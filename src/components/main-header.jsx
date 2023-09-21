import {
  DownOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Layout, Menu } from "antd";
// import { useSession } from "../libs/session-context";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const { Header } = Layout;

const HeaderContainer = styled(Header)`
  padding: 0;
  display: flex;
  z-index: 10;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background: #fff;
`;

const HeaderFuncWrapper = styled.div`
  display: flex;
  line-height: 64px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: 0 24px;
`;

const HeaderMenuItem = styled.span`
  padding: 0 24px 0 6px;
`;

const DropdownLink = styled.span`
  cursor: pointer;
  &:hover {
    color: #3f51b5;
  }
`;

const Trigger = styled.span`
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #3f51b5;
  }
`;

const MainHeader = ({ onToggleClick }) => {
  const [collapsed, setCollapsed] = useState(true);

  // const { logout, getUserInfo, session } = useSession();

  const clickHandler = () => {
    setCollapsed(!collapsed);
    onToggleClick(collapsed);
  };

  const handleLogout = () => {
    // logout();
  };

  // useEffect(() => {
  //   getUserInfo();
  // }, [getUserInfo]);

  return (
    <HeaderContainer>
      <Trigger onClick={clickHandler}>
        {collapsed ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </Trigger>
      <HeaderFuncWrapper>
        <Trigger>
          <Link style={{ color: "rgba(0, 0, 0, 0.65)" }} to="/">
            <HomeOutlined />
          </Link>
        </Trigger>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="0">
                <Link to="/main/user">
                  <UserOutlined />
                  <HeaderMenuItem>个人信息</HeaderMenuItem>
                </Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link to="/main/setting">
                  <SettingOutlined />
                  <HeaderMenuItem>设置</HeaderMenuItem>
                </Link>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="3" onClick={handleLogout}>
                <LogoutOutlined />
                <HeaderMenuItem></HeaderMenuItem>
              </Menu.Item>
            </Menu>
          }
          placement="bottomRight"
        >
          <DropdownLink>
            {/* {session.username} */}
            <DownOutlined />
          </DropdownLink>
        </Dropdown>
      </HeaderFuncWrapper>
    </HeaderContainer>
  );
};

MainHeader.propTypes = {
  onToggleClick: () => {},
};

export default MainHeader;
