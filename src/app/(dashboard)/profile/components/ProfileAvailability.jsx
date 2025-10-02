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
    Switch,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip
} from '@mui/material'

const ProfileAvailability = ({ data }) => {
    const [availability, setAvailability] = useState(data)

    const handleTogglePreference = (preferenceId) => {
        setAvailability({
            ...availability,
            preferences: availability.preferences.map(pref =>
                pref.id === preferenceId
                    ? { ...pref, active: !pref.active }
                    : pref
            )
        })
    }

    const handlePreferenceChange = (preferenceId, field, value) => {
        setAvailability({
            ...availability,
            preferences: availability.preferences.map(pref =>
                pref.id === preferenceId
                    ? { ...pref, fields: { ...pref.fields, [field]: value } }
                    : pref
            )
        })
    }

    const handleAdditionalPreferenceChange = (field, value) => {
        setAvailability({
            ...availability,
            additionalPreferences: {
                ...availability.additionalPreferences,
                [field]: value
            }
        })
    }

    const getPreferenceFields = (preference) => {
        if (preference.type === 'Full-time') {
            return (
                <Grid container spacing={2} className="mt-4">
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Minimum Salary"
                            type="number"
                            value={preference.fields.minSalary}
                            onChange={(e) => handlePreferenceChange(preference.id, 'minSalary', parseInt(e.target.value))}
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
                            value={preference.fields.maxSalary}
                            onChange={(e) => handlePreferenceChange(preference.id, 'maxSalary', parseInt(e.target.value))}
                            InputProps={{
                                startAdornment: <Typography variant="body2" className="mr-1">$</Typography>
                            }}
                        />
                    </Grid>
                </Grid>
            )
        } else if (preference.type === 'Part-time') {
            return (
                <Grid container spacing={2} className="mt-4">
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Hourly Rate"
                            type="number"
                            value={preference.fields.hourlyRate}
                            onChange={(e) => handlePreferenceChange(preference.id, 'hourlyRate', parseInt(e.target.value))}
                            InputProps={{
                                startAdornment: <Typography variant="body2" className="mr-1">$</Typography>
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Min Hours/Week"
                            type="number"
                            value={preference.fields.minHours}
                            onChange={(e) => handlePreferenceChange(preference.id, 'minHours', parseInt(e.target.value))}
                        />
                    </Grid>
                </Grid>
            )
        } else if (preference.type === 'Consulting') {
            return (
                <Grid container spacing={2} className="mt-4">
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Hourly Rate"
                            type="number"
                            value={preference.fields.hourlyRate}
                            onChange={(e) => handlePreferenceChange(preference.id, 'hourlyRate', parseInt(e.target.value))}
                            InputProps={{
                                startAdornment: <Typography variant="body2" className="mr-1">$</Typography>
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Daily Rate"
                            type="number"
                            value={preference.fields.dailyRate}
                            onChange={(e) => handlePreferenceChange(preference.id, 'dailyRate', parseInt(e.target.value))}
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
            <Typography variant="h5" className="font-bold text-gray-900">
                Availability & Rates
            </Typography>

            <Typography variant="subtitle1" className="text-gray-600 mb-6">
                Availability Preferences
            </Typography>

            {/* Work Type Preferences */}
            <Box className="space-y-4">
                {availability.preferences.map((preference) => (
                    <Card key={preference.id}>
                        <CardContent className="p-6">
                            <Box className="flex items-center justify-between">
                                <Box className="flex-1">
                                    <Box className="flex items-center gap-3 mb-2">
                                        <Typography variant="h6" className="font-semibold text-gray-900">
                                            {preference.type}
                                        </Typography>
                                        <Chip
                                            label={preference.description}
                                            size="small"
                                            className="bg-gray-100 text-gray-600"
                                        />
                                    </Box>

                                    {preference.active && getPreferenceFields(preference)}
                                </Box>

                                <Box className="ml-4">
                                    <Switch
                                        checked={preference.active}
                                        onChange={() => handleTogglePreference(preference.id)}
                                        color="primary"
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>

            {/* Additional Preferences */}
            <Card>
                <CardContent className="p-6">
                    <Typography variant="h6" className="font-semibold text-gray-900 mb-4">
                        Additional Preferences
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Work Location</InputLabel>
                                <Select
                                    value={availability.additionalPreferences.workLocation}
                                    onChange={(e) => handleAdditionalPreferenceChange('workLocation', e.target.value)}
                                    label="Work Location"
                                >
                                    <MenuItem value="Remote Only">Remote Only</MenuItem>
                                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                                    <MenuItem value="On-site">On-site</MenuItem>
                                    <MenuItem value="Flexible">Flexible</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Notice Period</InputLabel>
                                <Select
                                    value={availability.additionalPreferences.noticePeriod}
                                    onChange={(e) => handleAdditionalPreferenceChange('noticePeriod', e.target.value)}
                                    label="Notice Period"
                                >
                                    <MenuItem value="Immediate">Immediate</MenuItem>
                                    <MenuItem value="1 week">1 week</MenuItem>
                                    <MenuItem value="2 weeks">2 weeks</MenuItem>
                                    <MenuItem value="1 month">1 month</MenuItem>
                                    <MenuItem value="2 months">2 months</MenuItem>
                                    <MenuItem value="3 months">3 months</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Time Zone</InputLabel>
                                <Select
                                    value={availability.additionalPreferences.timeZone}
                                    onChange={(e) => handleAdditionalPreferenceChange('timeZone', e.target.value)}
                                    label="Time Zone"
                                >
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

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Travel Willingness</InputLabel>
                                <Select
                                    value={availability.additionalPreferences.travelWillingness}
                                    onChange={(e) => handleAdditionalPreferenceChange('travelWillingness', e.target.value)}
                                    label="Travel Willingness"
                                >
                                    <MenuItem value="No Travel">No Travel</MenuItem>
                                    <MenuItem value="Occasional Travel">Occasional Travel</MenuItem>
                                    <MenuItem value="Frequent Travel">Frequent Travel</MenuItem>
                                    <MenuItem value="Extensive Travel">Extensive Travel</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    )
}

export default ProfileAvailability
