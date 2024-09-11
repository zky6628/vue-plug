<!-- 
	author: zhanghuan
	created: 2020/3/31
	describe: 测试例子
 -->
<template>
    <div class="test-parent">
        <test-child msg="这是测试例子" />
        <a-card title="全国迁徙城市热门" style="width: 800px; margin: 0 auto;">
            <a-tabs defaultActiveKey="1">
                <a-tab-pane tab="热门迁入地" key="1">
                    <a-table :columns="columns" :dataSource="moveInList" :pagination="false" rowKey="city_code">
                        <span slot="city_code" slot-scope="text, record, index">{{index + 1}}</span>
                        <div slot="city_name" slot-scope="text, record"><strong>{{text}}</strong><span>（{{record.province_name}}）</span></div>
                        <div slot="value" slot-scope="text"><strong>{{text}}%</strong></div>
                    </a-table>
                </a-tab-pane>
                <a-tab-pane tab="热门迁出地" key="2">
                    <a-table :columns="columnsOut" :dataSource="moveOutList" :pagination="false" rowKey="city_code">
                        <span slot="city_code" slot-scope="text, record, index">{{index + 1}}</span>
                        <div slot="city_name" slot-scope="text, record"><strong>{{text}}</strong><span>（{{record.province_name}}）</span></div>
                        <div slot="value" slot-scope="text"><strong>{{text}}%</strong></div>
                    </a-table>
                </a-tab-pane>
            </a-tabs>
        </a-card>
    </div>
</template>

<script>
    // @ is an alias to /src
    import TestChild from '@/components/test/Test.vue'
    import urls from '@/urls/test'

    export default {
        name: 'Test',
        components: {
            TestChild
        },
        data() {
            return {
                moveInList: [],
                moveOutList: [],
                columns: [{
                        title: '排名',
                        dataIndex: 'city_code',
                        scopedSlots: { customRender: 'city_code' },
                    },
                    {
                        title: '城市名称',
                        dataIndex: 'city_name',
                        scopedSlots: { customRender: 'city_name' },
                    },
                    {
                        title: '迁入比例',
                        dataIndex: 'value',
                        scopedSlots: { customRender: 'value' },
                    },
                ],
                columnsOut: [{
                        title: '排名',
                        dataIndex: 'city_code',
                        scopedSlots: { customRender: 'city_code' },
                    },
                    {
                        title: '城市名称',
                        dataIndex: 'city_name',
                        scopedSlots: { customRender: 'city_name' },
                    },
                    {
                        title: '迁出比例',
                        dataIndex: 'value',
                        scopedSlots: { customRender: 'value' },
                    },
                ]
            }
        },
        mounted() {
            this.getData()
        },
        methods: {
            /* 
            func: 提交表单
            params: 无
            return: 无
            */
            getData() {
                this.$axios.get(urls.getData, { params: { type: 'move', ak: 'kgD2HiDnLdUhwzd3CLuG5AWNfX3fhLYe', adminType: 'country', name: '中国' } }).then(res => {
                    if (res.status === 0) {
                        this.moveInList = res.result.moveInList;
                        this.moveOutList = res.result.moveOutList;
                    }
                })
            }
        }
    }
</script>