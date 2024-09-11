<!--
 * 流向图
 * @module FlowChart
 * @author zhanghuan
 * @date 2021/01/12
-->
<template>
    <loading :loading="loading">
        <div class="tree-map-container">
            <tree-map ref="treeMap" :currentNode="currentNode"></tree-map>
        </div>
    </loading>
</template>

<script type="text/ecmascript-6">
    import { Loading } from '@/components/common'
    import maps from '../../urls/maps'
    import TreeMap from './modules/TreeMap'

    export default {
        name: "FlowChart",
        components: {
            Loading,
            TreeMap,
        },
        data() {
            return {
                loading: false,
                dataSource: {},
                currentNode: {},
            }
        },
        methods: {
            /**
             * 获取数据
             * @method getData
             * @for 
             * @param {} 
             * @return {} 
             */
            getData() {
                this.loading = true;
                this.$axios.get(maps.flowChart).then(res => {
                    this.loading = false;
                    const _dealData = (data, ind) => {
                        if (ind) {
                            data.id = data.pId + '-' + ind
                            data.level = data.pLevel + 1;
                        } else {
                            data.id = '1'
                            data.pId = null
                            data.level = 0;
                        }

                        if (data.children) {
                            data.children.forEach((item, i) => {
                                item.pId = data.id
                                item.pLevel = data.level
                                _dealData(item, i + 1)
                            })
                            data.childrenCopy = Object.assign([], data.children)
                        }

                        if (!data.expand && data.children) {
                            data.childrenCopy = data.children
                            delete data.children
                        }
                    }
                    if (res.code === 200) {
                        let contracts = res.data.data.contracts

                        if (contracts.length > 0) {
                            let children = res.data.children
                            if (contracts.length % 2 === 0) {
                                contracts.splice(contracts.length / 2, 0, {
                                    name: "合同编号",
                                    type: "contract",
                                    id: "_0",
                                    hide: true,
                                    data: {}
                                })
                                contracts[Math.floor(contracts.length / 2)].expand = true
                                contracts[Math.floor(contracts.length / 2)].children = children
                                res.data.children = contracts
                            } else {
                                contracts[Math.floor(contracts.length / 2)].expand = true
                                contracts[Math.floor(contracts.length / 2)].children = children
                                res.data.children = contracts
                            }
                        }
                        _dealData(res.data)
                        this.dataSource = res.data
                        this.$refs.treeMap.init(this.dataSource)
                    }
                })
            }
        },
        created() {
            this.getData()
        }
    }
</script>

<style scoped lang="less">
    .tree-map-container {
        width: 100%;
        height: calc(100vh - 228px);
    }
</style>