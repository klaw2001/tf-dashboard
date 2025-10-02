'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { API_CONFIG } from './APIContext'

// Auth Context
const AuthContext = createContext({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    signin: async () => { },
    logout: () => { },
    checkAuth: () => { }
})

// Custom hook to use Auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check if user is authenticated
    const isAuthenticated = !!token && !!user

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem('auth_token')
                const storedUser = localStorage.getItem('auth_user')

                if (storedToken && storedUser) {
                    setToken(storedToken)
                    setUser(JSON.parse(storedUser))
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
                // Clear invalid data
                localStorage.removeItem('auth_token')
                localStorage.removeItem('auth_user')
            } finally {
                setIsLoading(false)
            }
        }

        initializeAuth()
    }, [])

    // Sign in function
    const signin = useCallback(async (credentials) => {
        try {
            setIsLoading(true)

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.SIGNIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            })

            const data = await response.json()

            if (data.status === 'success' && data.data) {
                const { user: userData, token: authToken } = data.data

                // Store in state
                setUser(userData)
                setToken(authToken)

                // Store in localStorage
                localStorage.setItem('auth_token', authToken)
                localStorage.setItem('auth_user', JSON.stringify(userData))

                return { success: true, data: data.data }
            } else {
                return {
                    success: false,
                    error: data.message || 'Sign in failed',
                    details: data.data || null
                }
            }
        } catch (error) {
            console.error('Sign in error:', error)
            return {
                success: false,
                error: error.message || 'Network error occurred'
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Logout function
    const logout = useCallback(() => {
        // Clear state
        setUser(null)
        setToken(null)

        // Clear localStorage
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
    }, [])

    // Check authentication status
    const checkAuth = useCallback(() => {
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('auth_user')

        if (storedToken && storedUser) {
            try {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error('Error parsing stored user data:', error)
                logout()
            }
        } else {
            logout()
        }
    }, [logout])

    // Auto-logout if token is expired (basic check)
    useEffect(() => {
        if (token) {
            try {
                // Only check JWT expiration if token has proper JWT structure
                if (token.includes('.') && token.split('.').length === 3) {
                    const payload = JSON.parse(atob(token.split('.')[1]))
                    const currentTime = Date.now() / 1000

                    if (payload.exp && payload.exp < currentTime) {
                        console.log('Token expired, logging out')
                        logout()
                    }
                }
                // For non-JWT tokens (like mock tokens), skip expiration check
            } catch (error) {
                console.error('Error checking token expiration:', error)
                // Don't logout on token parsing errors for non-JWT tokens
                console.log('Token is not a valid JWT, skipping expiration check')
            }
        }
    }, [token, logout])

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        signin,
        logout,
        checkAuth
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
