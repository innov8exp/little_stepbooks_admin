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
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}

// { activeRoute: "/", activeMenu: "首页" }
export const items = [
  // 首页
  getItem('数据报表', '1', <DashboardOutlined />, [
    getItem(
      <Link to='/user-report'>用户报表</Link>,
      '11',
      <DashboardOutlined />
    ),
    getItem(
      <Link to='/order-report'>订单报表</Link>,
      '12',
      <DashboardOutlined />
    ),
  ]),

  // 用户管理
  getItem('用户管理', '2', <UserOutlined />, [
    getItem(<Link to='/user-list'>用户列表</Link>, '21', <UserOutlined />),
    getItem(<Link to='/label-manage'>标签管理</Link>, '22', <BookOutlined />),
  ]),

  // 小说管理
  getItem('书籍管理', '3', <BookOutlined />, [
    getItem(<Link to='/category'>分类管理</Link>, '31', <BookOutlined />),
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

export const conf = [
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
