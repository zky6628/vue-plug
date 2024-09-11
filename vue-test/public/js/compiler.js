class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }

    // 编译模板，处理元素节点和文本节点
    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            // 处理文本节点
            if (this.isTextNode(node)) {
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                // 处理元素节点
                this.compileElement(node)
            }

            // 判断 node 是否有子节点，如果有要递归调用compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    // 编译元素节点，处理指令
    compileElement(node) {
        // 遍历所有属性，判断是否是指令
        Array.from(node.attributes).forEach(attr => {
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                attrName = attrName.substr(2)
                let key = attr.value
                this.update(node, key, attrName)
            }
        })
    }

    update(node, key, attrName) {
        let updateFn = null
        if (attrName.startsWith('on:')) {
            this.onUpdater(node, this.vm[key], key, attrName.replace('on:', ''))
        } else {
            updateFn = this[attrName + 'Updater']
        }
        
        updateFn && updateFn.call(this, node, this.vm[key], key)
    }

    // v-on
    onUpdater(node, value, key, evnt) {
        let fn = this.vm[key]
        if (fn === undefined) {
            console.error(key + ' is not defined!')
            return
        } 
        if (typeof fn !== 'function') {
            console.error(key + ' is not a function')
            return
        }

        node.addEventListener(evnt, (node) => {
            fn(node)
        })
    }

    // v-html
    htmlUpdater(node, value, key) {
        node.innerHTML = value
        // 创建一个watcher当数据更新时，更新dom
        new Watcher(this.vm, key, (newValue) => {
            node.innerHTML = newValue
        })
    }

    // v-model
    modelUpdater(node, value, key) {
        node.value = value
        // 创建一个watcher当数据更新时，更新dom
        new Watcher(this.vm, key, (newValue) => {
            node.value = newValue
        })
        // 视图更新时，更新数据
        node.addEventListener('input', () => {
            this.vm[key] = node.value
        })
    }

    // v-text
    textUpdater(node, value, key) {
        node.textContent = value
        // 创建一个watcher当数据更新时，更新dom
        new Watcher(this.vm, key, (newValue) => {
            node.textContent = newValue
        })
    }


    // 编译文本节点，处理插值表达式
    compileText(node) {
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            let key = RegExp.$1.trim()
            node.textContent = value.replace(reg, this.vm[key])

            // 创建一个watcher当数据更新时，更新dom
            new Watcher(this.vm, key, (newValue) => {
                node.textContent = newValue
            })
        }
    }

    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }

    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }

    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}