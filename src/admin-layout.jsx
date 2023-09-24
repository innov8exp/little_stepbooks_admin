import { Breadcrumb, Layout, Menu } from 'antd'
import { useProjectNameStore } from './libs/store'
// import { MainRoutes } from './libs/router'
import EnvFlag from './components/env-flag'
import MainHeader from './components/main-header'
// import MainMenu from 'components/main-menu'
import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { items, conf } from '@/libs/menu'
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
  // console.log("===items===", items);
  const [collapsed, setCollapsed] = useState(false)
  const { projectName, projectNameSort } = useProjectNameStore()
  const location = useLocation()
  const pathSnippets = location.pathname.split('/').filter((i) => i)
  const lastUrl = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    const lastUrl = conf.filter((item) => item.router == url)
    return lastUrl
  })

  // let count = 0;
  const breadcrumbItems = [
    {
      title: <Link to='/'>首页</Link>,
      key: 'home',
    },
  ]

  if (lastUrl.length > 0) {
    lastUrl[0].map((item) => {
      if (item.parentLabel && item.parentLabel !== '首页') {
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
        theme='light'
        breakpoint='sm'
        trigger={null}
        collapsible
        collapsed={collapsed}>
        <Logo>{collapsed ? projectNameSort : projectName}</Logo>
        <Menu
          theme='light'
          defaultSelectedKeys={['1']}
          mode='inline'
          items={items}
        />
      </Sider>
      <Layout>
        <MainHeader
          onToggleClick={(collapsedParam) =>
            setCollapsed(collapsedParam)
          }></MainHeader>
        <ContentHeader>
          <Breadcrumb items={breadcrumbItems} />
        </ContentHeader>
        <ContentWrapper>
          <Outlet></Outlet>
        </ContentWrapper>
      </Layout>
      <EnvFlag />
    </Layout>
  )
}

export default AdminLayout
