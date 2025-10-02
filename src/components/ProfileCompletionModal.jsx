'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import {
    Dialog,
    DialogContent,
    Typography,
    Box,
    Button,
    IconButton,
    CircularProgress,
    LinearProgress,
    Avatar,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material'

// Context Imports
import { useTalent } from '@/contexts/TalentContext'

// Utils
import { getInitials } from '@/data/profileData'

const ProfileCompletionModal = ({ open, onClose, profileData, profilePercentageData }) => {
    const [pendingFields, setPendingFields] = useState([])
    const [loading, setLoading] = useState(false)

    const { fetchProfilePercentage } = useTalent()

    // Fetch profile percentage when modal opens
    useEffect(() => {
        if (open) {
            fetchProfileData()
        }
    }, [open])

    const fetchProfileData = async () => {
        setLoading(true)
        try {
            const response = await fetchProfilePercentage()
            if (response && response.data) {
                setPendingFields(response.data.pending_fields || [])
            }
        } catch (error) {
            console.error('Error fetching profile data:', error)
        } finally {
            setLoading(false)
        }
    }

    const profilePercentage = profilePercentageData?.profile_percentage || 0

    const getProgressColor = (percentage) => {
        if (percentage >= 80) return '#4caf50' // Green
        if (percentage >= 60) return '#ff9800' // Orange
        return '#f44336' // Red
    }

    const getStatusMessage = (percentage) => {
        if (percentage >= 90) return "You're almost there!"
        if (percentage >= 70) return "You're doing great!"
        if (percentage >= 50) return "You're on your way!"
        return "Let's get started!"
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'user_info':
                return 'tabler-user'
            case 'basic_profile':
                return 'tabler-user-circle'
            case 'related_data':
                return 'tabler-briefcase'
            default:
                return 'tabler-circle'
        }
    }

    const getCategoryName = (category) => {
        switch (category) {
            case 'user_info':
                return 'Personal Information'
            case 'basic_profile':
                return 'Basic Profile'
            case 'related_data':
                return 'Professional Details'
            default:
                return category
        }
    }

    const handleFieldClick = (field) => {
        // Navigate to the appropriate section based on field type
        const fieldRoutes = {
            'is_verified': '/profile?tab=overview',
            'availability': '/profile?tab=availability',
            'projects': '/profile?tab=projects',
            'experience': '/profile?tab=experience',
            'education': '/profile?tab=overview',
            'certifications': '/profile?tab=overview',
            'tp_about': '/profile?tab=overview',
            'tp_professional_summary': '/profile?tab=overview',
            'tp_image': '/profile?tab=overview'
        }

        const route = fieldRoutes[field.field] || '/profile?tab=overview'
        window.location.href = route
    }

    if (loading) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogContent className="text-center p-8">
                    <CircularProgress />
                    <Typography variant="body1" className="mt-4">
                        Loading profile data...
                    </Typography>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
                }
            }}
        >
            <DialogContent className="p-0">
                <Box className="relative">
                    {/* Header */}
                    <Box className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-lg">
                        <Box className="flex justify-between items-start">
                            <Box>
                                <Typography variant="h4" className="font-bold text-white mb-2">
                                    Complete your profile
                                </Typography>
                                <Typography variant="body1" className="text-green-100">
                                    Talents with complete, quality profiles are{' '}
                                    <span className="font-semibold text-white">4.5 times</span> more likely to get hired by clients.
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={onClose}
                                className="text-white hover:bg-green-700"
                                size="small"
                            >
                                <i className="tabler-x text-xl" />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box className="p-6">
                        <Box className="flex gap-6">
                            {/* Left Side - Progress Circle */}
                            <Box className="flex flex-col items-center">
                                <Box className="relative">
                                    <CircularProgress
                                        variant="determinate"
                                        value={profilePercentage}
                                        size={120}
                                        thickness={4}
                                        sx={{
                                            color: getProgressColor(profilePercentage),
                                            '& .MuiCircularProgress-circle': {
                                                strokeLinecap: 'round'
                                            }
                                        }}
                                    />
                                    <Box className="absolute inset-0 flex items-center justify-center">
                                        <Avatar
                                            sx={{
                                                width: 80,
                                                height: 80,
                                                bgcolor: 'primary.main',
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getInitials(profileData?.user?.name || 'User')}
                                        </Avatar>
                                    </Box>
                                </Box>
                                <Typography variant="h6" className="font-semibold text-gray-900 mt-4">
                                    {profilePercentage}% complete
                                </Typography>
                                <Typography variant="body2" className="text-gray-600 text-center">
                                    {getStatusMessage(profilePercentage)}
                                </Typography>
                                <Button
                                    variant="text"
                                    size="small"
                                    className="text-green-600 hover:text-green-700 mt-2"
                                >
                                    Learn more
                                </Button>
                            </Box>

                            {/* Right Side - Pending Fields */}
                            <Box className="flex-1">
                                <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                                    Complete these sections to improve your profile:
                                </Typography>

                                {pendingFields.length === 0 ? (
                                    <Box className="text-center py-8">
                                        <i className="tabler-check-circle text-6xl text-green-500 mb-4" />
                                        <Typography variant="h6" className="text-green-600 font-semibold">
                                            Congratulations!
                                        </Typography>
                                        <Typography variant="body1" className="text-gray-600">
                                            Your profile is 100% complete.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <List className="space-y-2">
                                        {pendingFields.map((field, index) => (
                                            <ListItem
                                                key={index}
                                                className="cursor-pointer hover:bg-gray-50 rounded-lg p-3 border border-gray-200"
                                                onClick={() => handleFieldClick(field)}
                                            >
                                                <ListItemIcon className="min-w-0 mr-3">
                                                    <Box className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                                        <i className={`${getCategoryIcon(field.category)} text-sm text-gray-400`} />
                                                    </Box>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box className="flex items-center justify-between">
                                                            <Typography variant="subtitle1" className="font-medium">
                                                                {field.field_name}
                                                            </Typography>
                                                            <Chip
                                                                label={`+${field.weight}%`}
                                                                size="small"
                                                                className="bg-green-100 text-green-700"
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography variant="body2" className="text-gray-600">
                                                                {field.message}
                                                            </Typography>
                                                            <Typography variant="caption" className="text-gray-500">
                                                                {getCategoryName(field.category)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                                <i className="tabler-chevron-right text-gray-400" />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </Box>

                        {/* Bottom Section */}
                        {pendingFields.length > 0 && (
                            <Box className="mt-6 pt-4 border-t border-gray-200">
                                <Box className="flex items-center justify-between">
                                    <Box>
                                        <Typography variant="body2" className="text-gray-600">
                                            Complete all sections to reach 100%
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={profilePercentage}
                                            className="mt-2"
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                backgroundColor: 'gray.200',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: getProgressColor(profilePercentage),
                                                    borderRadius: 4
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Button
                                        variant="contained"
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                                        onClick={() => {
                                            onClose()
                                            window.location.href = '/profile'
                                        }}
                                    >
                                        Complete Profile
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ProfileCompletionModal
