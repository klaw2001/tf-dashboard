'use client'

// React Imports
import { useState } from 'react'

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
    Chip
} from '@mui/material'

// Icon Imports - Using Iconify CSS classes

const ProfilePortfolio = ({ data }) => {
    const [portfolio, setPortfolio] = useState(data)
    const [addLinkOpen, setAddLinkOpen] = useState(false)
    const [newLink, setNewLink] = useState({
        title: '',
        url: '',
        icon: 'tabler-world'
    })

    const handleAddLink = () => {
        const link = {
            id: Date.now(),
            ...newLink
        }
        setPortfolio({
            ...portfolio,
            externalLinks: [...portfolio.externalLinks, link]
        })
        setNewLink({
            title: '',
            url: '',
            icon: 'tabler-world'
        })
        setAddLinkOpen(false)
    }

    const handleDeleteLink = (linkId) => {
        setPortfolio({
            ...portfolio,
            externalLinks: portfolio.externalLinks.filter(l => l.id !== linkId)
        })
    }

    const getIconComponent = (iconName) => {
        return <i className={iconName} />
    }

    const getMediaIcon = (type) => {
        switch (type) {
            case 'images':
                return <i className="tabler-photo text-2xl" />
            case 'document':
                return <i className="tabler-download text-2xl" />
            case 'videos':
                return <i className="tabler-play text-2xl" />
            default:
                return <i className="tabler-photo text-2xl" />
        }
    }

    return (
        <Box className="space-y-6">
            {/* Header */}
            <Box className="flex justify-between items-center">
                <Typography variant="h5" className="font-bold text-gray-900">
                    Portfolio & Media
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<i className="tabler-upload" />}
                    className="bg-primary-main hover:bg-primary-dark"
                >
                    Upload Media
                </Button>
            </Box>

            {/* Portfolio Media */}
            <Card>
                <CardContent className="p-6">
                    <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                        Portfolio & Media
                    </Typography>

                    <Grid container spacing={3}>
                        {portfolio.media.map((media) => (
                            <Grid item xs={12} sm={6} md={4} key={media.id}>
                                <Card
                                    className={`bg-gradient-to-br ${media.gradient} text-white cursor-pointer hover:shadow-lg transition-shadow duration-200`}
                                    sx={{ minHeight: 120 }}
                                >
                                    <CardContent className="p-4 h-full flex flex-col items-center justify-center">
                                        <Box className="text-center">
                                            <Box className="mb-3">
                                                {getMediaIcon(media.type)}
                                            </Box>
                                            <Typography variant="h6" className="font-semibold text-white mb-1">
                                                {media.title}
                                            </Typography>
                                            <Typography variant="body2" className="text-white/80">
                                                {media.count ? `${media.count} ${media.type}` : media.format}
                                            </Typography>
                                            {media.type === 'document' && (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    startIcon={<tablerDownload size={16} />}
                                                    className="mt-3 bg-white text-gray-900 hover:bg-gray-100"
                                                >
                                                    Download
                                                </Button>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Card>

            {/* External Links */}
            <Card>
                <CardContent className="p-6">
                    <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                        External Links
                    </Typography>

                    <Box className="space-y-3">
                        {portfolio.externalLinks.map((link) => (
                            <Box
                                key={link.id}
                                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                <Box className="flex items-center gap-3">
                                    <Box className="text-gray-600">
                                        {getIconComponent(link.icon)}
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle1" className="font-medium text-gray-900">
                                            {link.title}
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-500">
                                            {link.url}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box className="flex items-center gap-2">
                                    <IconButton
                                        size="small"
                                        onClick={() => window.open(link.url, '_blank')}
                                        className="text-gray-400 hover:text-primary-main"
                                    >
                                        <i className="tabler-external-link" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteLink(link.id)}
                                        className="text-gray-400 hover:text-red-600"
                                    >
                                        <i className="tabler-trash" />
                                    </IconButton>
                                </Box>
                            </Box>
                        ))}

                        {/* Add External Link Button */}
                        <Box
                            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-main hover:bg-primary-main/5 transition-colors duration-200"
                            onClick={() => setAddLinkOpen(true)}
                        >
                            <Box className="text-center">
                                <i className="tabler-plus text-gray-400 text-xl mx-auto mb-2" />
                                <Typography variant="body2" className="text-gray-500">
                                    + Add External Link
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Upload Files Section */}
            <Card>
                <CardContent className="p-6">
                    <Box
                        className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-main hover:bg-primary-main/5 transition-colors duration-200"
                    >
                        <Box className="text-center">
                            <i className="tabler-upload text-gray-400 text-4xl mx-auto mb-4" />
                            <Typography variant="h6" className="text-gray-600 mb-2">
                                Upload Files
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                                Images, PDFs, Videos
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

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
                                        className={newLink.icon === iconOption.name ? 'bg-primary-main text-white' : ''}
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
                        className="bg-primary-main hover:bg-primary-dark"
                    >
                        Add Link
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ProfilePortfolio
