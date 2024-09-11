/**
 * 自己写一个vue
 * @module vue
 * @author zhanghuan
 * @date 2021/03/14
 */

class Vue {
    constructor(options) {
        // 1.通过属性保存传入的属性
        this.$options = options || {}
        this.$data = this.$options.data || {}
        this.$el = typeof this.$options.el === 'string' ? document.querySelector(this.$options.el) : this.$options.el
        // 2.把 $data 中的成员转换成getter和setter注入到vue实例中
        this._proxyData(this.$data)
        // 3.调用Observer,监听数据变化
        new Observer(this.$data)
        // 4.初始化方法
        this._init()
        // 5.调用Compiler,处理指令和表达式
        new Compiler(this)
    }

    _proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return data[key]
                },
                set(newVal) {
                    if (newVal === data[key]) return

                    data[key] = newVal
                }
            })
        })
    }

    _init() {
        let methods = this.$options.methods
        if (!methods) {
            return
        }

        for (let method in methods) {
            this[method] = methods[method]
        }
    }
}