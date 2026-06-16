import { reactive } from 'vue'
import { post, get, put } from '../utils/request.js'
import { showToast } from 'vant'

const state = reactive({
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token')
})

export function useAuth() {
  const login = async (email, password) => {
    const res = await post('/auth/login', { email, password })
    if (res.success) {
      state.token = res.data.token
      state.user = res.data.user
      state.isAuthenticated = true
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      showToast('Login successful')
      return true
    }
    return false
  }

  const register = async (username, email, password) => {
    const res = await post('/auth/register', { username, email, password })
    if (res.success) {
      state.token = res.data.token
      state.user = res.data.user
      state.isAuthenticated = true
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      showToast('Registration successful')
      return true
    }
    return false
  }

  const logout = () => {
    state.token = null
    state.user = null
    state.isAuthenticated = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const fetchProfile = async () => {
    const res = await get('/auth/profile')
    if (res.success) {
      state.user = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
    }
    return res
  }

  const updateProfile = async (data) => {
    const res = await put('/auth/profile', data)
    if (res.success) {
      state.user = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
    }
    return res
  }

  return { state, login, register, logout, fetchProfile, updateProfile }
}
