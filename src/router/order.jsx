// import Comment from '@/pages/comment'
import Order from '@/pages/order'
import OrderForm from '@/pages/order/form'
import RefundRequest from '@/pages/order/refund-request'

const routes = [
    // { path: '/comment-list', element: <Comment /> },
    { path: '/order-list', element: <Order />, label: 'menu.orderList', isMenu: true },
    { path: '/refund-request', element: <RefundRequest />, label: 'menu.refundRequest', isMenu: true },
    { path: '/order-form', element: <OrderForm />, label: 'button.orderEditing', parentPath: '/order-list' },
]

export default routes
