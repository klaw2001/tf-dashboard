'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'

// MUI Imports
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert
} from '@mui/material'

// Component Imports
import ProfileOverview from './components/ProfileOverview'
import ProfileProjects from './components/ProfileProjects'
import ProfileExperience from './components/ProfileExperience'
import ProfileAvailability from './components/ProfileAvailability'
import ProfileReviews from './components/ProfileReviews'

// Context Imports
import { useTalent } from '@/contexts/TalentContext'
import { useHome } from '@/contexts/HomeContext'
import { useAuth } from '@/contexts/AuthContext'

// Icon Imports - Using Iconify CSS classes

// Data Import
import { profileData } from '@/data/profileData'

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('overview')
    const { userRole } = useHome()
    const { user } = useAuth()

    // Handle URL tab parameter
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const tab = urlParams.get('tab')
        if (tab && ['overview', 'projects', 'experience', 'availability', 'reviews'].includes(tab)) {
            setActiveSection(tab)
        }
    }, [])

    // Redirect to recruiter profile if user is a recruiter
    useEffect(() => {
        if (userRole === 'recruiter') {
            window.location.href = '/profile/recruiter'
        }
    }, [userRole])

    // Use refs to track if data has been fetched to prevent infinite loops
    const fetchedSections = useRef({
        profile: false,
        projects: false,
        experience: false,
        availability: false,
        reviews: false
    })

    // Reset fetched sections when switching tabs (optional - for fresh data on each visit)
    const resetFetchedSections = () => {
        fetchedSections.current = {
            profile: false,
            projects: false,
            experience: false,
            availability: false,
            reviews: false
        }
    }

    // Use Talent context
    const {
        profile,
        projects,
        experience,
        availability,
        reviews,
        loading,
        errors,
        fetchProfile,
        fetchProjects,
        fetchExperience,
        fetchAvailability,
        fetchReviews
    } = useTalent()

    const navigationItems = [
        { id: 'overview', label: 'Overview', icon: 'tabler-user' },
        { id: 'projects', label: 'Portfolio', icon: 'tabler-photo' },
        { id: 'experience', label: 'Experience', icon: 'tabler-briefcase' },
        { id: 'availability', label: 'Availability', icon: 'tabler-calendar' },
        { id: 'reviews', label: 'Reviews', icon: 'tabler-star' }
    ]

    // Fetch data based on active section
    useEffect(() => {
        switch (activeSection) {
            case 'overview':
                if (!fetchedSections.current.profile && !loading.profile) {
                    fetchedSections.current.profile = true
                    fetchProfile()
                }
                break
            case 'projects':
                if (!fetchedSections.current.projects && !loading.projects) {
                    fetchedSections.current.projects = true
                    fetchProjects()
                }
                break
            case 'experience':
                if (!fetchedSections.current.experience && !loading.experience) {
                    fetchedSections.current.experience = true
                    fetchExperience()
                }
                break
            case 'availability':
                if (!fetchedSections.current.availability && !loading.availability) {
                    fetchedSections.current.availability = true
                    fetchAvailability()
                }
                break
            case 'reviews':
                if (!fetchedSections.current.reviews && !loading.reviews) {
                    fetchedSections.current.reviews = true
                    fetchReviews()
                }
                break
        }
    }, [activeSection, loading, fetchProfile, fetchProjects, fetchExperience, fetchAvailability, fetchReviews])

    // Helper function to construct full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL
        return `${uploadUrl}${imagePath}`
    }

    // Transform API data to match component expectations
    const getTransformedData = () => {
        if (!profile) return profileData

        return {
            user: {
                id: profile.tp_id,
                name: `${profile.user?.user_full_name || ''}`.trim() || 'Data not available',
                title: profile.tp_designation || 'Data not available',
                location: profile.tp_location || 'Data not available',
                experience: profile.tp_total_experience ? `${profile.tp_total_experience} years experience` : 'Data not available',
                profilePicture: getImageUrl(profile.tp_image),
                profileCompleteness: 75, // You can calculate this based on filled fields
                socialLinks: {
                    linkedin: '',
                    behance: '',
                    website: '',
                    github: ''
                }
            },
            aboutMe: {
                content: profile.tp_about || 'Data not available'
            },
            professionalSummary: {
                content: profile.tp_professional_summary || 'Data not available',
                isAIOptimized: false
            },
            skills: {
                categories: [] // You can add skills data if available
            }
        }
    }

    const renderActiveSection = () => {
        const currentLoading = loading[activeSection] || loading.profile
        const currentError = errors[activeSection] || errors.profile

        if (currentLoading) {
            return (
                <Box className="flex justify-center items-center h-64">
                    <CircularProgress />
                </Box>
            )
        }

        if (currentError) {
            return (
                <Alert severity="error" className="mb-4">
                    {currentError}
                </Alert>
            )
        }

        switch (activeSection) {
            case 'overview':
                return <ProfileOverview data={getTransformedData()} />
            case 'projects':
                return <ProfileProjects data={projects.length > 0 ? projects : []} />
            case 'experience':
                return <ProfileExperience data={experience.length > 0 ? experience : []} />
            case 'availability':
                return <ProfileAvailability data={availability.length > 0 ? availability[0] : null} />
            case 'reviews':
                return <ProfileReviews data={reviews.length > 0 ? reviews : []} />
            default:
                return <ProfileOverview data={getTransformedData()} />
        }
    }

    return (
        <Box className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Left Sidebar Navigation */}
            <Card className="w-full lg:w-80 h-fit">
                <CardContent className="p-6">
                    {/* Back to Dashboard */}
                    <Box className="mb-6">
                        <Button
                            variant="text"
                            startIcon={<i className="tabler-arrow-left" />}
                            sx={{
                                color: 'var(--mui-palette-text-secondary)',
                                '&:hover': {
                                    color: 'var(--mui-palette-primary-main)',
                                    backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                }
                            }}
                            onClick={() => window.history.back()}
                        >
                            Back to Dashboard
                        </Button>
                    </Box>

                    {/* Navigation Items */}
                    <List className="p-0">
                        {navigationItems.map((item, index) => {
                            const iconClass = item.icon
                            const isActive = activeSection === item.id

                            return (
                                <ListItem key={item.id} className="p-0 mb-1">
                                    <ListItemButton
                                        onClick={() => setActiveSection(item.id)}
                                        className="rounded-lg transition-all duration-200"
                                        sx={{
                                            backgroundColor: isActive ? 'primary.main' : 'transparent',
                                            color: isActive ? 'white' : 'text.secondary',
                                            '&:hover': {
                                                backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                                                color: isActive ? 'white' : 'primary.main'
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: 'primary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'primary.dark'
                                                }
                                            }
                                        }}
                                    >
                                        <ListItemIcon
                                            className="min-w-0 mr-3"
                                            sx={{
                                                color: isActive ? 'white' : 'text.secondary',
                                                '& .MuiListItemIcon-root': {
                                                    color: isActive ? 'white' : 'text.secondary'
                                                }
                                            }}
                                        >
                                            <i className={iconClass} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        color: isActive ? 'white' : 'text.secondary',
                                                        fontWeight: isActive ? 600 : 400
                                                    }}
                                                >
                                                    {item.label}
                                                </Box>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List>

                    <Divider className="my-6" />

                    {/* Save Changes Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<i className="tabler-device-floppy" />}
                        sx={{
                            backgroundColor: 'var(--mui-palette-primary-main)',
                            '&:hover': {
                                backgroundColor: 'var(--mui-palette-primary-dark)'
                            }
                        }}
                    >
                        Save Changes
                    </Button>
                </CardContent>
            </Card>

            {/* Main Content Area */}
            <Box className="flex-1">
                {renderActiveSection()}
            </Box>
        </Box>
    )
}

export default ProfilePage
