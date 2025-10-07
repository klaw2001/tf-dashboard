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
    Avatar,
    Rating,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Grid
} from '@mui/material'

// Icon Imports - Using Iconify CSS classes

// Utils
import { getInitials, getAvatarColor } from '@/data/profileData'

const ProfileReviews = ({ data }) => {
    // Transform data to expected structure or provide defaults
    const transformedData = data && data.length > 0 ? {
        overallRating: 4.5, // You can calculate this from actual reviews
        totalReviews: data.length,
        testimonials: data.map((review, index) => ({
            id: review.id || index,
            clientName: review.client_name || 'Anonymous Client',
            clientTitle: review.client_title || 'Client',
            clientInitials: review.client_initials || 'AC',
            avatarColor: review.avatar_color || 'primary',
            rating: review.rating || 5,
            testimonial: review.testimonial || review.review_text || 'Great work!',
            engagement: {
                type: review.engagement_type || 'Project',
                duration: review.duration || '1 month',
                period: review.period || '2024'
            }
        }))
    } : {
        overallRating: 0,
        totalReviews: 0,
        testimonials: []
    }

    const [reviews, setReviews] = useState(transformedData)
    const [requestReviewOpen, setRequestReviewOpen] = useState(false)
    const [newReviewRequest, setNewReviewRequest] = useState({
        clientName: '',
        clientEmail: '',
        projectName: '',
        message: ''
    })

    // Update reviews state when data changes
    useEffect(() => {
        const newTransformedData = data && data.length > 0 ? {
            overallRating: 4.5, // You can calculate this from actual reviews
            totalReviews: data.length,
            testimonials: data.map((review, index) => ({
                id: review.id || index,
                clientName: review.client_name || 'Anonymous Client',
                clientTitle: review.client_title || 'Client',
                clientInitials: review.client_initials || 'AC',
                avatarColor: review.avatar_color || 'primary',
                rating: review.rating || 5,
                testimonial: review.testimonial || review.review_text || 'Great work!',
                engagement: {
                    type: review.engagement_type || 'Project',
                    duration: review.duration || '1 month',
                    period: review.period || '2024'
                }
            }))
        } : {
            overallRating: 0,
            totalReviews: 0,
            testimonials: []
        }
        setReviews(newTransformedData)
    }, [data])

    const handleRequestReview = () => {
        // Here you would send the review request
        console.log('Review request sent:', newReviewRequest)
        setNewReviewRequest({
            clientName: '',
            clientEmail: '',
            projectName: '',
            message: ''
        })
        setRequestReviewOpen(false)
    }

    const renderStars = (rating) => {
        const stars = []
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 !== 0

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <i
                    key={i}
                    className="tabler-star-filled text-yellow-400"
                />
            )
        }

        if (hasHalfStar) {
            stars.push(
                <i
                    key="half"
                    className="tabler-star-filled text-yellow-400 opacity-50"
                />
            )
        }

        const remainingStars = 5 - Math.ceil(rating)
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <i
                    key={`empty-${i}`}
                    className="tabler-star text-gray-300"
                />
            )
        }

        return stars
    }

    return (
        <Box className="space-y-6">
            {/* Header */}
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    color: 'var(--mui-palette-text-primary)'
                }}
            >
                Client Reviews & Testimonials
            </Typography>

            {/* Overall Rating */}
            <Box className="flex items-center gap-3 mb-6">
                <Box className="flex">
                    {renderStars(reviews.overallRating)}
                </Box>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: 'var(--mui-palette-text-primary)'
                    }}
                >
                    {reviews.overallRating}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'var(--mui-palette-text-secondary)'
                    }}
                >
                    Based on {reviews.totalReviews} reviews
                </Typography>
            </Box>

            {/* Testimonials */}
            <Box className="space-y-6">
                {reviews.testimonials && reviews.testimonials.length > 0 ? (
                    reviews.testimonials.map((testimonial) => (
                        <Card key={testimonial.id}>
                            <CardContent className="p-6">
                                <Box className="flex gap-4">
                                    {/* Client Avatar */}
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            bgcolor: getAvatarColor(testimonial.avatarColor),
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {testimonial.clientInitials}
                                    </Avatar>

                                    {/* Testimonial Content */}
                                    <Box className="flex-1">
                                        <Box className="flex items-start justify-between mb-2">
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: 'var(--mui-palette-text-primary)'
                                                    }}
                                                >
                                                    {testimonial.clientName}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: 'var(--mui-palette-text-secondary)'
                                                    }}
                                                >
                                                    {testimonial.clientTitle}
                                                </Typography>
                                            </Box>
                                            <Box className="flex">
                                                {renderStars(testimonial.rating)}
                                            </Box>
                                        </Box>

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'var(--mui-palette-text-primary)',
                                                lineHeight: 1.6,
                                                mb: 2
                                            }}
                                        >
                                            "{testimonial.testimonial}"
                                        </Typography>

                                        <Box className="flex flex-wrap gap-4">
                                            <Chip
                                                label={testimonial.engagement.type}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'var(--mui-palette-info-lightOpacity)',
                                                    color: 'var(--mui-palette-info-dark)'
                                                }}
                                            />
                                            <Chip
                                                label={testimonial.engagement.duration}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'var(--mui-palette-success-lightOpacity)',
                                                    color: 'var(--mui-palette-success-dark)'
                                                }}
                                            />
                                            <Chip
                                                label={testimonial.engagement.period}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'var(--mui-palette-action-hover)',
                                                    color: 'var(--mui-palette-text-secondary)'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'var(--mui-palette-text-secondary)',
                                    mb: 1
                                }}
                            >
                                No reviews yet
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'var(--mui-palette-text-disabled)'
                                }}
                            >
                                Your client reviews and testimonials will appear here once you start receiving them.
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>

            {/* Call to Action */}
            <Card
                sx={{
                    background: 'linear-gradient(135deg, var(--mui-palette-primary-lightOpacity) 0%, var(--mui-palette-secondary-lightOpacity) 100%)',
                    border: '1px solid',
                    borderColor: 'var(--mui-palette-primary-light)'
                }}
            >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: 'var(--mui-palette-text-primary)',
                            mb: 2
                        }}
                    >
                        Want to work with Sarah? Submit an intent or book a consultation.
                    </Typography>

                    <Box className="flex flex-wrap justify-center gap-4">
                        <Button
                            variant="contained"
                            startIcon={<i className="tabler-eye" />}
                            sx={{
                                backgroundColor: 'var(--mui-palette-primary-main)',
                                '&:hover': {
                                    backgroundColor: 'var(--mui-palette-primary-dark)'
                                }
                            }}
                        >
                            View All Reviews
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<i className="tabler-plus" />}
                            onClick={() => setRequestReviewOpen(true)}
                            sx={{
                                borderColor: 'var(--mui-palette-primary-main)',
                                color: 'var(--mui-palette-primary-main)',
                                '&:hover': {
                                    backgroundColor: 'var(--mui-palette-primary-main)',
                                    color: 'white'
                                }
                            }}
                        >
                            Request Review
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Request Review Dialog */}
            <Dialog open={requestReviewOpen} onClose={() => setRequestReviewOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Request a Review</DialogTitle>
                <DialogContent>
                    <Grid container spacing={3} className="mt-2">
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Client Name"
                                value={newReviewRequest.clientName}
                                onChange={(e) => setNewReviewRequest({ ...newReviewRequest, clientName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Client Email"
                                type="email"
                                value={newReviewRequest.clientEmail}
                                onChange={(e) => setNewReviewRequest({ ...newReviewRequest, clientEmail: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Project Name"
                                value={newReviewRequest.projectName}
                                onChange={(e) => setNewReviewRequest({ ...newReviewRequest, projectName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Message (Optional)"
                                value={newReviewRequest.message}
                                onChange={(e) => setNewReviewRequest({ ...newReviewRequest, message: e.target.value })}
                                placeholder="Add a personal message to include with the review request..."
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRequestReviewOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleRequestReview}
                        sx={{
                            backgroundColor: 'var(--mui-palette-primary-main)',
                            '&:hover': {
                                backgroundColor: 'var(--mui-palette-primary-dark)'
                            }
                        }}
                    >
                        Send Review Request
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ProfileReviews
