import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { RouterProvider } from 'react-router-dom'
// import AdminLayout from './admin-layout'
import router from './router'
import GlobalProvider from './common/global-store'
import './index.css'

// const router = createBrowserRouter([{ path: '/', element: <AdminLayout /> }])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <GlobalProvider>
        <RouterProvider router={router} />
      </GlobalProvider>
    </ConfigProvider>
  </React.StrictMode>
)
