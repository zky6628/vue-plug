<!--
 * @file d3 流程图
 * 
 * @date 2022/06/08
-->
<template>
    <div
        class="flow-chart"
        @wheel.prevent="mouseWheel"
        @mousedown="mousedown"
        @mouseup="mouseup"
        @mouseout="mouseout"
        @mousemove="mousemove"
    >
        <svg width="100%" height="100%">
            <g
                class="its-flow-chart"
                :transform="`translate(${tranInfo.x},${tranInfo.y}),scale(${tranInfo.k})`"
            >
                <g>
                    <template v-for="(link, i) in links">
                        <!-- tips: 此处属性有英文减号连接，否则箭头不显示 -->
                        <path
                            v-if="
                                [
                                    'give',
                                    'contract',
                                    'borrower',
                                    'year',
                                ].indexOf(link.target.data.type) > -1
                            "
                            :key="i"
                            :d="
                                bezierCurveGenerator({
                                    source: {
                                        x: link.source.x,
                                        y:
                                            link.source.y +
                                            (startBufs[link.target.data.type] ||
                                                startBuf),
                                    },
                                    target: {
                                        x: link.target.x,
                                        y: link.target.y + endBuf,
                                    },
                                })
                            "
                            fill="none"
                            :stroke="
                                lineColor[link.target.data.type] ||
                                theme.lineStroke
                            "
                            stroke-width="2"
                            :marker-end="
                                lineColor[link.target.data.type]
                                    ? `url(#arrow-${link.target.data.type})`
                                    : 'url(#arrow)'
                            "
                        />

                        <path
                            v-else-if="link.target.data.type === 'company'"
                            :key="i"
                            :d="
                                bezierCurveGenerator({
                                    source: {
                                        x: link.source.x,
                                        y:
                                            link.source.y +
                                            (link.source.data.type === 'company'
                                                ? 220
                                                : startBufs[
                                                      link.target.data.type
                                                  ] || startBuf),
                                    },
                                    target: {
                                        x: link.target.x,
                                        y: link.target.y + endBuf,
                                    },
                                })
                            "
                            fill="none"
                            :stroke="
                                link.target.data.data.flow === 'outer'
                                    ? '#FA6400'
                                    : theme.lineStroke
                            "
                            stroke-width="1"
                        />

                        <path
                            v-else
                            :key="i"
                            :d="
                                bezierCurveGenerator({
                                    source: {
                                        x: link.source.x,
                                        y:
                                            link.source.y +
                                            (startBufs[link.target.data.type] ||
                                                startBuf),
                                    },
                                    target: {
                                        x: link.target.x,
                                        y: link.target.y + endBuf,
                                    },
                                })
                            "
                            fill="none"
                            :stroke="
                                lineColor[link.target.data.type] ||
                                theme.lineStroke
                            "
                            stroke-width="2"
                        />
                    </template>
                </g>
                <g>
                    <template v-for="(node, i) in nodes">
                        <g
                            :key="i"
                            :transform="
                                direction === 'vertical'
                                    ? `translate(${node.x - 10}, ${node.y})`
                                    : `translate(${node.y}, ${node.x - 10})`
                            "
                        >
                            <!-- 根节点 -->
                            <template v-if="node.data.type === 'root'">
                                <rect
                                    x="0"
                                    y="-100"
                                    rx="10"
                                    ry="10"
                                    width="180"
                                    height="200"
                                    :style="`fill:${theme.lineStroke}; stroke:${theme.lineStroke};`"
                                />
                                <image x="55" y="-80" :href="root" />
                                <foreignObject y="-10" width="180" height="110">
                                    <body
                                        class="root-body"
                                        xmlns="http://www.w3.org/1999/xhtml"
                                    >
                                        <p class="root-name">
                                            {{ node.data.name }}
                                        </p>
                                        <a-tooltip placement="topLeft">
                                            <template slot="title">
                                                <span
                                                    >项目编号：{{
                                                        node.data.data.projectNO
                                                    }}</span
                                                >
                                            </template>
                                            <p class="root-project-no etc">
                                                项目编号：{{
                                                    node.data.data.projectNO
                                                }}
                                            </p>
                                        </a-tooltip>
                                    </body>
                                </foreignObject>
                                <g
                                    v-if="!node.data.isLeaf"
                                    transform="translate(182, 0)"
                                >
                                    <template v-if="node.active">
                                        <image
                                            v-if="node.data.expand"
                                            :href="desActive"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="addActive"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                    <template v-else>
                                        <image
                                            v-if="node.data.expand"
                                            :href="des"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="add"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                </g>
                            </template>
                            <!-- 合同 -->
                            <template v-if="node.data.type === 'contract'">
                                <rect
                                    x="0"
                                    y="-22"
                                    rx="10"
                                    ry="10"
                                    width="200"
                                    height="65"
                                    style="fill: transparent; stroke: #12810a"
                                    stroke-width="2"
                                />
                                <image x="8" y="-16" :href="file" />
                                <foreignObject y="-22" width="200" height="65">
                                    <body
                                        class="contract-body"
                                        xmlns="http://www.w3.org/1999/xhtml"
                                    >
                                        <p class="contract-name">
                                            {{ node.data.name }}
                                        </p>
                                        <a-tooltip
                                            v-if="node.data.data.overdue"
                                            placement="topLeft"
                                        >
                                            <template slot="title">
                                                <p>
                                                    <span>日期：</span>
                                                    <span>{{
                                                        node.data.data.overdue
                                                            .date
                                                    }}</span>
                                                </p>
                                                <p>
                                                    <span>逾期金额：</span>
                                                    <span>{{
                                                        node.data.data.overdue
                                                            .currency
                                                    }}</span>
                                                </p>
                                                <p>
                                                    <span>逾期本金：</span>
                                                    <span>{{
                                                        node.data.data.overdue
                                                            .principal
                                                    }}</span>
                                                </p>
                                                <p>
                                                    <span>逾期利息：</span>
                                                    <span>{{
                                                        node.data.data.overdue
                                                            .interest
                                                    }}</span>
                                                </p>
                                            </template>
                                            <a-icon
                                                class="
                                                    icon
                                                    icon-over
                                                    icon-node-over
                                                "
                                                type="exclamation-circle"
                                            />
                                        </a-tooltip>
                                        <a-tooltip placement="topLeft">
                                            <template slot="title">
                                                <span>{{
                                                    node.data.data.contractNO
                                                }}</span>
                                            </template>
                                            <p class="contract-contract-no etc">
                                                {{ node.data.data.contractNO }}
                                            </p>
                                        </a-tooltip>
                                    </body>
                                </foreignObject>
                            </template>
                            <!-- 资金发放 -->
                            <template v-else-if="node.data.type === 'give'">
                                <rect
                                    x="0"
                                    y="-90"
                                    rx="10"
                                    ry="10"
                                    width="190"
                                    height="186"
                                    :style="`fill: transparent;stroke:#945A89;stroke-width: 2px;`"
                                />

                                <foreignObject
                                    x="0"
                                    y="-90"
                                    width="190"
                                    height="186"
                                >
                                    <body
                                        class="give-body"
                                        xmlns="http://www.w3.org/1999/xhtml"
                                    >
                                        <p class="give-name">
                                            <span>{{ node.data.name }}</span>
                                        </p>
                                        <p class="give-txt">
                                            {{ node.data.data.giveType }}
                                        </p>
                                        <a-tooltip
                                            v-for="(p, j) in node.data.data
                                                .numbers"
                                            :key="j"
                                            placement="topLeft"
                                        >
                                            <template slot="title">
                                                <span>{{ p }}</span>
                                            </template>
                                            <p class="give-txt etc">{{ p }}</p>
                                        </a-tooltip>
                                    </body>
                                </foreignObject>
                            </template>
                            <!-- 借款人 -->
                            <template v-else-if="node.data.type === 'borrower'">
                                <circle
                                    cx="90"
                                    cy="0"
                                    r="90"
                                    :fill="theme.lineStroke"
                                    :stroke="theme.lineStroke"
                                    stroke-width="1"
                                />

                                <foreignObject
                                    x="0"
                                    y="-90"
                                    width="180"
                                    height="260"
                                >
                                    <body
                                        class="borrower-body"
                                        xmlns="http://www.w3.org/1999/xhtml"
                                    >
                                        <p class="borrower-type">
                                            {{ node.data.name }}
                                        </p>
                                        <p class="borrower-name">
                                            <span>{{
                                                node.data.data.borrower
                                            }}</span>
                                        </p>
                                        <div class="borrower-txt">
                                            <p>{{ node.data.data.giveType }}</p>
                                            <p
                                                v-for="(p, j) in node.data.data
                                                    .numbers"
                                                :key="j"
                                            >
                                                {{ p }}
                                            </p>
                                        </div>
                                    </body>
                                </foreignObject>
                                <g
                                    v-if="!node.data.isLeaf"
                                    transform="translate(182, 0)"
                                >
                                    <template v-if="node.active">
                                        <image
                                            v-if="node.data.expand"
                                            :href="desActive"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="addActive"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                    <template v-else>
                                        <image
                                            v-if="node.data.expand"
                                            :href="des"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="add"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                </g>
                            </template>
                            <!-- 年 -->
                            <template v-else-if="node.data.type === 'year'">
                                <rect
                                    x="0"
                                    y="-10"
                                    rx="5"
                                    ry="5"
                                    width="94"
                                    height="40"
                                    :style="`fill: transparent;stroke:${theme.lineStroke};stroke-width: 2px;`"
                                />
                                <image x="6" y="-2" :href="time" />
                                <text x="32" y="16">{{ node.data.name }}</text>
                                <g
                                    v-if="!node.data.isLeaf"
                                    transform="translate(96, 0)"
                                >
                                    <template v-if="node.active">
                                        <image
                                            v-if="node.data.expand"
                                            :href="desActive"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="addActive"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                    <template v-else>
                                        <image
                                            v-if="node.data.expand"
                                            :href="des"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="add"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                </g>
                            </template>
                            <!-- 季度 -->
                            <template v-else-if="node.data.type === 'quarter'">
                                <path
                                    :d="`M-15,10 L94,10`"
                                    fill="none"
                                    :stroke="theme.lineStroke"
                                    stroke-width="2"
                                />
                                <image x="6" y="-22" :href="time" />
                                <text x="32" y="-4">{{ node.data.name }}</text>
                                <g
                                    v-if="!node.data.isLeaf"
                                    transform="translate(96, 0)"
                                >
                                    <template v-if="node.active">
                                        <image
                                            v-if="node.data.expand"
                                            :href="desActive"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="addActive"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                    <template v-else>
                                        <image
                                            v-if="node.data.expand"
                                            :href="des"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="add"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                </g>
                            </template>
                            <!-- 支付类型 -->
                            <template v-else-if="node.data.type === 'giveType'">
                                <path
                                    :d="`M-15,10 L96,10`"
                                    fill="none"
                                    :stroke="theme.lineStroke"
                                    stroke-width="2"
                                />
                                <image x="6" y="-22" :href="giveType" />
                                <text x="32" y="-4">{{ node.data.name }}</text>
                                <g
                                    v-if="!node.data.isLeaf"
                                    transform="translate(98, 0)"
                                >
                                    <template v-if="node.active">
                                        <image
                                            v-if="node.data.expand"
                                            :href="desActive"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="addActive"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                    <template v-else>
                                        <image
                                            v-if="node.data.expand"
                                            :href="des"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="add"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                </g>
                            </template>
                            <!-- 关联关系 -->
                            <template
                                v-else-if="node.data.type === 'relationship'"
                            >
                                <path
                                    :d="`M-15,10 L114,10`"
                                    fill="none"
                                    :stroke="theme.lineStroke"
                                    stroke-width="2"
                                />
                                <image x="6" y="-22" :href="giveType" />
                                <text x="32" y="-4">{{ node.data.name }}</text>
                                <g
                                    v-if="!node.data.isLeaf"
                                    transform="translate(116, 0)"
                                >
                                    <template v-if="node.active">
                                        <image
                                            v-if="node.data.expand"
                                            :href="desActive"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="addActive"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                    <template v-else>
                                        <image
                                            v-if="node.data.expand"
                                            :href="des"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="add"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                </g>
                            </template>
                            <!-- 公司 -->
                            <template v-else-if="node.data.type === 'company'">
                                <path
                                    :d="`M-15,10 L200,10`"
                                    fill="none"
                                    :stroke="
                                        node.data.data.flow === 'outer'
                                            ? '#FA6400'
                                            : theme.lineStroke
                                    "
                                    stroke-width="1"
                                />
                                <foreignObject
                                    x="-15"
                                    y="-22"
                                    width="215"
                                    height="24"
                                >
                                    <body
                                        class="company-body"
                                        xmlns="http://www.w3.org/1999/xhtml"
                                    >
                                        <a-tooltip placement="topLeft">
                                            <template slot="title">
                                                <span>{{
                                                    node.data.name
                                                }}</span>
                                            </template>
                                            <p class="company-name etc">
                                                {{ node.data.name }}
                                            </p>
                                        </a-tooltip>
                                    </body>
                                </foreignObject>
                                <g
                                    v-if="!node.data.isLeaf"
                                    transform="translate(202, 0)"
                                >
                                    <template v-if="node.active">
                                        <image
                                            v-if="node.data.expand"
                                            :href="desActive"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="addActive"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                    <template v-else>
                                        <image
                                            v-if="node.data.expand"
                                            :href="des"
                                            @click="openOrClose(false, node)"
                                        />
                                        <image
                                            v-else
                                            :href="add"
                                            @click="openOrClose(true, node)"
                                        />
                                    </template>
                                </g>
                            </template>
                        </g>
                    </template>
                </g>

                <!-- 定义箭头 -->
                <defs>
                    <marker
                        id="arrow"
                        markerUnits="strokeWidth"
                        :markerWidth="MARKER.MARKERWIDTH"
                        :markerHeight="MARKER.MARKERHIEGHT"
                        :viewBox="MARKER.VIEWBOX"
                        :refX="MARKER.REFX"
                        :refY="MARKER.REFY"
                        :orient="MARKER.ORIENT"
                    >
                        <path :d="MARKER.PATH" :fill="MARKER.FILL" />
                    </marker>
                </defs>
                <defs>
                    <marker
                        id="arrow-give"
                        markerUnits="strokeWidth"
                        :markerWidth="MARKER.MARKERWIDTH"
                        :markerHeight="MARKER.MARKERHIEGHT"
                        :viewBox="MARKER.VIEWBOX"
                        :refX="MARKER.REFX"
                        :refY="MARKER.REFY"
                        :orient="MARKER.ORIENT"
                    >
                        <path :d="MARKER.PATH" :fill="lineColor.give" />
                    </marker>
                </defs>
                <defs>
                    <marker
                        id="arrow-contract"
                        markerUnits="strokeWidth"
                        :markerWidth="MARKER.MARKERWIDTH"
                        :markerHeight="MARKER.MARKERHIEGHT"
                        :viewBox="MARKER.VIEWBOX"
                        :refX="MARKER.REFX"
                        :refY="MARKER.REFY"
                        :orient="MARKER.ORIENT"
                    >
                        <path :d="MARKER.PATH" :fill="lineColor.contract" />
                    </marker>
                </defs>
            </g>
        </svg>
    </div>
</template>

<script type="text/ecmascript-6">
import * as d3 from 'd3';
import root from '@/assets/maps/root.svg';
import des from '@/assets/maps/des.svg';
import desActive from '@/assets/maps/des-active.svg';
import time from '@/assets/maps/time.svg';
import giveType from '@/assets/maps/give-type.svg';
import add from '@/assets/maps/add.svg';
import addActive from '@/assets/maps/add-active.svg';
import file from '@/assets/maps/file.svg';

export default {
    name: 'DFlowChart',
    props: {
        direction: {
            type: String,
            default: 'horizontal',
        },
        startBuf: {
            type: Number,
            default: 35,
        },
        endBuf: {
            type: Number,
            default: -15,
        },
    },
    data() {
        return {
            tree: null,
            nodes: [], // tree nodes
            links: [], // tree path
            tranInfo: {
                // 移动信息
                k: 1, // scale param
                x: 30, // translate x
                y: 30, // translate y
            },
            dataSource: {},
            MARKER: {
                MARKERHIEGHT: '14',
                MARKERWIDTH: '14',
                VIEWBOX: '0 0 12 12',
                ORIENT: 'auto',
                PATH: 'M2,2 L10,6 L2,10 L4,6 L2,2',
                FILL: '#0980E9',
                REFX: '5',
                REFY: '6',
            },
            theme: {
                lineStroke: '#0980E9',
            },
            lineColor: {
                give: '#945A89',
                contract: '#12810A',
            },
            startBufs: {
                contract: 200,
                give: 200,
                borrower: 190,
                year: 200,
                quarter: 114,
                giveType: 114,
                relationship: 116,
                company: 134,
            },
            root: root,
            des: des,
            desActive: desActive,
            time: time,
            giveType: giveType,
            add: add,
            addActive: addActive,
            file: file,
            moveAble: false, // 是否可以移动
            eX: 0,
            eY: 0,
            currentNode: {},
        };
    },
    methods: {
        /**
         * 初始化树的节点，获取连接线links、节点nodes
         * @method initTreeNodes
         * @for
         * @param {any} nextProps 下一次props数据
         * @return {any} {nodes: array, links: array}
         */
        initTreeNodes(nextProps) {
            const { currentNode, dataSource } = nextProps;
            let nodes = [];
            let links = [];
            let giveNode = {};
            let midContractNode = {};
            let minContractInd = 0;

            if (dataSource) {
                // create data of tree structure
                const hierarchyData = d3.hierarchy(dataSource);
                // hierarchy layout and add node.x,node.y
                const treeNode = this.tree(hierarchyData);
                nodes = treeNode.descendants();
                links = treeNode.links();

                // 如果指定当前结点，激活当前节点
                if (currentNode) {
                    nodes = nodes.map((node) => {
                        if (node.active) {
                            node.active = false;
                        }

                        if (node.data.id === currentNode.id) {
                            node.active = true;
                        }
                        return node;
                    });
                }
            }
            // 处理合同连接线
            nodes.forEach((item) => {
                if (item.data.type === 'give') {
                    giveNode = item;
                    midContractNode = item.parent;
                }
            });

            nodes.forEach((item, i) => {
                if (item.data.type === 'contract') {
                    links.push({ source: item, target: giveNode });
                    if (midContractNode.data.id === item.data.id) {
                        minContractInd = i;
                    }
                }
            });
            nodes.forEach((item, i) => {
                if (item.data.type === 'contract') {
                    if (midContractNode.data.hide) {
                        item.x = midContractNode.x + (i - minContractInd) * 100;
                        if (i - minContractInd > 0) {
                            item.x = item.x - 50 - 44;
                        } else {
                            item.x = item.x + 50;
                        }
                    } else {
                        item.x = midContractNode.x + (i - minContractInd) * 100;
                    }
                }
            });

            if (midContractNode.data.hide) {
                nodes.splice(minContractInd, 1);
            }

            links = links.filter((item) => {
                return !item.source.data.hide && !item.target.data.hide;
            });
            // 处理合同连接线 end
            return { nodes, links };
        },
        /**
         * 初始化树
         * @method init
         * @for
         * @param {array} dataSource 数据
         * @return 无
         */
        init(dataSource) {
            let { direction, currentNode } = this;
            let width = 3000;
            let height = 2400;
            let maxLevel = 0;
            let _dealData = (data) => {
                if (data.level > maxLevel) {
                    maxLevel = data.level;
                }
                if (data.children) {
                    data.children.forEach((item) => {
                        _dealData(item);
                    });
                }
            };
            _dealData(dataSource);

            height = (maxLevel + 1) * 240;
            width = height * 0.8;

            this.dataSource = dataSource;

            if (direction === 'vertical') {
                this.bezierCurveGenerator = d3
                    .linkVertical()
                    .x((d) => d.x)
                    .y((d) => d.y);
            }
            // 创建树布局
            this.tree = d3
                .tree()
                .size([width, height])
                .separation(
                    (a, b) => (a.parent === b.parent ? 1 : 2) / a.depth
                );
            const { links, nodes } = this.initTreeNodes({
                currentNode,
                dataSource,
            });
            this.links = links;
            this.nodes = nodes;
        },
        /**
         * 画贝赛尔曲线的方法
         * @method bezierCurveGenerator
         * @for
         * @param {}
         * @return 无
         */
        bezierCurveGenerator: d3
            .linkHorizontal()
            .x((d) => d.y)
            .y((d) => d.x),
        zoomOut() {
            const g = d3.select('.its-flow-chart');
            d3.zoom().scaleBy(g, 1.1);
            const tranInfo = d3.zoomTransform(g.node());
            this.tranInfo.k = tranInfo.k;
        },
        zoomIn() {
            const g = d3.select('.its-flow-chart');
            d3.zoom().scaleBy(g, 0.9);
            const tranInfo = d3.zoomTransform(g.node());
            this.tranInfo.k = tranInfo.k;
        },
        /**
         * 鼠标滚动方法
         * @method mouseWheel
         * @for
         * @param {e} e 事件源
         * @return 无
         */
        mouseWheel(e) {
            if (e.deltaY < 0) {
                this.zoomOut();
            } else {
                this.zoomIn();
            }
        },
        /**
         * 鼠标按下方法
         * @method mousedown
         * @for
         * @param {e} e 事件源
         * @return 无
         */
        mousedown(e) {
            this.moveAble = true;
            this.eX = e.clientX;
            this.eY = e.clientY;
        },
        /**
         * 鼠标弹起方法
         * @method mouseup
         * @for
         * @param 无
         * @return 无
         */
        mouseup() {
            this.moveAble = false;
        },
        /**
         * 鼠标移出方法
         * @method mouseout
         * @for
         * @param 无
         * @return 无
         */
        mouseout() {
            this.moveAble = false;
        },
        /**
         * 鼠标移动方法
         * @method mousemove
         * @for
         * @param {e} e 事件源
         * @return 无
         */
        mousemove(e) {
            if (this.moveAble) {
                this.tranInfo.x += e.clientX - this.eX;
                this.tranInfo.y += e.clientY - this.eY;
                this.eX = e.clientX;
                this.eY = e.clientY;
            }
        },
        openOrClose(isOpen, node) {
            const dataCopy = Object.assign({}, this.dataSource);

            const _dealData = (isOpen, node, data) => {
                if (data.id === node.data.id) {
                    data.expand = isOpen;
                    this.currentNode = data;
                    if (isOpen) {
                        data.children = data.childrenCopy;
                    } else {
                        data.childrenCopy = Object.assign([], data.children);
                        data.children && delete data.children;
                    }
                } else if (data.children) {
                    data.children.forEach((item) => {
                        _dealData(isOpen, node, item);
                    });
                }
            };

            _dealData(isOpen, node, dataCopy);
            this.init(dataCopy);
        },
    },
};
</script>

<style scoped lang="less">
.flow-chart {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background: #fff;

    .root-body {
        background: none;
        padding: 5px;
        color: #fff;

        .root-name {
            font-size: 16px;
            margin: 0;
        }

        .root-project-no {
            font-size: 12px;
            margin: 10px 0 0 0;
        }
    }

    .contract-body {
        position: relative;
        background: none;
        padding: 5px 5px 5px 40px;

        .contract-name {
            font-size: 16px;
            margin: 0;
            color: #12810a;
        }

        .contract-contract-no {
            font-size: 12px;
            margin: 10px 0 0 0;
        }
    }

    .give-body {
        background: none;
        padding: 5px;
        color: #945a89;

        .give-name {
            font-size: 16px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            justify-content: center;

            span {
                padding: 0 10px;
            }

            &::before,
            &::after {
                content: '';
                display: inline-block;
                width: 38px;
                height: 0;
                border-top: 1px solid #945a89;
            }
        }

        .give-txt {
            margin: 0;
            font-size: 14px;
            color: #5c2a53;
            line-height: 35px;
            padding-left: 8px;
        }
    }

    .borrower-body {
        background: none;
        padding: 5px;
        color: #fff;

        .borrower-type {
            margin-top: 30px;
            font-size: 16px;
            text-align: center;
        }

        .borrower-name {
            font-size: 16px;
            text-align: center;
        }

        .borrower-txt {
            font-size: 14px;
            color: #e02020;
            text-align: center;
            margin-top: 70px;

            & > p {
                margin: 0;
            }
        }
    }

    .company-body {
        background: none;
        padding: 5px;

        .company-name {
            margin: 0;
        }
    }

    .icon-over {
        color: rgb(255, 171, 0);
        font-size: 16px;
    }

    .icon-node-over {
        position: absolute;
        top: 10px;
        right: 10px;
    }
}
</style>