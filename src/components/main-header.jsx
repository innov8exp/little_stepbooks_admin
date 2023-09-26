import useSession from '@/hooks/useSession'
import {
  DownOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Dropdown, Layout, Space } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import EnvFlag from '@/components/env-flag'
import { Routes } from '@/libs/router'
import { Radio } from 'antd'
import i18n from '@/locales/i18n'
import useLanguage from '@/stores/useLanguage'
const { Header } = Layout

const HeaderContainer = styled(Header)`
  padding: 0;
  display: flex;
  z-index: 10;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: #fff;
`

const HeaderFuncWrapper = styled.div`
  display: flex;
  line-height: 64px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0 24px;
`

const HeaderMenuItem = styled.span`
  padding: 0 24px 0 6px;
`

// const DropdownLink = styled.span`
//   cursor: pointer;
//   &:hover {
//     color: #3f51b5;
//   }
// `

const Trigger = styled.span`
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #3f51b5;
  }
`

const MainHeader = ({ onToggleClick }) => {
  const { language, setLanguage } = useLanguage()
  const [collapsed, setCollapsed] = useState(true)
  const { logout, refreshUserInfo, userInfo } = useSession()

  // const { locales, inc } = useStore()

  const changeLocale = (e) => {
    const localeValue = e.target.value
    setLanguage(localeValue)
    i18n.changeLanguage(localeValue)
  }

  const items = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: (
        <Link to={Routes.PROFILE.path}>
          <HeaderMenuItem>个人信息</HeaderMenuItem>
        </Link>
      ),
    },
    {
      key: '2',
      icon: <SettingOutlined />,
      label: (
        <Link to="/main/setting">
          <HeaderMenuItem>设置</HeaderMenuItem>
        </Link>
      ),
    },
    {
      key: '3',
      danger: true,
      icon: <LogoutOutlined />,
      label: <HeaderMenuItem>登出</HeaderMenuItem>,
      onClick: logout,
    },
  ]

  const clickHandler = () => {
    setCollapsed(!collapsed)
    onToggleClick(collapsed)
  }

  useEffect(() => {
    async function fetchData() {
      await refreshUserInfo()
    }
    fetchData()
  }, [refreshUserInfo])

  return (
    <HeaderContainer>
      <Trigger onClick={clickHandler}>
        {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </Trigger>

      <HeaderFuncWrapper>
        <EnvFlag />
        <Trigger>
          <Link style={{ color: 'rgba(0, 0, 0, 0.65)' }} to="/">
            <HomeOutlined />
          </Link>
        </Trigger>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              {userInfo ? userInfo.username : `${i18n.t('title.notLoggedIn')}`}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Radio.Group
          value={language}
          onChange={changeLocale}
          size="small"
          style={{ marginLeft: '10px' }}
        >
          <Radio.Button key="cn" value="zh_CN">
            中文
          </Radio.Button>
          <Radio.Button key="en" value="en_US">
            English
          </Radio.Button>
        </Radio.Group>
      </HeaderFuncWrapper>
    </HeaderContainer>
  )
}

MainHeader.propTypes = {
  onToggleClick: () => {},
}

export default MainHeader
