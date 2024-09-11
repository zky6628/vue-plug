/**
 * 手写一级vue-router
 * @module vue-router
 * @author zhanghuan
 * @date 2021/03/13
 * @description 
 * 1. VueRouter 是一个类型 
 * 2. VueRouter 有一个静态方法 install
 * 3. VueRouter 具有以下属性 mode（hash|history） options（路由配置）、data（存放当前路由，更新时要去更新组件）、routeMap（动态解析出来的路由配置）
 */
// 用于存下Vue
let _Vue = null

export default class VueRouter {

    static install(Vue) {
        // 1.判断当前插件是否已经安装
        // 如果 VueRouter 已经安装就不在安装
        if (VueRouter.install.installed) return

        VueRouter.install.installed = true
        // 2.把Vue构造函数记录到全局
        _Vue = Vue

        // 3.把创建 Vue 实例传入的 router 对象注入到 Vue 实例上
        // 通过混入才能拿到 Vue 实例对象的 this
        _Vue.mixin({
            beforeCreate() {
                // this.$options.router 只有创建的 Vue 实例才有，Vue 组件是没有的
                /* new Vue({
                    router, // 在这里传入的 router 会放到 this.$options 里
                    render: h => h(App),
                }).$mount('#app') */
                if (this.$options.router) {
                    _Vue.prototype.$router = this.$options.router
                    this.$options.router.init()
                }
            }
        })
    }

    constructor(options) {
        this.mode = options.mode || 'hash'
        this.options = options
        this.routeMap = {}
        // Vue.observable 可以创建一个响应是对象
        this.data = _Vue.observable({ current: '/' })
    }

    init() {
        this.initRouteMap()
        this.initComponents(_Vue)
        this.initEvents()
    }

    /**
     * 根据 options 组装 routeMap (键值对形式)
     */
    initRouteMap() {
        this.options.routes.forEach(route => {
            this.routeMap[route.path] = route.component
        })
    }

    /**
     * 创建组件 router-link 、 router-view
     */
    initComponents(Vue) {
        const self = this

        Vue.component('router-link', {
            props: {
                to: String,
            },
            render(h) {
                return h('a', {
                    attrs: {
                        href: self.mode === 'hash' ? '#' + this.to : this.to
                    },
                    on: {
                        click: this.clickHandler
                    }
                }, [this.$slots.default])
            },
            methods: {
                clickHandler(e) {
                    if (self.mode === 'hash') {
                        if (history.pushState) {
                            history.pushState({}, '', '#' + this.to)
                        } else {
                            window.location.hash = '#' + this.to
                        }
                    } else {
                        history.pushState({}, '', this.to)
                    }
                    // this.$router.data.current = this.to
                    self.data.current = this.to
                    e.preventDefault()
                }
            }
        })

        Vue.component('router-view', {
            render(h) {
                const component = self.routeMap[self.data.current]
                return h(component)
            }
        })
    }

    /**
     * 初始化事件
     */
    initEvents() {
        if (this.mode === 'hash') {
            window.addEventListener('hashchange', () => {
                this.data.current = window.location.hash ? window.location.hash.replace('#', '') : '/'
            })
        } else {
            window.addEventListener('popstate', () => {
                this.data.current = window.location.pathname
            })
        }
    }
}