import Vue from 'vue'
import router from './router'
import './vantUse'
import axios from './utils/axios'
import Storage from 'vue-ls'
import config from './defaultSettings'

import App from './App.vue'


Vue.prototype.$axios = axios
Vue.use(Storage, config.storageOptions)
Vue.config.productionTip = false

router.afterEach((to) => {
    window.document.title = to.meta.title
})

new Vue({
    router,
  render: h => h(App),
}).$mount('#app')
