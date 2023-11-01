import AdminLayout from '@/admin-layout'
import Advertisement from '@/pages/advertisement'
import ForgetPassword from '@/pages/auth/forget-password'
import SignIn from '@/pages/auth/sign-in'
import Book from '@/pages/book'
import Chapter from '@/pages/book/chapter'
import ChapterForm from '@/pages/book/chapter/form'
import ChapterView from '@/pages/book/chapter/view'
import BookForm from '@/pages/book/form'
import BookView from '@/pages/book/view'
// import Category from '@/pages/category'
import ComingSoon from '@/pages/coming-soon'
import Comment from '@/pages/comment'
import Consumption from '@/pages/consumption'
import Dashboard from '@/pages/dashboard'
import Error from '@/pages/error'
import Order from '@/pages/order'
import Product from '@/pages/product'
import Profile from '@/pages/profile'
import Promotion from '@/pages/promotion'
import Recommend from '@/pages/recommend'
// import Tag from '@/pages/tag'
import User from '@/pages/user'
import Course from '@/pages/book/course'
// import CourseCategory from '@/pages/courseCategory'
import CourseForm from '@/pages/book/course/form'
import CourseView from '@/pages/book/course/view'
import ContentList from '@/pages/book/course/content/index'
import ContentForm from '@/pages/book/course/content/form'
import Classification from '@/pages/classification'

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
  // TAG_LIST: { path: '/tag-list', element: <Tag /> },
  // CATEGORY_LIST: { path: '/category-list', element: <Category /> },
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
  FORGET_PASSWORD: { path: '/forget-password', element: <ForgetPassword /> },
  COMING_SOON: { path: '/coming-soon', element: <ComingSoon /> },
  COURSE: { path: '/course-list', element: <Course /> },
  COURSE_FORM: { path: '/course_form', element: <CourseForm /> },
  COURSE_VIEW: { path: '/course-view', element: <CourseView /> },
  COURSE_CONTENT_LIST: { path: '/content-list', element: <ContentList /> },
  COURSE_CONTENT_FORM: { path: '/content-form', element: <ContentForm /> },
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
      // {
      //   path: Routes.TAG_LIST.path,
      //   element: Routes.TAG_LIST.element,
      // },
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
        path: Routes.COURSE_CONTENT_LIST.path,
        element: Routes.COURSE_CONTENT_LIST.element,
      },
      {
        path: Routes.COURSE_CONTENT_FORM.path,
        element: Routes.COURSE_CONTENT_FORM.element,
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
