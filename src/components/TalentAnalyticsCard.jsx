'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import { Box, Card, CardContent, Divider, Grid, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from '@mui/material'

// Iconify (tabler icons are available via CSS classes in this template)

// Services
import { authenticatedAPI } from '@/services/api'

// Utils
const formatNumber = value => {
    if (value === null || value === undefined) return '0'
    if (typeof value === 'number') {
        return Intl.NumberFormat().format(value)
    }
    return value
}

const presetRanges = [
    { key: 'last7', label: 'Last 7 days', days: 7 },
    { key: 'last30', label: 'Last 30 days', days: 30 },
    { key: 'last90', label: 'Last 90 days', days: 90 },
    { key: 'thisMonth', label: 'This month', days: null }
]

const getThisMonthRange = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return { start, end }
}

const toISODate = d => d.toISOString().slice(0, 10)

const buildRange = preset => {
    if (preset === 'thisMonth') return getThisMonthRange()
    const item = presetRanges.find(r => r.key === preset)
    if (item && item.days) {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - (item.days - 1))
        return { start, end }
    }
    return null
}

const metricsConfig = [
    {
        key: 'profileViews',
        label: 'Profile Views',
        what: 'Number of times your profile was viewed by recruiters',
        why: "Measures visibility and attractiveness.",
        format: formatNumber
    },
    {
        key: 'searchAppearances',
        label: 'Search Appearances',
        what: "Times your profile appeared in recruiter searches",
        why: "Shows how often you’re being discovered.",
        format: formatNumber
    },
    {
        key: 'viewFullProfileClicks',
        label: 'Clicks on “View Full Profile”',
        what: 'How many recruiters clicked to see more after search',
        why: 'Indicates profile headline/summary strength.',
        format: formatNumber
    },
    {
        key: 'shortlistRate',
        label: 'Bookmark / Shortlist Rate',
        what: 'How often recruiters saved your profile',
        why: 'Shows demand level.',
        format: v => `${v ?? 0}%`
    },
    {
        key: 'contactRequests',
        label: 'Contact Requests / Invites',
        what: 'How many times recruiters reached out',
        why: 'Core success metric.',
        format: formatNumber
    },
    {
        key: 'responseRate',
        label: 'Response Rate',
        what: '% of times you responded to recruiter outreach',
        why: 'Reflects engagement and responsiveness.',
        format: v => `${v ?? 0}%`
    },
    {
        key: 'profileStrength',
        label: 'Profile Strength Score',
        what: '% completeness or quality score (resume, skills, projects, etc.)',
        why: 'Encourages candidates to improve their profile.',
        format: v => `${v ?? 0}%`
    }
]

const TalentAnalyticsCard = () => {
    const [preset, setPreset] = useState('last30')
    const [customFrom, setCustomFrom] = useState('')
    const [customTo, setCustomTo] = useState('')
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)

    const { startDate, endDate } = useMemo(() => {
        if (preset === 'custom' && customFrom && customTo) {
            return { startDate: customFrom, endDate: customTo }
        }
        const range = buildRange(preset)
        if (!range) return { startDate: '', endDate: '' }
        return { startDate: toISODate(range.start), endDate: toISODate(range.end) }
    }, [preset, customFrom, customTo])

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!startDate || !endDate) return
            setLoading(true)
            try {
                const response = await authenticatedAPI.get(`/talent/analytics?from=${startDate}&to=${endDate}`)
                if (response.success && response.data?.status === 'success') {
                    setData(response.data.data)
                } else {
                    setData(null)
                }
            } catch (e) {
                setData(null)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [startDate, endDate])

    const renderMetric = (cfg) => {
        const value = data?.[cfg.key]
        return (
            <Grid item xs={12} sm={6} md={6} lg={4} key={cfg.key}>
                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ p: 2, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Box>
                        <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>{cfg.label}</Typography>
                        <Typography variant='h4' sx={{ mt: 0.5 }}>{cfg.format(value)}</Typography>
                    </Box>
                    <Tooltip
                        title={
                            <Box>
                                <Typography variant='subtitle2' sx={{ mb: 0.5 }}>What it shows</Typography>
                                <Typography variant='body2' sx={{ mb: 1 }} color='text.primary'>{cfg.what}</Typography>
                                <Typography variant='subtitle2' sx={{ mb: 0.5 }}>Why it’s valuable</Typography>
                                <Typography variant='body2' color='text.primary'>{cfg.why}</Typography>
                            </Box>
                        }
                        placement='top'
                        arrow
                        slotProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: 'background.paper',
                                    color: 'text.primary',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    boxShadow: 3
                                }
                            },
                            arrow: {
                                sx: {
                                    color: 'background.paper'
                                }
                            }
                        }}
                    >
                        <IconButton size='small'>
                            <i className='tabler-info-circle text-[22px]' />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Grid>
        )
    }

    return (
        <Card>
            <CardContent>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='space-between' alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                    <Box>
                        <Typography variant='h6'>Analytics</Typography>
                        <Typography variant='subtitle1' sx={{ fontWeight: 700 }}>Talent-centric analytics</Typography>
                    </Box>
                    <Stack direction='row' spacing={1} alignItems='center' sx={{ minWidth: { sm: 360 } }}>
                        <TextField
                            select
                            size='small'
                            label='Date range'
                            value={preset}
                            onChange={e => setPreset(e.target.value)}
                            sx={{ minWidth: 180 }}
                        >
                            {presetRanges.map(r => (
                                <MenuItem value={r.key} key={r.key}>{r.label}</MenuItem>
                            ))}
                            <MenuItem value='custom'>Custom range</MenuItem>
                        </TextField>
                        {preset === 'custom' && (
                            <>
                                <TextField
                                    size='small'
                                    type='date'
                                    label='From'
                                    value={customFrom}
                                    onChange={e => setCustomFrom(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    size='small'
                                    type='date'
                                    label='To'
                                    value={customTo}
                                    onChange={e => setCustomTo(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </>
                        )}
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3} columns={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                    {metricsConfig.map(renderMetric)}
                </Grid>

                {loading && (
                    <Typography variant='caption' color='text.secondary' sx={{ display: 'block', mt: 2 }}>Loading latest analytics…</Typography>
                )}
            </CardContent>
        </Card>
    )
}

export default TalentAnalyticsCard


