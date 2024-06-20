import Advertisement from '@/pages/advertisement'
import DailyAudioListPage from '@/pages/activity/dailyAudioList'
// import Activity from '@/pages/activity'
// import ActivityAudioList from '@/pages/activity/audioList'

const routes = [
    { path: '/advertisement-list', element: <Advertisement />, label: 'menu.advertisement', isMenu: true },
    {
        path: '/daily-audios-list',
        element: <DailyAudioListPage />,
        label: 'dailyAudio',
        isMenu: true
    }
    // { path: '/activity-list', element: <Activity />, label: 'menu.activityList', isMenu: true },
    // {
    //     path: '/activity/:activityId/audios',
    //     element: <ActivityAudioList />,
    //     label: 'button.mediaManage',
    //     parentPath: '/activity-list'
    // },
]

export default routes