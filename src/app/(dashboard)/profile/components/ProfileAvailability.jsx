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
    Switch,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    Snackbar,
    Alert,
    CircularProgress
} from '@mui/material'

// Context Imports
import { useTalent } from '@/contexts/TalentContext'

// Map display labels to enum values
const timezoneEnumMap = {
    'UTC': 'UTC',
    'GMT (UTC+0)': 'GMT',
    'EST (UTC-5)': 'EST',
    'PST (UTC-8)': 'PST',
    'CST (UTC-6)': 'CST',
    'MST (UTC-7)': 'MST',
    'IST (UTC+5:30)': 'IST'
}

// Map enum values back to display labels
const timezoneDisplayMap = {
    'UTC': 'UTC',
    'GMT': 'GMT (UTC+0)',
    'EST': 'EST (UTC-5)',
    'PST': 'PST (UTC-8)',
    'CST': 'CST (UTC-6)',
    'MST': 'MST (UTC-7)',
    'IST': 'IST (UTC+5:30)'
}

const ProfileAvailability = ({ data }) => {
    // Convert backend timezone enum to display label if data exists
    const initialData = data ? {
        ...data,
        ta_timezone: timezoneDisplayMap[data.ta_timezone] || 'UTC'
    } : {
        ta_id: null,
        ta_full_time: false,
        ta_full_min_salary: null,
        ta_full_max_salary: null,
        ta_part_time: false,
        ta_part_min_salary: null,
        ta_part_max_salary: null,
        ta_consulting: false,
        ta_consulting_min_salary: null,
        ta_consulting_max_salary: null,
        ta_work_location: 'Remote',
        ta_timezone: 'UTC'
    }

    const [availability, setAvailability] = useState(initialData)

    // Snackbar state for notifications
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

    // Use Talent context for saving availability
    const { saveAvailability, loading } = useTalent()

    // Update state when data changes (e.g., when fetched from backend)
    useEffect(() => {
        if (data) {
            const updatedData = {
                ...data,
                ta_timezone: timezoneDisplayMap[data.ta_timezone] || 'UTC'
            }
            setAvailability(updatedData)
        }
    }, [data])

    const handleToggleWorkType = (workType) => {
        setAvailability({
            ...availability,
            [workType]: !availability[workType]
        })
    }

    const handleSalaryChange = (workType, salaryType, value) => {
        setAvailability({
            ...availability,
            [`${workType}_${salaryType}`]: value ? parseInt(value) : null
        })
    }

    const handleWorkLocationChange = (value) => {
        setAvailability({
            ...availability,
            ta_work_location: value
        })
    }

    const handleTimezoneChange = (value) => {
        setAvailability({
            ...availability,
            ta_timezone: value
        })
    }

    const handleSaveAvailability = async () => {
        try {
            // Convert display timezone to enum value for backend
            const availabilityForBackend = {
                ...availability,
                ta_timezone: timezoneEnumMap[availability.ta_timezone] || 'UTC'
            }

            const result = await saveAvailability(availabilityForBackend)

            if (result.success) {
                setSnackbar({ open: true, message: 'Availability saved successfully', severity: 'success' })
                // Update ta_id if it's a new record
                if (result.data && result.data.ta_id) {
                    setAvailability(prev => ({ ...prev, ta_id: result.data.ta_id }))
                }
            } else {
                setSnackbar({ open: true, message: result.error || 'Failed to save availability', severity: 'error' })
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to save availability', severity: 'error' })
        }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    const getWorkTypeFields = (workType) => {
        if (workType === 'ta_full_time') {
            return (
                <Grid container spacing={2} className="mt-4">
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Minimum Salary"
                            type="number"
                            value={availability.ta_full_min_salary || ''}
                            onChange={(e) => handleSalaryChange('ta_full', 'min_salary', e.target.value)}
                            InputProps={{
                                startAdornment: <Typography variant="body2" className="mr-1">$</Typography>
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Maximum Salary"
                            type="number"
                            value={availability.ta_full_max_salary || ''}
                            onChange={(e) => handleSalaryChange('ta_full', 'max_salary', e.target.value)}
                            InputProps={{
                                startAdornment: <Typography variant="body2" className="mr-1">$</Typography>
                            }}
                        />
                    </Grid>
                </Grid>
            )
        } else if (workType === 'ta_part_time') {
            return (
                <Grid container spacing={2} className="mt-4">
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Minimum Salary"
                            type="number"
                            value={availability.ta_part_min_salary || ''}
                            onChange={(e) => handleSalaryChange('ta_part', 'min_salary', e.target.value)}
                            InputProps={{
                                startAdornment: <Typography variant="body2" className="mr-1">$</Typography>
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Maximum Salary"
                            type="number"
                            value={availability.ta_part_max_salary || ''}
                            onChange={(e) => handleSalaryChange('ta_part', 'max_salary', e.target.value)}
                            InputProps={{
                                startAdornment: <Typography variant="body2" className="mr-1">$</Typography>
                            }}
                        />
                    </Grid>
                </Grid>
            )
        } else if (workType === 'ta_consulting') {
            return (
                <Grid container spacing={2} className="mt-4">
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Minimum Salary"
                            type="number"
                            value={availability.ta_consulting_min_salary || ''}
                            onChange={(e) => handleSalaryChange('ta_consulting', 'min_salary', e.target.value)}
                            InputProps={{
                                startAdornment: <Typography variant="body2" className="mr-1">$</Typography>
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Maximum Salary"
                            type="number"
                            value={availability.ta_consulting_max_salary || ''}
                            onChange={(e) => handleSalaryChange('ta_consulting', 'max_salary', e.target.value)}
                            InputProps={{
                                startAdornment: <Typography variant="body2" className="mr-1">$</Typography>
                            }}
                        />
                    </Grid>
                </Grid>
            )
        }
        return null
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
                Availability & Rates
            </Typography>

            <Typography
                variant="subtitle1"
                sx={{
                    color: 'var(--mui-palette-text-secondary)',
                    mb: 3
                }}
            >
                Work Type Preferences
            </Typography>

            {/* Work Type Preferences */}
            <Box className="space-y-4">
                {/* Full-time */}
                <Card>
                    <CardContent className="p-6">
                        <Box className="flex items-center justify-between">
                            <Box className="flex-1">
                                <Box className="flex items-center gap-3 mb-2">
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'var(--mui-palette-text-primary)'
                                        }}
                                    >
                                        Full-time
                                    </Typography>
                                    <Chip
                                        label="Full-time employment"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'var(--mui-palette-action-hover)',
                                            color: 'var(--mui-palette-text-secondary)'
                                        }}
                                    />
                                </Box>

                                {availability.ta_full_time && getWorkTypeFields('ta_full_time')}
                            </Box>

                            <Box className="ml-4">
                                <Switch
                                    checked={availability.ta_full_time}
                                    onChange={() => handleToggleWorkType('ta_full_time')}
                                    color="primary"
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Part-time */}
                <Card>
                    <CardContent className="p-6">
                        <Box className="flex items-center justify-between">
                            <Box className="flex-1">
                                <Box className="flex items-center gap-3 mb-2">
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'var(--mui-palette-text-primary)'
                                        }}
                                    >
                                        Part-time
                                    </Typography>
                                    <Chip
                                        label="Part-time employment"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'var(--mui-palette-action-hover)',
                                            color: 'var(--mui-palette-text-secondary)'
                                        }}
                                    />
                                </Box>

                                {availability.ta_part_time && getWorkTypeFields('ta_part_time')}
                            </Box>

                            <Box className="ml-4">
                                <Switch
                                    checked={availability.ta_part_time}
                                    onChange={() => handleToggleWorkType('ta_part_time')}
                                    color="primary"
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Consulting */}
                <Card>
                    <CardContent className="p-6">
                        <Box className="flex items-center justify-between">
                            <Box className="flex-1">
                                <Box className="flex items-center gap-3 mb-2">
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: 'var(--mui-palette-text-primary)'
                                        }}
                                    >
                                        Consulting
                                    </Typography>
                                    <Chip
                                        label="Consulting projects"
                                        size="small"
                                        sx={{
                                            backgroundColor: 'var(--mui-palette-action-hover)',
                                            color: 'var(--mui-palette-text-secondary)'
                                        }}
                                    />
                                </Box>

                                {availability.ta_consulting && getWorkTypeFields('ta_consulting')}
                            </Box>

                            <Box className="ml-4">
                                <Switch
                                    checked={availability.ta_consulting}
                                    onChange={() => handleToggleWorkType('ta_consulting')}
                                    color="primary"
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Additional Preferences */}
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
                        Additional Preferences
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Work Location</InputLabel>
                                <Select
                                    value={availability.ta_work_location || 'Remote'}
                                    onChange={(e) => handleWorkLocationChange(e.target.value)}
                                    label="Work Location"
                                >
                                    <MenuItem value="Remote">Remote</MenuItem>
                                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                                    <MenuItem value="On-site">On-site</MenuItem>
                                    <MenuItem value="Flexible">Flexible</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Time Zone</InputLabel>
                                <Select
                                    value={availability.ta_timezone || 'UTC'}
                                    onChange={(e) => handleTimezoneChange(e.target.value)}
                                    label="Time Zone"
                                >
                                    <MenuItem value="UTC">UTC</MenuItem>
                                    <MenuItem value="PST (UTC-8)">PST (UTC-8)</MenuItem>
                                    <MenuItem value="EST (UTC-5)">EST (UTC-5)</MenuItem>
                                    <MenuItem value="CST (UTC-6)">CST (UTC-6)</MenuItem>
                                    <MenuItem value="MST (UTC-7)">MST (UTC-7)</MenuItem>
                                    <MenuItem value="GMT (UTC+0)">GMT (UTC+0)</MenuItem>
                                    <MenuItem value="CET (UTC+1)">CET (UTC+1)</MenuItem>
                                    <MenuItem value="IST (UTC+5:30)">IST (UTC+5:30)</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Save Button */}
            <Box className="flex justify-end pt-4">
                <Button
                    variant="contained"
                    size="large"
                    startIcon={loading.availability ? <CircularProgress size={20} color="inherit" /> : <i className="tabler-device-floppy" />}
                    onClick={handleSaveAvailability}
                    disabled={loading.availability}
                    sx={{
                        backgroundColor: 'var(--mui-palette-primary-main)',
                        '&:hover': {
                            backgroundColor: 'var(--mui-palette-primary-dark)'
                        }
                    }}
                >
                    {loading.availability ? 'Saving...' : 'Save Availability'}
                </Button>
            </Box>

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

export default ProfileAvailability
