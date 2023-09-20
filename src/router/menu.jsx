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
} from "@ant-design/icons";
import { Link } from "react-router-dom";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

// { activeRoute: "/", activeMenu: "首页" }
export const items = [
  // 首页
  getItem("首页", "1", <DashboardOutlined />, [
    getItem(
      <Link to="/userReport">用户报表</Link>,
      "11",
      <DashboardOutlined />
    ),
    getItem(
      <Link to="/orderReport">订单报表</Link>,
      "12",
      <DashboardOutlined />
    ),
    getItem(
      <Link to="/novelReport">小说报表</Link>,
      "13",
      <DashboardOutlined />
    ),
  ]),

  // 用户管理
  getItem("用户管理", "2", <UserOutlined />, [
    getItem(<Link to="/userList">用户列表</Link>, "21", <UserOutlined />),
    getItem(<Link to="/labelManage">标签管理</Link>, "22", <BookOutlined />),
  ]),

  // 小说管理
  getItem("小说管理", "3", <BookOutlined />, [
    getItem(<Link to="/category">分类管理</Link>, "31", <BookOutlined />),
    getItem(<Link to="/book">小说列表</Link>, "32", <BookOutlined />),
    getItem(<Link to="/comment">评论管理</Link>, "33", <CommentOutlined />),
  ]),

  // 订单中心
  getItem("订单中心", "4", <ShoppingOutlined />, [
    getItem(<Link to="/order">订单明细</Link>, "41", <ShoppingOutlined />),
    getItem(
      <Link to="/consumption">消费明细</Link>,
      "42",
      <ShoppingOutlined />
    ),
  ]),

  // 运营管理
  getItem("运营管理", "5", <FundProjectionScreenOutlined />, [
    getItem(<Link to="/product">产品套餐</Link>, "51", <AccountBookOutlined />),
    getItem(
      <Link to="/promotion">促销管理</Link>,
      "52",
      <FundProjectionScreenOutlined />
    ),
    getItem(
      <Link to="/recommend">推荐设置</Link>,
      "53",
      <FundProjectionScreenOutlined />
    ),
    getItem(
      <Link to="/advertisement">广告设置</Link>,
      "54",
      <FundProjectionScreenOutlined />
    ),
    getItem(<Link to="/book1">消息推送</Link>, "55", <MailOutlined />),
    getItem(<Link to="/book1">用户反馈</Link>, "56", <SmileOutlined />),
  ]),

  // 系统管理
  getItem("系统管理", "6", <SettingOutlined />, [
    getItem(<Link to="/category1">基础配置</Link>, "61", <SettingOutlined />),
    getItem(<Link to="/book1">App配置</Link>, "62", <UserOutlined />),
    getItem(<Link to="/comment1">Admin用户管理</Link>, "63", <UserOutlined />),
  ]),
];
