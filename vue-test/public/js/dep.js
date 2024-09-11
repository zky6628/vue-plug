class Dep {
    constructor() {
        // 存储所有观查者
        this.subs =[]
    }

    // 添加观查者
    addSub(sub) {
        // 约定所有的观查都都有update方法
        if (sub && sub.update) {
            this.subs.push(sub)
        }
    }

    // 发送通知
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}