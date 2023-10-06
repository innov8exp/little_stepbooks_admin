import { asyncLogin, asyncUserInfo } from '@/libs/http'
import { Routes } from '@/libs/router'
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
      const resp = await asyncUserInfo
      setUserInfo(resp.data)
      navigate(Routes.DASHBOARD.path)
    } catch (err) {
      if (err.response.status === HttpStatus.UNAUTHORIZED) {
        message.error('获取授权失败，请重新登录！')
        navigate(Routes.SIGN_IN.path)
      } else {
        message.error('服务器连接异常！')
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (values) => {
    try {
      const resp = await asyncLogin(values)
      if (resp.status === HttpStatus.OK) {
        await refreshUserInfo()
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
        navigate(Routes.SIGN_IN.path)
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
