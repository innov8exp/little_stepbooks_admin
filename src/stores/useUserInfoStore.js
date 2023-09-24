import { create } from 'zustand'
import Config from '@/libs/config'

const useUserInfoStore = create()((set) => ({
  userInfo: JSON.parse(localStorage.getItem(Config.USER_INFO_KEY)),
  setUserInfo: (userInfo) => {
    set({ userInfo })
    localStorage.setItem(Config.USER_INFO_KEY, JSON.stringify(userInfo))
  },
  removeUserInfo: () => {
    set({ userInfo: null })
    localStorage.removeItem(Config.USER_INFO_KEY)
  },
}))

export default useUserInfoStore
