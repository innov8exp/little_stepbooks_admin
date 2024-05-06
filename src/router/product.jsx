import Classification from '@/pages/classification'
import Product from '@/pages/product'
import VirtualGoods from '@/pages/goods/virtual'
import PhysicalGoods from '@/pages/goods/physical'
import GoodsCategory from '@/pages/goods/category'
import GoodsAudioList from '@/pages/goods/audioList'
import GoodsVideoList from '@/pages/goods/videoList'
import ProductSkuList from '@/pages/product/skuList'
import SkuGoodsList from '@/pages/product/skuGoodsList'

// 书籍相关的页面
import Book from '@/pages/book'
import BookQRCode from '@/pages/book-qrcode'
import BookQRCodeForm from '@/pages/book-qrcode/form'
import BookQRCodeView from '@/pages/book-qrcode/view'
import BookForm from '@/pages/book/form'
import BookView from '@/pages/book/view'
import Chapter from '@/pages/chapter'
import ChapterForm from '@/pages/chapter/form'
import ChapterView from '@/pages/chapter/view'
import Course from '@/pages/course'
import CourseForm from '@/pages/course/form'
import CourseView from '@/pages/course/view'
import Promotion from '@/pages/promotion'


const routes = [
    { path: '/classification-list', element: <Classification />, label: 'menu.classificationManagement', isMenu: true },
    { path: '/product-list', element: <Product />, label: 'menu.skuList', isMenu: true },
    { path: '/goods/physical-list', element: <PhysicalGoods />, label: 'menu.physicalGoodsList', isMenu: true },
    { path: '/goods/virtual-list', element: <VirtualGoods />, label: 'menu.virtualGoodsList', isMenu: true },
    { path: '/goods/category-list', element: <GoodsCategory />, label: 'menu.virtualGoodsList', isMenu: true },
    { path: '/product-sku-list/:id', element: <ProductSkuList />, label: 'menu.productList', parentPath: '/product-list' },
    { path: '/sku-goods-list/:skuId/:spuId', element: <SkuGoodsList />, label: 'skuRelationWidthGoods', parentPath: '/product-list' },
    { path: '/goods/:id/audio-list', element: <GoodsAudioList />, label: 'menu.virtualAudioList', parentPath: '/virtual-list' },
    { path: '/goods/:id/video-list', element: <GoodsVideoList />, label: 'menu.virtualVideoList', parentPath: '/virtual-list' },
    { 
        path: '/books', 
        element: <Book />,
        label: 'menu.book',
        isMenu: true
      },
      {
        path: '/books/form',
        element: <BookForm />,
        label: 'button.bookEditing',
        parentPath: '/books'
      },
      {
        path: '/books/:id/form',
        element: <BookForm />,
        label: 'button.bookEditing',
        parentPath: '/books'
      },
      {
        path: '/books/:id/view',
        element: <BookView />,
        label: 'title.bookViewing',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/chapters',
        element: <Chapter />,
        label: 'menu.bookChapter',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/chapters/form',
        element: <ChapterForm />,
        label: 'menu.addChapter',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/chapters/:id/form',
        element: <ChapterForm />,
        label: 'menu.editChapter',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/chapters/:id/view',
        element: <ChapterView />,
        label: 'menu.viewChapter',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/courses',
        element: <Course />,
        label: 'menu.courseList',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/courses/form',
        element: <CourseForm />,
        label: 'menu.addCourse',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/courses/:id/form',
        element: <CourseForm />,
        label: 'menu.editCourse',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/courses/:id/view',
        element: <CourseView />,
        label: 'menu.viewCourse',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/qrcodes',
        element: <BookQRCode />,
        label: 'menu.bookQrCode',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/qrcodes/form',
        element: <BookQRCodeForm />,
        label: 'menu.addQrCode',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/qrcodes/:id/form',
        element: <BookQRCodeForm />,
        label: 'menu.editQrCode',
        parentPath: '/books'
      },
      {
        path: '/books/:bookId/qrcodes/:id/view',
        element: <BookQRCodeView />,
        label: 'menu.viewQrCode',
        parentPath: '/books'
      },
      { 
        path: '/promotion-list',
        element: <Promotion />,
        label: 'title.label.promotion',
        parentPath: '/books'
      }
]

export default routes