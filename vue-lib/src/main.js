/**
 * author: zhanghuan
 * created: 2020/4/27
 * describe: 入口文件
 */
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/axios'
import Storage from 'vue-ls'
import echarts from 'echarts'
import config from './defaultSettings'
import './antdImport'
import { Loading } from './components/common'

Vue.prototype.$axios = axios
Vue.use(Storage, config.storageOptions)
window.echarts = echarts

Vue.config.productionTip = false
// 把常用的组件全局注入
Vue.component('loading', Loading)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')