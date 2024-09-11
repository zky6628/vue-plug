/**
 * 测试
 * @module text
 * @author zhanghuan
 * @date 2021/01/30
 */

const routes = [
{
    path: '/test',
    name: 'test',
    component: () => import('@/view/test'),
    meta: {
        title: '测试'
    }
},
];

export default routes;