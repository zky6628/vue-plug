<!--
 * 测试
 * @module test
 * @author zhanghuan
 * @date 2021/01/30
-->
<template>
    <div>
        测试分支
        <van-cell title="显示分享面板" @click="showShare = true">
            <template #right-icon>
                <van-icon name="arrow" />
            </template>
        </van-cell>
        <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    </div>
</template>

<script>
    import { Toast } from 'vant'
    import api from '@/api/test'

    export default {
        name: "test",
        data() {
            return {
                showShare: false,
                options: [
                    { name: '微信', icon: 'wechat' },
                    { name: '微博', icon: 'weibo' },
                    { name: '复制链接', icon: 'link' },
                    { name: '分享海报', icon: 'poster' },
                    { name: '二维码', icon: 'qrcode' },
                ],
            }
        },
        methods: {
            getData() {
                // 服务器接口
                this.$axios.get(api.getData, { params: { type: 'move', ak: 'kgD2HiDnLdUhwzd3CLuG5AWNfX3fhLYe', adminType: 'country', name: '中国' } }).then(res => {
                    console.log(res)
                })
                // 假数据接口
                this.$axios.get(api.menu).then(res => {
                    console.log(res)
                    return res
                }).then(val => {
                    console.log('v', val)
                })
            },
            onSelect(option) {
                Toast(option.name);
                this.showShare = false;
            },
        },
        mounted() {
            this.getData()
        }
    }
</script>

<style scoped lang="less">

</style>