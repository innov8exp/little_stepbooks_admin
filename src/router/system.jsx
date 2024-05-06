import Profile from '@/pages/profile'
import AdminUserPage from '@/pages/admin-user'

const routes = [
    {
        path: '/admin-user',
        element: <AdminUserPage />,
        label: 'menu.adminUser',
        isMenu: true
    },
    { path: '/profile', label: 'profile', element: <Profile /> },

]

export default routes
