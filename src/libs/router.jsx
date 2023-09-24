import { createBrowserRouter } from 'react-router-dom'
import AdminLayout from '@/admin-layout'
import Dashboard from '@/pages/dashboard'
import User from '@/pages/user'
import Tag from '@/pages/tag'
import Category from '@/pages/category'
import Book from '@/pages/book'
import BookForm from '@/pages/book/form'
import BookView from '@/pages/book/view'
import Chapter from '@/pages/book/chapter'
import ChapterForm from '@/pages/book/chapter/form'
import ChapterView from '@/pages/book/chapter-view'
import Comment from '@/pages/comment'
import Order from '@/pages/order'
import Consumption from '@/pages/consumption'
import Product from '@/pages/product'
import Promotion from '@/pages/promotion'
import Recommend from '@/pages/recommend'
import Advertisement from '@/pages/advertisement'
import SignIn from '@/pages/auth/sign-in'
import ComingSoon from '@/pages/coming-soon'
import Error from '@/pages/error'

export const Routes = {
  DASHBOARD: { path: '/', element: <Dashboard /> },
  USER_REPORT: { path: '/user-report', element: <Dashboard /> },
  ORDER_REPORT: { path: '/order-report', element: <Dashboard /> },
  USER_LIST: { path: '/user-list', element: <User /> },
  TAG_LIST: { path: '/tag-list', element: <Tag /> },
  CATEGORY_LIST: { path: '/category-list', element: <Category /> },
  BOOK_LIST: { path: '/book-list', element: <Book /> },
  BOOK_FORM: { path: '/book-form', element: <BookForm /> },
  BOOK_VIEW: { path: '/book-view', element: <BookView /> },
  CHAPTER_LIST: { path: '/chapter-list', element: <Chapter /> },
  CHAPTER_FORM: { path: '/chapter-form', element: <ChapterForm /> },
  CHAPTER_VIEW: { path: '/chapter-view', element: <ChapterView /> },
  COMMENT_LIST: { path: '/comment-list', element: <Comment /> },
  ORDER_LIST: { path: '/order-list', element: <Order /> },
  CONSUMPTION_LIST: { path: '/consumption-list', element: <Consumption /> },
  PRODUCT_LIST: { path: '/product-list', element: <Product /> },
  PROMOTION_LIST: { path: '/promotion-list', element: <Promotion /> },
  RECOMMEND_LIST: { path: '/recommend-list', element: <Recommend /> },
  ADVERTISEMENT_LIST: {
    path: '/advertisement-list',
    element: <Advertisement />,
  },
  SIGN_IN: { path: '/sign-in', element: <SignIn /> },
}

const Router = createBrowserRouter([
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
        path: Routes.TAG_LIST.path,
        element: Routes.TAG_LIST.element,
      },
      {
        path: Routes.CATEGORY_LIST.path,
        element: Routes.CATEGORY_LIST.element,
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
        path: Routes.CHAPTER_LIST.path,
        element: Routes.CATEGORY_LIST.element,
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
        path: Routes.COMING_SOON.path,
        element: Routes.COMING_SOON.element,
      },
      {
        path: Routes.PRODUCT_LIST.path,
        element: Routes.PRODUCT_LIST.element,
      },
      {
        path: Routes.PROMOTION_LIST.path,
        element: Routes.PRODUCT_LIST.element,
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
    path: '*',
    element: <ComingSoon />,
  },
])

export default Router
