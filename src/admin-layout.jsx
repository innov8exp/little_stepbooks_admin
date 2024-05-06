import { Breadcrumb, Layout, Menu } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Header from './components/main-header'
import { menus, breadcrumbMap } from './router/index'
import {
  HomeOutlined
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
  background-color: #f54a74;
`
const AdminLayout = () => {
  const { t } = useTranslation()

  const menuItems = menus.map((item, index1) => {
    const menuItem = {
      key: `${index1}`,
      label: item.path ? <Link to={item.path}>{t(item.label)}</Link> : t(item.label),
      icon: item.icon,
      children: item.children
    }
    if(menuItem.children){
      menuItem.children = menuItem.children.map(({ label, path }, index2) => {
        return {
          key: `${index1}${index2}`,
          label: <Link to={path}>{t(label)}</Link>,
        }
      })
    }
    return menuItem
  })

  function buildBreadcrumbItems () {
    const arr = [
      { title: <Link to="/"><HomeOutlined /></Link> }
    ]
    let currentItem = breadcrumbMap[location.pathname]
    if(!currentItem){ // 匹配不到配置项，尝试进行规则匹配
      const pathArr = location.pathname.split('/')
      let matchKey;
      Object.keys(breadcrumbMap).some(key => {
        const keyArr = key.split('/');
        if(keyArr.length === pathArr.length){
          let isSame = true
          for (let i = 0; i < keyArr.length; i++) {
            if(keyArr[i][0] != ':' && keyArr[i] != pathArr[i]){
              isSame = false;
              break;
            }
          }
          if(isSame){
            matchKey = key;
          }
          return isSame
        }
        return false
      })
      if(matchKey){
        currentItem = breadcrumbMap[matchKey]
      }
    }
    if(currentItem && currentItem.path != '/'){
      if(currentItem.parentPath){
        const parentItem = breadcrumbMap[currentItem.parentPath];
        arr.push({ title: <Link to={ parentItem.path }>{t(parentItem.label)}</Link> })
      }
      arr.push({ title: t(currentItem.label) })
    }
    return arr
  }

  const [collapsed, setCollapsed] = useState(localStorage.getItem('menu_collapsed') == 1)
  const location = useLocation()
  const breadcrumbItems = buildBreadcrumbItems()

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="sm"
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Logo>{collapsed ? t('project.nameSort') : t('project.name')}</Logo>
        <Menu
          theme="light"
          defaultSelectedKeys={['0']}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          onToggleClick={(collapsedParam) => {
            localStorage.setItem('menu_collapsed', collapsedParam ? 1 : 0)
            setCollapsed(collapsedParam)
          }}
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
