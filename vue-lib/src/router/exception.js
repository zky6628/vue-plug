/**
 * author: zhanghuan
 * created: 2020/05/08
 * describe: 异常页面
 */
const routes = [{
    path: '/403',
    component: () => import('@/views/exception/403')
}, {
    path: '/404',
    component: () => import('@/views/exception/404')
}, {
    path: '/500',
    component: () => import('@/views/exception/500')
}]

export default routes