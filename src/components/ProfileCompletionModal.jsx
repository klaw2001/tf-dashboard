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
        if (percentage >= 80) return 'var(--mui-palette-success-main)' // Success green
        if (percentage >= 60) return 'var(--mui-palette-warning-main)' // Warning orange
        return 'var(--mui-palette-error-main)' // Error red
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
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, var(--mui-palette-primary-main) 0%, var(--mui-palette-primary-dark) 100%)',
                            color: 'white',
                            padding: '24px',
                            borderRadius: '8px 8px 0 0'
                        }}
                    >
                        <Box className="flex justify-between items-start">
                            <Box>
                                <Typography variant="h4" className="font-bold text-white mb-2">
                                    Complete your profile
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Talents with complete, quality profiles are{' '}
                                    <span className="font-semibold text-white">4.5 times</span> more likely to get hired by clients.
                                </Typography>
                            </Box>
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                                size="small"
                            >
                                <i className="tabler-x text-xl" />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ padding: 3 }}>
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
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        mt: 2,
                                        color: 'var(--mui-palette-text-primary)'
                                    }}
                                >
                                    {profilePercentage}% complete
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'var(--mui-palette-text-secondary)',
                                        textAlign: 'center'
                                    }}
                                >
                                    {getStatusMessage(profilePercentage)}
                                </Typography>
                                <Button
                                    variant="text"
                                    size="small"
                                    sx={{
                                        color: 'var(--mui-palette-primary-main)',
                                        mt: 2,
                                        fontSize: '0.875rem',
                                        '&:hover': {
                                            backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
                                            color: 'var(--mui-palette-primary-dark)'
                                        }
                                    }}
                                >
                                    Learn more
                                </Button>
                            </Box>

                            {/* Right Side - Pending Fields */}
                            <Box className="flex-1">
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        mb: 2,
                                        color: 'var(--mui-palette-text-primary)'
                                    }}
                                >
                                    Complete these sections to improve your profile:
                                </Typography>

                                {pendingFields.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 4 }}>
                                        <i
                                            className="tabler-check-circle text-6xl mb-4"
                                            style={{ color: 'var(--mui-palette-success-main)' }}
                                        />
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: 'var(--mui-palette-success-main)',
                                                fontWeight: 600
                                            }}
                                        >
                                            Congratulations!
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: 'var(--mui-palette-text-secondary)' }}
                                        >
                                            Your profile is 100% complete.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <List className="space-y-2">
                                        {pendingFields.map((field, index) => (
                                            <ListItem
                                                key={index}
                                                sx={{
                                                    cursor: 'pointer',
                                                    borderRadius: 2,
                                                    p: 1.5,
                                                    mb: 1,
                                                    border: '1px solid',
                                                    borderColor: 'var(--mui-palette-divider)',
                                                    backgroundColor: 'var(--mui-palette-background-paper)',
                                                    '&:hover': {
                                                        backgroundColor: 'var(--mui-palette-action-hover)'
                                                    }
                                                }}
                                                onClick={() => handleFieldClick(field)}
                                            >
                                                <ListItemIcon sx={{ minWidth: 0, mr: 2 }}>
                                                    <Box
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            border: '2px solid',
                                                            borderColor: 'var(--mui-palette-divider)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center'
                                                        }}
                                                    >
                                                        <i
                                                            className={`${getCategoryIcon(field.category)} text-sm`}
                                                            style={{ color: 'var(--mui-palette-text-disabled)' }}
                                                        />
                                                    </Box>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box className="flex items-center justify-between">
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    color: 'var(--mui-palette-text-primary)'
                                                                }}
                                                            >
                                                                {field.field_name}
                                                            </Typography>
                                                            <Chip
                                                                label={`+${field.weight}%`}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: 'var(--mui-palette-success-lightOpacity)',
                                                                    color: 'var(--mui-palette-success-dark)',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: 'var(--mui-palette-text-secondary)',
                                                                    mt: 0.5
                                                                }}
                                                            >
                                                                {field.message}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: 'var(--mui-palette-text-disabled)',
                                                                    mt: 0.5,
                                                                    display: 'block'
                                                                }}
                                                            >
                                                                {getCategoryName(field.category)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                                <i
                                                    className="tabler-chevron-right"
                                                    style={{ color: 'var(--mui-palette-text-disabled)' }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </Box>

                        {/* Bottom Section */}
                        {pendingFields.length > 0 && (
                            <Box
                                sx={{
                                    mt: 3,
                                    pt: 3,
                                    borderTop: '1px solid',
                                    borderColor: 'var(--mui-palette-divider)'
                                }}
                            >
                                <Box className="flex items-center justify-between">
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'var(--mui-palette-text-secondary)'
                                            }}
                                        >
                                            Complete all sections to reach 100%
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={profilePercentage}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                mt: 1,
                                                backgroundColor: 'var(--mui-palette-action-disabledBackground)',
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: getProgressColor(profilePercentage),
                                                    borderRadius: 4
                                                }
                                            }}
                                        />
                                    </Box>
                                    <Button
                                        variant="contained"
                                        sx={{
                                            backgroundColor: 'var(--mui-palette-primary-main)',
                                            color: 'white',
                                            px: 3,
                                            py: 1.5,
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            '&:hover': {
                                                backgroundColor: 'var(--mui-palette-primary-dark)',
                                            }
                                        }}
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
