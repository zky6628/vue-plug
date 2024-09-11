<!--
 * 尝试响应式
 * @module Proxy
 * @author zhanghuan
 * @date 2021/03/14
-->
<template>
    <div>
        <h1>Proxy</h1>
        <h2 id="proxy"></h2>
        <input placeholder="请输入" @keyup="valChange" />
        <input placeholder="请输入" @keyup="numChange" />
    </div>
</template>

<script>
let data = {
    msg: '',
    num: 0,
}
// Proxy 会监控所有的属性
let vm = new Proxy(data, {
    get(target, key) {
        return target[key]
    },
    set(target, key, newVal) {
        if (newVal === target[key]) return true

        target[key] = newVal
        document.querySelector('#proxy').innerHTML = newVal
        return true // 返回boolean是必须的
    }
})

export default {
    data() {
        return {

        }
    },
    methods: {
        valChange(e) {
            vm.msg = e.target.value;
        },
        numChange(e) {
            vm.num = e.target.value;
        },
    },
}
</script>

<style scoped lang="less">

</style>
