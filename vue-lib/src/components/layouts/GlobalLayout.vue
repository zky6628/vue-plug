<!--
 * 全局布局
 * @module GlobalLayout
 * @author zhanghuan
 * @date 2021/01/05
-->
<template>
    <a-layout class="global-layout">
        <top-header :menu="menu" />
        <a-layout-content>
            <a-breadcrumb class="zh-breadcrumb">
                <a-breadcrumb-item href="/">
                    <a-icon type="home" />
                </a-breadcrumb-item>
                <a-breadcrumb-item v-for="(item, i) in breadcrumb" :key="i">{{item}}</a-breadcrumb-item>
            </a-breadcrumb>
            <div class="global-content">
                <router-view />
            </div>
        </a-layout-content>
        <a-layout-footer class="global-footer">
            个人娱乐 ©2021 Created by zh
        </a-layout-footer>
    </a-layout>
</template>

<script type="text/ecmascript-6">
    import home from '../../urls/home';
    import { TopHeader } from '@/components/common';
    import Loading from '../common/Loading.vue';
    export default {
        name: "global-layout",
        components: {
            TopHeader
        },
        data() {
            return {
                menu: [],
                breadcrumb: []
            }
        },
        methods: {
            /**
             * 获取菜单
             * @method getMenu
             * @param {void} 
             * @return {void} 
             */
            getMenu() {
                this.$axios.get(home.menu).then(res => {
                    if (res.code === 200) {
                        this.menu = res.data;
                    }
                });
            },
            /**
             * 获取面包屑
             * @method getBreadcrumb
             * @param {void} 
             * @return {void} 
             */
            getBreadcrumb() {
                this.breadcrumb = this.$route.meta.breadcrumb;
            }
        },
        created() {
            this.getMenu();
            this.getBreadcrumb();
        },
        watch: {
            '$route': function(route) {
                this.breadcrumb = route.meta.breadcrumb;
            }
        }
    }
</script>

<style scoped lang="less">
    .global-layout {
        background: none;

        .zh-breadcrumb {
            padding: 10px 24px;
            background: #fff;
        }

        .global-content {
            min-height: calc(100vh - 180px);
            padding: 24px;
        }

        .global-footer {
            text-align: center;
            background: #fff;
        }
    }
</style>