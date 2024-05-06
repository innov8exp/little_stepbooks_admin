import AdminLayout from '@/admin-layout'
import ForgetPassword from '@/pages/auth/forget-password'
import SignIn from '@/pages/auth/sign-in'
import Dashboard from '@/pages/dashboard'
import Error from '@/pages/error'
import ComingSoon from '@/pages/not-found'
import { createBrowserRouter } from 'react-router-dom'


import {
    HomeOutlined,
    UserOutlined,
    BookOutlined,
    PayCircleOutlined,
    InfoCircleOutlined,
    SettingOutlined,
} from '@ant-design/icons'

// 按照左侧菜单对路由进行分类维护
import userRoutes from './user'
import productRoutes from './product'
import orderRoutes from './order'
import activityRoutes from './activity'
import systemRoutes from './system'

const filterMenu = (routes) => routes.filter(item => item.isMenu).map(item => ({
    label: item.label,
    path: item.path
}))

export const contentRoutes = [
    { path: '/', element: <Dashboard />, label: 'home', index: true },
    ...userRoutes,
    ...productRoutes,
    ...orderRoutes,
    ...activityRoutes,
    ...systemRoutes
]

const map = {}

contentRoutes.forEach(item => {
  map[item.path] = {
    path: item.path,
    label: item.label,
    parentPath: item.parentPath,
  }
})

export const breadcrumbMap = map

export const menus = [
    {
        icon: <HomeOutlined />, label: 'menu.dashboard', path: '/'
    },
    {
        icon: <UserOutlined />, label: 'menu.userList', path: '/user-list'
    },
    {
        icon: <BookOutlined />, label: 'menu.product', children: filterMenu(productRoutes)
    },
    {
        icon: <PayCircleOutlined />, label: 'menu.order', children: filterMenu(orderRoutes)
    },
    {
        icon: <InfoCircleOutlined />, label: 'menu.operation', children: filterMenu(activityRoutes)
    },
    {
        icon: <SettingOutlined />, label: 'menu.system', children: filterMenu(systemRoutes)
    }
]

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [
      ...contentRoutes,
      { path: '/not-found', element: <ComingSoon /> },
      {
        path: '*',
        element: <ComingSoon />,
      },
    ],
  },
  { path: '/sign-in', element: <SignIn /> },
  { path: '/forget-password', element: <ForgetPassword /> },
  {
    path: '*',
    element: <ComingSoon />,
  },
])
