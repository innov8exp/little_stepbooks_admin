import { create } from 'zustand'
import Config from '@/libs/config'

export const useProjectNameStore = create()((set) => ({
  projectName: Config.PROJECT_NAME,
  projectNameSort: Config.PROJECT_NAME_SORT,
  setProjectName: (projectName) => set({ projectName }),
  setProjectNameSort: (projectNameSort) => set({ projectNameSort }),
}))

export const useUserInfoStore = create()((set) => ({
  userInfo: JSON.parse(localStorage.getItem('user_info')),
  setUserInfo: (userInfo) => {
    set({ userInfo })
    localStorage.setItem('user_info', JSON.stringify(userInfo))
  },
}))
