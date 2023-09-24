import axios from 'axios'
import Cookies from 'js-cookie'
import StatusCodes from 'http-status-codes'
import Config from '@/libs/config'
import { asyncRefreshToken } from './http'

// Axios default config
// axios.defaults.baseURL = process.env.PUBLIC_URL;//TODO:
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/json'
// Axios default config
axios.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN')

// Add a response interceptor for authenticating failure
const interceptor = axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Reject promise if usual error
    if (error?.response?.status !== StatusCodes.UNAUTHORIZED) {
      return Promise.reject(error)
    }
    const originalRequest = error.config
    axios.interceptors.response.eject(interceptor)

    // use refresh token retry
    return asyncRefreshToken
      .then((res) => {
        if (res.status === StatusCodes.OK) {
          return axios(originalRequest)
        }
        return Promise.reject(new Error('refresh error'))
      })
      .catch((err) => {
        if (err.response.status === StatusCodes.UNAUTHORIZED) {
          localStorage.removeItem(Config.USER_INFO_KEY)
          window.location.href = '/sign-in'
          return null
        }
        return Promise.reject(err)
      })
  }
)
