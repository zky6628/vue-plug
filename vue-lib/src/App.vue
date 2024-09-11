<!-- 
	author: zhanghuan
	created: 2020/4/30
	describe: 入口
 -->
<template>
    <a-config-provider :locale="locale">
        <div id="app">
            <router-view />
        </div>
    </a-config-provider>
</template>

<script>
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
    import enquireScreen from '@/utils/device'
    export default {
        data() {
            return {
                locale: zhCN
            }
        }
    }
</script>

<style lang="less">
    @import './style/var.less';
    @import './style/common.less';

    #app {
        width: 100%;
        height: 100%;
        overflow: auto;
        font-family: PingFangSC-Regular, "Source Han Sans CN", Avenir, Helvetica, Arial, sans-serif;
        font-size: 16px;
        color: rgb(51, 51, 51);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background: #f0f2f5;
    }
</style>