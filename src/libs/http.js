import axios from 'axios'

// login
export const asyncLogin = async (values) =>
  axios.post('/api/admin/auth/login', { ...values })
// refresh token
export const asyncRefreshToken = axios.post('/api/admin/auth/refresh')
// receive user info
export const asyncUserInfo = axios.get('/api/admin/auth/user-info')
