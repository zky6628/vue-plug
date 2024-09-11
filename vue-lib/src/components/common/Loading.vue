<!--
 * 加载层
 * @module loading
 * @author zhanghuan
 * @date 2021/01/07
-->
<template>
    <a-spin tip="别急，小老弟..." :spinning="loading">
        <slot />
    </a-spin>
</template>

<script type="text/ecmascript-6">
    export default {
        name: "Loading",
        props: {
            loading: {
                required: true,
                type: Boolean,
                default: false,
            }
        }
    }
</script>

<style scoped lang="less">

</style>