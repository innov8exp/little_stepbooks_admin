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
import Category from '@/pages/category'
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
import Tag from '@/pages/tag'
import User from '@/pages/user'
import {
  AccountBookOutlined,
  BookOutlined,
  CommentOutlined,
  DashboardOutlined,
  FundProjectionScreenOutlined,
  MailOutlined,
  SettingOutlined,
  ShoppingOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link, createBrowserRouter } from 'react-router-dom'
import i18n from '@/locales/i18n'

export const Routes = {
  DASHBOARD: { path: '/', element: <Dashboard /> },
  PROFILE: { path: '/profile', element: <Profile /> },
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
  FORGET_PASSWORD: { path: '/forget-password', element: <ForgetPassword /> },
  COMING_SOON: { path: '/coming-soon', element: <ComingSoon /> },
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
        path: Routes.PROFILE.path,
        element: Routes.PROFILE.element,
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

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}

export const MenuItems = [
  getItem(i18n.t('menu.dashboard'), '1', <DashboardOutlined />, [
    getItem(
      <Link to={Routes.USER_REPORT.path}>{i18n.t('menu.userReport')}</Link>,
      '11',
      <DashboardOutlined />,
    ),
    getItem(
      <Link to={Routes.ORDER_REPORT.path}>{i18n.t('menu.orderReport')}</Link>,
      '12',
      <DashboardOutlined />,
    ),
  ]),

  getItem(i18n.t('menu.user'), '2', <UserOutlined />, [
    getItem(
      <Link to={Routes.USER_LIST.path}>{i18n.t('menu.userList')}</Link>,
      '21',
      <UserOutlined />,
    ),
    getItem(
      <Link to={Routes.TAG_LIST.path}>{i18n.t('menu.tag')}</Link>,
      '22',
      <BookOutlined />,
    ),
  ]),

  getItem(i18n.t('menu.bookManage'), '3', <BookOutlined />, [
    getItem(
      <Link to={Routes.CATEGORY_LIST.path}>{i18n.t('menu.category')}</Link>,
      '31',
      <BookOutlined />,
    ),

    getItem(
      <Link to={Routes.BOOK_LIST.path}>{i18n.t('menu.book')}</Link>,
      '32',
      <BookOutlined />,
    ),

    getItem(
      <Link to={Routes.COMMENT_LIST.path}>{i18n.t('menu.comment')}</Link>,
      '33',
      <CommentOutlined />,
    ),
  ]),

  // 订单中心
  getItem(i18n.t('menu.order'), '4', <ShoppingOutlined />, [
    getItem(
      <Link to={Routes.ORDER_LIST.path}>{i18n.t('menu.orderList')}</Link>,
      '41',
      <ShoppingOutlined />,
    ),
    getItem(
      <Link to={Routes.CONSUMPTION_LIST.path}>
        {i18n.t('menu.consumptionList')}
      </Link>,
      '42',
      <ShoppingOutlined />,
    ),
  ]),

  // 运营管理
  getItem(i18n.t('menu.product'), '5', <FundProjectionScreenOutlined />, [
    getItem(
      <Link to={Routes.PRODUCT_LIST.path}>{i18n.t('menu.productList')}</Link>,
      '51',
      <AccountBookOutlined />,
    ),
    getItem(
      <Link to={Routes.PROMOTION_LIST.path}>
        {i18n.t('menu.promotionList')}
      </Link>,
      '52',
      <FundProjectionScreenOutlined />,
    ),
    getItem(
      <Link to={Routes.RECOMMEND_LIST.path}>{i18n.t('menu.recommend')}</Link>,
      '53',
      <FundProjectionScreenOutlined />,
    ),
    getItem(
      <Link to={Routes.ADVERTISEMENT_LIST.path}>
        {i18n.t('menu.advertisement')}
      </Link>,
      '54',
      <FundProjectionScreenOutlined />,
    ),
    getItem(
      <Link to="/book2">{i18n.t('menu.push')}</Link>,
      '55',
      <MailOutlined />,
    ),
    getItem(
      <Link to="/comment3">{i18n.t('menu.feedback')}</Link>,
      '56',
      <SmileOutlined />,
    ),
  ]),

  getItem(i18n.t('menu.system'), '6', <SettingOutlined />, [
    getItem(
      <Link to="/category1">{i18n.t('menu.basic')}</Link>,
      '61',
      <SettingOutlined />,
    ),
    getItem(
      <Link to="/book1">{i18n.t('menu.configuration')}</Link>,
      '62',
      <UserOutlined />,
    ),
    getItem(
      <Link to="/comment1">{i18n.t('menu.adminUser')}</Link>,
      '63',
      <UserOutlined />,
    ),
  ]),
]

function getBreadcrumbItem(router, parentLabel, label) {
  return {
    router,
    label,
    parentLabel,
  }
}

export const BreadcrumbConfig = [
  getBreadcrumbItem(
    Routes.USER_REPORT.path,
    i18n.t('menu.dashboard'),
    i18n.t('menu.userReport'),
  ),
  getBreadcrumbItem(
    Routes.ORDER_REPORT.path,
    i18n.t('menu.dashboard'),
    i18n.t('menu.orderReport'),
  ),

  getBreadcrumbItem(
    Routes.USER_LIST.path,
    i18n.t('menu.user'),
    i18n.t('menu.userList'),
  ),
  getBreadcrumbItem(
    Routes.TAG_LIST.path,
    i18n.t('menu.user'),
    i18n.t('menu.tag'),
    6,
  ),

  getBreadcrumbItem(
    Routes.CATEGORY_LIST.path,
    i18n.t('menu.bookManage'),
    i18n.t('menu.category'),
  ),
  getBreadcrumbItem(
    Routes.BOOK_LIST.path,
    i18n.t('menu.bookManage'),
    i18n.t('menu.book'),
  ),
  getBreadcrumbItem(
    Routes.COMMENT_LIST.path,
    i18n.t('menu.bookManage'),
    i18n.t('menu.comment'),
  ),

  getBreadcrumbItem(
    Routes.ORDER_LIST.path,
    i18n.t('menu.order'),
    i18n.t('menu.orderList'),
  ),
  getBreadcrumbItem(
    Routes.CONSUMPTION_LIST.path,
    i18n.t('menu.order'),
    i18n.t('menu.consumptionList'),
  ),

  getBreadcrumbItem(
    Routes.PRODUCT_LIST.path,
    i18n.t('menu.product'),
    i18n.t('menu.productList'),
  ),
  getBreadcrumbItem(
    Routes.PROMOTION_LIST.path,
    i18n.t('menu.product'),
    i18n.t('menu.promotionList'),
  ),
  getBreadcrumbItem(
    Routes.RECOMMEND_LIST.path,
    i18n.t('menu.product'),
    i18n.t('menu.recommend'),
  ),
  getBreadcrumbItem(
    Routes.ADVERTISEMENT_LIST.path,
    i18n.t('menu.product'),
    i18n.t('menu.advertisement'),
  ),
  getBreadcrumbItem('/book2', i18n.t('menu.product'), i18n.t('menu.push')),
  getBreadcrumbItem(
    '/comment3',
    i18n.t('menu.product'),
    i18n.t('menu.feedback'),
  ),

  getBreadcrumbItem('/category1', i18n.t('menu.system'), i18n.t('menu.basic')),
  getBreadcrumbItem(
    '/book1',
    i18n.t('menu.system'),
    i18n.t('menu.configuration'),
  ),
  getBreadcrumbItem(
    '/comment1',
    i18n.t('menu.system'),
    i18n.t('menu.adminUser'),
  ),
]
