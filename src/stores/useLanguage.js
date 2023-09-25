import { create } from 'zustand'
import Config from '@/libs/config'

const useLanguage = create()((set) => ({
  language: localStorage.getItem(Config.LANGUAGE_KEY) || 'zh_CN',
  setLanguage: (language) => {
    set({ language })
    localStorage.setItem(Config.LANGUAGE_KEY, language)
  },
}))

export default useLanguage
