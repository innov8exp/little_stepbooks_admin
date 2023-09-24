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
      <Link to={Routes.ORDER_REPORT.path}>订单报表</Link>,
      '12',
      <DashboardOutlined />,
    ),
  ]),

  getItem('用户管理', '2', <UserOutlined />, [
    getItem(
      <Link to={Routes.USER_LIST.path}>用户列表</Link>,
      '21',
      <UserOutlined />,
    ),
    getItem(
      <Link to={Routes.TAG_LIST.path}>标签管理</Link>,
      '22',
      <BookOutlined />,
    ),
  ]),

  getItem('书籍管理', '3', <BookOutlined />, [
    getItem(
      <Link to={Routes.CATEGORY_LIST.path}>分类管理</Link>,
      '31',
      <BookOutlined />,
    ),

    getItem(
      <Link to={Routes.BOOK_LIST.path}>书籍列表</Link>,
      '32',
      <BookOutlined />,
    ),

    getItem(
      <Link to={Routes.COMMENT_LIST.path}>评论管理</Link>,
      '33',
      <CommentOutlined />,
    ),
  ]),

  // 订单中心
  getItem('订单中心', '4', <ShoppingOutlined />, [
    getItem(
      <Link to={Routes.ORDER_LIST.path}>订单明细</Link>,
      '41',
      <ShoppingOutlined />,
    ),
    getItem(
      <Link to={Routes.CONSUMPTION_LIST.path}>消费明细</Link>,
      '42',
      <ShoppingOutlined />,
    ),
  ]),

  // 运营管理
  getItem('运营管理', '5', <FundProjectionScreenOutlined />, [
    getItem(
      <Link to={Routes.PRODUCT_LIST.path}>产品套餐</Link>,
      '51',
      <AccountBookOutlined />,
    ),
    getItem(
      <Link to={Routes.PROMOTION_LIST.path}>促销管理</Link>,
      '52',
      <FundProjectionScreenOutlined />,
    ),
    getItem(
      <Link to={Routes.RECOMMEND_LIST.path}>推荐设置</Link>,
      '53',
      <FundProjectionScreenOutlined />,
    ),
    getItem(
      <Link to={Routes.ADVERTISEMENT_LIST.path}>广告设置</Link>,
      '54',
      <FundProjectionScreenOutlined />,
    ),
    getItem(<Link to="/book2">消息推送</Link>, '55', <MailOutlined />),
    getItem(<Link to="/comment3">用户反馈</Link>, '56', <SmileOutlined />),
  ]),

  // 系统管理
  getItem('系统管理', '6', <SettingOutlined />, [
    getItem(<Link to="/category1">基础配置</Link>, '61', <SettingOutlined />),
    getItem(<Link to="/book1">App配置</Link>, '62', <UserOutlined />),
    getItem(<Link to="/comment1">Admin用户管理</Link>, '63', <UserOutlined />),
  ]),
]

function getBreadcrumbItem(router, parentLabel, label, key) {
  return {
    router,
    label,
    parentLabel,
    key,
  }
}

export const BreadcrumbConfig = [
  getBreadcrumbItem(Routes.USER_REPORT.path, '首页', '用户报表', 2),
  getBreadcrumbItem(Routes.ORDER_REPORT.path, '首页', '订单列表', 3),
  // getBreadcrumbItem('/novel-report', '首页', '小说报表', 4),

  getBreadcrumbItem(Routes.USER_LIST.path, '用户管理', '用户列表', 5),
  getBreadcrumbItem(Routes.TAG_LIST.path, '用户管理', '标签管理', 6),

  getBreadcrumbItem(Routes.CATEGORY_LIST.path, '书籍管理', '分类管理', 5),
  getBreadcrumbItem(Routes.BOOK_LIST.path, '书籍管理', '书籍列表', 6),
  getBreadcrumbItem(Routes.COMMENT_LIST.path, '书籍管理', '评论管理', 7),

  getBreadcrumbItem(Routes.ORDER_LIST.path, '订单中心', '订单明细', 6),
  getBreadcrumbItem(Routes.CONSUMPTION_LIST.path, '订单中心', '消费明细', 7),

  getBreadcrumbItem(Routes.PRODUCT_LIST.path, '运营管理', '产品套餐', 5),
  getBreadcrumbItem(Routes.PROMOTION_LIST.path, '运营管理', '促销管理', 6),
  getBreadcrumbItem(Routes.RECOMMEND_LIST.path, '运营管理', '推荐设置', 7),
  getBreadcrumbItem(Routes.ADVERTISEMENT_LIST.path, '运营管理', '广告设置', 5),
  getBreadcrumbItem('/book2', '运营管理', '消息推送', 6),
  getBreadcrumbItem('/comment3', '运营管理', '用户反馈', 7),

  getBreadcrumbItem('/category1', '系统管理', '基础配置', 5),
  getBreadcrumbItem('/book1', '系统管理', 'App配置', 6),
  getBreadcrumbItem('/comment1', '系统管理', 'Admin用户管理', 7),
]
