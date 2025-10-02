// Auth service using the new API context
import { authAPI } from './api'

// Legacy functions for backward compatibility (deprecated)
export async function loginWithGoogle() {
  console.warn('loginWithGoogle is deprecated. Use AuthContext signin method instead.')
  // Simulate an async OAuth flow returning a JWT token
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 90% success rate to occasionally test error UI
      const succeeded = Math.random() < 0.9
      if (succeeded) {
        resolve({ token: 'mock-jwt-token.' + Math.random().toString(36).slice(2) })
      } else {
        reject(new Error('Google authentication failed. Please try again.'))
      }
    }, 900)
  })
}

export async function loginWithEmailPassword(email, password) {
  console.warn('loginWithEmailPassword is deprecated. Use AuthContext signin method instead.')
  const allowedEmail = 'hrishikesh@aliff.in'
  const allowedPassword = 'hrishikesh'

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === allowedEmail && password === allowedPassword) {
        const fakeToken = `fake-jwt.${btoa(`${email}:${Date.now()}`)}`
        resolve({ token: fakeToken })
      } else {
        reject(new Error('Invalid email or password'))
      }
    }, 500)
  })
}

// New API-based auth functions
export const authService = {
  // Sign in with email and password
  signin: async credentials => {
    return await authAPI.signin(credentials)
  },

  // Logout
  logout: async () => {
    return await authAPI.logout()
  },

  // Refresh token
  refresh: async () => {
    return await authAPI.refresh()
  }
}
