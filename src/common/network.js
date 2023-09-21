import axios from 'axios'
// import Cookies from 'js-cookie';

// Axios default config
// axios.defaults.baseURL = process.env.PUBLIC_URL;//TODO:
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/json'
// Axios default config
// axios.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
// Add a response interceptor for authenticating failure
const interceptor = axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Reject promise if usual error
    if (error?.response?.status !== 401) {
      return Promise.reject(error)
    }
    const originalRequest = error.config
    axios.interceptors.response.eject(interceptor)

    // use refresh token retry
    return axios
      .post('/api/admin/auth/refresh')
      .then((res) => {
        if (res.status === 200) {
          return axios(originalRequest)
        }
        return Promise.reject(new Error('refresh error'))
      })
      .catch((err) => {
        if (err.response.status === 401) {
          localStorage.removeItem('sat_current')
          window.location.href = '/sign-in'
          return null
        }
        return Promise.reject(err)
      })
  }
)

export default axios
