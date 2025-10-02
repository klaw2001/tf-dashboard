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
    const [reviews, setReviews] = useState(data)
    const [requestReviewOpen, setRequestReviewOpen] = useState(false)
    const [newReviewRequest, setNewReviewRequest] = useState({
        clientName: '',
        clientEmail: '',
        projectName: '',
        message: ''
    })

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
            <Typography variant="h5" className="font-bold text-gray-900">
                Client Reviews & Testimonials
            </Typography>

            {/* Overall Rating */}
            <Box className="flex items-center gap-3 mb-6">
                <Box className="flex">
                    {renderStars(reviews.overallRating)}
                </Box>
                <Typography variant="h4" className="font-bold text-gray-900">
                    {reviews.overallRating}
                </Typography>
                <Typography variant="body1" className="text-gray-600">
                    Based on {reviews.totalReviews} reviews
                </Typography>
            </Box>

            {/* Testimonials */}
            <Box className="space-y-6">
                {reviews.testimonials.map((testimonial) => (
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
                                            <Typography variant="h6" className="font-semibold text-gray-900">
                                                {testimonial.clientName}
                                            </Typography>
                                            <Typography variant="body2" className="text-gray-600">
                                                {testimonial.clientTitle}
                                            </Typography>
                                        </Box>
                                        <Box className="flex">
                                            {renderStars(testimonial.rating)}
                                        </Box>
                                    </Box>

                                    <Typography variant="body1" className="text-gray-700 leading-relaxed mb-4">
                                        "{testimonial.testimonial}"
                                    </Typography>

                                    <Box className="flex flex-wrap gap-4">
                                        <Chip
                                            label={testimonial.engagement.type}
                                            size="small"
                                            className="bg-blue-100 text-blue-700"
                                        />
                                        <Chip
                                            label={testimonial.engagement.duration}
                                            size="small"
                                            className="bg-green-100 text-green-700"
                                        />
                                        <Chip
                                            label={testimonial.engagement.period}
                                            size="small"
                                            className="bg-gray-100 text-gray-700"
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                <CardContent className="p-6 text-center">
                    <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                        Want to work with Sarah? Submit an intent or book a consultation.
                    </Typography>

                    <Box className="flex flex-wrap justify-center gap-4">
                        <Button
                            variant="contained"
                            startIcon={<i className="tabler-eye" />}
                            className="bg-primary-main hover:bg-primary-dark"
                        >
                            View All Reviews
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<i className="tabler-plus" />}
                            onClick={() => setRequestReviewOpen(true)}
                            className="border-primary-main text-primary-main hover:bg-primary-main hover:text-white"
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
                        className="bg-primary-main hover:bg-primary-dark"
                    >
                        Send Review Request
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ProfileReviews
