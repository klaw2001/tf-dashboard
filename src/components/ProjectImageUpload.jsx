'use client'

// React Imports
import { useState, useRef } from 'react'

// MUI Imports
import {
    Box,
    Grid,
    IconButton,
    Dialog,
    DialogContent,
    Avatar,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material'

// Context Imports
import { useTalent } from '@/contexts/TalentContext'

const ProjectImageUpload = ({
    images = [],
    onImagesChange,
    disabled = false,
    onUploadSuccess = null,
    onUploadError = null
}) => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [uploadingIndex, setUploadingIndex] = useState(null)
    const fileInputRefs = useRef({})

    // Helper function to trigger file input
    const triggerFileInput = (index) => {
        const fileInput = fileInputRefs.current[index]
        if (fileInput) {
            console.log('Triggering file input for index:', index)
            fileInput.click()
        } else {
            console.log('File input not found for index:', index)
        }
    }

    // Use Talent context for uploading images
    const { uploadProjectImage, loading } = useTalent()

    // Helper function to construct full image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL
        return `${uploadUrl}${imagePath}`
    }

    // Handle file selection
    const handleFileSelect = async (event, index) => {
        const file = event.target.files[0]
        if (!file) return

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
            setSnackbar({
                open: true,
                message: 'Please select a valid image file (JPEG, JPG, PNG, or GIF)',
                severity: 'error'
            })
            event.target.value = ''
            return
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            setSnackbar({
                open: true,
                message: 'File size must be less than 5MB',
                severity: 'error'
            })
            event.target.value = ''
            return
        }

        setUploadingIndex(index)

        try {
            const formData = new FormData()
            formData.append('file', file)

            const result = await uploadProjectImage(formData)

            if (result.success) {
                const newImages = [...images]
                newImages[index] = result.data.filePath
                onImagesChange(newImages)

                if (onUploadSuccess) {
                    onUploadSuccess('Image uploaded successfully')
                } else {
                    setSnackbar({
                        open: true,
                        message: 'Image uploaded successfully',
                        severity: 'success'
                    })
                }
            } else {
                const errorMessage = result.error || 'Failed to upload image'
                if (onUploadError) {
                    onUploadError(errorMessage)
                } else {
                    setSnackbar({
                        open: true,
                        message: errorMessage,
                        severity: 'error'
                    })
                }
            }
        } catch (error) {
            const errorMessage = 'Failed to upload image'
            if (onUploadError) {
                onUploadError(errorMessage)
            } else {
                setSnackbar({
                    open: true,
                    message: errorMessage,
                    severity: 'error'
                })
            }
        } finally {
            setUploadingIndex(null)
            event.target.value = ''
        }
    }

    // Handle image preview
    const handleImagePreview = (imagePath) => {
        if (imagePath) {
            setPreviewImage(getImageUrl(imagePath))
            setPreviewOpen(true)
        }
    }

    // Handle image removal
    const handleRemoveImage = (index) => {
        const newImages = [...images]
        newImages[index] = ''
        onImagesChange(newImages)

        setSnackbar({
            open: true,
            message: 'Image removed',
            severity: 'success'
        })
    }

    // Handle snackbar close
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    // Render image upload box
    const renderImageBox = (index) => {
        const imagePath = images[index]
        const isUploading = uploadingIndex === index
        const isLoading = loading.projects && isUploading

        return (
            <Box
                key={index}
                sx={{
                    width: '100%',
                    height: 120,
                    border: 2,
                    borderColor: imagePath ? 'primary.main' : 'grey.300',
                    borderStyle: 'dashed',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: imagePath ? 'pointer' : 'pointer',
                    backgroundColor: imagePath ? 'primary.50' : 'grey.50',
                    '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: imagePath ? 'primary.100' : 'grey.100',
                    },
                }}
                onClick={(e) => {
                    console.log('Image upload box clicked, index:', index, 'imagePath:', imagePath) // Debug log
                    e.stopPropagation() // Prevent event bubbling
                    if (imagePath) {
                        handleImagePreview(imagePath)
                    } else {
                        triggerFileInput(index)
                    }
                }}
            >
                {imagePath ? (
                    <>
                        {/* Display uploaded image */}
                        <Avatar
                            src={getImageUrl(imagePath)}
                            sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 1,
                            }}
                            variant="rounded"
                        />

                        {/* Remove button */}
                        {!disabled && (
                            <IconButton
                                size="small"
                                sx={{
                                    position: 'absolute',
                                    top: 4,
                                    right: 4,
                                    backgroundColor: 'error.main',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'error.dark',
                                    },
                                    zIndex: 1,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveImage(index)
                                }}
                            >
                                <i className="tabler-x" />
                            </IconButton>
                        )}
                    </>
                ) : isLoading ? (
                    /* Loading state */
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CircularProgress size={24} />
                        <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                            Uploading...
                        </Typography>
                    </Box>
                ) : (
                    /* Empty state */
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <i className="tabler-photo text-2xl text-gray-400" />
                        <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary', textAlign: 'center' }}>
                            Click to upload
                        </Typography>
                    </Box>
                )}

                {/* Hidden file input */}
                <input
                    ref={(el) => {
                        fileInputRefs.current[index] = el
                        console.log('File input ref set for index:', index, el) // Debug log
                    }}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={(e) => {
                        e.stopPropagation()
                        console.log('File input onChange triggered for index:', index) // Debug log
                        handleFileSelect(e, index)
                    }}
                    style={{ display: 'none' }}
                    disabled={disabled}
                />
            </Box>
        )
    }

    return (
        <>
            <Box
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
            >
                <Typography variant="subtitle2" className="mb-3 font-medium text-gray-700">
                    Project Images
                </Typography>
                <Typography variant="body2" className="mb-4 text-gray-500">
                    Upload up to 4 images to showcase your project (JPEG, PNG, GIF - Max 5MB each)
                </Typography>

                <Grid container spacing={2}>
                    {[0, 1, 2, 3].map((index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            {renderImageBox(index)}
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Image Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 1,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                        }}
                        onClick={() => setPreviewOpen(false)}
                    >
                        <i className="tabler-x" />
                    </IconButton>

                    {previewImage && (
                        <Box
                            component="img"
                            src={previewImage}
                            alt="Project preview"
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                display: 'block',
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Snackbar for notifications - only show if no callbacks provided */}
            {!onUploadSuccess && !onUploadError && (
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    sx={{ zIndex: 1300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            )}
        </>
    )
}

export default ProjectImageUpload
