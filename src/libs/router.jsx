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
import ChapterView from '@/pages/book/chapter/view'
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
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  CommentOutlined,
  ShoppingOutlined,
  FundProjectionScreenOutlined,
  AccountBookOutlined,
  MailOutlined,
  SmileOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'

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

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}

export const MenuItems = [
  // 首页
  getItem('数据报表', '1', <DashboardOutlined />, [
    getItem(
      <Link to={Routes.USER_REPORT.path}>用户报表</Link>,
      '11',
      <DashboardOutlined />
    ),
    getItem(
      <Link to={Routes.ORDER_REPORT.path}>订单报表</Link>,
      '12',
      <DashboardOutlined />
    ),
  ]),

  // 用户管理
  getItem('用户管理', '2', <UserOutlined />, [
    getItem(
      <Link to={Routes.USER_LIST.path}>用户列表</Link>,
      '21',
      <UserOutlined />
    ),
    getItem(
      <Link to={Routes.TAG_LIST.path}>标签管理</Link>,
      '22',
      <BookOutlined />
    ),
  ]),

  // 小说管理
  getItem('书籍管理', '3', <BookOutlined />, [
    getItem(
      <Link to={Routes.CATEGORY_LIST.path}>分类管理</Link>,
      '31',
      <BookOutlined />
    ),
    getItem(<Link to='/book'>书籍列表</Link>, '32', <BookOutlined />),
    getItem(<Link to='/comment'>评论管理</Link>, '33', <CommentOutlined />),
  ]),

  // 订单中心
  getItem('订单中心', '4', <ShoppingOutlined />, [
    getItem(<Link to='/order'>订单明细</Link>, '41', <ShoppingOutlined />),
    getItem(
      <Link to='/consumption'>消费明细</Link>,
      '42',
      <ShoppingOutlined />
    ),
  ]),

  // 运营管理
  getItem('运营管理', '5', <FundProjectionScreenOutlined />, [
    getItem(<Link to='/product'>产品套餐</Link>, '51', <AccountBookOutlined />),
    getItem(
      <Link to='/promotion'>促销管理</Link>,
      '52',
      <FundProjectionScreenOutlined />
    ),
    getItem(
      <Link to='/recommend'>推荐设置</Link>,
      '53',
      <FundProjectionScreenOutlined />
    ),
    getItem(
      <Link to='/advertisement'>广告设置</Link>,
      '54',
      <FundProjectionScreenOutlined />
    ),
    getItem(<Link to='/book1'>消息推送</Link>, '55', <MailOutlined />),
    getItem(<Link to='/book1'>用户反馈</Link>, '56', <SmileOutlined />),
  ]),

  // 系统管理
  getItem('系统管理', '6', <SettingOutlined />, [
    getItem(<Link to='/category1'>基础配置</Link>, '61', <SettingOutlined />),
    getItem(<Link to='/book1'>App配置</Link>, '62', <UserOutlined />),
    getItem(<Link to='/comment1'>Admin用户管理</Link>, '63', <UserOutlined />),
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
  // getBreadcrumbItem("/", "", "首页", 1),
  getBreadcrumbItem('/user-report', '首页', '用户报表', 2),
  getBreadcrumbItem('/order-report', '首页', '订单列表', 3),
  getBreadcrumbItem('/novel-report', '首页', '小说报表', 4),

  // getBreadcrumbItem("", "用户管理", "用户管理", 1),
  getBreadcrumbItem('/user-list', '用户管理', '用户列表', 5),
  getBreadcrumbItem('/label-manage', '用户管理', '标签管理', 6),

  getBreadcrumbItem('/category', '小说管理', '分类管理', 5),
  getBreadcrumbItem('/book', '小说管理', '小说列表', 6),
  getBreadcrumbItem('/comment', '小说管理', '评论管理', 7),

  getBreadcrumbItem('/order', '订单中心', '订单明细', 6),
  getBreadcrumbItem('/consumption', '订单中心', '消费明细', 7),

  getBreadcrumbItem('/product', '运营管理', '产品套餐', 5),
  getBreadcrumbItem('/promotion', '运营管理', '促销管理', 6),
  getBreadcrumbItem('/recommend', '运营管理', '推荐设置', 7),
  getBreadcrumbItem('/advertisement', '运营管理', '广告设置', 5),
  getBreadcrumbItem('/book2', '运营管理', '消息推送', 6),
  getBreadcrumbItem('/comment3', '运营管理', '用户反馈', 7),

  getBreadcrumbItem('/advertisement1', '系统管理', '基础配置', 5),
  getBreadcrumbItem('/book1', '系统管理', 'App配置', 6),
  getBreadcrumbItem('/comment1', '系统管理', 'Admin用户管理', 7),
]
