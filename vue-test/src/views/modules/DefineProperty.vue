<!--
 * 尝试响应式
 * @module defineProperty
 * @author zhanghuan
 * @date 2021/03/14
-->
<template>
    <div>
        <h1>defineProperty</h1>
        
        <h2 id="define-property"></h2>
        <input placeholder="请输入" @keyup="valChange" />
        <input placeholder="请输入" @keyup="numChange" />
    </div>
</template>

<script>
let data = {
    msg: "",
    num: 0,
};

let vm = {};

export default {
    data() {
        return {};
    },
    methods: {
        doDefineProperty(data) {
            Object.keys(data).forEach((key) => {
                // 数据劫持
                Object.defineProperty(vm, key, {
                    // 可枚举，可遍历
                    enumerable: true,
                    // 可配置（可以用delete删除，可以用defineProperty重新定义）
                    configurable: true,
                    get() {
                        return data[key];
                    },
                    set(val) {
                        if (val === data[key]) return;

                        data[key] = val;
                        document.querySelector(
                            "#define-property"
                        ).innerHTML = val;
                    },
                });
            });
        },
        valChange(e) {
            vm.msg = e.target.value;
        },
        numChange(e) {
            vm.num = e.target.value;
        },
    },
    mounted() {
        this.doDefineProperty(data);
    },
};
</script>

<style scoped lang="less">
</style>
