import { API_CONFIG } from '../contexts/APIContext'

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', body, headers = {}, token, ...otherOptions } = options

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    ...otherOptions
  }

  // Add authorization header if token is provided
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Add body if provided
  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, config)
    const data = await response.json()

    return {
      success: response.ok,
      data,
      status: response.status,
      statusText: response.statusText
    }
  } catch (error) {
    console.error('API request error:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

// Authenticated API request (requires token)
export const authenticatedRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token')

  if (!token) {
    return {
      success: false,
      error: 'No authentication token found',
      data: null
    }
  }

  return apiRequest(endpoint, {
    ...options,
    token
  })
}

// Auth API functions
export const authAPI = {
  signin: async credentials => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.SIGNIN, {
      method: 'POST',
      body: credentials
    })
  },

  logout: async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      return apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST',
        token
      })
    }
    return { success: true, data: null }
  },

  refresh: async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      return apiRequest(API_CONFIG.ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        token
      })
    }
    return { success: false, error: 'No token to refresh' }
  }
}

// Generic API functions for other endpoints
export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: 'DELETE' })
}

// File upload function for FormData
export const uploadFile = async (endpoint, formData) => {
  const token = localStorage.getItem('auth_token')

  if (!token) {
    return {
      success: false,
      error: 'No authentication token found',
      data: null
    }
  }

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    })

    const data = await response.json()

    return {
      success: response.ok,
      data,
      status: response.status,
      statusText: response.statusText
    }
  } catch (error) {
    console.error('File upload error:', error)
    return {
      success: false,
      error: error.message,
      data: null
    }
  }
}

// Authenticated API functions
export const authenticatedAPI = {
  get: (endpoint, options = {}) => authenticatedRequest(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => authenticatedRequest(endpoint, { ...options, method: 'POST', body }),
  put: (endpoint, body, options = {}) => authenticatedRequest(endpoint, { ...options, method: 'PUT', body }),
  patch: (endpoint, body, options = {}) => authenticatedRequest(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options = {}) => authenticatedRequest(endpoint, { ...options, method: 'DELETE' }),
  upload: (endpoint, formData) => uploadFile(endpoint, formData)
}
