import Advertisement from '@/pages/advertisement'
import DailyAudioListPage from '@/pages/activity/dailyAudioList'
import PointTaskListPage from '@/pages/point/task'
import PointSettingPage from '@/pages/point/setting'
// import Activity from '@/pages/activity'
// import ActivityAudioList from '@/pages/activity/audioList'

const routes = [
    { path: '/advertisement-list', element: <Advertisement />, label: 'menu.advertisement', isMenu: true },
    {
        path: '/daily-audios-list',
        element: <DailyAudioListPage />,
        label: 'dailyAudio',
        isMenu: true
    },
    { path: '/point-setting', element: <PointSettingPage />, label: 'pointSetting', isMenu: true },
    { path: '/point-task-list', element: <PointTaskListPage />, label: 'pointTask', isMenu: true },
    // {
    //     path: '/activity/:activityId/audios',
    //     element: <ActivityAudioList />,
    //     label: 'button.mediaManage',
    //     parentPath: '/activity-list'
    // },
]

export default routes