import AdminLayout from '@/admin-layout'
import AdminUserPage from '@/pages/admin-user'
import Advertisement from '@/pages/advertisement'
import Activity from '@/pages/activity'
import ActivityAudioList from '@/pages/activity/audioList'
import ForgetPassword from '@/pages/auth/forget-password'
import SignIn from '@/pages/auth/sign-in'
import Book from '@/pages/book'
import BookQRCode from '@/pages/book-qrcode'
import BookQRCodeForm from '@/pages/book-qrcode/form'
import BookQRCodeView from '@/pages/book-qrcode/view'
import BookForm from '@/pages/book/form'
import BookView from '@/pages/book/view'
import Chapter from '@/pages/chapter'
import ChapterForm from '@/pages/chapter/form'
import ChapterView from '@/pages/chapter/view'
import Classification from '@/pages/classification'
import Comment from '@/pages/comment'
import Course from '@/pages/course'
import CourseForm from '@/pages/course/form'
import CourseView from '@/pages/course/view'
import Dashboard from '@/pages/dashboard'
import Error from '@/pages/error'
import Inventory from '@/pages/inventory'
import ComingSoon from '@/pages/not-found'
import Order from '@/pages/order'
import OrderInventoryLog from '@/pages/order-inventory-log'
import OrderForm from '@/pages/order/form'
import RefundRequest from '@/pages/order/refund-request'
import Product from '@/pages/product'
import ProductForm from '@/pages/product/form'
import ProductView from '@/pages/product/view'
import Profile from '@/pages/profile'
import Promotion from '@/pages/promotion'
import Recommend from '@/pages/recommend'
import VirtualGoods from '@/pages/goods/virtual'
import PhysicalGoods from '@/pages/goods/physical'
import GoodsCategory from '@/pages/goods/category'
import GoodsAudioList from '@/pages/goods/audioList'
import GoodsVideoList from '@/pages/goods/videoList'
import User from '@/pages/user'

import { createBrowserRouter } from 'react-router-dom'

const contentRoutes = {
  DASHBOARD: { path: '/', element: <Dashboard /> },
  PROFILE: { path: '/profile', element: <Profile /> },
  USER_REPORT: { path: '/user-report', element: <Dashboard /> },
  ORDER_REPORT: { path: '/order-report', element: <Dashboard /> },
  USER_LIST: { path: '/user-list', element: <User /> },
  CLASSIFICATION_LIST: { path: '/classification-list', element: <Classification /> },

  COMMENT_LIST: { path: '/comment-list', element: <Comment /> },
  ORDER_LIST: { path: '/order-list', element: <Order /> },
  ORDER_FORM: { path: '/order-form', element: <OrderForm /> },
  REFUND_REQUEST: { path: '/refund-request', element: <RefundRequest /> },

  INVENTORY_LIST: { path: '/inventory-list', element: <Inventory /> },
  ORDER_INVENTORY_LOG_LIST: { path: '/order-inventory-log-list', element: <OrderInventoryLog /> },

  PRODUCT_LIST: { path: '/product-list', element: <Product /> },
  PRODUCT_FORM: { path: '/product-form', element: <ProductForm /> },
  PRODUCT_VIEW: { path: '/product-view', element: <ProductView /> },
  
  VIRTUAL_GOODS_LIST: { path: '/goods/virtual-list', element: <VirtualGoods /> },
  PHYSICAL_GOODS_LIST: { path: '/goods/physical-list', element: <PhysicalGoods /> },
  GOODS_CATEGORY_LIST: { path: '/goods/category-list', element: <GoodsCategory /> },
  GOODS_AUDIO_LIST: { path: '/goods/:id/audio-list', element: <GoodsAudioList /> },
  GOODS_VIDEO_LIST: { path: '/goods/:id/video-list', element: <GoodsVideoList /> },

  PROMOTION_LIST: { path: '/promotion-list', element: <Promotion /> },
  RECOMMEND_LIST: { path: '/recommend-list', element: <Recommend /> },
  ADVERTISEMENT_LIST: { path: '/advertisement-list', element: <Advertisement /> },
  ACTIVITY_LIST: { path: '/activity-list', element: <Activity /> },
}

const otherRoutes = {
  SIGN_IN: { path: '/sign-in', element: <SignIn /> },
  FORGET_PASSWORD: { path: '/forget-password', element: <ForgetPassword /> },
  NOT_FOUND: { path: '/not-found', element: <ComingSoon /> },
}

export const Routes = {
  ...contentRoutes,
  ...otherRoutes
}

const contentArr = Object.keys(contentRoutes).map(key => {
  const item = {
    path: contentRoutes[key].path,
    element: contentRoutes[key].element
  }
  if(contentRoutes[key].path === '/'){
    item.index = true
  }
  return item
})

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [
      ...contentArr,
      {
        path: '/books',
        element: <Book />,
      },
      {
        path: '/books/form',
        element: <BookForm />,
      },
      {
        path: '/books/:id/form',
        element: <BookForm />,
      },
      {
        path: '/books/:id/view',
        element: <BookView />,
      },
      {
        path: '/books/:bookId/chapters',
        element: <Chapter />,
      },
      {
        path: '/books/:bookId/chapters/form',
        element: <ChapterForm />,
      },
      {
        path: '/books/:bookId/chapters/:id/form',
        element: <ChapterForm />,
      },
      {
        path: '/books/:bookId/chapters/:id/view',
        element: <ChapterView />,
      },
      {
        path: '/books/:bookId/courses',
        element: <Course />,
      },
      {
        path: '/books/:bookId/courses/form',
        element: <CourseForm />,
      },
      {
        path: '/books/:bookId/courses/:id/form',
        element: <CourseForm />,
      },
      {
        path: '/books/:bookId/courses/:id/view',
        element: <CourseView />,
      },
      {
        path: '/books/:bookId/qrcodes',
        element: <BookQRCode />,
      },
      {
        path: '/books/:bookId/qrcodes/form',
        element: <BookQRCodeForm />,
      },
      {
        path: '/books/:bookId/qrcodes/:id/form',
        element: <BookQRCodeForm />,
      },
      {
        path: '/books/:bookId/qrcodes/:id/view',
        element: <BookQRCodeView />,
      },
      {
        path: '/activity/:activityId/audios',
        element: <ActivityAudioList />,
      },
      {
        path: '/admin-user',
        element: <AdminUserPage />,
      },
      {
        path: '*',
        element: <ComingSoon />,
      },
    ],
  },
  {
    path: otherRoutes.SIGN_IN.path,
    element: otherRoutes.SIGN_IN.element,
  },
  {
    path: otherRoutes.FORGET_PASSWORD.path,
    element: otherRoutes.FORGET_PASSWORD.element,
  },
  {
    path: '*',
    element: <ComingSoon />,
  },
])
