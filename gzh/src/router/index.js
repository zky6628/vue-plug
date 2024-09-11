/**
 * 路由入口
 * @module router
 * @author zhanghuan
 * @date 2021/01/30
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import home from './home'
import test from './test'

Vue.use(VueRouter)

const routes = [
    ...home,
    ...test,
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router