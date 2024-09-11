/**
 * 图集路由
 * @module maps
 * @author zhanghuan
 * @date 2021/01/07
 */

import { GlobalLayout } from '@/components/layouts'

const routes = [
  {
    path: '/maps',
    redirect: '/maps/index',
    component: GlobalLayout,
    children: [
      {
        path: 'index',
        name: 'allView',
        component: () => import('@/views/maps/AllView.vue'),
        meta: {
          breadcrumb: ['图集', '全景图']
        }
      },
      {
        path: 'flowChart',
        name: 'flowChart',
        component: () => import('@/views/maps/FlowChart.vue'),
        meta: {
          breadcrumb: ['图集', '流向图']
        }
      },
      {
        path: 'flowMap',
        name: 'flowMap',
        component: () => import('@/views/maps/FlowMap.vue'),
        meta: {
          breadcrumb: ['图集', '流程图']
        }
      },
    ],
  },
]

export default routes
