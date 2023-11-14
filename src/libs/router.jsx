import AdminLayout from '@/admin-layout'
import Advertisement from '@/pages/advertisement'
import ForgetPassword from '@/pages/auth/forget-password'
import SignIn from '@/pages/auth/sign-in'
import Book from '@/pages/book'
import BookSet from '@/pages/book-set'
import BookSetForm from '@/pages/book-set/form'
import BookSetView from '@/pages/book-set/view'
import Chapter from '@/pages/chapter'
import ChapterForm from '@/pages/chapter/form'
import ChapterView from '@/pages/chapter/view'
import BookForm from '@/pages/book/form'
import BookView from '@/pages/book/view'
import Classification from '@/pages/classification'
import ComingSoon from '@/pages/coming-soon'
import Comment from '@/pages/comment'
import Consumption from '@/pages/consumption'
import Course from '@/pages/course'
import CourseForm from '@/pages/course/form'
import CourseView from '@/pages/course/view'
import Dashboard from '@/pages/dashboard'
import Error from '@/pages/error'
import Inventory from '@/pages/inventory'
import Order from '@/pages/order'
import OrderInventoryLog from '@/pages/order-inventory-log'
import OrderForm from '@/pages/order/form'
import Product from '@/pages/product'
import ProductForm from '@/pages/product/form'
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
  BOOK_LIST: { path: '/book-list', element: <Book /> },
  BOOK_FORM: { path: '/book-form', element: <BookForm /> },
  BOOK_VIEW: { path: '/book-view', element: <BookView /> },

  BOOK_SET_LIST: { path: '/book-set-list', element: <BookSet /> },
  BOOK_SET_FORM: { path: '/book-set-form', element: <BookSetForm /> },
  BOOK_SET_VIEW: { path: '/book-set-view', element: <BookSetView /> },

  CHAPTER_LIST: { path: '/chapter-list', element: <Chapter /> },
  CHAPTER_FORM: { path: '/chapter-form', element: <ChapterForm /> },
  CHAPTER_VIEW: { path: '/chapter-view', element: <ChapterView /> },
  COMMENT_LIST: { path: '/comment-list', element: <Comment /> },
  ORDER_LIST: { path: '/order-list', element: <Order /> },
  ORDER_FORM: { path: '/order-form', element: <OrderForm /> },

  INVENTORY_LIST: { path: '/inventory-list', element: <Inventory /> },
  ORDER_INVENTORY_LOG_LIST: {
    path: '/order-inventory-log-list',
    element: <OrderInventoryLog />,
  },

  CONSUMPTION_LIST: { path: '/consumption-list', element: <Consumption /> },
  PRODUCT_LIST: { path: '/product-list', element: <Product /> },
  PRODUCT_FORM: { path: '/product-form', element: <ProductForm /> },
  PROMOTION_LIST: { path: '/promotion-list', element: <Promotion /> },
  RECOMMEND_LIST: { path: '/recommend-list', element: <Recommend /> },
  ADVERTISEMENT_LIST: {
    path: '/advertisement-list',
    element: <Advertisement />,
  },
  SIGN_IN: { path: '/sign-in', element: <SignIn /> },
  FORGET_PASSWORD: { path: '/forget-password', element: <ForgetPassword /> },
  COMING_SOON: { path: '/coming-soon', element: <ComingSoon /> },
  COURSE: { path: '/course-list', element: <Course /> },
  COURSE_FORM: { path: '/course_form', element: <CourseForm /> },
  COURSE_VIEW: { path: '/course-view', element: <CourseView /> },
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
        path: Routes.BOOK_LIST.path,
        element: Routes.BOOK_LIST.element,
      },
      {
        path: Routes.BOOK_FORM.path,
        element: Routes.BOOK_FORM.element,
      },
      {
        path: Routes.BOOK_VIEW.path,
        element: Routes.BOOK_VIEW.element,
      },
      {
        path: Routes.BOOK_SET_LIST.path,
        element: Routes.BOOK_SET_LIST.element,
      },
      {
        path: Routes.BOOK_SET_FORM.path,
        element: Routes.BOOK_SET_FORM.element,
      },
      {
        path: Routes.BOOK_SET_VIEW.path,
        element: Routes.BOOK_SET_VIEW.element,
      },
      {
        path: Routes.CHAPTER_LIST.path,
        element: Routes.CHAPTER_LIST.element,
      },
      {
        path: Routes.CHAPTER_FORM.path,
        element: Routes.CHAPTER_FORM.element,
      },
      {
        path: Routes.CHAPTER_VIEW.path,
        element: Routes.CHAPTER_VIEW.element,
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
        path: Routes.INVENTORY_LIST.path,
        element: Routes.INVENTORY_LIST.element,
      },
      {
        path: Routes.ORDER_INVENTORY_LOG_LIST.path,
        element: Routes.ORDER_INVENTORY_LOG_LIST.element,
      },
      {
        path: Routes.CONSUMPTION_LIST.path,
        element: Routes.CONSUMPTION_LIST.element,
      },
      {
        path: Routes.COMING_SOON.path,
        element: Routes.COMING_SOON.element,
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
        path: Routes.PROFILE.path,
        element: Routes.PROFILE.element,
      },
      {
        path: Routes.COURSE.path,
        element: Routes.COURSE.element,
      },
      {
        path: Routes.COURSE_FORM.path,
        element: Routes.COURSE_FORM.element,
      },
      {
        path: Routes.COURSE_VIEW.path,
        element: Routes.COURSE_VIEW.element,
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
