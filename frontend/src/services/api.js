const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Token management
export const getToken = () => localStorage.getItem('access_token')
export const setToken = (token) => localStorage.setItem('access_token', token)
export const removeToken = () => localStorage.removeItem('access_token')

// Centralized fetch wrapper
async function apiFetch(endpoint, options = {}) {
  const token = getToken()
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    
    // Handle 401 (unauthorized) - invalid/expired token
    if (response.status === 401) {
      removeToken()
      window.location.href = '/login'
      throw new Error('Session expired. Please login again.')
    }

    const data = await response.json()

    if (!response.ok) {
      // Extract error message from FastAPI response
      const errorMessage = data.detail || data.message || 'An error occurred'
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    // Network errors or parsing errors
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please try again.')
    }
    throw error
  }
}

// Auth endpoints
export const register = async (username, fullName, email, password, role = 'user') => {
  return apiFetch('/auth/', {
    method: 'POST',
    body: JSON.stringify({ 
      username, 
      full_name: fullName, 
      email, 
      password, 
      role 
    }),
  })
}

export const login = async (username, password) => {
  // FastAPI OAuth2PasswordRequestForm expects form data, not JSON
  const formData = new URLSearchParams()
  formData.append('username', username)
  formData.append('password', password)

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMessage = data.detail || 'Login failed'
      throw new Error(errorMessage)
    }

    if (data.access_token) {
      setToken(data.access_token)
    }

    return data
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please try again.')
    }
    throw error
  }
}

export const logout = () => {
  removeToken()
}

export const getCurrentUser = async () => {
  return apiFetch('/user/me')
}

// Tasks CRUD endpoints
export const getTasks = async () => {
  return apiFetch('/tasks/get_all_my_tasks')
}

export const getTask = async (taskId) => {
  return apiFetch(`/tasks/get_task/${taskId}`)
}

export const createTask = async (taskData) => {
  return apiFetch('/tasks/create', {
    method: 'POST',
    body: JSON.stringify({
      task_title: taskData.task_title,
      task_description: taskData.task_description,
    }),
  })
}

export const updateTaskStatus = async (taskId) => {
  return apiFetch(`/tasks/update_status/${taskId}`, {
    method: 'PUT',
  })
}

export const deleteTask = async (taskId) => {
  return apiFetch(`/tasks/delete/${taskId}`, {
    method: 'DELETE',
  })
}