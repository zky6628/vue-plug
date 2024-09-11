<!--
 * 全景图
 * @module maps
 * @author zhanghuan
 * @date 2021/01/07
-->
<template>
    <loading :loading="loading">
        <div class="all-view">
            <div class="top-section">
                <div class="top-header">
                    <div class="title">某某某建设公司</div>
                    <div>
                        日期范围：
                        <a-range-picker @change="onDateChange" />
                    </div>
                    <div class="btns">
                        <a-button class="action-btn" type="primary" ghost :icon="isFullScreen  ? 'fullscreen-exit' : 'fullscreen'" @click="viewFullPage"></a-button>
                    </div>
                </div>

                <div class="canvas-container" :style="canvasContainerStyle">
                    <div class="legend">
                        <div v-for="(value, key) in chartData.legend" :key="key" class="leg-item">
                            <i class="leg-icon" :style="{background: value}"></i>
                            <span>{{ key }}</span>
                        </div>
                    </div>
                    <div class="left-tree">
                        <div class="tree-header"></div>
                        <div id="all-view-tree" @scroll="treeScroll" class="all-view-tree">
                            <a-tree v-if="treeDataReady" :show-line="true" :show-icon="true" :tree-data="chartData.data" :default-expanded-keys="defaultExpandedKeys" @expand="expandTree"></a-tree>
                        </div>
                    </div>
                    <canvas id="canvas" @wheel.prevent="mouseWheel" @mousedown="mousedown" @mouseup="mouseup" @mouseout="mouseout" @mousemove="mousemove" @click="mouseClick"></canvas>
                    <a-empty v-show="chartData.years.length < 1" class="empty" />

                    <div id="zh-tooltip" class="ant-tooltip ant-tooltip-placement-topLeft" :style="tooltipStyle">
                        <div class="ant-tooltip-content">
                            <div class="ant-tooltip-arrow" :style="arrowStyle"></div>
                            <div v-if="activePoint.data" role="tooltip" class="ant-tooltip-inner">
                                <span>{{activePoint.data.treeNode && activePoint.data.treeNode.title}}</span>：
                                <span>{{activePoint.data.pX}}</span>
                                <span>（{{activePoint.data.legend}}）</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </loading>
</template>

<script type="text/ecmascript-6">
    import Loading from '../../components/common/Loading.vue'
    import maps from '../../urls/maps'
    export default {
        name: "AllView",
        components: {
            Loading,
        },
        data() {
            return {
                loading: false,
                defaultExpandedKeys: [],
                treeDataReady: false,
                // 左边内容区
                treeKey: 1,
                currCust: '',
                scrollTop: 0, // 树滚动的距离
                treeItemHeight: 40, // 树节点高度
                // 右边内容区
                canvas: null,
                context: null,
                multiple: 1, // 放大倍数
                oX: 0, // 原点坐标
                oY: 0,
                translateX: 0, // 原点坐标移动到的位置
                translateY: 0,
                eX: 0, // 鼠标移动时的坐标
                eY: 0,
                mouseX: 0, // 鼠标所在的坐标
                mouseY: 0,
                activePoint: {}, // 当前激活点
                ratio: 1, // 屏幕的设备像素比
                moveAble: false, // 允许移动
                colW: 40, // 单元格宽度
                AGrad: [], // 存放最小单元格的信息
                showType: 'quarterData', // 按季度展示
                AQ: [1, 2, 3, 4], // 季度或者是月
                marginLR: 0, // 左右拖动到头后的边距
                showData: [], // 当前展示的数据
                chartData: {
                    legend: [],
                    data: [], // 左边公司树
                    years: []
                },
                nodes: [], // 所有的树节点平铺
                cells: {}, // 所有页面上时间左横坐标（左边那一条）
                pointSize: 20, // 点的尺寸
                date: [], // 筛选时间范围
                tooltipStyle: { display: 'none' }, // 提示样式
                arrowStyle: {},
                isFullScreen: false, // 是否全屏
                canvasContainerStyle: {},
            }
        },
        methods: {
            /**
             * 处理数据
             * @method dealData
             * @param {array} data 树形数据 
             * @return {viod} 
             */
            dealData(data, parent) {
                data.forEach(item => {
                    if (!parent) {
                        item.level = 0
                    } else {
                        item.level = parent.level + 1
                    }
                    if (item.expand) {
                        this.defaultExpandedKeys.push(item.key)
                    }
                    item.parent = parent
                    if (item.children) {
                        this.dealData(item.children, item)
                    }
                })
            },
            /**
             * 获取数据
             * @method getData
             * @param {void} 
             * @return {void} 
             */
            getData() {
                this.loading = true;
                this.$axios.post(maps.allView, { date: this.date }).then(res => {

                    this.loading = false;
                    if (res.code === 200) {
                        this.chartData = res.data
                        this.defaultExpandedKeys = []
                        this.dealData(this.chartData.data)
                        this.treeDataReady = true
                        this.draw()
                    }
                })
            },
            /**
             * 日期筛选变化
             * @method onDateChange
             * @param {array} date moment时间对象数组
             * @param {array} dateString 字符串时间数组
             * @return {viod} 
             */
            onDateChange(date, dateString) {
                this.date = dateString
                this.getData()
            },
            treeScroll(e) {
                this.scrollTop = e.target.scrollTop
                this.translateY = -this.scrollTop
                // 如果是用户滚动树，那就要去同步滚动右边
                if (!this.moveAble) {
                    this.draw()
                }
            },
            /* 
            func: 树节点展开或收起
            params: 当前key,事件源
             */
            expandTree(expandedKeys, e) {
                /**
                 * 处理数据
                 * @method _dealData
                 * @param {array} data 树形数据 
                 * @return {viod} 
                 */
                let _dealData = (data) => {
                    data.forEach(item => {
                        if (!item.isLeaf) {
                            if (expandedKeys.indexOf(item.key) > -1) {
                                item.expand = true
                            } else {
                                item.expand = false
                            }
                        }
                        if (item.children) {
                            _dealData(item.children, item)
                        }
                    })
                }

                _dealData(this.chartData.data)
                this.defaultExpandedKeys = []
                this.dealData(this.chartData.data)
                this.treeDataReady = true
                this.draw()
            },
            /* 
            func: 初始化
             */
            init() {
                this.canvas = window.document.getElementById('canvas')
                this.context = this.canvas.getContext('2d')
                this.ratio = this.getPixelRatio(this.canvas)
                this.canvas.width = this.canvas.offsetWidth * this.ratio
                this.canvas.height = this.canvas.offsetHeight * this.ratio
                // 放大倍数, 解决线条模糊
                this.context.scale(this.ratio, this.ratio)
            },

            /* 
            func: 绘制方法
            params:坐标原点要移动到的橫坐标，坐标原点要移动到的纵坐标(步进值)
             */
            draw() {
                // 清除画布
                this.canvas.width = this.canvas.width
                this.canvas.height = this.canvas.height
                // 清除提示 
                this.tooltipStyle = { display: 'none' }
                this.activePoint = {}

                // 放大倍数, 解决线条模糊
                this.context.scale(this.ratio, this.ratio)
                // 先绘制栅格使其在最下面
                // 绘制时间表头和栅格只有横向可以移动  
                // this.context.translate(transX, 0)
                // 绘制栅格
                this.drawGrad()

                /* 内容区 */
                // 除了背景外，其他的可以移动 
                this.drawPoint()
                /* 内容区 end */

                // 最后绘制表头，使其在最上面
                // 绘制时间
                this.drawTime()
            },
            /* 
            func: 绘制右边的栅格
             */
            drawGrad() {
                this.AGrad = []

                if (this.showType === "quarterData") {
                    this.AQ = [1, 2, 3, 4]
                    this.chartData.years.forEach((item, i) => {
                        this.AQ.forEach((ite, j) => {
                            this.AGrad.push({
                                year: item,
                                pX: item + '-' + 'Q' + ite,
                                tX: 'Q' + ite
                            })
                        })
                    })
                }
                if (this.showType === "monthData") {
                    this.AQ = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                    this.chartData.years.forEach((item, i) => {
                        this.AQ.forEach((ite, j) => {
                            this.AGrad.push({
                                year: item,
                                pX: item + '-' + ite,
                                tX: ite + '月'
                            })
                        })
                    })
                }
                if (this.showType === "dayData") {
                    this.AQ = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
                    this.chartData.years.forEach((item, i) => {
                        this.AQ.forEach((ite, j) => {
                            let dayNum = new Date(item, ite, 0).getDate()
                            for (let k = 0; k < dayNum; k++) {
                                let d = k + 1 < 10 ? '0' + (k + 1) : k + 1
                                this.AGrad.push({
                                    year: item,
                                    month: ite,
                                    pX: item + '-' + ite + '-' + d,
                                    tX: (k + 1) + '日'
                                })
                            }
                        })
                    })
                }

                // 最小取40
                this.colW = this.canvas.offsetWidth / this.AGrad.length
                if (this.colW < 40) {
                    this.colW = 40
                }
                this.colW = this.colW * this.multiple

                this.AGrad.forEach((item, i) => {
                    item.x = this.colW * i
                    this.cells[item.pX] = item
                })

                let showLength = Math.ceil(this.canvas.offsetWidth / this.colW) // 一屏能展示多少列
                let startIndex = 0
                if (this.translateX < 0) { // 往左移
                    startIndex = Math.floor(-this.translateX / this.colW)
                    // 多取一个
                    if (startIndex + showLength + 1 >= this.AGrad.length) {
                        this.showData = this.AGrad.slice(startIndex)
                    } else {
                        this.showData = this.AGrad.slice(startIndex, startIndex + showLength + 1)
                    }
                } else { // 往右移或不移
                    if (showLength <= this.AGrad.length) {
                        this.showData = this.AGrad.slice(0, showLength) // 渲染一屏的数据就行了
                    } else {
                        this.showData = this.AGrad
                    }
                }

                // 左边第一条线
                this.line(this.context, {
                    x1: this.translateX,
                    y1: 0,
                    x2: this.translateX,
                    y2: this.canvas.offsetHeight
                })

                this.showData.forEach((item, i) => {
                    this.line(this.context, {
                        x1: item.x + this.colW + this.translateX,
                        y1: 58,
                        x2: item.x + this.colW + this.translateX,
                        y2: this.canvas.offsetHeight
                    })
                })
            },
            /* 
            func: 绘制右边的时间
             */
            drawTime() {
                // 绘制时间表头和栅格只有横向可以移动  
                this.context.translate(0, -this.translateY)
                // 背景
                this.fillRect(this.context, { x: 0, y: 0, w: this.AGrad.length * this.colW, h: 27, fillStyle: '#def0fe' }) // 右边第三行
                this.line(this.context, { x1: 0, y1: 28, x2: this.AGrad.length * this.colW, y2: 28, lineWidth: 4, strokeStyle: '#fff' })
                this.fillRect(this.context, { x: 0, y: 30, w: this.AGrad.length * this.colW, h: 28, fillStyle: '#def0fe' }) // 右边第四行
                if (this.showType === "quarterData" || this.showType === "monthData") {
                    // 年
                    let QAWidth = this.colW * this.AQ.length // 一年中月和季度总宽
                    this.line(this.context, { x1: this.translateX, y1: 0, x2: this.translateX, y2: 30 })
                    this.chartData.years.forEach((item, i) => {
                        this.text(this.context, { text: item + '年', x: QAWidth / 2 + QAWidth * i + this.translateX, y: 20, fontSize: '16px' })
                        this.line(this.context, { x1: QAWidth * (i + 1) + this.translateX, y1: 0, x2: QAWidth * (i + 1) + this.translateX, y2: 30 })
                    })
                }

                if (this.showType === "dayData") {
                    // 年月
                    let tmp = 0
                    this.chartData.years.forEach((item, i) => {
                        let AMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

                        AMonth.forEach((ite, j) => {
                            let dayWidth = this.colW * new Date(item, ite, 0).getDate() // 一月中总天数的宽度
                            tmp += dayWidth
                            this.text(this.context, { text: item + '年' + ite + '月', x: tmp + this.translateX - dayWidth / 2, y: 20, fontSize: '16px' })
                            this.line(this.context, { x1: tmp + this.translateX, y1: 0, x2: tmp + this.translateX, y2: 30 })
                        })
                    })
                }
                // 季度和单元格
                this.line(this.context, {
                    x1: this.translateX,
                    y1: 30,
                    x2: this.translateX,
                    y2: 58
                })
                this.showData.forEach(item => {
                    this.line(this.context, {
                        x1: item.x + this.colW + this.translateX,
                        y1: 30,
                        x2: item.x + this.colW + this.translateX,
                        y2: 58
                    })
                    this.text(this.context, { text: item.tX, x: item.x + this.colW / 2 + this.translateX, y: 50 })
                })
            },
            /* 
            func: 绘制右边的点
             */
            drawPoint() {
                this.context.translate(0, this.translateY) // 用的是相对坐标
                this.nodes = []
                let _dealData = (data, index) => {
                    data.forEach((item, i) => {
                        let points = []
                        item.y = this.nodes.length * this.treeItemHeight; // 计算纵轴坐标
                        this.nodes.push(item)
                        for (let year in item[this.showType]) {
                            let indexArr = Object.keys(item[this.showType][year]).sort(); // 先排序
                            indexArr.forEach(q => {
                                let pntSize = this.pointSize
                                let space = 5
                                if (item[this.showType][year][q].length > 1) {
                                    pntSize = (this.colW - space * (item[this.showType][year][q].length + 1)) / item[this.showType][year][q].length // 减去空隔后下平均分配
                                    pntSize = pntSize > 20 ? 20 : pntSize
                                    space = (this.colW - pntSize * item[this.showType][year][q].length) / (item[this.showType][year][q].length + 1) // 最后下平均分配空隔
                                } else {
                                    space = (this.colW - pntSize) / 2
                                }
                                let y = item.y + (this.treeItemHeight - this.pointSize) / 2 + 59 // 树节点纵坐标 + 剩余一半树节点高度 + 时间表头高度
                                let lIndex = 0;

                                for (let l in item[this.showType][year][q]) {
                                    let x = this.cells[`${year}-${q}`].x + space + (pntSize + space) * lIndex + this.translateX // 栅格坐标 + 剩余一半栅格宽 + 横向移动距离
                                    let clr = this.chartData.legend[item[this.showType][year][q][l]] // 点的颜色
                                    let point;
                                    lIndex++
                                    point = { x: x, y: y, w: pntSize, h: this.pointSize, fillStyle: clr, data: { x: x, y: y, legend: item[this.showType][year][q][l], color: clr, treeNode: item, treeNodeName: item.name, pX: `${year}-${q}` }, space }
                                    points.push(point)
                                }
                            })
                        }
                        if (points.length > 0) {
                            if (item.level === 0) {
                                this.line(this.context, { x1: points[0].x - points[0].space, y1: points[0].y + this.pointSize / 2, x2: points[points.length - 1].x + points[points.length - 1].space + points[points.length - 1].w, y2: points[points.length - 1].y + this.pointSize / 2, strokeStyle: 'rgb(250, 84, 28)', lineWidth: 2 })
                            } else {
                                this.line(this.context, { x1: points[0].x - points[0].space, y1: points[0].y + this.pointSize / 2, x2: points[points.length - 1].x + points[points.length - 1].space + points[points.length - 1].w, y2: points[points.length - 1].y + this.pointSize / 2, strokeStyle: '#aaa', lineWidth: 2 })
                            }
                        }

                        points.forEach(item => {
                            this.fillRect(this.context, item)
                        })

                        if (item.expand && item.children) {
                            _dealData(item.children, i)
                        }
                    })
                }
                _dealData(this.chartData.data)
            },
            /* 
            func: 鼠标滚动事件
            params: 事件源
             */
            mouseWheel(e) {
                // 清除鼠标的位置
                this.mouseX = 0
                this.mouseY = 0
                // 放大倍数 加等于滚动距离除以100，目的不让它变化太快
                this.multiple += -e.deltaY / 100

                if (this.showType === "quarterData") {
                    if (this.multiple > 3) {
                        this.showType = "monthData"
                        this.multiple = 1
                    }
                } else if (this.showType === "monthData") {
                    if (this.multiple < 1) {
                        this.showType = "quarterData"
                        this.multiple = 3
                    }
                    if (this.multiple > 3) {
                        this.showType = "dayData"
                        this.multiple = 1
                    }
                } else if (this.showType === "dayData") {
                    if (this.multiple < 1) {
                        this.showType = "monthData"
                        this.multiple = 3
                    }
                }

                if (this.multiple < 1) {
                    this.multiple = 1 // 最小就是1倍
                }
                if (this.multiple > 3) {
                    this.multiple = 3 // 最大就是3倍
                }

                this.translateX = 0
                // this.translateY = 0 // 如果想在原点开始缩放就放开这行

                this.draw()
            },
            /* 
            func: 鼠标点击事件
            params: 事件源
             */
            mouseClick(e) {
                // 记录下鼠标按下的位置，以用来计算移动的差值
                this.mouseX = e.clientX - this.canvas.getBoundingClientRect().left
                this.mouseY = e.clientY - this.canvas.getBoundingClientRect().top
                this.draw()
            },
            /* 
            func: 鼠标按下事件
            params: 事件源
             */
            mousedown(e) {
                this.moveAble = true
                // 记录下鼠标按下的位置，以用来计算移动的差值
                this.eX = e.clientX
                this.eY = e.clientY
            },
            /* 
            func: 鼠标弹起事件
            params: 事件源
             */
            mouseup(e) {
                this.moveAble = false
            },
            /* 
            func: 鼠标移出canvas事件
            params: 事件源
             */
            mouseout(e) {
                this.moveAble = false
            },
            /* 
            func: 鼠标在canvas内移动事件
            params: 事件源
             */
            mousemove(e) {
                if (this.moveAble === true) {
                    // 清除鼠标的位置
                    this.mouseX = 0
                    this.mouseY = 0
                    // 记录移动距离
                    this.translateX += e.clientX - this.eX
                    this.translateY += e.clientY - this.eY
                    // 记录下鼠标本次移动到的位置，以用来计算移动的差值
                    this.eX = e.clientX
                    this.eY = e.clientY

                    // 限制可移动的范围
                    if (this.translateX > this.canvas.offsetWidth) {
                        this.translateX = this.canvas.offsetWidth
                        return false
                    }

                    if (this.translateX < -this.AGrad.length * this.colW) {
                        this.translateX = -this.AGrad.length * this.colW
                        return false
                    }

                    let treeDom = window.document.getElementById('all-view-tree')
                    let tree = treeDom.getElementsByClassName('ant-tree')[0]
                    let treeDomH = treeDom.offsetHeight
                    let treeH = tree.offsetHeight

                    // 往上拖的极限，负值
                    if (this.translateY < treeDomH - treeH) {
                        this.translateY = treeDomH - treeH;
                    }
                    // 往下拖的极限
                    if (this.translateY > 0) {
                        this.translateY = 0;
                    }
                    // 左边树要同步滚动
                    treeDom.scrollTop = -this.translateY
                    this.draw()
                }
            },
            /* 
            func: 画一条线
            params: canvas上下文对象，设置
             */
            line(cnt, opt = {}) {
                cnt.beginPath()
                cnt.moveTo(opt.x1, opt.y1) // 起点坐标，
                cnt.lineTo(opt.x2, opt.y2) // 终点坐标，
                cnt.closePath()

                cnt.strokeStyle = opt.strokeStyle || '#bee2fe'
                cnt.lineWidth = opt.lineWidth || 1

                cnt.stroke()
            },
            /* 
            func: 写字
            params: canvas上下文对象，opt配置对象
             */
            text(cnt, opt = {}) {
                cnt.font = (opt.fontSize || '14px') + " Source Han Sans CN, Avenir, Helvetica, Arial, sans-serif"
                cnt.textAlign = opt.textAlign || 'center'
                cnt.textBaseline = opt.textBaseline || 'bottom'
                cnt.fillStyle = opt.fillStyle || 'rgb(51, 51, 51)'
                cnt.fillText(opt.text, opt.x, opt.y, opt.maxWidth)
            },
            /* 
            func: 画矩形背景
            params: canvas上下文对象，opt配置对象
             */
            fillRect(cnt, opt = {}) {
                cnt.beginPath()
                cnt.shadowOffsetX = 0; // 阴影Y轴偏移
                cnt.shadowOffsetY = 0; // 阴影X轴偏移
                cnt.shadowBlur = 0; // 模糊尺寸
                cnt.strokeStyle = cnt.fillStyle = opt.fillStyle || '#ebf6ff'
                cnt.rect(opt.x, opt.y, opt.w, opt.h)
                cnt.stroke()
                cnt.fill()
                cnt.closePath()
                this.getItemData(cnt, opt)
            },
            getItemData(cnt, opt) {
                // 如果是打的点并且点击了这个点就获取这个点数据
                if (opt.data && cnt.isPointInPath(this.mouseX * this.ratio, this.mouseY * this.ratio)) {
                    this.activePoint = opt
                    this.drawActivePoint()
                    cnt.beginPath()
                    cnt.lineWidth = 2;
                    cnt.strokeStyle = 'rgba(0, 0, 0, 0.5)'
                    cnt.shadowOffsetX = 10; // 阴影Y轴偏移
                    cnt.shadowOffsetY = 10; // 阴影X轴偏移
                    cnt.shadowBlur = 10; // 模糊尺寸
                    cnt.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 颜色
                    cnt.fillStyle = opt.fillStyle || '#ebf6ff'
                    cnt.rect(opt.x, opt.y, opt.w, opt.h)
                    cnt.stroke()
                    cnt.fill()
                    cnt.closePath()
                }
            },
            /* 
            func: 获取屏幕的设备像素比
            params: canvas上下文对象
             */
            getPixelRatio(context) {
                let backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            },
            /* 
            func: 添加提示
            params: 无
             */
            drawActivePoint() {
                let l = this.canvas.offsetWidth - this.activePoint.x
                if (l < 400) {
                    this.tooltipStyle = {
                        left: 'auto',
                        right: l - 25 + 'px',
                        top: this.translateY + this.activePoint.y + 'px',
                        transformOrigin: '0px 45px',
                        display: 'block',
                        maxWidth: '400px'
                    }
                    this.arrowStyle = {
                        left: 'auto',
                        right: '10px',
                    }
                } else {
                    this.tooltipStyle = {
                        right: 'auto',
                        left: 290 + this.activePoint.x + 'px',
                        top: this.translateY + this.activePoint.y + 'px',
                        transformOrigin: '0px 45px',
                        display: 'block',
                        maxWidth: '400px'
                    }
                    this.arrowStyle = {
                        left: '13px',
                        right: 'auto',
                    }
                }
            },
            /**
             * 全屏
             * @method exitFullscreen
             * @param {viod} 
             * @return {viod} 
             */
            requestFullScreen() {
                const de = window.document.getElementsByClassName('all-view')[0];
                if (de.requestFullscreen) {
                    de.requestFullscreen();
                } else if (de.mozRequestFullScreen) {
                    de.mozRequestFullScreen();
                } else if (de.webkitRequestFullScreen) {
                    de.webkitRequestFullScreen();
                }
                this.isFullScreen = true;
            },
            /**
             * 退出全屏
             * @method exitFullscreen
             * @param {viod} 
             * @return {viod} 
             */
            exitFullscreen() {
                let document = window.document;
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                this.isFullScreen = false;
            },
            /**
             * 切换全屏
             * @method exitFullscreen
             * @param {viod} 
             * @return {viod} 
             */
            viewFullPage() {
                if (this.isFullScreen) {
                    this.exitFullscreen();
                    this.canvasContainerStyle = {}
                } else {
                    this.requestFullScreen();
                    this.canvasContainerStyle = {
                        height: 'calc(100vh - 80px)',
                    }
                }
                setTimeout(() => {
                    this.init()
                    this.draw()
                }, 500)
            }
        },
        created() {
            this.getData()
        },
        mounted() {
            this.init()
        }
    }
</script>

<style scoped lang="less">
    .all-view {

        .top-section {
            border-radius: 6px;
            padding: 12px 30px;
            background: #fff;
        }

        .top-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #eee;

            .title {
                font-size: 30px;

                span {
                    font-size: 22px;
                }
            }

            .btns {
                .action-btn {
                    margin-left: 10px;
                }
            }
        }

        .canvas-container {
            position: relative;
            height: 560px;
            margin: 10px 0;
            border: 1px solid #bee2fe;

            .legend {
                display: flex;
                align-items: center;
                height: 40px;
                padding-left: 24px;
                background: linear-gradient(to right, rgb(110, 158, 255) 0%, rgb(55, 106, 221) 59%, rgb(0, 54, 187) 100%);

                .leg-item {
                    margin-right: 40px;

                    .leg-icon {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        margin-right: 10px;
                    }
                }

                .current-title {
                    text-align: center;
                    margin-top: 14px;
                }
            }

            .left-tree {
                position: relative;
                width: 300px;
                height: calc(100% - 40px);
                padding-top: 60px;
                border-right: 1px solid #bee2fe;

                .tree-header {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 60px;
                    background: #bee2fe;
                }

                .all-view-tree {
                    height: 100%;
                    overflow: auto;

                    /deep/ li .ant-tree-node-content-wrapper,
                    /deep/ li span.ant-tree-switcher,
                    /deep/ li span.ant-tree-iconEle {
                        height: 40px;
                        line-height: 40px;
                    }

                    /deep/ .ant-tree-children-tree>li:first-children {
                        padding: 0;
                    }

                    /deep/ .ant-tree li {
                        padding: 0;
                    }
                }
            }

            .empty,
            #canvas {
                position: absolute;
                top: 40px;
                right: 0;
                width: calc(100% - 300px);
                height: calc(100% - 40px);
            }

            .empty {
                top: calc(40px + 50% - 65px);
            }
        }
    }
</style>