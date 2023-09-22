/**
 */
export const Config = {
  PROJECT_NAME: "步印童书",
  PROJECT_NAME_SORT: "步印",
  PROJECT_DESCRIPTION: "Little Step Books Admin System",
};

/**
 * 路由表配置
 */
export const Routes = {
  signIn: {
    path: '/sign-in',
    name: 'Sign In',
    activeMenuItem: undefined,
  },
  signUp: {
    path: '/sign-up',
    name: 'Sign Up',
    activeMenuItem: undefined,
  },
  main: {
    path: '/main',
    name: 'Home',
    activeMenuItem: 'dashboard',
    routes: {
      dashboard: {
        path: '/main/dashboard',
        name: 'dashboard',
        activeMenuItem: 'dashboard',
      },
      category: {
        path: '/main/category',
        name: 'category',
        activeMenuItem: 'category',
      },
      tag: {
        path: '/main/tag',
        name: 'tag',
        activeMenuItem: 'tag',
      },
      bookList: {
        path: '/main/book',
        name: 'book',
        activeMenuItem: 'bookList',
      },
      bookForm: {
        path: '/main/book-form',
        name: 'Edit Book',
        activeMenuItem: 'bookList',
      },
      bookView: {
        path: '/main/book-view',
        name: 'Book Detail',
        activeMenuItem: 'bookList',
      },
      chapter: {
        path: '/main/chapter',
        name: 'Chapter',
        activeMenuItem: 'bookList',
      },
      chapterForm: {
        path: '/main/chapter-form',
        name: 'Chapter Form',
        activeMenuItem: 'bookList',
      },
      product: {
        path: '/main/product',
        name: 'Product',
        activeMenuItem: 'product',
      },
      promotion: {
        path: '/main/promotion',
        name: 'Promotion',
        activeMenuItem: 'promotion',
      },
      order: {
        path: '/main/order',
        name: 'Order',
        activeMenuItem: 'orderDetail',
      },
      consumption: {
        path: '/main/consumption',
        name: 'Consumption',
        activeMenuItem: 'consumption',
      },
      comment: {
        path: '/main/comment',
        name: 'Comment',
        activeMenuItem: 'comment',
      },
      recommend: {
        path: '/main/recommend',
        name: 'Recommend',
        activeMenuItem: 'recommend',
      },
      advertisement: {
        path: '/main/advertisement',
        name: 'Advertisement',
        activeMenuItem: 'advertisement',
      },
      // user: {
      //   path: '/main/user',
      //   name: 'User',
      //   activeMenuItem: 'user',
      // },
      settings: {
        path: '/main/settings',
        name: 'Settings',
        activeMenuItem: 'settings',
      },
      comingSoon: {
        path: '/main/coming-soon',
        name: 'comingSoon',
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
      children: [
        {
          key: 'userDashboard',
          text: '用户报表',
          link: Routes.main.routes.dashboard.path,
        },
        {
          key: 'order',
          text: '订单报表',
          link: Routes.main.routes.dashboard.path,
        },
        {
          key: 'novl',
          text: '小说报表',
          link: Routes.main.routes.dashboard.path,
        },
      ],
    },
    {
      key: 'user',
      text: '用户管理',
      children: [
        {
          key: 'userList',
          text: '用户列表',
          link: Routes.main.routes.user.path,
        },
        {
          key: 'tag',
          text: '标签管理',
          link: Routes.main.routes.tag.path,
        },
      ],
    },
    {
      key: 'book',
      text: '小说管理',
      children: [
        {
          key: 'category',
          text: '分类管理',
          link: Routes.main.routes.category.path,
        },
        {
          key: 'bookList',
          text: '小说列表',
          link: Routes.main.routes.bookList.path,
        },
        // {
        //     key: 'searchList',
        //     text: '热搜列表',
        //     link: Routes.main.routes.comingSoon.path,
        // },
        {
          key: 'comment',
          text: '评论管理',
          link: Routes.main.routes.comment.path,
        },
      ],
    },
    {
      key: 'order',
      text: '订单中心',
      children: [
        {
          key: 'orderDetail',
          text: '订单明细',
          link: Routes.main.routes.order.path,
        },
        // {
        //     key: 'orderStatistics',
        //     text: '订单统计',
        //     link: Routes.main.routes.comingSoon.path,
        // },
        {
          key: 'consumption',
          text: '消费明细',
          link: Routes.main.routes.consumption.path,
        },
      ],
    },
    {
      key: 'operation',
      text: '运营管理',
      children: [
        {
          key: 'product',
          text: '产品套餐',
          link: Routes.main.routes.product.path,
        },
        {
          key: 'promotion',
          text: '促销管理',
          link: Routes.main.routes.promotion.path,
        },
        {
          key: 'recommend',
          text: '推荐设置',
          link: Routes.main.routes.recommend.path,
        },
        {
          key: 'advertisement',
          text: '广告设置',
          link: Routes.main.routes.advertisement.path,
        },
        {
          key: 'message',
          text: '消息推送',
          link: Routes.main.routes.comingSoon.path,
        },
        {
          key: 'feedback',
          text: '用户反馈',
          link: Routes.main.routes.comingSoon.path,
        },
      ],
    },
    {
      key: 'settings',
      text: '系统管理',
      children: [
        {
          key: 'basicSetting',
          text: '基础配置',
          link: Routes.main.routes.comingSoon.path,
        },
        {
          key: 'appSetting',
          text: 'App配置',
          link: Routes.main.routes.comingSoon.path,
        },
        {
          key: 'userSetting',
          text: 'Admin用户管理',
          link: Routes.main.routes.comingSoon.path,
        },
      ],
    },
  ]
}
