import { Breadcrumb, Layout } from "antd";
import { Config } from "./libs/config";
import { useGlobalData } from "./common/global-context";
// import { MainRoutes } from './libs/router'
import EnvFlag from "./components/env-flag";
import MainHeader from "./components/main-header";
// import MainMenu from 'components/main-menu'
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const { Sider, Content } = Layout;

const ContentHeader = styled.div`
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
`;

const ContentWrapper = styled(Content)`
  padding: 24px;
  background: #f0f2f5;
  overflow-y: auto;
`;

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
`;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [globalData] = useGlobalData();
  return (
    <Layout style={{ height: "100vh" }}>
      <Sider breakpoint="sm" trigger={null} collapsible collapsed={collapsed}>
        <Logo>
          {collapsed ? Config.PROJECT_NAME_SORT : Config.PROJECT_NAME}
        </Logo>
        {/* <MainMenu menuData={GenerateMenu()} /> */}
      </Sider>
      <Layout>
        <MainHeader
          onToggleClick={(collapsedParam) => setCollapsed(collapsedParam)}
        />
        <ContentHeader>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/main/dashboard">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {globalData.activeRoute ? (
                <Link to={globalData.activeRoute.path}>
                  {globalData.activeMenu?.text}
                </Link>
              ) : (
                globalData.activeMenu?.text
              )}
            </Breadcrumb.Item>
          </Breadcrumb>
        </ContentHeader>
        <ContentWrapper>{/* <MainRoutes /> */}</ContentWrapper>
      </Layout>
      <EnvFlag />
    </Layout>
  );
};

export default AdminLayout;
