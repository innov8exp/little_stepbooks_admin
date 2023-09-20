import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../admin-layout";
import Dashboard from "../pages/dashboard/dashboard";
import User from "../pages/user/user";
import Tag from "../pages/tag/tag";
import Category from "../pages/category/category";
import Book from "../pages/book/book";
import Comment from "../pages/comment/comment";
import Order from "../pages/order/order";
import Consumption from "../pages/consumption/consumption";
import Product from "../pages/product/product";
import Promotion from "../pages/promotion/promotion";
import Recommend from "../pages/recommend/recommend";
import Advertisement from "../pages/advertisement/advertisement";
import ComingSoon from "../pages/coming-soon/coming-soon";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        // path: "/dashboard",
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/userReport",
        element: <Dashboard />,
      },
      {
        path: "/orderReport",
        element: <Dashboard />,
      },
      {
        path: "/novelReport",
        element: <Dashboard />,
      },
      //用户列表
      {
        path: "/userList",
        element: <User />,
      },
      //标签管理
      {
        path: "/labelManage",
        element: <Tag />,
      },
      //分类管理
      {
        path: "/Category",
        element: <Category />,
      },
      //小说列表
      {
        path: "/book",
        element: <Book />,
      },
      //评论管理
      {
        path: "/comment",
        element: <Comment />,
      },
      //订单明细
      {
        path: "/order",
        element: <Order />,
      },
      //消费明细
      {
        path: "/consumption",
        element: <Consumption />,
      },
      //产品套餐
      {
        path: "/product",
        element: <Product />,
      },
      //促销管理
      {
        path: "/promotion",
        element: <Promotion />,
      },
      //推荐设置
      {
        path: "/recommend",
        element: <Recommend />,
      },
      //广告设置
      {
        path: "/advertisement",
        element: <Advertisement />,
      },
      // 基础配置
      {
        path: "/advertisement",
        element: <Advertisement />,
      },
      {
        path: "*",
        element: <ComingSoon />,
      },
    ],
  },
]);

export default router;
