import { Breadcrumb, Layout, Menu } from 'antd'
import { useGlobalStore } from './common/global-store'
import { Config } from 'src/common/config'
// import { MainRoutes } from './libs/router'
import EnvFlag from './components/env-flag'
import MainHeader from './components/main-header'
// import MainMenu from 'components/main-menu'
import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { items } from './router/menu'
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
  background-color: #0bafff;
`

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const { projectName, projectNameSort } = useGlobalStore()
  useEffect(() => {
    console.log('projectName:', projectName)
    console.log('projectNameSort:', projectNameSort)
  }, [projectName, projectNameSort])
  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        theme='light'
        breakpoint='sm'
        trigger={null}
        collapsible
        collapsed={collapsed}>
        <Logo>
          {collapsed ? Config.PROJECT_NAME_SORT : Config.PROJECT_NAME}
        </Logo>
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
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to='/'>首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {/* {globalStore.activeRoute ? (
                <Link to={globalStore.activeRoute.path}>
                  {globalStore.activeMenu?.text}
                </Link>
              ) : (
                globalStore.activeMenu?.text
              )} */}
            </Breadcrumb.Item>
          </Breadcrumb>
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
