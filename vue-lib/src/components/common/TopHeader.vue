<!--
 * 最上方头部
 * @module TopHeader
 * @author zhanghuan
 * @date 2021/01/06
-->
<template>
    <a-layout-header class="top-header">
        <div class="logo">
            <a-icon type="twitter" class="logo-icon" />
            <span>综合平台</span>
        </div>

        <a-menu theme="dark" mode="horizontal" :default-selected-keys="defaultSelectedKeys" class="top-menu" @select="menuSelect">
            <template v-for="item in menu">
                <a-sub-menu v-if="item.children && item.children.length > 0" :key="item.name">
                    <span slot="title">{{item.title}}</span>
                    <a-menu-item v-for="ite in item.children" :key="ite.name">{{ite.title}}</a-menu-item>
                </a-sub-menu>
                <a-menu-item v-else :key="item.name">{{item.title}}</a-menu-item>
            </template>
        </a-menu>
    </a-layout-header>
</template>

<script type="text/ecmascript-6">
    export default {
        name: "TopHeader",
        props: {
            menu: {
                required: true,
                type: Array,
                default: function() {
                    return []
                }
            }
        },
        data() {
            return {
                defaultSelectedKeys: ['home']
            }
        },
        methods: {
            /**
             * 菜单选择后触发方法
             * @method menuSelect
             * @param {object} item 当前菜单对象
             * @return {void} 
             */
            menuSelect(item) {
                this.$router.push({name: item.key})
            },
            /**
             * 获取当前菜单名
             * @method getMenuName
             * @param {void}
             * @return {void} 
             */
            getMenuName() {
                this.defaultSelectedKeys = [this.$route.name]
            },
        },
        created() {
            this.getMenuName()
        }
    }
</script>

<style scoped lang="less">
    .top-header {
        display: flex;
        color: #fff;

        .logo {
            font-size: 24px;
            margin-right: 20px;

            .logo-icon {
                font-size: 30px;
                margin-right: 10px;
            }
        }

        .top-menu {
            line-height: 64px;
        }
    }
</style>