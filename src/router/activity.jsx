import Advertisement from '@/pages/advertisement'
import Activity from '@/pages/activity'
import ActivityAudioList from '@/pages/activity/audioList'
import DailyAudioListPage from '@/pages/activity/dailyAudioList'

const routes = [
    { path: '/advertisement-list', element: <Advertisement />, label: 'menu.advertisement', isMenu: true },
    { path: '/activity-list', element: <Activity />, label: 'menu.activityList', isMenu: true },
    {
        path: '/activity/:activityId/audios',
        element: <ActivityAudioList />,
        label: 'button.mediaManage',
        parentPath: '/activity-list'
    },
    {
        path: '/daily-audios-list',
        element: <DailyAudioListPage />,
        label: 'dailyAudio',
        isMenu: true
    }
]

export default routes