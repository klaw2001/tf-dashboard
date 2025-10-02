'use client'

import { createContext, useContext } from 'react'

// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_BASEURL || 'http://localhost:8000/api',
    ENDPOINTS: {
        AUTH: {
            SIGNIN: '/auth/signin',
            LOGOUT: '/auth/logout',
            REFRESH: '/auth/refresh'
        },
        TALENT: {
            PROFILE: '/talent/profile',
            PROJECTS: '/talent/projects',
            EXPERIENCE: '/talent/experience',
            AVAILABILITY: '/talent/availability',
            REVIEWS: '/talent/reviews'
        }
    }
}

// Create API Context
const APIContext = createContext({
    config: API_CONFIG,
    isAuthenticated: false,
    user: null,
    token: null
})

// Custom hook to use API context
export const useAPI = () => {
    const context = useContext(APIContext)
    if (!context) {
        throw new Error('useAPI must be used within an APIProvider')
    }
    return context
}

export default APIContext
