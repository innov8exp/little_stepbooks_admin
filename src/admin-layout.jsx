import { Breadcrumb, Layout, Menu } from 'antd'
// import { MainRoutes } from './libs/router'

import Header from './components/main-header'
// import MainMenu from 'components/main-menu'
import Config from '@/libs/config'
import { Routes } from './libs/router'
import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
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
const { Sider, Content } = Layout

const ContentHeader = styled.div`
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
`

const ContentWrapper = styled(Content)`
  padding: 24px;
  background: #f0f2f5;
  overflow-y: auto;
`

const Logo = styled.div`
  height: 64px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  line-height: 64px;
  text-align: center;
  white-space: nowrap;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #1677ff;
`
const AdminLayout = () => {
  const { t } = useTranslation()

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    }
  }

  const MenuItems = [
    getItem(t('menu.dashboard'), '1', <DashboardOutlined />, [
      getItem(
        <Link to={Routes.USER_REPORT.path}>{t('menu.userReport')}</Link>,
        '11',
        <DashboardOutlined />,
      ),
      getItem(
        <Link to={Routes.ORDER_REPORT.path}>{t('menu.orderReport')}</Link>,
        '12',
        <DashboardOutlined />,
      ),
    ]),

    getItem(t('menu.user'), '2', <UserOutlined />, [
      getItem(
        <Link to={Routes.USER_LIST.path}>{t('menu.userList')}</Link>,
        '21',
        <UserOutlined />,
      ),
      getItem(
        <Link to={Routes.TAG_LIST.path}>{t('menu.tag')}</Link>,
        '22',
        <BookOutlined />,
      ),
    ]),

    getItem(t('menu.bookManage'), '3', <BookOutlined />, [
      getItem(
        <Link to={Routes.CATEGORY_LIST.path}>{t('menu.category')}</Link>,
        '31',
        <BookOutlined />,
      ),

      getItem(
        <Link to={Routes.BOOK_LIST.path}>{t('menu.book')}</Link>,
        '32',
        <BookOutlined />,
      ),

      getItem(
        <Link to={Routes.COMMENT_LIST.path}>{t('menu.comment')}</Link>,
        '33',
        <CommentOutlined />,
      ),
    ]),

    // 订单中心
    getItem(t('menu.order'), '4', <ShoppingOutlined />, [
      getItem(
        <Link to={Routes.ORDER_LIST.path}>{t('menu.orderList')}</Link>,
        '41',
        <ShoppingOutlined />,
      ),
      getItem(
        <Link to={Routes.CONSUMPTION_LIST.path}>
          {t('menu.consumptionList')}
        </Link>,
        '42',
        <ShoppingOutlined />,
      ),
    ]),

    // 运营管理
    getItem(t('menu.product'), '5', <FundProjectionScreenOutlined />, [
      getItem(
        <Link to={Routes.PRODUCT_LIST.path}>{t('menu.productList')}</Link>,
        '51',
        <AccountBookOutlined />,
      ),
      getItem(
        <Link to={Routes.PROMOTION_LIST.path}>{t('menu.promotionList')}</Link>,
        '52',
        <FundProjectionScreenOutlined />,
      ),
      getItem(
        <Link to={Routes.RECOMMEND_LIST.path}>{t('menu.recommend')}</Link>,
        '53',
        <FundProjectionScreenOutlined />,
      ),
      getItem(
        <Link to={Routes.ADVERTISEMENT_LIST.path}>
          {t('menu.advertisement')}
        </Link>,
        '54',
        <FundProjectionScreenOutlined />,
      ),
      getItem(
        <Link to="/book2">{t('menu.push')}</Link>,
        '55',
        <MailOutlined />,
      ),
      getItem(
        <Link to="/comment3">{t('menu.feedback')}</Link>,
        '56',
        <SmileOutlined />,
      ),
    ]),

    getItem(t('menu.system'), '6', <SettingOutlined />, [
      getItem(
        <Link to="/category1">{t('menu.basic')}</Link>,
        '61',
        <SettingOutlined />,
      ),
      getItem(
        <Link to="/book1">{t('menu.configuration')}</Link>,
        '62',
        <UserOutlined />,
      ),
      getItem(
        <Link to="/comment1">{t('menu.adminUser')}</Link>,
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

  const BreadcrumbConfig = [
    getBreadcrumbItem(
      Routes.USER_REPORT.path,
      t('menu.dashboard'),
      t('menu.userReport'),
    ),
    getBreadcrumbItem(
      Routes.ORDER_REPORT.path,
      t('menu.dashboard'),
      t('menu.orderReport'),
    ),

    getBreadcrumbItem(
      Routes.USER_LIST.path,
      t('menu.user'),
      t('menu.userList'),
    ),
    getBreadcrumbItem(Routes.TAG_LIST.path, t('menu.user'), t('menu.tag'), 6),

    getBreadcrumbItem(
      Routes.CATEGORY_LIST.path,
      t('menu.bookManage'),
      t('menu.category'),
    ),
    getBreadcrumbItem(
      Routes.BOOK_LIST.path,
      t('menu.bookManage'),
      t('menu.book'),
    ),
    getBreadcrumbItem(
      Routes.COMMENT_LIST.path,
      t('menu.bookManage'),
      t('menu.comment'),
    ),

    getBreadcrumbItem(
      Routes.ORDER_LIST.path,
      t('menu.order'),
      t('menu.orderList'),
    ),
    getBreadcrumbItem(
      Routes.CONSUMPTION_LIST.path,
      t('menu.order'),
      t('menu.consumptionList'),
    ),

    getBreadcrumbItem(
      Routes.PRODUCT_LIST.path,
      t('menu.product'),
      t('menu.productList'),
    ),
    getBreadcrumbItem(
      Routes.PROMOTION_LIST.path,
      t('menu.product'),
      t('menu.promotionList'),
    ),
    getBreadcrumbItem(
      Routes.RECOMMEND_LIST.path,
      t('menu.product'),
      t('menu.recommend'),
    ),
    getBreadcrumbItem(
      Routes.ADVERTISEMENT_LIST.path,
      t('menu.product'),
      t('menu.advertisement'),
    ),
    getBreadcrumbItem('/book2', t('menu.product'), t('menu.push')),
    getBreadcrumbItem('/comment3', t('menu.product'), t('menu.feedback')),

    getBreadcrumbItem('/category1', t('menu.system'), t('menu.basic')),
    getBreadcrumbItem('/book1', t('menu.system'), t('menu.configuration')),
    getBreadcrumbItem('/comment1', t('menu.system'), t('menu.adminUser')),
  ]

  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter((i) => i)
  const lastUrl = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    const lastUrl = BreadcrumbConfig.filter((item) => item.router == url)
    return lastUrl
  })

  // let count = 0;
  const breadcrumbItems = [
    {
      title: <Link to="/">{t('page.index')}</Link>,
      key: 'home',
    },
  ]

  if (lastUrl.length > 0) {
    lastUrl[0].map((item) => {
      if (item.parentLabel && item.parentLabel !== t('page.index')) {
        breadcrumbItems.push({
          title: item.parentLabel,
          key: item.parentLabel,
        })
      }
      breadcrumbItems.push({
        title: <Link to={item.router}>{item.label}</Link>,
        key: item.label,
      })
    })
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="sm"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Logo>
          {collapsed ? Config.PROJECT_NAME_SORT : Config.PROJECT_NAME}
        </Logo>
        <Menu
          theme="light"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={MenuItems}
        />
      </Sider>
      <Layout>
        <Header
          onToggleClick={(collapsedParam) => setCollapsed(collapsedParam)}
        />
        <ContentHeader>
          <Breadcrumb items={breadcrumbItems} />
        </ContentHeader>
        <ContentWrapper>
          <Outlet></Outlet>
        </ContentWrapper>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
