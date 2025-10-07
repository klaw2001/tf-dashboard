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
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        color: 'var(--mui-palette-text-primary)'
                    }}
                >
                    Portfolio & Media
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<i className="tabler-upload" />}
                    sx={{
                        backgroundColor: 'var(--mui-palette-primary-main)',
                        '&:hover': {
                            backgroundColor: 'var(--mui-palette-primary-dark)'
                        }
                    }}
                >
                    Upload Media
                </Button>
            </Box>

            {/* Portfolio Media */}
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
                                                    startIcon={<i className="tabler-download" />}
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
                        {portfolio.externalLinks.map((link) => (
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

            {/* Upload Files Section */}
            <Card>
                <CardContent className="p-6">
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 4,
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
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <i
                                className="tabler-upload text-4xl mx-auto mb-4"
                                style={{ color: 'var(--mui-palette-text-disabled)' }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'var(--mui-palette-text-secondary)',
                                    mb: 1
                                }}
                            >
                                Upload Files
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'var(--mui-palette-text-disabled)'
                                }}
                            >
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
        </Box>
    )
}

export default ProfilePortfolio
