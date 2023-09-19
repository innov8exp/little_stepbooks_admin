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
import MainLayout from '../admin-layout'
import SignInPage from '../pages/auth/sign-in'
import SignUpPage from '../pages/auth/sign-up'
import BookPage from '../pages/book/book'
import ChapterPage from '../pages/book/chapter'
import ChapterFormPage from '../pages/book/chapter-form'
import BookForm from '../pages/book/book-form'
import BookView from '../pages/book/book-view'
import CategoryPage from '../pages/category/category'
import ComingSoonPage from '../pages/coming-soon/coming-soon'
import DashboardPage from '../pages/dashboard/dashboard'
import SettingsPage from '../pages/settings/settings'
import PromotionPage from '../pages/promotion/promotion'
import ConsumptionPage from '../pages/consumption/consumption'
import OrderPage from '../pages/order/order'
import TagPage from '../pages/tag/tag'
import UserPage from '../pages/user/user'
import CommentPage from '../pages/comment/comment'
import ProductPage from '../pages/product/product'
import RecommendPage from '../pages/recommend/recommend'
import AdvertisementPage from '../pages/advertisement/advertisement'
// import { MenuItem } from '../components/main-menu';
/**
 */
export const Config = {
  PROJECT_NAME: 'NovlNovl',
  PROJECT_NAME_SORT: 'Novl',
  PROJECT_DESCRIPTION: 'NovlNovl Admin System',
}

/**
 * 路由表配置
 */
export const Routes = {
  signIn: {
    path: '/sign-in',
    name: 'Sign In',
    component: SignInPage,
    activeMenuItem: undefined,
  },
  signUp: {
    path: '/sign-up',
    name: 'Sign Up',
    component: SignUpPage,
    activeMenuItem: undefined,
  },
  main: {
    path: '/main',
    name: 'Home',
    component: MainLayout,
    activeMenuItem: 'dashboard',
    routes: {
      dashboard: {
        path: '/main/dashboard',
        name: 'dashboard',
        component: DashboardPage,
        activeMenuItem: 'dashboard',
      },
      category: {
        path: '/main/category',
        name: 'category',
        component: CategoryPage,
        activeMenuItem: 'category',
      },
      tag: {
        path: '/main/tag',
        name: 'tag',
        component: TagPage,
        activeMenuItem: 'tag',
      },
      bookList: {
        path: '/main/book',
        name: 'book',
        component: BookPage,
        activeMenuItem: 'bookList',
      },
      bookForm: {
        path: '/main/book-form',
        name: 'Edit Book',
        component: BookForm,
        activeMenuItem: 'bookList',
      },
      bookView: {
        path: '/main/book-view',
        name: 'Book Detail',
        component: BookView,
        activeMenuItem: 'bookList',
      },
      chapter: {
        path: '/main/chapter',
        name: 'Chapter',
        component: ChapterPage,
        activeMenuItem: 'bookList',
      },
      chapterForm: {
        path: '/main/chapter-form',
        name: 'Chapter Form',
        component: ChapterFormPage,
        activeMenuItem: 'bookList',
      },
      product: {
        path: '/main/product',
        name: 'Product',
        component: ProductPage,
        activeMenuItem: 'product',
      },
      promotion: {
        path: '/main/promotion',
        name: 'Promotion',
        component: PromotionPage,
        activeMenuItem: 'promotion',
      },
      order: {
        path: '/main/order',
        name: 'Order',
        component: OrderPage,
        activeMenuItem: 'orderDetail',
      },
      consumption: {
        path: '/main/consumption',
        name: 'Consumption',
        component: ConsumptionPage,
        activeMenuItem: 'consumption',
      },
      comment: {
        path: '/main/comment',
        name: 'Comment',
        component: CommentPage,
        activeMenuItem: 'comment',
      },
      recommend: {
        path: '/main/recommend',
        name: 'Recommend',
        component: RecommendPage,
        activeMenuItem: 'recommend',
      },
      advertisement: {
        path: '/main/advertisement',
        name: 'Advertisement',
        component: AdvertisementPage,
        activeMenuItem: 'advertisement',
      },
      user: {
        path: '/main/user',
        name: 'User',
        component: UserPage,
        activeMenuItem: 'user',
      },
      settings: {
        path: '/main/settings',
        name: 'Settings',
        component: SettingsPage,
        activeMenuItem: 'settings',
      },
      comingSoon: {
        path: '/main/coming-soon',
        name: 'comingSoon',
        component: ComingSoonPage,
        activeMenuItem: 'comingSoon',
      },
    },
  },
}

/**
 * 生成菜单列表
 * @returns MenuItems 菜单列表
 */
export const GenerateMenu = () => {
  return [
    {
      key: 'home',
      text: '首页',
      icon: <DashboardOutlined />,
      children: [
        {
          key: 'userDashboard',
          text: '用户报表',
          icon: <DashboardOutlined />,
          link: Routes.main.routes.dashboard.path,
        },
        {
          key: 'order',
          text: '订单报表',
          icon: <DashboardOutlined />,
          link: Routes.main.routes.dashboard.path,
        },
        {
          key: 'novl',
          text: '小说报表',
          icon: <DashboardOutlined />,
          link: Routes.main.routes.dashboard.path,
        },
      ],
    },
    {
      key: 'user',
      text: '用户管理',
      icon: <UserOutlined />,
      children: [
        {
          key: 'userList',
          text: '用户列表',
          icon: <UserOutlined />,
          link: Routes.main.routes.user.path,
        },
        {
          key: 'tag',
          text: '标签管理',
          icon: <BookOutlined />,
          link: Routes.main.routes.tag.path,
        },
      ],
    },
    {
      key: 'book',
      text: '小说管理',
      icon: <BookOutlined />,
      children: [
        {
          key: 'category',
          text: '分类管理',
          icon: <BookOutlined />,
          link: Routes.main.routes.category.path,
        },
        {
          key: 'bookList',
          text: '小说列表',
          icon: <BookOutlined />,
          link: Routes.main.routes.bookList.path,
        },
        // {
        //     key: 'searchList',
        //     text: '热搜列表',
        //     icon: <BookOutlined />,
        //     link: Routes.main.routes.comingSoon.path,
        // },
        {
          key: 'comment',
          text: '评论管理',
          icon: <CommentOutlined />,
          link: Routes.main.routes.comment.path,
        },
      ],
    },
    {
      key: 'order',
      text: '订单中心',
      icon: <ShoppingOutlined />,
      children: [
        {
          key: 'orderDetail',
          text: '订单明细',
          icon: <ShoppingOutlined />,
          link: Routes.main.routes.order.path,
        },
        // {
        //     key: 'orderStatistics',
        //     text: '订单统计',
        //     icon: <ShoppingOutlined />,
        //     link: Routes.main.routes.comingSoon.path,
        // },
        {
          key: 'consumption',
          text: '消费明细',
          icon: <ShoppingOutlined />,
          link: Routes.main.routes.consumption.path,
        },
      ],
    },
    {
      key: 'operation',
      text: '运营管理',
      icon: <FundProjectionScreenOutlined />,
      children: [
        {
          key: 'product',
          text: '产品套餐',
          icon: <AccountBookOutlined />,
          link: Routes.main.routes.product.path,
        },
        {
          key: 'promotion',
          text: '促销管理',
          icon: <FundProjectionScreenOutlined />,
          link: Routes.main.routes.promotion.path,
        },
        {
          key: 'recommend',
          text: '推荐设置',
          icon: <FundProjectionScreenOutlined />,
          link: Routes.main.routes.recommend.path,
        },
        {
          key: 'advertisement',
          text: '广告设置',
          icon: <FundProjectionScreenOutlined />,
          link: Routes.main.routes.advertisement.path,
        },
        {
          key: 'message',
          text: '消息推送',
          icon: <MailOutlined />,
          link: Routes.main.routes.comingSoon.path,
        },
        {
          key: 'feedback',
          text: '用户反馈',
          icon: <SmileOutlined />,
          link: Routes.main.routes.comingSoon.path,
        },
      ],
    },
    {
      key: 'settings',
      text: '系统管理',
      icon: <SettingOutlined />,
      children: [
        {
          key: 'basicSetting',
          text: '基础配置',
          icon: <SettingOutlined />,
          link: Routes.main.routes.comingSoon.path,
        },
        {
          key: 'appSetting',
          text: 'App配置',
          icon: <UserOutlined />,
          link: Routes.main.routes.comingSoon.path,
        },
        {
          key: 'userSetting',
          text: 'Admin用户管理',
          icon: <UserOutlined />,
          link: Routes.main.routes.comingSoon.path,
        },
      ],
    },
  ]
}
