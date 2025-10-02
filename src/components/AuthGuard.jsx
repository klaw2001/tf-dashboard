'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

const AuthGuard = ({ children }) => {
    const router = useRouter()
    const { isAuthenticated, isLoading } = useAuth()
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.replace('/login')
            } else {
                setChecked(true)
            }
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading || !checked) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                Loading...
            </div>
        )
    }

    return children
}

export default AuthGuard


