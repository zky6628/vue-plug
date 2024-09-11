/**
 * 录音路由
 * @module recorder
 * @author zhanghuan
 * @date 2021/01/07
 */

import { GlobalLayout } from '@/components/layouts';

const routes = [
    {
        path: '/recorder',
        redirect: '/recorder/index',
        component: GlobalLayout,
        children: [
            {
                path: 'index',
                name: 'recorder',
                component: () => import('@/views/recorder/Recorder.vue'),
                meta: {
                    breadcrumb: ['录音', '录音并上传']
                }
            },
        ],
    },
];

export default routes;
