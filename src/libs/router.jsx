import AdminLayout from '@/admin-layout'
import AdminUserPage from '@/pages/admin-user'
import Advertisement from '@/pages/advertisement'
import Activity from '@/pages/activity'
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
import User from '@/pages/user'

import { createBrowserRouter } from 'react-router-dom'

export const Routes = {
  DASHBOARD: { path: '/', element: <Dashboard /> },
  PROFILE: { path: '/profile', element: <Profile /> },
  USER_REPORT: { path: '/user-report', element: <Dashboard /> },
  ORDER_REPORT: { path: '/order-report', element: <Dashboard /> },
  USER_LIST: { path: '/user-list', element: <User /> },
  CLASSIFICATION_LIST: {
    path: '/classification-list',
    element: <Classification />,
  },

  // BOOK_QRCODE_LIST: { path: '/book-qrcode-list', element: <BookQRCode /> },
  // BOOK_QRCODE_FORM: { path: '/book-qrcode-form', element: <BookQRCodeForm /> },
  // BOOK_QRCODE_VIEW: { path: '/book-qrcode-view', element: <BookQRCodeView /> },

  COMMENT_LIST: { path: '/comment-list', element: <Comment /> },
  ORDER_LIST: { path: '/order-list', element: <Order /> },
  ORDER_FORM: { path: '/order-form', element: <OrderForm /> },
  REFUND_REQUEST: { path: '/refund-request', element: <RefundRequest /> },

  INVENTORY_LIST: { path: '/inventory-list', element: <Inventory /> },
  ORDER_INVENTORY_LOG_LIST: {
    path: '/order-inventory-log-list',
    element: <OrderInventoryLog />,
  },

  PRODUCT_LIST: { path: '/product-list', element: <Product /> },
  PRODUCT_FORM: { path: '/product-form', element: <ProductForm /> },
  PRODUCT_VIEW: { path: '/product-view', element: <ProductView /> },

  PROMOTION_LIST: { path: '/promotion-list', element: <Promotion /> },
  RECOMMEND_LIST: { path: '/recommend-list', element: <Recommend /> },
  ADVERTISEMENT_LIST: {
    path: '/advertisement-list',
    element: <Advertisement />,
  },
  ACTIVITY_LIST: {
    path: '/activity-list',
    element: <Activity />,
  },
  SIGN_IN: { path: '/sign-in', element: <SignIn /> },
  FORGET_PASSWORD: { path: '/forget-password', element: <ForgetPassword /> },
  NOT_FOUND: { path: '/not-found', element: <ComingSoon /> },
}

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        path: Routes.DASHBOARD.path,
        element: Routes.DASHBOARD.element,
      },
      {
        path: Routes.USER_REPORT.path,
        element: Routes.USER_REPORT.element,
      },
      {
        path: Routes.ORDER_REPORT.path,
        element: Routes.ORDER_REPORT.element,
      },
      {
        path: Routes.USER_LIST.path,
        element: Routes.USER_LIST.element,
      },
      {
        path: Routes.CLASSIFICATION_LIST.path,
        element: Routes.CLASSIFICATION_LIST.element,
      },
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
        path: Routes.COMMENT_LIST.path,
        element: Routes.COMMENT_LIST.element,
      },
      {
        path: Routes.ORDER_LIST.path,
        element: Routes.ORDER_LIST.element,
      },
      {
        path: Routes.ORDER_FORM.path,
        element: Routes.ORDER_FORM.element,
      },
      {
        path: Routes.REFUND_REQUEST.path,
        element: Routes.REFUND_REQUEST.element,
      },
      {
        path: Routes.INVENTORY_LIST.path,
        element: Routes.INVENTORY_LIST.element,
      },
      {
        path: Routes.ORDER_INVENTORY_LOG_LIST.path,
        element: Routes.ORDER_INVENTORY_LOG_LIST.element,
      },
      {
        path: Routes.NOT_FOUND.path,
        element: Routes.NOT_FOUND.element,
      },
      {
        path: Routes.PRODUCT_LIST.path,
        element: Routes.PRODUCT_LIST.element,
      },
      {
        path: Routes.PRODUCT_FORM.path,
        element: Routes.PRODUCT_FORM.element,
      },
      {
        path: Routes.PRODUCT_VIEW.path,
        element: Routes.PRODUCT_VIEW.element,
      },
      {
        path: Routes.PROMOTION_LIST.path,
        element: Routes.PROMOTION_LIST.element,
      },
      {
        path: Routes.RECOMMEND_LIST.path,
        element: Routes.RECOMMEND_LIST.element,
      },
      {
        path: Routes.ADVERTISEMENT_LIST.path,
        element: Routes.ADVERTISEMENT_LIST.element,
      },
      {
        path: Routes.ACTIVITY_LIST.path,
        element: Routes.ACTIVITY_LIST.element,
      },
      {
        path: Routes.PROFILE.path,
        element: Routes.PROFILE.element,
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
    path: Routes.SIGN_IN.path,
    element: Routes.SIGN_IN.element,
  },
  {
    path: Routes.FORGET_PASSWORD.path,
    element: Routes.FORGET_PASSWORD.element,
  },
  {
    path: '*',
    element: <ComingSoon />,
  },
])
