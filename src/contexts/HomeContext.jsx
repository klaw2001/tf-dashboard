'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authenticatedAPI } from '@/services/api'

// Home Context
const HomeContext = createContext({
    // Profile data
    user: null,
    talentProfile: null,
    recruiterProfile: null,
    userRole: null,

    // Loading states
    loading: {
        profile: false
    },

    // Error states
    errors: {
        profile: null
    },

    // Actions
    fetchUserProfile: () => { },
    refreshProfile: () => { }
})

// Custom hook to use Home context
export const useHome = () => {
    const context = useContext(HomeContext)
    if (!context) {
        throw new Error('useHome must be used within a HomeProvider')
    }
    return context
}

// Home Provider Component
export const HomeProvider = ({ children }) => {
    // State for all profile data
    const [user, setUser] = useState(null)
    const [talentProfile, setTalentProfile] = useState(null)
    const [recruiterProfile, setRecruiterProfile] = useState(null)
    const [userRole, setUserRole] = useState(null)

    // Loading states
    const [loading, setLoading] = useState({
        profile: false
    })

    // Error states
    const [errors, setErrors] = useState({
        profile: null
    })

    // Helper function to update loading state
    const setLoadingState = (key, value) => {
        setLoading(prev => ({ ...prev, [key]: value }))
    }

    // Helper function to update error state
    const setErrorState = (key, error) => {
        setErrors(prev => ({ ...prev, [key]: error }))
    }

    // Fetch user profile with role-specific data
    const fetchUserProfile = useCallback(async () => {
        setLoadingState('profile', true)
        setErrorState('profile', null)

        try {
            const response = await authenticatedAPI.get('/home/profile')

            if (response.success && response.data.status === 'success') {
                const profileData = response.data.data

                // Set user data
                setUser(profileData.user)
                setUserRole(profileData.user?.user_role?.role_name)

                // Set role-specific profile data
                if (profileData.talentProfile) {
                    setTalentProfile(profileData.talentProfile)
                    setRecruiterProfile(null)
                } else if (profileData.recruiterProfile) {
                    setRecruiterProfile(profileData.recruiterProfile)
                    setTalentProfile(null)
                }

                return { success: true, data: profileData }
            } else {
                const error = response.data?.message || 'Failed to fetch user profile'
                setErrorState('profile', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to fetch user profile'
            setErrorState('profile', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('profile', false)
        }
    }, [])

    // Refresh profile data
    const refreshProfile = useCallback(async () => {
        return await fetchUserProfile()
    }, [fetchUserProfile])

    // Auto-fetch profile on mount
    useEffect(() => {
        fetchUserProfile()
    }, [fetchUserProfile])

    const value = {
        // Data
        user,
        talentProfile,
        recruiterProfile,
        userRole,

        // Loading states
        loading,

        // Error states
        errors,

        // Actions
        fetchUserProfile,
        refreshProfile
    }

    return (
        <HomeContext.Provider value={value}>
            {children}
        </HomeContext.Provider>
    )
}

export default HomeContext
