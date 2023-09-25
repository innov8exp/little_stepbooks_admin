import { Router } from '@/libs/router'
import { ConfigProvider } from 'antd'
import en_US from 'antd/locale/en_US'
import zh_CN from 'antd/locale/zh_CN'
import { RouterProvider } from 'react-router-dom'
import useLanguage from './stores/useLanguage'

const App = () => {
  const { language } = useLanguage()
  return (
    <ConfigProvider locale={language == 'en_US' ? en_US : zh_CN}>
      <RouterProvider router={Router} />
    </ConfigProvider>
  )
}

export default App
