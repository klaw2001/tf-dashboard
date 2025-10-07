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
    Chip,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid,
    Alert,
    Snackbar
} from '@mui/material'

// Context Imports
import { useTalent } from '@/contexts/TalentContext'

// Component Imports
import ProjectImageUpload from '@/components/ProjectImageUpload'

// Icon Imports - Using Iconify CSS classes

const ProfileProjects = ({ data }) => {
    const [projects, setProjects] = useState(data || [])
    const [addProjectOpen, setAddProjectOpen] = useState(false)
    const [editProjectOpen, setEditProjectOpen] = useState(false)
    const [editingProject, setEditingProject] = useState(null)
    const [editingProjectImages, setEditingProjectImages] = useState(['', '', '', ''])
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [newProject, setNewProject] = useState({
        tpj_name: '',
        tpj_description: '',
        tpj_duration: '',
        tpj_impact: '',
        tpj_technologies: '',
        tpj_url: '',
        tpj_github_url: '',
        tpj_images: ''
    })
    const [newProjectImages, setNewProjectImages] = useState(['', '', '', ''])

    // Custom close function for add project modal
    const closeAddProjectModal = () => {
        console.log('Explicitly closing add project modal') // Debug log
        setAddProjectOpen(false)
    }

    // External Links state
    const [externalLinks, setExternalLinks] = useState([
        { id: 1, title: 'Personal Website', url: 'https://sarahmitchell.dev', icon: 'tabler-world' },
        { id: 2, title: 'GitHub Portfolio', url: 'https://github.com/saraharchitect', icon: 'tabler-brand-github' }
    ])
    const [addLinkOpen, setAddLinkOpen] = useState(false)
    const [newLink, setNewLink] = useState({
        title: '',
        url: '',
        icon: 'tabler-world'
    })

    // Use Talent context
    const { saveProject, loading } = useTalent()

    // Update projects when data changes
    useEffect(() => {
        if (data) {
            setProjects(data)
        }
    }, [data])

    const handleAddProject = async () => {
        try {
            // Filter out empty image paths and join with commas
            const imagePaths = newProjectImages.filter(path => path.trim() !== '').join(',')

            const projectData = {
                ...newProject,
                tpj_images: imagePaths
            }

            const result = await saveProject(projectData)

            if (result.success) {
                setSnackbar({ open: true, message: 'Project added successfully', severity: 'success' })
                setNewProject({
                    tpj_name: '',
                    tpj_description: '',
                    tpj_duration: '',
                    tpj_impact: '',
                    tpj_technologies: '',
                    tpj_url: '',
                    tpj_github_url: '',
                    tpj_images: ''
                })
                setNewProjectImages(['', '', '', ''])
                // Only close modal on successful project save
                closeAddProjectModal()
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to add project', severity: 'error' })
                // Keep modal open on error
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to add project', severity: 'error' })
            // Keep modal open on error
        }
    }

    const handleEditProject = (project) => {
        setEditingProject({
            tpj_id: project.tpj_id,
            tpj_name: project.tpj_name,
            tpj_description: project.tpj_description,
            tpj_duration: project.tpj_duration,
            tpj_impact: project.tpj_impact,
            tpj_technologies: project.tpj_technologies || '',
            tpj_url: project.tpj_url || '',
            tpj_github_url: project.tpj_github_url || '',
            tpj_images: project.tpj_images || ''
        })

        // Parse existing images into array
        const existingImages = project.tpj_images ? project.tpj_images.split(',') : []
        const imageArray = [...existingImages, ...Array(4 - existingImages.length).fill('')]
        setEditingProjectImages(imageArray)

        setEditProjectOpen(true)
    }

    const handleDeleteProject = async (projectId) => {
        try {
            // Set status to false for soft delete
            const result = await saveProject({
                tpj_id: projectId,
                tpj_status: false
            })

            if (result.success) {
                setSnackbar({ open: true, message: 'Project deleted successfully', severity: 'success' })
                // Update local state to reflect the change
                setProjects(projects.map(p =>
                    p.tpj_id === projectId ? { ...p, tpj_status: false } : p
                ))
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to delete project', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to delete project', severity: 'error' })
        }
    }

    const handleSaveEdit = async () => {
        try {
            // Filter out empty image paths and join with commas
            const imagePaths = editingProjectImages.filter(path => path.trim() !== '').join(',')

            const projectData = {
                ...editingProject,
                tpj_images: imagePaths
            }

            const result = await saveProject(projectData)

            if (result.success) {
                setSnackbar({ open: true, message: 'Project updated successfully', severity: 'success' })
                setEditProjectOpen(false)
                setEditingProject(null)
                setEditingProjectImages(['', '', '', ''])
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to update project', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to update project', severity: 'error' })
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    // External Links handlers
    const handleAddLink = () => {
        const link = {
            id: Date.now(),
            ...newLink
        }
        setExternalLinks([...externalLinks, link])
        setNewLink({
            title: '',
            url: '',
            icon: 'tabler-world'
        })
        setAddLinkOpen(false)
    }

    const handleDeleteLink = (linkId) => {
        setExternalLinks(externalLinks.filter(l => l.id !== linkId))
    }

    const getIconComponent = (iconName) => {
        return <i className={iconName} />
    }

    // Helper function to construct full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL
        return `${uploadUrl}${imagePath}`
    }

    // Transform API data to display format
    const getDisplayData = (project) => {
        return {
            id: project.tpj_id,
            title: project.tpj_name || 'Data not available',
            description: project.tpj_description || 'Data not available',
            duration: project.tpj_duration || 'Data not available',
            impact: project.tpj_impact || 'Data not available',
            technologies: project.tpj_technologies ? project.tpj_technologies.split(',').map(t => t.trim()) : [],
            images: project.tpj_images ? project.tpj_images.split(',').filter(img => img.trim() !== '') : [],
            links: {
                github: project.tpj_github_url || '',
                demo: project.tpj_url || '',
                images: project.tpj_images ? parseInt(project.tpj_images) : 0
            }
        }
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
                    Portfolio
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<i className="tabler-plus" />}
                    onClick={() => setAddProjectOpen(true)}
                    sx={{
                        backgroundColor: 'var(--mui-palette-primary-main)',
                        '&:hover': {
                            backgroundColor: 'var(--mui-palette-primary-dark)'
                        }
                    }}
                >
                    Add Project
                </Button>
            </Box>

            {/* Projects List */}
            <Box className="space-y-6">
                {projects.length === 0 ? (
                    <Card>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'var(--mui-palette-text-secondary)',
                                    mb: 1
                                }}
                            >
                                No projects found
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'var(--mui-palette-text-disabled)'
                                }}
                            >
                                Add your first project to showcase your work
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    projects.map((project) => {
                        const displayData = getDisplayData(project)
                        return (
                            <Card key={project.tpj_id}>
                                <CardContent className="p-6">
                                    <Box className="flex gap-6">
                                        {/* Project Content */}
                                        <Box className="flex-1">
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: 'var(--mui-palette-text-primary)',
                                                    mb: 1
                                                }}
                                            >
                                                {displayData.title}
                                            </Typography>

                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: 'var(--mui-palette-text-secondary)',
                                                    mb: 2,
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {displayData.description}
                                            </Typography>

                                            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'var(--mui-palette-text-secondary)',
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        Duration
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'var(--mui-palette-text-primary)',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {displayData.duration}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'var(--mui-palette-text-secondary)',
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        Impact
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'var(--mui-palette-text-primary)',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {displayData.impact}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: 'var(--mui-palette-text-secondary)',
                                                            mb: 0.5
                                                        }}
                                                    >
                                                        Technologies
                                                    </Typography>
                                                    <Box className="flex flex-wrap gap-1 mt-1">
                                                        {displayData.technologies.length > 0 ? (
                                                            displayData.technologies.map((tech, index) => (
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
                                                            ))
                                                        ) : (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: 'var(--mui-palette-text-disabled)'
                                                                }}
                                                            >
                                                                Data not available
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {/* Links */}
                                            <Box className="flex flex-wrap gap-4 mb-4">
                                                {displayData.links.github && (
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        startIcon={<i className="tabler-brand-github" />}
                                                        sx={{
                                                            color: 'var(--mui-palette-text-secondary)',
                                                            '&:hover': {
                                                                color: 'var(--mui-palette-primary-main)',
                                                                backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                                            }
                                                        }}
                                                        onClick={() => window.open(displayData.links.github, '_blank')}
                                                    >
                                                        GitHub
                                                    </Button>
                                                )}
                                                {displayData.links.demo && (
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        startIcon={<i className="tabler-play" />}
                                                        sx={{
                                                            color: 'var(--mui-palette-text-secondary)',
                                                            '&:hover': {
                                                                color: 'var(--mui-palette-primary-main)',
                                                                backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                                            }
                                                        }}
                                                        onClick={() => window.open(displayData.links.demo, '_blank')}
                                                    >
                                                        Demo
                                                    </Button>
                                                )}
                                                {displayData.links.images > 0 && (
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        startIcon={<i className="tabler-photo" />}
                                                        sx={{
                                                            color: 'var(--mui-palette-text-secondary)',
                                                            '&:hover': {
                                                                color: 'var(--mui-palette-primary-main)',
                                                                backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                                            }
                                                        }}
                                                    >
                                                        {displayData.links.images} images
                                                    </Button>
                                                )}
                                            </Box>

                                            {/* Actions */}
                                            <Box className="flex gap-2">
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    startIcon={<i className="tabler-edit" />}
                                                    onClick={() => handleEditProject(project)}
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
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    startIcon={<i className="tabler-trash" />}
                                                    onClick={() => handleDeleteProject(project.tpj_id)}
                                                    sx={{
                                                        color: 'var(--mui-palette-error-main)',
                                                        '&:hover': {
                                                            color: 'var(--mui-palette-error-dark)',
                                                            backgroundColor: 'var(--mui-palette-error-lightOpacity)'
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Box>

                                        {/* Project Images Display */}
                                        <Box
                                            sx={{
                                                width: 128,
                                                height: 128,
                                                backgroundColor: 'var(--mui-palette-action-hover)',
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid',
                                                borderColor: 'var(--mui-palette-divider)',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {displayData.images.length > 0 ? (
                                                <img
                                                    src={getImageUrl(displayData.images[0])}
                                                    alt={displayData.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <Tooltip title="No images uploaded">
                                                    <IconButton
                                                        sx={{
                                                            color: 'var(--mui-palette-text-disabled)'
                                                        }}
                                                    >
                                                        <i className="tabler-photo text-2xl" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </Box>

            {/* External Links */}
            <Card>
                <CardContent className="p-6">
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: 'var(--mui-palette-text-primary)',
                            mb: 2
                        }}
                    >
                        External Links
                    </Typography>

                    <Box className="space-y-3">
                        {externalLinks.map((link) => (
                            <Box
                                key={link.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 1.5,
                                    border: '1px solid',
                                    borderColor: 'var(--mui-palette-divider)',
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: 'var(--mui-palette-action-hover)'
                                    },
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <Box className="flex items-center gap-3">
                                    <Box sx={{ color: 'var(--mui-palette-text-secondary)' }}>
                                        {getIconComponent(link.icon)}
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 500,
                                                color: 'var(--mui-palette-text-primary)'
                                            }}
                                        >
                                            {link.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'var(--mui-palette-text-secondary)'
                                            }}
                                        >
                                            {link.url}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <IconButton
                                        size="small"
                                        onClick={() => window.open(link.url, '_blank')}
                                        sx={{
                                            color: 'var(--mui-palette-text-disabled)',
                                            '&:hover': {
                                                color: 'var(--mui-palette-primary-main)',
                                                backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                            }
                                        }}
                                    >
                                        <i className="tabler-external-link" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteLink(link.id)}
                                        sx={{
                                            color: 'var(--mui-palette-text-disabled)',
                                            '&:hover': {
                                                color: 'var(--mui-palette-error-main)',
                                                backgroundColor: 'var(--mui-palette-error-lightOpacity)'
                                            }
                                        }}
                                    >
                                        <i className="tabler-trash" />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}

                        {/* Add External Link Button */}
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 2,
                                border: '2px dashed',
                                borderColor: 'var(--mui-palette-divider)',
                                borderRadius: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: 'var(--mui-palette-primary-main)',
                                    backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                },
                                transition: 'all 0.2s'
                            }}
                            onClick={() => setAddLinkOpen(true)}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <i
                                    className="tabler-plus text-xl mx-auto mb-2"
                                    style={{ color: 'var(--mui-palette-text-disabled)' }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'var(--mui-palette-text-secondary)'
                                    }}
                                >
                                    + Add External Link
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Add Project Dialog */}
            <Dialog
                open={addProjectOpen}
                onClose={() => {
                    console.log('Dialog onClose triggered - preventing close') // Debug log
                    // Prevent all closing attempts
                }}
                maxWidth="md"
                fullWidth
                disableEscapeKeyDown
                disableRestoreFocus
                keepMounted={false}
                hideBackdrop={false}
                sx={{ zIndex: 1300 }}
                PaperProps={{
                    onClick: (e) => e.stopPropagation(),
                    onMouseDown: (e) => e.stopPropagation(),
                    onMouseUp: (e) => e.stopPropagation()
                }}
            >
                <DialogTitle>Add New Project</DialogTitle>
                <DialogContent
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                >
                    <Grid container spacing={3} className="mt-2">
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Project Title"
                                value={newProject.tpj_name}
                                onChange={(e) => setNewProject({ ...newProject, tpj_name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={newProject.tpj_description}
                                onChange={(e) => setNewProject({ ...newProject, tpj_description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Duration"
                                value={newProject.tpj_duration}
                                onChange={(e) => setNewProject({ ...newProject, tpj_duration: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Impact"
                                value={newProject.tpj_impact}
                                onChange={(e) => setNewProject({ ...newProject, tpj_impact: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Technologies (comma separated)"
                                value={newProject.tpj_technologies}
                                onChange={(e) => setNewProject({
                                    ...newProject,
                                    tpj_technologies: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="GitHub URL"
                                value={newProject.tpj_github_url}
                                onChange={(e) => setNewProject({
                                    ...newProject,
                                    tpj_github_url: e.target.value
                                })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Demo URL"
                                value={newProject.tpj_url}
                                onChange={(e) => setNewProject({
                                    ...newProject,
                                    tpj_url: e.target.value
                                })}
                            />
                        </Grid>

                        {/* Project Images Upload */}
                        <Grid item xs={12}>
                            <Box onClick={(e) => e.stopPropagation()}>
                                <ProjectImageUpload
                                    images={newProjectImages}
                                    onImagesChange={setNewProjectImages}
                                    onUploadSuccess={(message) => {
                                        console.log('Image upload success:', message) // Debug log
                                        setSnackbar({ open: true, message, severity: 'success' })
                                    }}
                                    onUploadError={(message) => {
                                        console.log('Image upload error:', message) // Debug log
                                        setSnackbar({ open: true, message, severity: 'error' })
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            console.log('Cancel button clicked') // Debug log
                            closeAddProjectModal()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            console.log('Add Project button clicked') // Debug log
                            handleAddProject()
                        }}
                        sx={{
                            backgroundColor: 'var(--mui-palette-primary-main)',
                            '&:hover': {
                                backgroundColor: 'var(--mui-palette-primary-dark)'
                            }
                        }}
                    >
                        Add Project
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Project Dialog */}
            <Dialog
                open={editProjectOpen}
                onClose={(event, reason) => {
                    // Only allow closing via explicit user action (not backdrop click or escape)
                    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                        return
                    }
                    setEditProjectOpen(false)
                }}
                maxWidth="md"
                fullWidth
                disableEscapeKeyDown
                disableRestoreFocus
                keepMounted={false}
            >
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    {editingProject && (
                        <Grid container spacing={3} className="mt-2">
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Project Title"
                                    value={editingProject.tpj_name}
                                    onChange={(e) => setEditingProject({ ...editingProject, tpj_name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    value={editingProject.tpj_description}
                                    onChange={(e) => setEditingProject({ ...editingProject, tpj_description: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Duration"
                                    value={editingProject.tpj_duration}
                                    onChange={(e) => setEditingProject({ ...editingProject, tpj_duration: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Impact"
                                    value={editingProject.tpj_impact}
                                    onChange={(e) => setEditingProject({ ...editingProject, tpj_impact: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Technologies (comma separated)"
                                    value={editingProject.tpj_technologies}
                                    onChange={(e) => setEditingProject({
                                        ...editingProject,
                                        tpj_technologies: e.target.value
                                    })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="GitHub URL"
                                    value={editingProject.tpj_github_url}
                                    onChange={(e) => setEditingProject({
                                        ...editingProject,
                                        tpj_github_url: e.target.value
                                    })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Demo URL"
                                    value={editingProject.tpj_url}
                                    onChange={(e) => setEditingProject({
                                        ...editingProject,
                                        tpj_url: e.target.value
                                    })}
                                />
                            </Grid>

                            {/* Project Images Upload */}
                            <Grid item xs={12}>
                                <Box onClick={(e) => e.stopPropagation()}>
                                    <ProjectImageUpload
                                        images={editingProjectImages}
                                        onImagesChange={setEditingProjectImages}
                                        onUploadSuccess={(message) => {
                                            console.log('Edit image upload success:', message) // Debug log
                                            setSnackbar({ open: true, message, severity: 'success' })
                                        }}
                                        onUploadError={(message) => {
                                            console.log('Edit image upload error:', message) // Debug log
                                            setSnackbar({ open: true, message, severity: 'error' })
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditProjectOpen(false)}>Cancel</Button>
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

            {/* Add External Link Dialog */}
            <Dialog open={addLinkOpen} onClose={() => setAddLinkOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add External Link</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} className="mt-2">
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Link Title"
                                value={newLink.title}
                                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                                placeholder="e.g., Personal Website, GitHub Portfolio"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="URL"
                                value={newLink.url}
                                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                                placeholder="https://example.com"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" className="mb-2">
                                Icon
                            </Typography>
                            <Box className="flex gap-2">
                                {[
                                    { name: 'tabler-world', label: 'Website' },
                                    { name: 'tabler-brand-github', label: 'GitHub' },
                                    { name: 'tabler-download', label: 'Download' },
                                    { name: 'tabler-play', label: 'Video' },
                                    { name: 'tabler-photo', label: 'Photo' }
                                ].map((iconOption) => (
                                    <Chip
                                        key={iconOption.name}
                                        icon={<i className={iconOption.name} />}
                                        label={iconOption.label}
                                        onClick={() => setNewLink({ ...newLink, icon: iconOption.name })}
                                        variant={newLink.icon === iconOption.name ? 'filled' : 'outlined'}
                                        sx={{
                                            ...(newLink.icon === iconOption.name && {
                                                backgroundColor: 'var(--mui-palette-primary-main)',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'var(--mui-palette-primary-dark)'
                                                }
                                            })
                                        }}
                                    />
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddLinkOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddLink}
                        sx={{
                            backgroundColor: 'var(--mui-palette-primary-main)',
                            '&:hover': {
                                backgroundColor: 'var(--mui-palette-primary-dark)'
                            }
                        }}
                    >
                        Add Link
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

export default ProfileProjects
