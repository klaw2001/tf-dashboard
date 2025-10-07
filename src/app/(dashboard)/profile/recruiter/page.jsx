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
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    CircularProgress,
    Alert,
    Tabs,
    Tab
} from '@mui/material'

// Component Imports
import RecruiterOverview from './components/RecruiterOverview'
import RecruiterProfileInfo from './components/RecruiterProfileInfo'

// Context Imports
import { useAuth } from '@/contexts/AuthContext'

// Icon Imports - Using Iconify CSS classes

const RecruiterProfilePage = () => {
    const [activeTab, setActiveTab] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { user } = useAuth()

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const renderActiveTab = () => {
        switch (activeTab) {
            case 0:
                return <RecruiterOverview />
            case 1:
                return <RecruiterProfileInfo />
            default:
                return <RecruiterOverview />
        }
    }

    return (
        <Box className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Left Sidebar Navigation */}
            <Card className="w-full lg:w-80 h-fit">
                <CardContent className="p-6">
                    {/* Back to Dashboard */}
                    <Box className="mb-6">
                        <Button
                            variant="text"
                            startIcon={<i className="tabler-arrow-left" />}
                            sx={{
                                color: 'var(--mui-palette-text-secondary)',
                                '&:hover': {
                                    color: 'var(--mui-palette-primary-main)',
                                    backgroundColor: 'var(--mui-palette-primary-lightOpacity)'
                                }
                            }}
                            onClick={() => window.history.back()}
                        >
                            Back to Dashboard
                        </Button>
                    </Box>

                    {/* Profile Type Tabs */}
                    <Box className="mb-6">
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            orientation="vertical"
                            variant="fullWidth"
                            sx={{
                                '& .MuiTab-root': {
                                    alignItems: 'flex-start',
                                    textAlign: 'left',
                                    minHeight: 48,
                                    padding: '12px 16px',
                                    '&.Mui-selected': {
                                        backgroundColor: 'var(--mui-palette-primary-main)',
                                        color: 'white',
                                        borderRadius: '8px'
                                    }
                                }
                            }}
                        >
                            <Tab
                                label="Overview"
                                icon={<i className="tabler-user" />}
                                iconPosition="start"
                            />
                            <Tab
                                label="Profile Information"
                                icon={<i className="tabler-edit" />}
                                iconPosition="start"
                            />
                        </Tabs>
                    </Box>
                </CardContent>
            </Card>

            {/* Main Content Area */}
            <Box className="flex-1">
                {loading ? (
                    <Box className="flex justify-center items-center h-64">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" className="mb-4">
                        {error}
                    </Alert>
                ) : (
                    renderActiveTab()
                )}
            </Box>
        </Box>
    )
}

export default RecruiterProfilePage
