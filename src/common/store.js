import { create } from 'zustand'
import { Config } from 'src/common/config'

export const useProjectNameStore = create()((set) => ({
  projectName: Config.PROJECT_NAME,
  projectNameSort: Config.PROJECT_NAME_SORT,
  setProjectName: (projectName) => set({ projectName }),
  setProjectNameSort: (projectNameSort) => set({ projectNameSort }),
}))

export const useSessionStore = create()((set) => ({
  session: { id: '', email: '', roles: [] },
  setSession: (session) => set({ session }),
}))
