'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'

// MUI Imports
import {
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Button,
    Alert,
    CircularProgress,
    Chip,
    Divider,
    IconButton
} from '@mui/material'

// Context Imports
import { useRecruiter } from '@/contexts/RecruiterContext'
import { useHome } from '@/contexts/HomeContext'
import { useAuth } from '@/contexts/AuthContext'

// Component Imports

const RecruiterOverview = () => {
    const [success, setSuccess] = useState(null)
    const fileInputRef = useRef(null)
    const { user } = useAuth()
    const { userRole } = useHome()
    const { profileImage, loading, errors, uploadProfileImage, companyProfile, individualProfile } = useRecruiter()

    // Determine recruiter type from API data based on available data
    const getRecruiterType = () => {
        if (individualProfile && individualProfile.ri_id) {
            return 'individual'
        } else if (companyProfile && companyProfile.rc_id) {
            return 'company'
        } else {
            // If no data exists, check rp_type field
            return companyProfile?.rp_type || individualProfile?.rp_type || 'company'
        }
    }

    const recruiterType = getRecruiterType()
    const isCompany = recruiterType === 'company'

    // Get profile data based on type
    const profileData = isCompany ? companyProfile : individualProfile

    const handleImageUpload = async (file) => {
        if (!file) return

        setSuccess(null)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('rp_type', recruiterType)

            const result = await uploadProfileImage(formData)

            if (result.success) {
                setSuccess('Profile image uploaded successfully!')
            }
        } catch (err) {
            console.error('Upload error:', err)
        }
    }

    // Helper function to construct full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL
        return `${uploadUrl}${imagePath}`
    }

    return (
        <Box className="space-y-6">
            {/* Profile Header Card */}
            <Card>
                <CardContent className="p-6">
                    <Box className="flex flex-col md:flex-row gap-6">
                        {/* Profile Image Section */}
                        <Box className="flex flex-col items-center md:items-start">
                            <Box className="relative">
                                <Avatar
                                    src={profileImage?.image_url || getImageUrl(profileData?.image)}
                                    sx={{ width: 120, height: 120 }}
                                    className="border-4 border-gray-200 mb-4"
                                >
                                    <i className="tabler-user text-4xl" />
                                </Avatar>

                                {/* Upload Button Overlay */}
                                <IconButton
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading.profileImage}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 8,
                                        right: 8,
                                        backgroundColor: 'var(--mui-palette-primary-main)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'var(--mui-palette-primary-dark)'
                                        },
                                        '&:disabled': {
                                            backgroundColor: 'var(--mui-palette-action-disabled)'
                                        }
                                    }}
                                >
                                    <i className="tabler-camera" />
                                </IconButton>
                            </Box>

                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        handleImageUpload(file)
                                    }
                                }}
                            />

                            {/* Upload Instructions */}
                            <Typography variant="caption" color="text.secondary" className="text-center">
                                Click camera icon to upload<br />
                                Recommended: 400x400px, Max 5MB
                            </Typography>
                        </Box>

                        {/* Profile Information */}
                        <Box className="flex-1">
                            <Box className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <Box>
                                    <Typography variant="h4" className="mb-2">
                                        {isCompany
                                            ? (profileData?.rc_name || 'Company Name')
                                            : (profileData?.ri_full_name || user?.user_full_name || 'Full Name')
                                        }
                                    </Typography>
                                    <Box className="flex items-center gap-2 mb-2">
                                        <Chip
                                            label={isCompany ? 'Company' : 'Individual'}
                                            color="primary"
                                            size="small"
                                        />
                                        {isCompany && profileData?.rc_industry && (
                                            <Chip
                                                label={profileData.rc_industry}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    </Box>
                                </Box>
                            </Box>

                            {/* Profile Details */}
                            <Box className="space-y-3">
                                {isCompany ? (
                                    <>
                                        {profileData?.rc_website && (
                                            <Box className="flex items-center gap-2">
                                                <i className="tabler-world text-gray-500" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {profileData.rc_website}
                                                </Typography>
                                            </Box>
                                        )}
                                        {profileData?.rc_size && (
                                            <Box className="flex items-center gap-2">
                                                <i className="tabler-users text-gray-500" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {profileData.rc_size} employees
                                                </Typography>
                                            </Box>
                                        )}
                                        {profileData?.rc_role && (
                                            <Box className="flex items-center gap-2">
                                                <i className="tabler-briefcase text-gray-500" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {profileData.rc_role}
                                                </Typography>
                                            </Box>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {profileData?.ri_email && (
                                            <Box className="flex items-center gap-2">
                                                <i className="tabler-mail text-gray-500" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {profileData.ri_email}
                                                </Typography>
                                            </Box>
                                        )}
                                        {profileData?.ri_mobile && (
                                            <Box className="flex items-center gap-2">
                                                <i className="tabler-phone text-gray-500" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {profileData.ri_mobile}
                                                </Typography>
                                            </Box>
                                        )}
                                        {profileData?.ri_linkedin_url && (
                                            <Box className="flex items-center gap-2">
                                                <i className="tabler-brand-linkedin text-gray-500" />
                                                <Typography variant="body2" color="text.secondary">
                                                    LinkedIn Profile
                                                </Typography>
                                            </Box>
                                        )}
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* About Section */}
            {(profileData?.rc_description || profileData?.ri_about) && (
                <Card>
                    <CardContent className="p-6">
                        <Typography variant="h6" className="mb-4">
                            About {isCompany ? 'Company' : 'Me'}
                        </Typography>
                        <Divider className="mb-4" />
                        <Box
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: profileData?.rc_description || profileData?.ri_about || ''
                            }}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Status Messages */}
            {errors.profileImage && (
                <Alert severity="error">
                    {errors.profileImage}
                </Alert>
            )}
            {success && (
                <Alert severity="success">
                    {success}
                </Alert>
            )}

            {/* Loading Indicator */}
            {loading.profileImage && (
                <Box className="flex items-center justify-center">
                    <CircularProgress size={24} />
                    <Typography variant="body2" className="ml-2">
                        Uploading image...
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default RecruiterOverview
