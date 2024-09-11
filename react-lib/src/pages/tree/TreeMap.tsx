/**
 * 树形组件的封装
 * @module TreeMap
 * @author zhanghuan
 * @date 2020/12/22
 */
import React, { Component } from 'react';
import * as d3 from 'd3';
import './treeMap.less';
import earth from '../../assets/img/earth.svg';
import user from '../../assets/img/user.svg';
import minusCircle from '../../assets/img/circle.svg';

/**
 * 主题属性
 * @property {string} active [active='#1890ff'] 激活色
 * @property {string} nodeActive [nodeActive='#333'] 节点激活色
 * @property {string} textWhite [textWhite='#FFF'] 白色文本
 * @property {string} textBlack [textBlack='#000'] 黑色文本
 * @property {string} rectBlue [rectBlue='#1890ff'] 蓝色矩形
 * @property {string} rectRed [rectRed='#c7254e'] 红色矩形
 * @property {string} fontSize [fontSize='12px'] 字体大小
 * @property {string} lineStroke [lineStroke='#444'] 线条颜色
 * @property {string} line [line='solid'] 线形
 */
interface ITheme {
    active: string;
    nodeActive: string;
    textWhite: string;
    textBlack: string;
    rectBlue: string;
    rectRed: string;
    fontSize: string;
    lineStroke: string;
    line: string;
}
/**
 * 移动属性
 * @property {number} k [k=1] 缩放比个
 * @property {number} x [x=60] 横坐标移动距离
 * @property {number} y [y=-30] 纵坐标移动距离
 */
interface ITranInfo {
    k: number, // scale param
    x: number, // translate x
    y: number, // translate y
}
/**
 * 接收属性
 * @property {number} width [width=1000] 图形的宽度
 * @property {number} height [height=800] 图形的高度
 * @property {number} startBuf [startBuf=35] 连接线前端缓冲距离
 * @property {number} endBuf [endBuf=-25] 连接线后端缓冲距离
 * @property {ITheme} theme [theme={
        active: '#1890ff',
        nodeActive: '#333',
        textWhite: '#FFF',
        textBlack: '#000',
        rectBlue: '#1890ff',
        rectRed: '#c7254e',
        fontSize: '12px',
        lineStroke: '#444',
        line: 'solid'
    }] 连接线后端缓冲距离
 * @property {any} dataSource 数据源
 * @property {any} currentNode 当前节点
 * @property {any} dragAble [dragAble=true]是否可以拖拽
 * @property {any} zoomAble [zoomAble=true]滚轮滚动是否可以缩放
 * @property {Function} onDidMount 初始化完成后调用
 * @property {string} direction [direction='horizontal'] 树的方向默认水平['horizontal', 'vertical']
 * @property {any} props 任意属性，用于解构放到最外层div
 */
interface IProps {
    width: number;
    height: number;
    startBuf: number;
    endBuf: number;
    theme?: ITheme;
    dataSource: any;
    currentNode?: any;
    nodeClick?: Function;
    dragAble?: boolean;
    zoomAble?: boolean;
    onDidMount?: Function;
    direction?: string;
    props?: any;
}

/**
 * 树形图组件
 * @class TreeMap
 * @constructor
 */
class TreeMap extends Component<IProps> {
    state = {
        nodes: [], // tree nodes
        links: [], // tree path
        tranInfo: { // 移动信息
            k: 1, // scale param
            x: 30, // translate x
            y: 30, // translate y
        } as ITranInfo,
    };
    /**
     * 类属性
     * @property {any} tree [tree=null] 树对象
     * @property {any} bezierCurveGenerator 画贝赛尔曲线的方法
     * @property {boolean} moveAble 是否可以移动
     * @property {any} treeDom 树的容器
     */
    tree: any = null;
    bezierCurveGenerator: Function = d3.linkHorizontal().x((d: any) => d.y).y((d: any) => d.x);
    moveAble: boolean = false;
    refDom: any = React.createRef();
    treeDom: any;
    translateX: number = 0;
    translateY: number = 0;
    eX: number = 0;
    eY: number = 0;

    componentDidMount() {
        const { onDidMount } = this.props;
        this.initMapData();
        this.treeDom = this.refDom.current;
        onDidMount && onDidMount(this);
    }

    /**
     * 组件是否应该更新
     * @method shouldComponentUpdate
     * @for TreeMap
     * @param {any} nextProps 下一次props, {any} nextState 下一次state的值
     * @return 无
     */
    shouldComponentUpdate(nextProps: any, nextState: any) {
        const { links, nodes } = this.initTreeNodes(nextProps);
        nextState.nodes = nodes;
        nextState.links = links;

        return true;
    }

    /**
     * 初始化树
     * @method initMapData
     * @for TreeMap
     * @param 无
     * @return 无
     */
    initMapData() {
        let { width, height, direction = 'horizontal' } = this.props;
        width = width || 1000;
        height = height || 800;
        if (direction === 'vertical') {
            this.bezierCurveGenerator = d3.linkVertical().x((d: any) => d.x).y((d: any) => d.y);
        }
        // 创建树布局
        this.tree = d3.tree()
            .size([width * 0.8, height])
            .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);
        const { links, nodes } = this.initTreeNodes(this.props);
        this.setState({
            links,
            nodes,
        });
    }

    /**
     * 初始化树的节点，获取连接线links、节点nodes
     * @method initTreeNodes
     * @for TreeMap
     * @param {any} nextProps 下一次props数据
     * @return {any} {nodes: array, links: array}
     */
    initTreeNodes(nextProps: any) {
        const { currentNode, dataSource } = nextProps;
        let nodes = [];
        let links = [];
        if (dataSource) {
            // create data of tree structure
            const hierarchyData = d3.hierarchy(dataSource)
            // hierarchy layout and add node.x,node.y
            const treeNode = this.tree(hierarchyData);
            nodes = treeNode.descendants();
            links = treeNode.links();
            // 如果指定当前结点，激活当前节点
            if (currentNode) {
                nodes = nodes.map((node: any) => {
                    if (node.active) {
                        node.active = false;
                        if (node.parent) {
                            node.parent.active = false;
                        }
                    }
                    if (node.data.name === currentNode.name) {
                        node.active = true;
                        if (node.parent) {
                            node.parent.active = true;
                        }
                    }
                    return node;
                });
            }
        }
        return { nodes, links };
    }

    /**
     * 树节点点击事件
     * @method nodeClick
     * @for TreeMap
     * @param {any} event 事件源
     * @param {any} currentNode 当前节点
     * @return 无
     */
    nodeClick = (event: any, currentNode: any) => {
        this.props.nodeClick && this.props.nodeClick(event, currentNode);
    }

    /**
     * 缩小
     * @method zoomIn
     * @for TreeMap
     * @param 无
     * @return 无
     */
    zoomIn = () => {
        const g: any = d3.select('.zh_tree_map');
        d3.zoom().scaleBy(g, 0.9);
        const tranInfo = d3.zoomTransform(g.node());
        this.setState({ tranInfo });
    }

    /**
     * 放大
     * @method zoomOut
     * @for TreeMap
     * @param 无
     * @return 无
     */
    zoomOut = () => {
        const g: any = d3.select('.zh_tree_map');
        d3.zoom().scaleBy(g, 1.1);
        const tranInfo = d3.zoomTransform(g.node());
        this.setState({ tranInfo });
    }

    /**
     * 鼠标滚动事件
     * @method mouseWheel
     * @for TreeMap
     * @param {any} e 事件源
     * @return 无
     */
    mouseWheel = (e: any) => {
        // 如果不控制项为不可缩放
        if (this.props.zoomAble === false) {
            return false;
        }
        if (e.deltaY < 0) {
            this.zoomOut();
        } else {
            this.zoomIn();
        }
    }

    /**
     * 鼠标按下事件
     * @method mouseDown
     * @for TreeMap
     * @param {any} e 事件源
     * @return 无
     */
    mouseDown = (e: any) => {
        e.stopPropagation();
        // 如果不控制项为不可拖拽
        if (this.props.dragAble === false) {
            return false;
        }
        this.moveAble = true;
        this.treeDom.addEventListener('mousemove', this.mouseMove);
        this.eX = e.clientX;
        this.eY = e.clientY;
    }

    /**
     * 鼠标弹起事件
     * @method mouseUp
     * @for TreeMap
     * @param {any} e 事件源
     * @return 无
     */
    mouseUp = (e: any) => {
        this.moveAble = false;
        this.treeDom.removeEventListener('mousemove', this.mouseMove);
    }

    /**
     * 鼠标移出事件
     * @method mouseOut
     * @for TreeMap
     * @param {any} e 事件源
     * @return 无
     */
    mouseOut = (e: any) => {
        this.moveAble = false;
        this.treeDom.removeEventListener('mousemove', this.mouseMove);
    }

    /**
     * 鼠标移动事件
     * @method mouseMove
     * @for TreeMap
     * @param {any} e 事件源
     * @return 无
     */
    mouseMove = (e: any) => {
        this.translateX += e.clientX - this.eX;
        this.translateY += e.clientY - this.eY;
        this.eX = e.clientX;
        this.eY = e.clientY;
        this.setState({
            tranInfo: {
                ...this.state.tranInfo,
                x: this.translateX,
                y: this.translateY,
            }
        })
    }

    render() {
        const CIRCLE = {
            CX: '8',
            CY: '8',
            R: 16,
        };
        const MARKER = {
            MARKERHIEGHT: '20',
            MARKERWIDTH: '20',
            VIEWBOX: '0 0 12 12',
            ORIENT: 'auto',
            PATH: 'M2,2 L10,6 L2,10 L6,6 L2,2',
            FILL: '#999',
            REFX: '5',
            REFY: '6',
        };
        const PROD = 'prod';
        const defaultTheme = {
            active: '#1890ff',
            nodeActive: '#333',
            textWhite: '#FFF',
            textBlack: '#000',
            rectBlue: '#1890ff',
            rectRed: '#c7254e',
            fontSize: '12px',
            lineStroke: '#444',
            line: 'solid',
        };
        const { width, height, startBuf = 35, endBuf = -25, theme = defaultTheme, direction, props } = this.props;
        const { links, nodes, tranInfo } = this.state;

        return (
            <div ref={this.refDom} className="zh_tree_wrapper" onWheel={this.mouseWheel} onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} onMouseOut={this.mouseOut} {...props}>
                <svg width={width} height={height}>
                    <g
                        className="zh_tree_map"
                        transform={`translate(${tranInfo.x},${tranInfo.y}),scale(${tranInfo.k})`}>
                        <g>
                            {
                                links.map((link: any, i) => {
                                    const start = { x: link.source.x, y: link.source.y + startBuf };
                                    const end = { x: link.target.x, y: link.target.y + endBuf };
                                    const pathLink = this.bezierCurveGenerator({ source: start, target: end });

                                    return <path
                                        key={i}
                                        d={pathLink}
                                        fill='none'
                                        stroke={theme.lineStroke}
                                        strokeWidth='1'
                                        strokeDasharray={theme.line === 'solid' ? '0,0' : '5,5'}
                                        markerEnd='url(#arrow)' />
                                })}
                        </g>
                        <g>
                            {nodes.map((node: any, i) => {
                                node.type = node.data.type;
                                node.tmp = node.data.tmp;
                                node.error = node.data.error;
                                node.avgTime = node.data.avgTime;
                                node.name = node.data.name;

                                return (<g key={i} transform={direction === 'vertical' ? `translate(${node.x - 10}, ${node.y})` : `translate(${node.y}, ${node.x - 10})`}>
                                    <defs>
                                        <marker id="arrow"
                                            markerUnits="strokeWidth"
                                            markerWidth={MARKER.MARKERWIDTH}
                                            markerHeight={MARKER.MARKERHIEGHT}
                                            viewBox={MARKER.VIEWBOX}
                                            refX={MARKER.REFX}
                                            refY={MARKER.REFY}
                                            orient={MARKER.ORIENT}>
                                            <path d={MARKER.PATH} fill={MARKER.FILL} />
                                        </marker>
                                    </defs>
                                    <circle
                                        cx={CIRCLE.CX}
                                        cy={CIRCLE.CY}
                                        r={CIRCLE.R}
                                        fill='#fff'
                                        stroke={node.active ? theme.active : theme.nodeActive}
                                        strokeWidth={node.active ? 2 : 1}
                                        style={{ cursor: 'pointer' }}
                                        onClick={(event) => this.nodeClick(event, node)} />
                                    <image
                                        href={node.depth === 0 ? user : node.depth === 1 ? earth : minusCircle}
                                        style={{ cursor: 'pointer' }}
                                        onClick={(event) => this.nodeClick(event, node)} />
                                    <rect x='10' y='32' width='40' height='20'
                                        fill={node.data.type === PROD ? theme.rectBlue : theme.rectRed} />
                                    <text
                                        x='17' y='46'
                                        fill={node.data.type === PROD ? theme.textBlack : theme.textWhite}
                                        style={{ fontSize: theme.fontSize }}>
                                        {node.type}
                                    </text>
                                    <text x='5' y='47' fill='#000' textAnchor='end' style={{ fontSize: theme.fontSize }}>
                                        {node.name}
                                    </text>
                                </g>)
                            })}
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
}

export default TreeMap;