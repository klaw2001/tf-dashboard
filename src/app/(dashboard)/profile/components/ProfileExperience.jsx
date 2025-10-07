'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    List,
    ListItem,
    ListItemText,
    Alert,
    Snackbar,
    Chip,
    Divider
} from '@mui/material'

// Context Imports
import { useTalent } from '@/contexts/TalentContext'

// Component Imports
import RichTextEditor from '@/components/RichTextEditor'

// Icon Imports - Using Iconify CSS classes

const ProfileExperience = ({ data }) => {
    const [experiences, setExperiences] = useState(data || [])
    const [addExperienceOpen, setAddExperienceOpen] = useState(false)
    const [editExperienceOpen, setEditExperienceOpen] = useState(false)
    const [editingExperience, setEditingExperience] = useState(null)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [newExperience, setNewExperience] = useState({
        te_company_name: '',
        te_designation: '',
        te_location: '',
        te_start_date: '',
        te_end_date: '',
        te_description: '',
        te_technologies: ''
    })

    // Rich text editor state
    const [isEditingDescription, setIsEditingDescription] = useState(false)
    const [tempDescription, setTempDescription] = useState('')

    // Use Talent context
    const { saveExperience, loading } = useTalent()

    // Update experiences when data changes
    useEffect(() => {
        if (data) {
            setExperiences(data)
        }
    }, [data])

    const handleAddExperience = async () => {
        try {
            const result = await saveExperience(newExperience)

            if (result.success) {
                setSnackbar({ open: true, message: 'Experience added successfully', severity: 'success' })
                setNewExperience({
                    te_company_name: '',
                    te_designation: '',
                    te_location: '',
                    te_start_date: '',
                    te_end_date: '',
                    te_description: '',
                    te_technologies: ''
                })
                setAddExperienceOpen(false)
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to add experience', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to add experience', severity: 'error' })
        }
    }

    const handleEditExperience = (experience) => {
        setEditingExperience({
            te_id: experience.te_id,
            te_company_name: experience.te_company_name || '',
            te_designation: experience.te_designation || '',
            te_location: experience.te_location || '',
            te_start_date: experience.te_start_date ? experience.te_start_date.split('T')[0] : '',
            te_end_date: experience.te_end_date ? experience.te_end_date.split('T')[0] : '',
            te_description: experience.te_description || '',
            te_technologies: experience.te_technologies || ''
        })
        setEditExperienceOpen(true)
    }

    // Helper function to format HTML for editing
    const formatHTMLForEditing = (htmlString) => {
        if (!htmlString || htmlString === 'Data not available') {
            return ''
        }
        return htmlString
    }

    const handleDeleteExperience = async (experienceId) => {
        try {
            // Set status to false for soft delete
            const result = await saveExperience({
                te_id: experienceId,
                te_status: false
            })

            if (result.success) {
                setSnackbar({ open: true, message: 'Experience deleted successfully', severity: 'success' })
                // Update local state to reflect the change
                setExperiences(experiences.map(e =>
                    e.te_id === experienceId ? { ...e, te_status: false } : e
                ))
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to delete experience', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to delete experience', severity: 'error' })
        }
    }

    const handleSaveEdit = async () => {
        try {
            const result = await saveExperience(editingExperience)

            if (result.success) {
                setSnackbar({ open: true, message: 'Experience updated successfully', severity: 'success' })
                setEditExperienceOpen(false)
                setEditingExperience(null)
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to update experience', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update experience', severity: 'error' })
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    // Transform API data to display format
    const getDisplayData = (experience) => {
        return {
            id: experience.te_id,
            title: experience.te_designation || 'Data not available',
            company: experience.te_company_name || 'Data not available',
            location: experience.te_location || 'Data not available',
            duration: experience.te_start_date && experience.te_end_date
                ? `${new Date(experience.te_start_date).getFullYear()} - ${new Date(experience.te_end_date).getFullYear()}`
                : experience.te_start_date
                    ? `Since ${new Date(experience.te_start_date).getFullYear()}`
                    : 'Data not available',
            description: experience.te_description || 'Data not available',
            technologies: experience.te_technologies ? experience.te_technologies.split(',').map(t => t.trim()) : []
        }
    }

    // Helper function to render HTML content safely
    const renderHTML = (htmlString) => {
        if (!htmlString || htmlString === 'Data not available') {
            return (
                <Typography
                    variant="body2"
                    sx={{
                        color: 'var(--mui-palette-text-disabled)',
                        fontStyle: 'italic'
                    }}
                >
                    No description available
                </Typography>
            )
        }

        // Basic HTML sanitization - in production, use a proper sanitization library
        const sanitizedHTML = htmlString
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
            .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
            .replace(/javascript:/gi, '') // Remove javascript: protocols

        return (
            <Box
                dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
                sx={{
                    '& p': { margin: '8px 0' },
                    '& ul': { margin: '8px 0', paddingLeft: '20px' },
                    '& ol': { margin: '8px 0', paddingLeft: '20px' },
                    '& li': { margin: '4px 0' },
                    '& strong': { fontWeight: 'bold' },
                    '& em': { fontStyle: 'italic' },
                    '& h1, & h2, & h3, & h4, & h5, & h6': { margin: '12px 0 8px 0' }
                }}
            />
        )
    }


    return (
        <Box className="space-y-6">
            {/* Header */}
            <Box className="flex justify-between items-center">
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        color: 'var(--mui-palette-text-primary)'
                    }}
                >
                    Work Experience
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<i className="tabler-plus" />}
                    onClick={() => setAddExperienceOpen(true)}
                    sx={{
                        backgroundColor: 'var(--mui-palette-primary-main)',
                        '&:hover': {
                            backgroundColor: 'var(--mui-palette-primary-dark)'
                        }
                    }}
                >
                    Add Experience
                </Button>
            </Box>

            {/* Experience List */}
            <Box className="space-y-4">
                {experiences.length === 0 ? (
                    <Card>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'var(--mui-palette-text-secondary)',
                                    mb: 1
                                }}
                            >
                                No experience found
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'var(--mui-palette-text-disabled)'
                                }}
                            >
                                Add your work experience to showcase your career
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    experiences.map((experience) => {
                        const displayData = getDisplayData(experience)
                        return (
                            <Card key={experience.te_id}>
                                <CardContent className="p-6">
                                    <Box className="flex gap-4">
                                        {/* Building Icon */}
                                        <Box className="flex-shrink-0 mt-1">
                                            <i
                                                className="tabler-building"
                                                style={{ color: 'var(--mui-palette-text-disabled)' }}
                                            />
                                        </Box>

                                        {/* Experience Content */}
                                        <Box className="flex-1">
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'var(--mui-palette-text-primary)',
                                                    mb: 0.5
                                                }}
                                            >
                                                {displayData.title}
                                            </Typography>

                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    color: 'var(--mui-palette-text-secondary)',
                                                    mb: 1
                                                }}
                                            >
                                                {displayData.company}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'var(--mui-palette-text-disabled)',
                                                    mb: 2
                                                }}
                                            >
                                                {displayData.duration}, {displayData.location}
                                            </Typography>

                                            {/* Technologies */}
                                            {displayData.technologies.length > 0 && (
                                                <Box className="mb-4">
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'var(--mui-palette-text-secondary)',
                                                            mb: 1
                                                        }}
                                                    >
                                                        Technologies:
                                                    </Typography>
                                                    <Box className="flex flex-wrap gap-1">
                                                        {displayData.technologies.map((tech, index) => (
                                                            <Chip
                                                                key={index}
                                                                label={tech}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: 'var(--mui-palette-info-lightOpacity)',
                                                                    color: 'var(--mui-palette-info-dark)',
                                                                    border: '1px solid',
                                                                    borderColor: 'var(--mui-palette-info-light)'
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* Description/Achievements */}
                                            <Box className="mb-4">
                                                <Box className="flex justify-between items-center mb-2">
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'var(--mui-palette-text-secondary)',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        Description & Achievements:
                                                    </Typography>
                                                    <Button
                                                        size="small"
                                                        variant="text"
                                                        startIcon={<i className="tabler-edit" />}
                                                        onClick={() => {
                                                            setTempDescription(formatHTMLForEditing(displayData.description))
                                                            setIsEditingDescription(true)
                                                        }}
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
                                                <Box
                                                    sx={{
                                                        backgroundColor: 'var(--mui-palette-action-hover)',
                                                        p: 1.5,
                                                        borderRadius: 2
                                                    }}
                                                >
                                                    {renderHTML(displayData.description)}
                                                </Box>
                                            </Box>
                                        </Box>

                                        {/* Actions */}
                                        <Box className="flex flex-col gap-2">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleEditExperience(experience)}
                                                sx={{
                                                    color: 'var(--mui-palette-primary-main)',
                                                    '&:hover': {
                                                        color: 'var(--mui-palette-primary-dark)',
                                                        backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                                    }
                                                }}
                                            >
                                                <i className="tabler-edit" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleDeleteExperience(experience.te_id)}
                                                sx={{
                                                    color: 'var(--mui-palette-error-main)',
                                                    '&:hover': {
                                                        color: 'var(--mui-palette-error-dark)',
                                                        backgroundColor: 'var(--mui-palette-error-lightOpacity)'
                                                    }
                                                }}
                                            >
                                                <i className="tabler-trash" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </Box>

            {/* Add Experience Dialog */}
            <Dialog open={addExperienceOpen} onClose={() => setAddExperienceOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add Work Experience</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} className="mt-2">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Job Title"
                                value={newExperience.te_designation}
                                onChange={(e) => setNewExperience({ ...newExperience, te_designation: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Company"
                                value={newExperience.te_company_name}
                                onChange={(e) => setNewExperience({ ...newExperience, te_company_name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                value={newExperience.te_start_date}
                                onChange={(e) => setNewExperience({ ...newExperience, te_start_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                value={newExperience.te_end_date}
                                onChange={(e) => setNewExperience({ ...newExperience, te_end_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Location"
                                value={newExperience.te_location}
                                onChange={(e) => setNewExperience({ ...newExperience, te_location: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Technologies (comma separated)"
                                value={newExperience.te_technologies}
                                onChange={(e) => setNewExperience({ ...newExperience, te_technologies: e.target.value })}
                                placeholder="e.g., React, Node.js, Python, AWS"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 1,
                                    fontWeight: 500,
                                    color: 'var(--mui-palette-text-primary)'
                                }}
                            >
                                Description & Achievements
                            </Typography>
                            <RichTextEditor
                                value={newExperience.te_description}
                                onChange={(html) => setNewExperience({ ...newExperience, te_description: html })}
                                placeholder="Describe your role, key achievements, and responsibilities. Use the toolbar above to format your text with lists, bold, italic, links, and more."
                                minHeight={200}
                                maxHeight={300}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddExperienceOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddExperience}
                        sx={{
                            backgroundColor: 'var(--mui-palette-primary-main)',
                            '&:hover': {
                                backgroundColor: 'var(--mui-palette-primary-dark)'
                            }
                        }}
                    >
                        Add Experience
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Experience Dialog */}
            <Dialog open={editExperienceOpen} onClose={() => setEditExperienceOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Work Experience</DialogTitle>
                <DialogContent>
                    {editingExperience && (
                        <Grid container spacing={3} className="mt-2">
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Job Title"
                                    value={editingExperience.te_designation}
                                    onChange={(e) => setEditingExperience({ ...editingExperience, te_designation: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Company"
                                    value={editingExperience.te_company_name}
                                    onChange={(e) => setEditingExperience({ ...editingExperience, te_company_name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Start Date"
                                    type="date"
                                    value={editingExperience.te_start_date}
                                    onChange={(e) => setEditingExperience({ ...editingExperience, te_start_date: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="End Date"
                                    type="date"
                                    value={editingExperience.te_end_date}
                                    onChange={(e) => setEditingExperience({ ...editingExperience, te_end_date: e.target.value })}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    value={editingExperience.te_location}
                                    onChange={(e) => setEditingExperience({ ...editingExperience, te_location: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Technologies (comma separated)"
                                    value={editingExperience.te_technologies}
                                    onChange={(e) => setEditingExperience({ ...editingExperience, te_technologies: e.target.value })}
                                    placeholder="e.g., React, Node.js, Python, AWS"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 500,
                                        color: 'var(--mui-palette-text-primary)'
                                    }}
                                >
                                    Description & Achievements
                                </Typography>
                                <RichTextEditor
                                    value={editingExperience.te_description}
                                    onChange={(html) => setEditingExperience({ ...editingExperience, te_description: html })}
                                    placeholder="Describe your role, key achievements, and responsibilities. Use the toolbar above to format your text with lists, bold, italic, links, and more."
                                    minHeight={200}
                                    maxHeight={300}
                                />
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditExperienceOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveEdit}
                        sx={{
                            backgroundColor: 'var(--mui-palette-primary-main)',
                            '&:hover': {
                                backgroundColor: 'var(--mui-palette-primary-dark)'
                            }
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Rich Text Editor Dialog */}
            <Dialog
                open={isEditingDescription}
                onClose={() => setIsEditingDescription(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Description & Achievements</DialogTitle>
                <DialogContent>
                    <Box className="mt-4">
                        <Typography
                            variant="body2"
                            sx={{
                                mb: 1,
                                color: 'var(--mui-palette-text-secondary)'
                            }}
                        >
                            You can use HTML tags for rich formatting:
                        </Typography>
                        <Box
                            sx={{
                                mb: 2,
                                p: 1.5,
                                backgroundColor: 'var(--mui-palette-action-hover)',
                                borderRadius: 2
                            }}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'var(--mui-palette-text-secondary)'
                                }}
                            >
                                <strong>Examples:</strong><br />
                                • <code>&lt;ul&gt;&lt;li&gt;Achievement 1&lt;/li&gt;&lt;li&gt;Achievement 2&lt;/li&gt;&lt;/ul&gt;</code><br />
                                • <code>&lt;strong&gt;Bold text&lt;/strong&gt;</code><br />
                                • <code>&lt;em&gt;Italic text&lt;/em&gt;</code><br />
                                • <code>&lt;p&gt;Paragraph text&lt;/p&gt;</code><br />
                                • <code>&lt;h3&gt;Section Title&lt;/h3&gt;</code>
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            multiline
                            rows={12}
                            placeholder="Enter your description and achievements with HTML formatting..."
                            value={tempDescription}
                            onChange={(e) => setTempDescription(e.target.value)}
                            variant="outlined"
                        />
                        <Box sx={{ mt: 2 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    color: 'var(--mui-palette-text-secondary)'
                                }}
                            >
                                Preview:
                            </Typography>
                            <Box
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'var(--mui-palette-divider)',
                                    p: 1.5,
                                    borderRadius: 2,
                                    backgroundColor: 'var(--mui-palette-action-hover)',
                                    minHeight: 80
                                }}
                            >
                                {renderHTML(tempDescription)}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditingDescription(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            // Update the current experience with the new description
                            if (editingExperience) {
                                setEditingExperience({ ...editingExperience, te_description: tempDescription })
                            } else {
                                setNewExperience({ ...newExperience, te_description: tempDescription })
                            }
                            setIsEditingDescription(false)
                        }}
                        sx={{
                            backgroundColor: 'var(--mui-palette-primary-main)',
                            '&:hover': {
                                backgroundColor: 'var(--mui-palette-primary-dark)'
                            }
                        }}
                    >
                        Save Description
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

export default ProfileExperience
