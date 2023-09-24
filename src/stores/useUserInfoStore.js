import { create } from 'zustand'

const useUserInfoStore = create()((set) => ({
  userInfo: JSON.parse(localStorage.getItem('user_info')),
  setUserInfo: (userInfo) => {
    set({ userInfo })
    localStorage.setItem('user_info', JSON.stringify(userInfo))
  },
}))

export default useUserInfoStore
