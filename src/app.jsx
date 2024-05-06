import { Router } from '@/router'
import { ConfigProvider, App as AntdApp } from 'antd'
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
          colorError: '#A30FF2',
          // 派生变量，影响范围小
        },
      }}
    >
      <AntdApp style={{ height: '100%' }}>
        <RouterProvider router={Router} />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
