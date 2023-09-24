import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import enTranslation from './en_US/translation.json'
import cnTranslation from './zh_CN/translation.json'

const resources = {
  en_US: {
    translation: enTranslation,
  },
  zh_CN: { translation: cnTranslation },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: 'zh_CN',
    fallbackLng: 'en_US',
    resources: resources,
  })

export default i18n
