# API Context Documentation

## Overview

This directory contains the API context implementation for the dashboard application, providing centralized API management and authentication.

## Files

### APIContext.jsx

- Contains API configuration and base context
- Defines API endpoints and base URL
- Provides `useAPI` hook for accessing API configuration

### AuthContext.jsx

- Manages authentication state and operations
- Provides `signin`, `logout`, and `checkAuth` functions
- Handles token storage in localStorage
- Auto-checks token expiration

## Usage

### Setting up Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_BASEURL=http://localhost:8000/api
```

### Using Auth Context in Components

```jsx
import { useAuth } from '@contexts/AuthContext'

function LoginComponent() {
  const { signin, logout, isAuthenticated, user, isLoading } = useAuth()

  const handleSignin = async credentials => {
    const result = await signin(credentials)
    if (result.success) {
      // User signed in successfully
      console.log('User:', result.data.user)
    } else {
      // Handle error
      console.error('Signin failed:', result.error)
    }
  }

  const handleLogout = () => {
    logout()
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.user_email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleSignin}>{/* Login form */}</form>
      )}
    </div>
  )
}
```

### Using API Service

```jsx
import { api, authenticatedAPI } from '@services/api'

// Public API call
const publicData = await api.get('/public/data')

// Authenticated API call
const userData = await authenticatedAPI.get('/user/profile')
```

## API Endpoints

### Authentication

- `POST /auth/signin` - User sign in
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh token

## Features

- **Automatic Token Management**: Tokens are automatically stored and retrieved from localStorage
- **Token Expiration Check**: Automatic logout when token expires
- **Error Handling**: Comprehensive error handling for API requests
- **Type Safety**: Proper response structure for all API calls
- **Loading States**: Built-in loading state management
