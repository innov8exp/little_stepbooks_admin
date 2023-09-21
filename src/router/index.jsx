import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from 'src/admin-layout'
import Dashboard from 'src/pages/dashboard/dashboard'
import User from 'src/pages/user/user'
import Tag from 'src/pages/tag/tag'
import Category from 'src/pages/category/category'
import Book from 'src/pages/book/book'
import Comment from 'src/pages/comment/comment'
import Order from 'src/pages/order/order'
import Consumption from 'src/pages/consumption/consumption'
import Product from 'src/pages/product/product'
import Promotion from 'src/pages/promotion/promotion'
import Recommend from 'src/pages/recommend/recommend'
import Advertisement from 'src/pages/advertisement/advertisement'
import SignIn from 'src/pages/auth/sign-in'
import ComingSoon from 'src/pages/coming-soon/coming-soon'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        // path: "/dashboard",
        index: true,
        element: <Dashboard />,
      },
      {
        path: '/user-report',
        element: <Dashboard />,
      },
      {
        path: '/order-report',
        element: <Dashboard />,
      },
      {
        path: '/novel-report',
        element: <Dashboard />,
      },
      //用户列表
      {
        path: '/user-list',
        element: <User />,
      },
      //标签管理
      {
        path: '/label-manage',
        element: <Tag />,
      },
      //分类管理
      {
        path: '/category',
        element: <Category />,
      },
      //小说列表
      {
        path: '/book',
        element: <Book />,
      },
      //评论管理
      {
        path: '/comment',
        element: <Comment />,
      },
      //订单明细
      {
        path: '/order',
        element: <Order />,
      },
      //消费明细
      {
        path: '/consumption',
        element: <Consumption />,
      },
      //产品套餐
      {
        path: '/product',
        element: <Product />,
      },
      //促销管理
      {
        path: '/promotion',
        element: <Promotion />,
      },
      //推荐设置
      {
        path: '/recommend',
        element: <Recommend />,
      },
      //广告设置
      {
        path: '/advertisement',
        element: <Advertisement />,
      },
      // 基础配置
      {
        path: '/advertisement',
        element: <Advertisement />,
      },
    ],
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '*',
    element: <ComingSoon />,
  },
])

export default router
