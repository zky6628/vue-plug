/**
 * author: zhanghuan
 * created: 2020/3/31
 * describe: home页
 */
import { GlobalLayout } from '@/components/layouts';

const routes = [
    {
        path: '/',
        redirect: '/home/index',
    },
    {
        path: '/home',
        redirect: '/home/index',
        component: GlobalLayout,
        children: [
            {
                path: 'index',
                name: 'home',
                component: () => import('@/views/home'),
                meta: {
                    breadcrumb: ['首页']
                }
            },
        ],
    },
];

export default routes;
