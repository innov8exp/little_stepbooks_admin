import { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { message } from 'antd'
import HttpStatus from 'http-status-codes'
import PropTypes from 'prop-types'

const emptyUser = () => {
  const user = {
    id: '',
    email: '',
    roles: [],
  }
  return user
}

const UserContext = createContext(emptyUser())

export const useSession = () => {
  const [session, setSession] = useContext(UserContext)
  const navigate = useNavigate()
  const login = (userTmp) => {
    setSession(userTmp)
    navigate.push('/')
  }
  const getUserInfo = () => {
    return new Promise()((resolve, reject) => {
      Axios.get('/api/admin/auth/user-info')
        .then((res) => {
          if (res && res.status === HttpStatus.OK) {
            console.log('xss', res)
            resolve(res.data)
          }
        })
        .catch((err) => reject(err))
    })
  }

  const logout = () => {
    Axios.post('/api/admin/auth/logout')
      .then((res) => {
        if (res.status === HttpStatus.OK) {
          setSession(emptyUser())
          localStorage.removeItem('sat_current')
          navigate.push('/sign-in')
        } else {
          message.error('logout failed.')
        }
      })
      .catch((err) => {
        message.error('logout failed, error: ', err.message)
      })
  }
  return { login, logout, getUserInfo, session }
}

const UserContextProvider = ({ children }) => {
  const navigate = useNavigate()
  let theUser = emptyUser()
  const current = localStorage.getItem('sat_current')
  if (current) {
    try {
      theUser = JSON.parse(decodeURIComponent(escape(atob(current))))
    } catch (err) {
      navigate.push('/sign-in')
    }
  }
  const [currentUser, setCurrentUser] = useState(theUser)
  useEffect(() => {
    if (currentUser.email) {
      localStorage.setItem(
        'sat_current',
        btoa(unescape(encodeURIComponent(JSON.stringify(currentUser))))
      )
    }
  }, [currentUser])

  return (
    <UserContext.Provider value={[currentUser, setCurrentUser]}>
      {children}
    </UserContext.Provider>
  )
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default UserContextProvider
