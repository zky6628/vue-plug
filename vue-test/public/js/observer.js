class Observer {
    constructor(data) {
        this.walk(data)
    }

    // 遍历所有属性
    walk(data) {
        if (!data || typeof data !== 'object') return

        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    // 把所有属性转为getter和setter
    defineReactive(obj, key, val) {
        const that = this
        // 收集依赖，发送通知
        let dep = new Dep()
        this.walk(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 收集依赖,target在watcher中添加
                Dep.target && dep.addSub(Dep.target)
                return val
            },
            set(newVal) {
                if (newVal === val) return
                val = newVal
                that.walk(newVal)
                // 触发通知
                dep.notify()
            }
        })
    }
}