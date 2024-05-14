import md5 from 'js-md5'
import useUserInfoStore from '@/stores/useUserInfoStore'
import { message } from 'antd'
import axios from 'axios'
import HttpStatus from 'http-status-codes'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const useSession = () => {
  const [loading, setLoading] = useState(false)
  const { userInfo, setUserInfo, removeUserInfo } = useUserInfoStore()
  const navigate = useNavigate()
  const refreshUserInfo = async () => {
    try {
      const resp = await axios.get('/api/admin/auth/user-info')
      setUserInfo(resp.data)
    } catch (err) {
      console.log(err)
      if (err.response.status === HttpStatus.UNAUTHORIZED) {
        message.error('获取授权失败，请重新登录！')
        navigate('/sign-in')
      } else {
        message.error('服务器连接异常！')
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (values) => {
    try {
      const resp = await axios.post('/api/admin/auth/login', {
        email: values.email,
        password: md5(values.password)
      })
      if (resp.status === HttpStatus.OK) {
        window.location.href = '/'
      }
    } catch (error) {
      if (error.response.status === HttpStatus.UNAUTHORIZED) {
        message.error('邮箱地址或密码错误，请重新输入！')
      } else {
        message.error('服务器连接异常！')
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      const resp = await axios.post('/api/admin/auth/logout')
      if (resp.status === HttpStatus.OK) {
        removeUserInfo()
        navigate('/sign-in', { replace: true })
      }
    } catch (error) {
      message.error(`登出失败，原因：${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    setLoading,
    login,
    logout,
    userInfo,
    refreshUserInfo,
  }
}

export default useSession
