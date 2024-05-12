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
import logo1 from '@/assets/images/logo.png'
import logo2 from '@/assets/images/logo2.png'

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
const AdminLayout = () => {
  let defaultSelectedKeys = ['0'];
  const { t } = useTranslation()
  const location = useLocation()
  const menuItems = menus.map((item, index1) => {
    const key = `${index1}`
    const menuItem = {
      key,
      label: item.path ? <Link to={item.path}>{t(item.label)}</Link> : t(item.label),
      icon: item.icon,
      children: item.children
    }
    if(location.pathname === item.path){
      defaultSelectedKeys = [key]
    }
    if(menuItem.children){
      menuItem.children = menuItem.children.map(({ label, path }, index2) => {
        const key = `${index1}${index2}`
        if(location.pathname === path){
          defaultSelectedKeys = [key]
        }
        return {
          key,
          label: <Link to={path}>{t(label)}</Link>,
        }
      })
    }
    return menuItem
  })
  const [collapsed, setCollapsed] = useState(localStorage.getItem('menu_collapsed') == 1)
  const [selectedKeys, setSelectedKeys] = useState(defaultSelectedKeys)

  function Logo () {
    return (
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
        position: 'relative',
        zIndex: 11
      }}>
        <img src={ collapsed ? logo1 : logo2 } style={{ height: 40 }} alt="stepbook" />
      </div>
    )
  }

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

  function onMenuClick ({ key }){
    setSelectedKeys(key)
  }

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
          selectedKeys={selectedKeys}
          mode="inline"
          items={menuItems}
          onClick={onMenuClick}
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
