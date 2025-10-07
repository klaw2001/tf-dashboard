'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authenticatedAPI } from '@/services/api'
import { useHome } from './HomeContext'

// Talent Context
const TalentContext = createContext({
    // Profile data
    profile: null,
    profilePercentage: 0,
    projects: [],
    experience: [],
    availability: [],
    reviews: [],
    skills: [],

    // Loading states
    loading: {
        profile: false,
        profilePercentage: false,
        projects: false,
        experience: false,
        availability: false,
        reviews: false,
        skills: false,
        aiGeneration: false
    },

    // Error states
    errors: {
        profile: null,
        profilePercentage: null,
        projects: null,
        experience: null,
        availability: null,
        reviews: null,
        skills: null
    },

    // Actions
    fetchProfile: () => { },
    fetchProfilePercentage: () => { },
    fetchProjects: () => { },
    fetchExperience: () => { },
    fetchAvailability: () => { },
    fetchReviews: () => { },
    fetchSkills: () => { },
    saveProfile: () => { },
    saveProject: () => { },
    saveExperience: () => { },
    saveAvailability: () => { },
    saveReview: () => { },
    generateProfessionalSummary: () => { },
    saveSkills: () => { },
    uploadProfileImage: () => { },
    uploadProjectImage: () => { },
    refreshAll: () => { }
})

// Custom hook to use Talent context
export const useTalent = () => {
    const context = useContext(TalentContext)
    if (!context) {
        throw new Error('useTalent must be used within a TalentProvider')
    }
    return context
}

// Talent Provider Component
export const TalentProvider = ({ children }) => {
    // Get data from HomeContext
    const { talentProfile, userRole } = useHome()

    // State for all talent data
    const [profile, setProfile] = useState(null)
    const [profilePercentage, setProfilePercentage] = useState(0)
    const [projects, setProjects] = useState([])
    const [experience, setExperience] = useState([])
    const [availability, setAvailability] = useState([])
    const [reviews, setReviews] = useState([])
    const [skills, setSkills] = useState([])

    // Loading states
    const [loading, setLoading] = useState({
        profile: false,
        profilePercentage: false,
        projects: false,
        experience: false,
        availability: false,
        reviews: false,
        skills: false,
        aiGeneration: false
    })

    // Error states
    const [errors, setErrors] = useState({
        profile: null,
        profilePercentage: null,
        projects: null,
        experience: null,
        availability: null,
        reviews: null,
        skills: null
    })

    // Helper function to update loading state
    const setLoadingState = (key, value) => {
        setLoading(prev => ({ ...prev, [key]: value }))
    }

    // Helper function to update error state
    const setErrorState = (key, error) => {
        setErrors(prev => ({ ...prev, [key]: error }))
    }

    // Fetch talent profile
    const fetchProfile = useCallback(async () => {
        setLoadingState('profile', true)
        setErrorState('profile', null)

        try {
            const response = await authenticatedAPI.get('/talent/profile')

            if (response.success && response.data.status === 'success') {
                setProfile(response.data.data)
            } else {
                setErrorState('profile', response.data?.message || 'Failed to fetch profile')
                setProfile(null)
            }
        } catch (error) {
            setErrorState('profile', error.message || 'Failed to fetch profile')
            setProfile(null)
        } finally {
            setLoadingState('profile', false)
        }
    }, [])

    // Fetch profile percentage
    const fetchProfilePercentage = useCallback(async () => {
        setLoadingState('profilePercentage', true)
        setErrorState('profilePercentage', null)

        try {
            const response = await authenticatedAPI.get('/talent/profile-percentage')

            if (response.success && response.data.status === 'success') {
                setProfilePercentage(response.data.data.profile_percentage || 0)
                return { success: true, data: response.data.data }
            } else {
                setErrorState('profilePercentage', response.data?.message || 'Failed to fetch profile percentage')
                setProfilePercentage(0)
                return { success: false, error: response.data?.message || 'Failed to fetch profile percentage' }
            }
        } catch (error) {
            setErrorState('profilePercentage', error.message || 'Failed to fetch profile percentage')
            setProfilePercentage(0)
            return { success: false, error: error.message || 'Failed to fetch profile percentage' }
        } finally {
            setLoadingState('profilePercentage', false)
        }
    }, [])

    // Fetch talent projects
    const fetchProjects = useCallback(async () => {
        setLoadingState('projects', true)
        setErrorState('projects', null)

        try {
            const response = await authenticatedAPI.get('/talent/projects')

            if (response.success && response.data.status === 'success') {
                setProjects(response.data.data || [])
            } else {
                setErrorState('projects', response.data?.message || 'Failed to fetch projects')
                setProjects([])
            }
        } catch (error) {
            setErrorState('projects', error.message || 'Failed to fetch projects')
            setProjects([])
        } finally {
            setLoadingState('projects', false)
        }
    }, [])

    // Fetch talent experience
    const fetchExperience = useCallback(async () => {
        setLoadingState('experience', true)
        setErrorState('experience', null)

        try {
            const response = await authenticatedAPI.get('/talent/experience')

            if (response.success && response.data.status === 'success') {
                setExperience(response.data.data || [])
            } else {
                setErrorState('experience', response.data?.message || 'Failed to fetch experience')
                setExperience([])
            }
        } catch (error) {
            setErrorState('experience', error.message || 'Failed to fetch experience')
            setExperience([])
        } finally {
            setLoadingState('experience', false)
        }
    }, [])

    // Fetch talent availability
    const fetchAvailability = useCallback(async () => {
        setLoadingState('availability', true)
        setErrorState('availability', null)

        try {
            const response = await authenticatedAPI.get('/talent/availability')

            if (response.success && response.data.status === 'success') {
                setAvailability(response.data.data || [])
            } else {
                setErrorState('availability', response.data?.message || 'Failed to fetch availability')
                setAvailability([])
            }
        } catch (error) {
            setErrorState('availability', error.message || 'Failed to fetch availability')
            setAvailability([])
        } finally {
            setLoadingState('availability', false)
        }
    }, [])

    // Fetch talent reviews
    const fetchReviews = useCallback(async () => {
        setLoadingState('reviews', true)
        setErrorState('reviews', null)

        try {
            const response = await authenticatedAPI.get('/talent/reviews')

            if (response.success && response.data.status === 'success') {
                setReviews(response.data.data || [])
            } else {
                setErrorState('reviews', response.data?.message || 'Failed to fetch reviews')
                setReviews([])
            }
        } catch (error) {
            setErrorState('reviews', error.message || 'Failed to fetch reviews')
            setReviews([])
        } finally {
            setLoadingState('reviews', false)
        }
    }, [])

    // Fetch talent skills
    const fetchSkills = useCallback(async () => {
        setLoadingState('skills', true)
        setErrorState('skills', null)

        try {
            const response = await authenticatedAPI.get('/talent/skills')

            if (response.success && response.data.status === 'success') {
                setSkills(response.data.data || [])
            } else {
                setErrorState('skills', response.data?.message || 'Failed to fetch skills')
                setSkills([])
            }
        } catch (error) {
            setErrorState('skills', error.message || 'Failed to fetch skills')
            setSkills([])
        } finally {
            setLoadingState('skills', false)
        }
    }, [])

    // Save talent profile
    const saveProfile = async (profileData) => {
        setLoadingState('profile', true)
        setErrorState('profile', null)

        try {
            const response = await authenticatedAPI.post('/talent/profile', profileData)

            if (response.success && response.data.status === 'success') {
                setProfile(response.data.data)
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to save profile'
                setErrorState('profile', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to save profile'
            setErrorState('profile', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('profile', false)
        }
    }

    // Save talent project
    const saveProject = async (projectData) => {
        setLoadingState('projects', true)
        setErrorState('projects', null)

        try {
            const response = await authenticatedAPI.post('/talent/projects', projectData)

            if (response.success && response.data.status === 'success') {
                // Refresh projects list
                await fetchProjects()
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to save project'
                setErrorState('projects', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to save project'
            setErrorState('projects', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('projects', false)
        }
    }

    // Save talent experience
    const saveExperience = async (experienceData) => {
        setLoadingState('experience', true)
        setErrorState('experience', null)

        try {
            const response = await authenticatedAPI.post('/talent/experience', experienceData)

            if (response.success && response.data.status === 'success') {
                // Refresh experience list
                await fetchExperience()
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to save experience'
                setErrorState('experience', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to save experience'
            setErrorState('experience', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('experience', false)
        }
    }

    // Save talent availability
    const saveAvailability = async (availabilityData) => {
        setLoadingState('availability', true)
        setErrorState('availability', null)

        try {
            const response = await authenticatedAPI.post('/talent/availability', availabilityData)

            if (response.success && response.data.status === 'success') {
                // Refresh availability list
                await fetchAvailability()
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to save availability'
                setErrorState('availability', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to save availability'
            setErrorState('availability', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('availability', false)
        }
    }

    // Save talent review
    const saveReview = async (reviewData) => {
        setLoadingState('reviews', true)
        setErrorState('reviews', null)

        try {
            const response = await authenticatedAPI.post('/talent/reviews', reviewData)

            if (response.success && response.data.status === 'success') {
                // Refresh reviews list
                await fetchReviews()
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to save review'
                setErrorState('reviews', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to save review'
            setErrorState('reviews', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('reviews', false)
        }
    }

    // Generate professional summary with AI
    const generateProfessionalSummary = async (prompt) => {
        setLoadingState('aiGeneration', true)
        setErrorState('profile', null)

        try {
            const response = await authenticatedAPI.post('/talent/generate-professional-summary', { prompt })

            if (response.success && response.data.status === 'success') {
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to generate professional summary'
                setErrorState('profile', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to generate professional summary'
            setErrorState('profile', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('aiGeneration', false)
        }
    }

    // Upload project image
    const uploadProjectImage = async (formData) => {
        setLoadingState('projects', true)
        setErrorState('projects', null)

        try {
            const response = await authenticatedAPI.upload('/talent/upload/project-image?type=project-image', formData)

            if (response.success && response.data.status === 'success') {
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to upload project image'
                setErrorState('projects', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to upload project image'
            setErrorState('projects', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('projects', false)
        }
    }

    // Save skills
    const saveSkills = async (skills) => {
        setLoadingState('profile', true)
        setErrorState('profile', null)

        try {
            const response = await authenticatedAPI.post('/talent/skills', { skills })

            if (response.success && response.data.status === 'success') {
                // Refresh profile to get updated skills
                await fetchProfile()
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to save skills'
                setErrorState('profile', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to save skills'
            setErrorState('profile', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('profile', false)
        }
    }

    // Upload profile image
    const uploadProfileImage = async (formData) => {
        setLoadingState('profile', true)
        setErrorState('profile', null)

        try {
            const response = await authenticatedAPI.upload('/talent/upload/profile-image?type=profile-image', formData)

            if (response.success && response.data.status === 'success') {
                // Refresh profile to get updated image
                await fetchProfile()
                return { success: true, data: response.data.data }
            } else {
                const error = response.data?.message || 'Failed to upload profile image'
                setErrorState('profile', error)
                return { success: false, error }
            }
        } catch (error) {
            const errorMessage = error.message || 'Failed to upload profile image'
            setErrorState('profile', errorMessage)
            return { success: false, error: errorMessage }
        } finally {
            setLoadingState('profile', false)
        }
    }

    // Refresh all data
    const refreshAll = useCallback(async () => {
        await Promise.all([
            fetchProfile(),
            fetchProfilePercentage(),
            fetchProjects(),
            fetchExperience(),
            fetchAvailability(),
            fetchReviews(),
            fetchSkills()
        ])
    }, [fetchProfile, fetchProfilePercentage, fetchProjects, fetchExperience, fetchAvailability, fetchReviews, fetchSkills])

    // Sync talent profile data from HomeContext
    useEffect(() => {
        if (talentProfile && userRole === 'talent') {
            setProfile(talentProfile)
            setProjects(talentProfile.t_projects || [])
            setExperience(talentProfile.t_experience || [])
            setAvailability(talentProfile.t_availability || [])
            setReviews(talentProfile.t_reviews || [])
            setSkills(talentProfile.t_skills || [])
        }
    }, [talentProfile, userRole])

    // Auto-fetch profile and percentage on mount (only for talent users)
    useEffect(() => {
        if (userRole === 'talent') {
            fetchProfile()
            fetchProfilePercentage()
        }
    }, [fetchProfile, fetchProfilePercentage, userRole])

    const value = {
        // Data
        profile,
        profilePercentage,
        projects,
        experience,
        availability,
        reviews,
        skills,

        // Loading states
        loading,

        // Error states
        errors,

        // Actions
        fetchProfile,
        fetchProfilePercentage,
        fetchProjects,
        fetchExperience,
        fetchAvailability,
        fetchReviews,
        fetchSkills,
        saveProfile,
        saveProject,
        saveExperience,
        saveAvailability,
        saveReview,
        generateProfessionalSummary,
        saveSkills,
        uploadProfileImage,
        uploadProjectImage,
        refreshAll
    }

    return (
        <TalentContext.Provider value={value}>
            {children}
        </TalentContext.Provider>
    )
}

export default TalentContext
