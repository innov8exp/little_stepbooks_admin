import { Router } from '@/libs/router'
import { ConfigProvider } from 'antd'
import en_US from 'antd/locale/en_US'
import zh_CN from 'antd/locale/zh_CN'
import { RouterProvider } from 'react-router-dom'
import useLanguage from './stores/useLanguage'

const App = () => {
  const { language } = useLanguage()
  return (
    <ConfigProvider
      locale={language == 'en_US' ? en_US : zh_CN}
      theme={{
        token: {
          // Seed Token，影响范围大
          colorPrimary: '#F54A74',
          colorLink: '#F54A74',
          // 派生变量，影响范围小
        },
      }}
    >
      <RouterProvider router={Router} />
    </ConfigProvider>
  )
}

export default App
