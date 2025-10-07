'use client'

// React Imports
import { useState, useRef, useEffect } from 'react'

// MUI Imports
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Button,
    Chip,
    LinearProgress,
    IconButton,
    Tooltip,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Snackbar,
    Input,
    Fab,
    CircularProgress
} from '@mui/material'

// Context Imports
import { useTalent } from '@/contexts/TalentContext'

// Icon Imports - Using Iconify CSS classes

// Utils
import { getInitials } from '@/data/profileData'

const ProfileOverview = ({ data }) => {
    const [editAbout, setEditAbout] = useState(false)
    const [editSummary, setEditSummary] = useState(false)
    const [aboutContent, setAboutContent] = useState(data.aboutMe.content)
    const [summaryContent, setSummaryContent] = useState(data.professionalSummary.content)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    // AI Optimization states
    const [aiOptimizeOpen, setAiOptimizeOpen] = useState(false)
    const [aiPrompt, setAiPrompt] = useState('')
    const [aiGeneratedText, setAiGeneratedText] = useState('')
    const [showAiPrompt, setShowAiPrompt] = useState(false)
    const [showGeneratedSummary, setShowGeneratedSummary] = useState(false)

    // Skills management states
    const [showAddSkill, setShowAddSkill] = useState(false)
    const [newSkill, setNewSkill] = useState('')
    const [localSkills, setLocalSkills] = useState([])
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // Profile image upload states
    const [imageUploadOpen, setImageUploadOpen] = useState(false)
    const [profileImage, setProfileImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const fileInputRef = useRef(null)
    const cameraInputRef = useRef(null)

    // Allowed image MIME types
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

    // Validate file type
    const validateFileType = (file) => {
        if (!file) return false
        return allowedMimes.includes(file.type)
    }

    // Use Talent context
    const {
        saveProfile,
        generateProfessionalSummary,
        saveSkills,
        fetchSkills,
        uploadProfileImage,
        profilePercentage,
        loading,
        profile,
        skills
    } = useTalent()

    // Helper function to construct full image URL (same as navbar)
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL
        return `${uploadUrl}${imagePath}`
    }

    // Initialize skills on component mount
    useEffect(() => {
        fetchSkills()
    }, [fetchSkills])

    // Update local skills when skills from context change
    useEffect(() => {
        if (skills && skills.length > 0) {
            setLocalSkills(skills)
        } else {
            setLocalSkills([])
        }
        setHasUnsavedChanges(false)
    }, [skills])

    const handleSaveAbout = async () => {
        try {
            const result = await saveProfile({
                tp_id: data.user.id,
                tp_about: aboutContent
            })

            if (result.success) {
                setSnackbar({ open: true, message: 'About section updated successfully', severity: 'success' })
                setEditAbout(false)
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to update about section', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update about section', severity: 'error' })
        }
    }

    const handleSaveSummary = async () => {
        try {
            const result = await saveProfile({
                tp_id: data.user.id,
                tp_professional_summary: summaryContent
            })

            if (result.success) {
                setSnackbar({ open: true, message: 'Professional summary updated successfully', severity: 'success' })
                setEditSummary(false)
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to update professional summary', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update professional summary', severity: 'error' })
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    // AI Optimization handlers
    const handleAiOptimize = () => {
        setAiOptimizeOpen(true)
        setAiPrompt('')
        setAiGeneratedText('')
    }

    const handleGenerateSummary = async () => {
        if (!aiPrompt.trim()) {
            setSnackbar({ open: true, message: 'Please enter a prompt', severity: 'error' })
            return
        }

        try {
            const result = await generateProfessionalSummary(aiPrompt)
            if (result.success && result.data && result.data.generated_summary) {
                setAiGeneratedText(result.data.generated_summary)
                setShowGeneratedSummary(true)
                setSnackbar({ open: true, message: 'Professional summary generated successfully!', severity: 'success' })
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to generate summary', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to generate summary', severity: 'error' })
        }
    }

    const handleSaveAiSummary = async () => {
        if (!aiGeneratedText.trim()) {
            setSnackbar({ open: true, message: 'No generated text to save', severity: 'error' })
            return
        }

        try {
            const result = await saveProfile({
                tp_id: data.user.id,
                tp_professional_summary: aiGeneratedText
            })

            if (result.success) {
                setSummaryContent(aiGeneratedText)
                setSnackbar({ open: true, message: 'Professional summary updated successfully', severity: 'success' })
                setShowGeneratedSummary(false)
                setAiGeneratedText('')
                setAiPrompt('')
                setShowAiPrompt(false)
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to update summary', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update summary', severity: 'error' })
        }
    }

    const handleCancelAiSummary = () => {
        setShowGeneratedSummary(false)
        setAiGeneratedText('')
        setAiPrompt('')
        setShowAiPrompt(false)
    }

    // Skills management handlers
    const handleAddSkill = () => {
        setShowAddSkill(true)
        setNewSkill('')
    }

    const handleAddSkillToList = () => {
        if (!newSkill.trim()) {
            setSnackbar({ open: true, message: 'Please enter a skill', severity: 'error' })
            return
        }

        // Check if skill already exists
        const skillExists = localSkills.some(skill =>
            (typeof skill === 'string' ? skill : skill.ts_skill).toLowerCase() === newSkill.trim().toLowerCase()
        )

        if (skillExists) {
            setSnackbar({ open: true, message: 'Skill already exists', severity: 'error' })
            return
        }

        // Add skill to local list
        setLocalSkills(prev => [...prev, newSkill.trim()])
        setNewSkill('')
        setShowAddSkill(false)
        setHasUnsavedChanges(true)
        setSnackbar({ open: true, message: 'Skill added to list', severity: 'success' })
    }

    const handleRemoveSkill = (index) => {
        setLocalSkills(prev => prev.filter((_, i) => i !== index))
        setHasUnsavedChanges(true)
        setSnackbar({ open: true, message: 'Skill removed from list', severity: 'success' })
    }

    const handleSaveAllSkills = async () => {
        if (localSkills.length === 0) {
            setSnackbar({ open: true, message: 'No skills to save', severity: 'error' })
            return
        }

        try {
            // Determine if this is first time adding skills (all strings) or updating (mix of strings and objects)
            const isFirstTime = localSkills.every(skill => typeof skill === 'string')

            let skillsToSend
            if (isFirstTime) {
                // First time - send array of strings
                skillsToSend = localSkills
            } else {
                // Updating - send array of objects
                skillsToSend = localSkills.map(skill => {
                    if (typeof skill === 'string') {
                        return { ts_skill: skill }
                    }
                    return skill
                })
            }

            const result = await saveSkills(skillsToSend)
            if (result.success) {
                setSnackbar({ open: true, message: 'Skills saved successfully', severity: 'success' })
                setHasUnsavedChanges(false)
                // Refresh skills from context
                await fetchSkills()
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to save skills', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to save skills', severity: 'error' })
        }
    }

    const handleCancelSkills = () => {
        setLocalSkills(skills || [])
        setHasUnsavedChanges(false)
        setShowAddSkill(false)
        setNewSkill('')
        setSnackbar({ open: true, message: 'Changes cancelled', severity: 'info' })
    }

    // Profile image upload handlers
    const handleImageUpload = () => {
        setImageUploadOpen(true)
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (!validateFileType(file)) {
                setSnackbar({
                    open: true,
                    message: 'Please select a valid image file (JPEG, JPG, PNG, or GIF)',
                    severity: 'error'
                })
                // Clear the input
                event.target.value = ''
                return
            }

            setProfileImage(file)
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    const handleCameraCapture = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (!validateFileType(file)) {
                setSnackbar({
                    open: true,
                    message: 'Please select a valid image file (JPEG, JPG, PNG, or GIF)',
                    severity: 'error'
                })
                // Clear the input
                event.target.value = ''
                return
            }

            setProfileImage(file)
            const reader = new FileReader()
            reader.onload = (e) => setImagePreview(e.target.result)
            reader.readAsDataURL(file)
        }
    }

    const handleSaveImage = async () => {
        if (!profileImage) {
            setSnackbar({ open: true, message: 'Please select an image', severity: 'error' })
            return
        }

        // Double-check file type validation before upload
        if (!validateFileType(profileImage)) {
            setSnackbar({
                open: true,
                message: 'Please select a valid image file (JPEG, JPG, PNG, or GIF)',
                severity: 'error'
            })
            return
        }

        try {
            const formData = new FormData()
            formData.append('file', profileImage)

            const result = await uploadProfileImage(formData)
            if (result.success) {
                setSnackbar({ open: true, message: 'Profile image updated successfully', severity: 'success' })
                setImageUploadOpen(false)
                setProfileImage(null)
                setImagePreview(null)
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to update image', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update image', severity: 'error' })
        }
    }

    return (
        <Box className="space-y-6">
            {/* Profile Header */}
            <Card>
                <CardContent className="p-8">
                    <Box className="flex flex-col md:flex-row gap-6">
                        {/* Profile Picture and Basic Info */}
                        <Box className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            {/* Profile Picture */}
                            <Box className="relative">
                                <Avatar
                                    src={imagePreview || getImageUrl(profile?.tp_image) || '/images/avatars/1.png'}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        bgcolor: 'primary.main',
                                        fontSize: '2rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {getInitials(data.user.name)}
                                </Avatar>
                                <IconButton
                                    size="small"
                                    className="absolute bottom-0 right-0 bg-white border-2 border-gray-200"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'gray.100'
                                        }
                                    }}
                                    onClick={handleImageUpload}
                                >
                                    <i className="tabler-camera" />
                                </IconButton>
                            </Box>

                            {/* Basic Info */}
                            <Box className="text-center md:text-left">
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 'bold',
                                        color: 'var(--mui-palette-text-primary)',
                                        mb: 1
                                    }}
                                >
                                    {data.user.name}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'var(--mui-palette-text-secondary)',
                                        mb: 1
                                    }}
                                >
                                    {data.user.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'var(--mui-palette-text-disabled)',
                                        mb: 2
                                    }}
                                >
                                    {data.user.location} • {data.user.experience}
                                </Typography>

                                {/* Social Links */}
                                {/* <Box className="flex flex-wrap gap-3 justify-center md:justify-start">
                                    <Tooltip title="LinkedIn">
                                        <IconButton
                                            size="small"
                                            className="bg-blue-600 text-white hover:bg-blue-700"
                                        >
                                            <i className="tabler-brand-linkedin" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Behance">
                                        <IconButton
                                            size="small"
                                            className="bg-red-600 text-white hover:bg-red-700"
                                        >
                                            <i className="tabler-brand-behance" />
                                        </IconButton>
                                    </Tooltip>

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<i className="tabler-brand-linkedin" />}
                                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                    >
                                        Sync LinkedIn
                                    </Button>
                                </Box> */}
                            </Box>
                        </Box>

                        {/* Profile Completeness */}
                        <Box className="ml-auto">
                            <Box sx={{ textAlign: 'right', mb: 1 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'var(--mui-palette-text-secondary)'
                                    }}
                                >
                                    Profile Completeness
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'var(--mui-palette-text-primary)'
                                    }}
                                >
                                    {profilePercentage}%
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={profilePercentage}
                                sx={{
                                    width: 128,
                                    height: 8,
                                    borderRadius: 4,
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: 'var(--mui-palette-primary-main)',
                                        borderRadius: 4
                                    },
                                    backgroundColor: 'var(--mui-palette-action-disabledBackground)'
                                }}
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* About Me Section */}
            <Card>
                <CardContent className="p-6">
                    <Box className="flex justify-between items-center mb-4">
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: 'var(--mui-palette-text-primary)'
                            }}
                        >
                            About Me
                        </Typography>
                        <Button
                            variant="text"
                            size="small"
                            startIcon={<i className="tabler-edit" />}
                            onClick={() => setEditAbout(true)}
                            sx={{
                                color: 'var(--mui-palette-primary-main)',
                                '&:hover': {
                                    color: 'var(--mui-palette-primary-dark)',
                                    backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                }
                            }}
                        >
                            Edit
                        </Button>
                    </Box>

                    {editAbout ? (
                        <TextField
                            multiline
                            rows={6}
                            fullWidth
                            value={aboutContent}
                            onChange={(e) => setAboutContent(e.target.value)}
                            variant="outlined"
                            className="mb-4"
                        />
                    ) : (
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'var(--mui-palette-text-primary)',
                                lineHeight: 1.6
                            }}
                        >
                            {aboutContent}
                        </Typography>
                    )}

                    {editAbout && (
                        <Box className="flex gap-2 mt-4">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleSaveAbout}
                                sx={{
                                    backgroundColor: 'var(--mui-palette-primary-main)',
                                    '&:hover': {
                                        backgroundColor: 'var(--mui-palette-primary-dark)'
                                    }
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setAboutContent(data.aboutMe.content)
                                    setEditAbout(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card>
                <CardContent className="p-6">
                    <Box className="flex justify-between items-center mb-4">
                        <Box className="flex items-center gap-2">
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: 'var(--mui-palette-text-primary)'
                                }}
                            >
                                Professional Summary
                            </Typography>
                            {data.professionalSummary.isAIOptimized && (
                                <Chip
                                    icon={<i className="tabler-sparkles" />}
                                    label="AI-Optimized"
                                    size="small"
                                    sx={{
                                        backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
                                        color: 'var(--mui-palette-primary-dark)',
                                        border: '1px solid',
                                        borderColor: 'var(--mui-palette-primary-light)'
                                    }}
                                />
                            )}
                        </Box>
                        <Box className="flex gap-2">
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<i className="tabler-sparkles" />}
                                sx={{
                                    color: 'var(--mui-palette-primary-main)',
                                    '&:hover': {
                                        color: 'var(--mui-palette-primary-dark)',
                                        backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                    }
                                }}
                                onClick={() => {
                                    setShowAiPrompt(!showAiPrompt)
                                    setAiPrompt('')
                                    setAiGeneratedText('')
                                    setShowGeneratedSummary(false)
                                }}
                            >
                                {showAiPrompt ? 'Hide AI' : 'AI Optimize'}
                            </Button>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<i className="tabler-edit" />}
                                sx={{
                                    color: 'var(--mui-palette-primary-main)',
                                    '&:hover': {
                                        color: 'var(--mui-palette-primary-dark)',
                                        backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                    }
                                }}
                                onClick={() => setEditSummary(true)}
                            >
                                Edit
                            </Button>
                        </Box>
                    </Box>

                    {/* AI Optimization Input - Only visible when toggled */}
                    {showAiPrompt && !editSummary && (
                        <Box
                            sx={{
                                mb: 2,
                                p: 2,
                                backgroundColor: 'var(--mui-palette-action-hover)',
                                borderRadius: 2
                            }}
                        >
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                placeholder="Enter your prompt for AI optimization..."
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                variant="outlined"
                                size="small"
                                className="mb-3"
                            />
                            <Box className="flex gap-2">
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={loading.aiGeneration ? <CircularProgress size={16} color="inherit" /> : <i className="tabler-sparkles" />}
                                    onClick={handleGenerateSummary}
                                    disabled={!aiPrompt.trim() || loading.aiGeneration}
                                    sx={{
                                        backgroundColor: 'var(--mui-palette-primary-main)',
                                        '&:hover': {
                                            backgroundColor: 'var(--mui-palette-primary-dark)'
                                        }
                                    }}
                                >
                                    {loading.aiGeneration ? 'Generating...' : 'Optimize with AI'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => setAiPrompt('')}
                                    disabled={loading.aiGeneration}
                                >
                                    Clear
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* Summary Content */}
                    {editSummary ? (
                        <TextField
                            multiline
                            rows={6}
                            fullWidth
                            value={summaryContent}
                            onChange={(e) => setSummaryContent(e.target.value)}
                            variant="outlined"
                            className="mb-4"
                        />
                    ) : (
                        <Box className="relative">
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'var(--mui-palette-text-primary)'
                                }}
                            >
                                {summaryContent}
                            </Typography>
                            {/* Loading overlay for the summary block */}
                            {loading.aiGeneration && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'rgba(var(--mui-palette-background-paperChannel) / 0.75)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 2
                                    }}
                                >
                                    <Box className="flex items-center gap-2">
                                        <CircularProgress size={20} />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'var(--mui-palette-text-secondary)'
                                            }}
                                        >
                                            Generating AI-optimized summary...
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* Edit Summary Actions */}
                    {editSummary && (
                        <Box className="flex gap-2 mt-4">
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleSaveSummary}
                                sx={{
                                    backgroundColor: 'var(--mui-palette-primary-main)',
                                    '&:hover': {
                                        backgroundColor: 'var(--mui-palette-primary-dark)'
                                    }
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setSummaryContent(data.professionalSummary.content)
                                    setEditSummary(false)
                                    setShowAiPrompt(false)
                                    setAiPrompt('')
                                    setAiGeneratedText('')
                                    setShowGeneratedSummary(false)
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}

                    {/* Generated Summary Actions - Only show when there's generated text */}
                    {showGeneratedSummary && aiGeneratedText && !editSummary && !loading.aiGeneration && (
                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                backgroundColor: 'var(--mui-palette-success-lightOpacity)',
                                borderRadius: 2,
                                border: '1px solid',
                                borderColor: 'var(--mui-palette-success-light)'
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: 'var(--mui-palette-success-dark)',
                                    mb: 1
                                }}
                            >
                                AI-Generated Summary:
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'var(--mui-palette-success-dark)',
                                    mb: 2
                                }}
                            >
                                {aiGeneratedText}
                            </Typography>
                            <Box className="flex gap-2">
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleSaveAiSummary}
                                    disabled={loading.profile}
                                    sx={{
                                        backgroundColor: 'var(--mui-palette-success-main)',
                                        '&:hover': {
                                            backgroundColor: 'var(--mui-palette-success-dark)'
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handleCancelAiSummary}
                                    disabled={loading.profile}
                                    sx={{
                                        borderColor: 'var(--mui-palette-success-main)',
                                        color: 'var(--mui-palette-success-main)',
                                        '&:hover': {
                                            backgroundColor: 'var(--mui-palette-success-lightOpacity)'
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Featured Skills */}
            <Card>
                <CardContent className="p-6">
                    <Box className="flex justify-between items-center mb-4">
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: 'var(--mui-palette-text-primary)'
                            }}
                        >
                            Featured Skills
                        </Typography>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<i className="tabler-plus" />}
                            onClick={handleAddSkill}
                            sx={{
                                backgroundColor: 'var(--mui-palette-primary-main)',
                                '&:hover': {
                                    backgroundColor: 'var(--mui-palette-primary-dark)'
                                }
                            }}
                        >
                            Add Skill
                        </Button>
                    </Box>

                    {/* Add Skill Input - Only visible when adding */}
                    {showAddSkill && (
                        <Box
                            sx={{
                                mb: 3,
                                p: 2,
                                backgroundColor: 'var(--mui-palette-action-hover)',
                                borderRadius: 2
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Enter skill name (e.g., React, Python, Project Management...)"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                variant="outlined"
                                size="small"
                                className="mb-3"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddSkillToList()
                                    }
                                }}
                            />
                            <Box className="flex gap-2">
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<i className="tabler-plus" />}
                                    onClick={handleAddSkillToList}
                                    disabled={!newSkill.trim()}
                                    sx={{
                                        backgroundColor: 'var(--mui-palette-primary-main)',
                                        '&:hover': {
                                            backgroundColor: 'var(--mui-palette-primary-dark)'
                                        }
                                    }}
                                >
                                    Add to List
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                        setShowAddSkill(false)
                                        setNewSkill('')
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* Skills List */}
                    {localSkills.length > 0 ? (
                        <Box className="space-y-3 mb-6">
                            {localSkills.map((skill, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 1.5,
                                        backgroundColor: 'var(--mui-palette-action-hover)',
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'var(--mui-palette-text-primary)',
                                            fontWeight: 500
                                        }}
                                    >
                                        {typeof skill === 'string' ? skill : skill.ts_skill}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveSkill(index)}
                                        sx={{
                                            color: 'var(--mui-palette-error-main)',
                                            '&:hover': {
                                                color: 'var(--mui-palette-error-dark)',
                                                backgroundColor: 'var(--mui-palette-error-lightOpacity)'
                                            }
                                        }}
                                    >
                                        <i className="tabler-x" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 4,
                                color: 'var(--mui-palette-text-disabled)'
                            }}
                        >
                            <i
                                className="tabler-skills text-4xl mb-2"
                                style={{ color: 'var(--mui-palette-text-disabled)' }}
                            />
                            <Typography
                                variant="body1"
                                sx={{
                                    color: 'var(--mui-palette-text-disabled)'
                                }}
                            >
                                No skills added yet
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'var(--mui-palette-text-disabled)'
                                }}
                            >
                                Click "Add Skill" to get started
                            </Typography>
                        </Box>
                    )}

                    {/* Save/Cancel Actions - Only show when there are changes */}
                    {hasUnsavedChanges && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 1,
                                pt: 2,
                                borderTop: '1px solid',
                                borderColor: 'var(--mui-palette-divider)'
                            }}
                        >
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={loading.profile ? <CircularProgress size={16} color="inherit" /> : <i className="tabler-device-floppy" />}
                                onClick={handleSaveAllSkills}
                                disabled={loading.profile || localSkills.length === 0}
                                sx={{
                                    backgroundColor: 'var(--mui-palette-success-main)',
                                    '&:hover': {
                                        backgroundColor: 'var(--mui-palette-success-dark)'
                                    }
                                }}
                            >
                                {loading.profile ? 'Saving...' : 'Save All Skills'}
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<i className="tabler-x" />}
                                onClick={handleCancelSkills}
                                disabled={loading.profile}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>


            {/* Profile Image Upload Dialog */}
            <Dialog open={imageUploadOpen} onClose={() => setImageUploadOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Update Profile Picture</DialogTitle>
                <DialogContent>
                    <Box className="text-center">
                        {imagePreview ? (
                            <Box className="mb-4">
                                <Avatar
                                    src={imagePreview}
                                    sx={{ width: 150, height: 150, mx: 'auto', mb: 2 }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'var(--mui-palette-text-secondary)'
                                    }}
                                >
                                    Preview of your new profile picture
                                </Typography>
                            </Box>
                        ) : (
                            <Box className="mb-4">
                                <Avatar
                                    sx={{ width: 150, height: 150, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}
                                >
                                    {getInitials(data.user.name)}
                                </Avatar>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'var(--mui-palette-text-secondary)'
                                    }}
                                >
                                    Current profile picture
                                </Typography>
                            </Box>
                        )}

                        <Box className="flex gap-4 justify-center">
                            <Button
                                variant="outlined"
                                startIcon={<i className="tabler-upload" />}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload Image
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<i className="tabler-camera" />}
                                onClick={() => cameraInputRef.current?.click()}
                            >
                                Take Photo
                            </Button>
                        </Box>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <input
                            ref={cameraInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif"
                            capture="environment"
                            onChange={handleCameraCapture}
                            style={{ display: 'none' }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImageUploadOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSaveImage}
                        variant="contained"
                        disabled={!profileImage || loading.profile}
                    >
                        Save Image
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default ProfileOverview
