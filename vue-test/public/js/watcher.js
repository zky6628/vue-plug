class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm
        this.key = key 
        this.cb = cb
        // 把watcher这个对象记录到Dep这个类的静态属性target上
        Dep.target = this
        // 访问当前属性，触发get方法，get会调用addSub方法，把当前这个watcher添加到dep对象的subs中
        this.oldValue = vm[key]
        // 清空防止重复添加
        Dep.target = null
    }

    // 当数据变化时，更新视图
    update() {
        let newValue = this.vm[this.key]
        if (newValue === this.oldValue) {
            return
        }

        this.cb(newValue)
    }
}