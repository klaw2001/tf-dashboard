'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import {
    Box,
    Button,
    TextField,
    Card,
    CardContent,
    Typography,
    Alert,
    CircularProgress
} from '@mui/material'

const AuthExample = () => {
    const { signin, logout, isAuthenticated, user, isLoading } = useAuth()
    const [credentials, setCredentials] = useState({
        user_email: '',
        user_password: ''
    })
    const [error, setError] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }))
        setError('')
    }

    const handleSignin = async (e) => {
        e.preventDefault()
        setIsSigningIn(true)
        setError('')

        try {
            const result = await signin(credentials)

            if (result.success) {
                console.log('Sign in successful:', result.data)
                setCredentials({ user_email: '', user_password: '' })
            } else {
                setError(result.error || 'Sign in failed')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsSigningIn(false)
        }
    }

    const handleLogout = () => {
        logout()
        setError('')
    }

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box maxWidth={400} mx="auto" mt={4}>
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Authentication Example
                    </Typography>

                    {isAuthenticated ? (
                        <Box>
                            <Typography variant="body1" gutterBottom>
                                Welcome, {user?.user_email}!
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Role: {user?.user_role?.role_name || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                User ID: {user?.user_id}
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleLogout}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Logout
                            </Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleSignin}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                label="Email"
                                name="user_email"
                                type="email"
                                value={credentials.user_email}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="user_password"
                                type="password"
                                value={credentials.user_password}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isSigningIn}
                                sx={{ mt: 2 }}
                            >
                                {isSigningIn ? <CircularProgress size={24} /> : 'Sign In'}
                            </Button>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}

export default AuthExample
