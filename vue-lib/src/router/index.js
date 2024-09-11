import Vue from 'vue'
import VueRouter from 'vue-router'
import test from './test'
import exception from './exception'
import home from './home'
import maps from './maps'
import recorder from './recorder'

Vue.use(VueRouter)

const routes = [
    ...home,
    ...maps,
    ...recorder,
    ...test,
    ...exception,
    { 
        path: "*",
        redirect: "/404",
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router