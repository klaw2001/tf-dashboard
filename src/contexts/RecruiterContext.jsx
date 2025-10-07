'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authenticatedAPI } from '@/services/api'
import { useHome } from './HomeContext'

// Recruiter Context
const RecruiterContext = createContext({
    // Profile data
    companyProfile: null,
    individualProfile: null,
    profileImage: null,

    // Loading states
    loading: {
        companyProfile: false,
        individualProfile: false,
        profileImage: false
    },

    // Error states
    errors: {
        companyProfile: null,
        individualProfile: null,
        profileImage: null
    },

    // Actions
    fetchCompanyProfile: () => { },
    fetchIndividualProfile: () => { },
    saveCompanyProfile: () => { },
    saveIndividualProfile: () => { },
    uploadProfileImage: () => { },
    refreshAll: () => { }
})

// Custom hook to use Recruiter context
export const useRecruiter = () => {
    const context = useContext(RecruiterContext)
    if (!context) {
        throw new Error('useRecruiter must be used within a RecruiterProvider')
    }
    return context
}

// Recruiter Provider Component
export const RecruiterProvider = ({ children }) => {
    // Get data from HomeContext
    const { recruiterProfile, userRole } = useHome()

    // State for all recruiter data
    const [companyProfile, setCompanyProfile] = useState(null)
    const [individualProfile, setIndividualProfile] = useState(null)
    const [profileImage, setProfileImage] = useState(null)

    // Loading states
    const [loading, setLoading] = useState({
        companyProfile: false,
        individualProfile: false,
        profileImage: false
    })

    // Error states
    const [errors, setErrors] = useState({
        companyProfile: null,
        individualProfile: null,
        profileImage: null
    })

    // Helper function to update loading state
    const setLoadingState = (key, value) => {
        setLoading(prev => ({ ...prev, [key]: value }))
    }

    // Helper function to update error state
    const setErrorState = (key, error) => {
        setErrors(prev => ({ ...prev, [key]: error }))
    }

    // Fetch company profile
    const fetchCompanyProfile = useCallback(async () => {
        setLoadingState('companyProfile', true)
        setErrorState('companyProfile', null)

        try {
            const response = await authenticatedAPI.get('/recruiter/company-profile')

            if (response.success && response.data.status === 'success') {
                setCompanyProfile(response.data.data)
            } else {
                setErrorState('companyProfile', response.data?.message || 'Failed to fetch company profile')
                setCompanyProfile(null)
            }
        } catch (error) {
            setErrorState('companyProfile', error.message || 'Failed to fetch company profile')
            setCompanyProfile(null)
        } finally {
            setLoadingState('companyProfile', false)
        }
    }, [])

    // Fetch individual profile
    const fetchIndividualProfile = useCallback(async () => {
        setLoadingState('individualProfile', true)
        setErrorState('individualProfile', null)

        try {
            const response = await authenticatedAPI.get('/recruiter/individual-profile')

            if (response.success && response.data.status === 'success') {
                setIndividualProfile(response.data.data)
            } else {
                setErrorState('individualProfile', response.data?.message || 'Failed to fetch individual profile')
                setIndividualProfile(null)
            }
        } catch (error) {
            setErrorState('individualProfile', error.message || 'Failed to fetch individual profile')
            setIndividualProfile(null)
        } finally {
            setLoadingState('individualProfile', false)
        }
    }, [])

    // Save company profile
    const saveCompanyProfile = async (profileData) => {
        setLoadingState('companyProfile', true)
        setErrorState('companyProfile', null)

        try {
            const response = await authenticatedAPI.post('/recruiter/company-profile', profileData)

            if (response.success && response.data.status === 'success') {
                setCompanyProfile(response.data.data)
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to save company profile'
                setErrorState('companyProfile', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to save company profile'
            setErrorState('companyProfile', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('companyProfile', false)
        }
    }

    // Save individual profile
    const saveIndividualProfile = async (profileData) => {
        setLoadingState('individualProfile', true)
        setErrorState('individualProfile', null)

        try {
            const response = await authenticatedAPI.post('/recruiter/individual-profile', profileData)

            if (response.success && response.data.status === 'success') {
                setIndividualProfile(response.data.data)
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to save individual profile'
                setErrorState('individualProfile', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to save individual profile'
            setErrorState('individualProfile', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('individualProfile', false)
        }
    }

    // Upload profile image
    const uploadProfileImage = async (formData) => {
        setLoadingState('profileImage', true)
        setErrorState('profileImage', null)

        try {
            const response = await authenticatedAPI.upload('/recruiter/upload/profile-image?type=profile-image', formData)

            if (response.success && response.data.status === 'success') {
                setProfileImage(response.data.data)
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to upload profile image'
                setErrorState('profileImage', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to upload profile image'
            setErrorState('profileImage', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('profileImage', false)
        }
    }

    // Refresh all data
    const refreshAll = useCallback(async () => {
        await Promise.all([
            fetchCompanyProfile(),
            fetchIndividualProfile()
        ])
    }, [fetchCompanyProfile, fetchIndividualProfile])

    // Sync recruiter profile data from HomeContext
    useEffect(() => {
        if (recruiterProfile && userRole === 'recruiter') {
            console.log('RecruiterProfile data received:', recruiterProfile)

            // Set company profile if it exists
            const companyData = recruiterProfile.r_company_profile?.[0] || null
            if (companyData) {
                console.log('Setting company profile:', companyData)
                setCompanyProfile(companyData)
            }

            // Set individual profile if it exists
            const individualData = recruiterProfile.r_individual_profile?.[0] || null
            if (individualData) {
                console.log('Setting individual profile:', individualData)
                setIndividualProfile(individualData)
            }

            // If no specific profiles exist, set the main recruiter profile data
            if (!companyData && !individualData && recruiterProfile.rp_id) {
                console.log('Setting main recruiter profile:', recruiterProfile)
                // This handles cases where the profile data is directly in the recruiterProfile object
                if (recruiterProfile.rp_type === 'company') {
                    setCompanyProfile(recruiterProfile)
                } else if (recruiterProfile.rp_type === 'individual') {
                    setIndividualProfile(recruiterProfile)
                }
            }
        }
    }, [recruiterProfile, userRole])

    // Auto-fetch profiles on mount (only for recruiter users)
    useEffect(() => {
        if (userRole === 'recruiter') {
            fetchCompanyProfile()
            fetchIndividualProfile()
        }
    }, [fetchCompanyProfile, fetchIndividualProfile, userRole])

    const value = {
        // Data
        companyProfile,
        individualProfile,
        profileImage,

        // Loading states
        loading,

        // Error states
        errors,

        // Actions
        fetchCompanyProfile,
        fetchIndividualProfile,
        saveCompanyProfile,
        saveIndividualProfile,
        uploadProfileImage,
        refreshAll
    }

    return (
        <RecruiterContext.Provider value={value}>
            {children}
        </RecruiterContext.Provider>
    )
}

export default RecruiterContext
