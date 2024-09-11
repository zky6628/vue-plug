<!--
 * 首页入口
 * @module home
 * @author zhanghuan
 * @date 2021/01/05
-->
<template>
    <div class="index">
        <a-row :gutter="16">
            <a-col :span="8">
                <a-card title="全景图" :bordered="false">
                    <router-link slot="extra" to="/maps/index">查看</router-link>
                    <img class="title-img" alt="全景图" :src="allImg" />
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card title="资金流向图" :bordered="false">
                    <router-link slot="extra" to="/maps/flowChart">查看</router-link>
                    <img class="title-img" alt="资金流向图" :src="flow" />
                </a-card>
            </a-col>
            <a-col :span="8">
                <a-card title="Card title" :bordered="false">
                    <p>card content</p>
                </a-card>
            </a-col>
        </a-row>
    </div>
</template>

<script type="text/ecmascript-6">
    import AllImg from '../../assets/home/all-img.png'
    import flow from '../../assets/home/flow.jpg'

    export default {
        name: "Index",
        data() {
            return {
                allImg: AllImg,
                flow,
            }
        },
        methods: {

        },
        created() {
            
        }
    }
</script>

<style scoped lang="less">
.index {
    .title-img {
        width: 100%;
    }
}
</style>