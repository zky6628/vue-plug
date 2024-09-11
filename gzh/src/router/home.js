/**
 * 首页路由
 * @module router
 * @author zhanghuan
 * @date 2021/01/30
 */
const routes = [{
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('@/view/home'),
        meta: {
            title: '检测信息登记'
        }
    },
];

export default routes;