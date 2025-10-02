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

// Icon Imports - Using Iconify CSS classes

const ProfileProjects = ({ data }) => {
    const [projects, setProjects] = useState(data || [])
    const [addProjectOpen, setAddProjectOpen] = useState(false)
    const [editProjectOpen, setEditProjectOpen] = useState(false)
    const [editingProject, setEditingProject] = useState(null)
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
            const result = await saveProject(newProject)

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
                setAddProjectOpen(false)
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to add project', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to add project', severity: 'error' })
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
            const result = await saveProject(editingProject)

            if (result.success) {
                setSnackbar({ open: true, message: 'Project updated successfully', severity: 'success' })
                setEditProjectOpen(false)
                setEditingProject(null)
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

    // Transform API data to display format
    const getDisplayData = (project) => {
        return {
            id: project.tpj_id,
            title: project.tpj_name || 'Data not available',
            description: project.tpj_description || 'Data not available',
            duration: project.tpj_duration || 'Data not available',
            impact: project.tpj_impact || 'Data not available',
            technologies: project.tpj_technologies ? project.tpj_technologies.split(',').map(t => t.trim()) : [],
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
                <Typography variant="h5" className="font-bold text-gray-900">
                    Featured Projects
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<i className="tabler-plus" />}
                    onClick={() => setAddProjectOpen(true)}
                    className="bg-primary-main hover:bg-primary-dark"
                >
                    Add Project
                </Button>
            </Box>

            {/* Projects List */}
            <Box className="space-y-6">
                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-center">
                            <Typography variant="h6" className="text-gray-500 mb-2">
                                No projects found
                            </Typography>
                            <Typography variant="body2" className="text-gray-400">
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
                                            <Typography variant="h6" className="font-semibold text-gray-900 mb-2">
                                                {displayData.title}
                                            </Typography>

                                            <Typography variant="body1" className="text-gray-700 mb-4 leading-relaxed">
                                                {displayData.description}
                                            </Typography>

                                            <Box className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                <Box>
                                                    <Typography variant="body2" className="text-gray-500 mb-1">
                                                        Duration
                                                    </Typography>
                                                    <Typography variant="body2" className="text-gray-900 font-medium">
                                                        {displayData.duration}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" className="text-gray-500 mb-1">
                                                        Impact
                                                    </Typography>
                                                    <Typography variant="body2" className="text-gray-900 font-medium">
                                                        {displayData.impact}
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" className="text-gray-500 mb-1">
                                                        Technologies
                                                    </Typography>
                                                    <Box className="flex flex-wrap gap-1 mt-1">
                                                        {displayData.technologies.length > 0 ? (
                                                            displayData.technologies.map((tech, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    label={tech}
                                                                    size="small"
                                                                    className="bg-blue-100 text-blue-700 border-blue-200"
                                                                />
                                                            ))
                                                        ) : (
                                                            <Typography variant="body2" className="text-gray-400">
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
                                                        className="text-gray-600 hover:text-primary-main"
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
                                                        className="text-gray-600 hover:text-primary-main"
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
                                                        className="text-gray-600 hover:text-primary-main"
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
                                                    className="text-primary-main hover:text-primary-dark"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    startIcon={<i className="tabler-trash" />}
                                                    onClick={() => handleDeleteProject(project.tpj_id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Box>

                                        {/* Project Image Placeholder */}
                                        <Box className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                            <Tooltip title="Upload Project Image">
                                                <IconButton className="text-gray-400">
                                                    <i className="tabler-photo text-2xl" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </Box>

            {/* Add Project Dialog */}
            <Dialog open={addProjectOpen} onClose={() => setAddProjectOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add New Project</DialogTitle>
                <DialogContent>
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
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddProjectOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddProject}
                        className="bg-primary-main hover:bg-primary-dark"
                    >
                        Add Project
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Project Dialog */}
            <Dialog open={editProjectOpen} onClose={() => setEditProjectOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Project</DialogTitle>
                <DialogContent>
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
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditProjectOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveEdit}
                        className="bg-primary-main hover:bg-primary-dark"
                    >
                        Save Changes
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
