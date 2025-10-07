'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import {
    Card,
    CardContent,
    Typography,
    Box,
    TextField,
    Button,
    Alert,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid
} from '@mui/material'

// Component Imports
import RichTextEditor from '@/components/RichTextEditor'

// Context Imports
import { useRecruiter } from '@/contexts/RecruiterContext'

const RecruiterProfileInfo = () => {
    const [success, setSuccess] = useState(null)
    const [formData, setFormData] = useState({})
    const [recruiterType, setRecruiterType] = useState('company')

    const {
        companyProfile,
        individualProfile,
        loading,
        errors,
        saveCompanyProfile,
        saveIndividualProfile,
        fetchCompanyProfile,
        fetchIndividualProfile
    } = useRecruiter()

    // Determine recruiter type and initialize form data based on available data
    useEffect(() => {
        // Determine type based on which profile data is available
        let type = 'company' // default

        if (individualProfile && individualProfile.ri_id) {
            type = 'individual'
        } else if (companyProfile && companyProfile.rc_id) {
            type = 'company'
        } else {
            // If no data exists, check rp_type field
            type = companyProfile?.rp_type || individualProfile?.rp_type || 'company'
        }

        setRecruiterType(type)

        if (type === 'company') {
            setFormData({
                rc_name: companyProfile?.rc_name || '',
                rc_website: companyProfile?.rc_website || '',
                rc_industry: companyProfile?.rc_industry || '',
                rc_size: companyProfile?.rc_size || '',
                rc_role: companyProfile?.rc_role || '',
                rc_description: companyProfile?.rc_description || ''
            })
        } else {
            setFormData({
                ri_full_name: individualProfile?.ri_full_name || '',
                ri_email: individualProfile?.ri_email || '',
                ri_mobile: individualProfile?.ri_mobile || '',
                ri_linkedin_url: individualProfile?.ri_linkedin_url || '',
                ri_about: individualProfile?.ri_about || ''
            })
        }
    }, [companyProfile, individualProfile])

    const industryOptions = [
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Manufacturing',
        'Retail',
        'Consulting',
        'Real Estate',
        'Media & Entertainment',
        'Non-profit',
        'Other'
    ]

    const companySizeOptions = [
        '1-10',
        '11-50',
        '51-100',
        '101-500',
        '501-1000',
        '1000+'
    ]

    const handleInputChange = (field) => (event) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value
        }))
    }

    const handleDescriptionChange = (content) => {
        const field = recruiterType === 'company' ? 'rc_description' : 'ri_about'
        setFormData(prev => ({
            ...prev,
            [field]: content
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSuccess(null)

        try {
            let result
            if (recruiterType === 'company') {
                result = await saveCompanyProfile(formData)
            } else {
                result = await saveIndividualProfile(formData)
            }

            if (result.success) {
                setSuccess(`${recruiterType === 'company' ? 'Company' : 'Individual'} profile saved successfully!`)
            }
        } catch (err) {
            console.error('Save error:', err)
        }
    }

    const isCompany = recruiterType === 'company'
    const currentLoading = isCompany ? loading.companyProfile : loading.individualProfile
    const currentError = isCompany ? errors.companyProfile : errors.individualProfile

    return (
        <Card>
            <CardContent className="p-6">
                <Typography variant="h5" className="mb-6">
                    {isCompany ? 'Company Information' : 'Personal Information'}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        {isCompany ? (
                            <>
                                {/* Company Name */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Company Name"
                                        value={formData.rc_name || ''}
                                        onChange={handleInputChange('rc_name')}
                                        required
                                        placeholder="Enter your company name"
                                    />
                                </Grid>

                                {/* Website */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Website"
                                        value={formData.rc_website || ''}
                                        onChange={handleInputChange('rc_website')}
                                        placeholder="https://yourcompany.com"
                                        type="url"
                                    />
                                </Grid>

                                {/* Industry */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Industry</InputLabel>
                                        <Select
                                            value={formData.rc_industry || ''}
                                            label="Industry"
                                            onChange={handleInputChange('rc_industry')}
                                        >
                                            {industryOptions.map((industry) => (
                                                <MenuItem key={industry} value={industry}>
                                                    {industry}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Company Size */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Company Size</InputLabel>
                                        <Select
                                            value={formData.rc_size || ''}
                                            label="Company Size"
                                            onChange={handleInputChange('rc_size')}
                                        >
                                            {companySizeOptions.map((size) => (
                                                <MenuItem key={size} value={size}>
                                                    {size} employees
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Your Role */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Your Role"
                                        value={formData.rc_role || ''}
                                        onChange={handleInputChange('rc_role')}
                                        placeholder="e.g., HR Manager, Talent Acquisition Specialist"
                                    />
                                </Grid>
                            </>
                        ) : (
                            <>
                                {/* Full Name */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        value={formData.ri_full_name || ''}
                                        onChange={handleInputChange('ri_full_name')}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </Grid>

                                {/* Email */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        value={formData.ri_email || ''}
                                        onChange={handleInputChange('ri_email')}
                                        type="email"
                                        placeholder="your.email@company.com"
                                    />
                                </Grid>

                                {/* Mobile */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Mobile Number"
                                        value={formData.ri_mobile || ''}
                                        onChange={handleInputChange('ri_mobile')}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </Grid>

                                {/* LinkedIn URL */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="LinkedIn Profile"
                                        value={formData.ri_linkedin_url || ''}
                                        onChange={handleInputChange('ri_linkedin_url')}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        type="url"
                                    />
                                </Grid>
                            </>
                        )}

                        {/* Description/About */}
                        <Grid item xs={12}>
                            <Typography variant="h6" className="mb-3">
                                {isCompany ? 'Company Description' : 'About You'}
                            </Typography>
                            <RichTextEditor
                                value={isCompany ? (formData.rc_description || '') : (formData.ri_about || '')}
                                onChange={handleDescriptionChange}
                                placeholder={isCompany
                                    ? "Tell us about your company, its mission, values, and what makes it a great place to work..."
                                    : "Tell us about yourself, your experience in recruitment, your specialties, and what makes you unique as a recruiter..."
                                }
                            />
                        </Grid>
                    </Grid>

                    {/* Submit Button */}
                    <Box className="mt-6">
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={<i className="tabler-device-floppy" />}
                            disabled={currentLoading}
                            sx={{
                                backgroundColor: 'var(--mui-palette-primary-main)',
                                '&:hover': {
                                    backgroundColor: 'var(--mui-palette-primary-dark)'
                                }
                            }}
                        >
                            {currentLoading ? 'Saving...' : `Save ${isCompany ? 'Company' : 'Individual'} Profile`}
                        </Button>
                    </Box>

                    {/* Status Messages */}
                    {currentError && (
                        <Alert severity="error" className="mt-4">
                            {currentError}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" className="mt-4">
                            {success}
                        </Alert>
                    )}

                    {/* Loading Indicator */}
                    {currentLoading && (
                        <Box className="flex items-center justify-center mt-4">
                            <CircularProgress size={24} />
                            <Typography variant="body2" className="ml-2">
                                Saving profile...
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
    )
}

export default RecruiterProfileInfo
