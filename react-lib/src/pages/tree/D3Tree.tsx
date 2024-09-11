/**
 * 通过d3和svg来实现树图
 * @module D3Tree
 * @author zhanghuan
 * @date 2020/12/22
 */
import { Component } from 'react';
import {
    DatabaseOutlined,
    DeleteOutlined,
    PlusCircleFilled,
    MinusCircleFilled,
    FullscreenOutlined,
    FullscreenExitOutlined,

} from '@ant-design/icons';
import './d3Tree.less';
import { TreeMap } from './index';
import { axios } from '../../utils';
import { tree } from '../../apis';

/**
 * 调用树形图组件
 * @class D3Tree
 * @constructor
 */
class D3Tree extends Component {
    state = {
        dataSource: null,
        currentNode: {} as any, // select node
        startBuf: 35,
        endBuf: -25,
        theme: {
            active: '#1890ff',
            nodeActive: '#333',
            textWhite: '#FFF',
            textBlack: '#000',
            rectBlue: '#1890ff',
            rectRed: '#c7254e',
            fontSize: '12px',
            lineStroke: '#444',
            line: 'solid',
        },
        menuStatus: 'hidden' as any,
        positionY: 0,
        positionX: 0,
        isFullScreen: false,
        dragAble: true,
        zoomAble: true,
        direction: 'horizontal',
    };

    treeMap: any;

    componentDidMount() {
        this.watchFullScreen();
        this.getTreeDate();
    }

    getTreeDate = () => {
        axios.get(tree.getTree).then((res: any) => {
            if (res.data) {
                this.setState({
                    dataSource: res.data
                });
            }
        })

        axios.delete('/api/user/123').then((res: any) => {
            if (res.data) {
                
            }
        })
    }

    treeMapDidMount = (component: any) => {
        this.treeMap = component;
    }

    /**
     * 缩小
     * @method zoomIn
     * @for D3Tree
     * @param 无
     * @return 无
     */
    zoomIn = () => {
        this.treeMap.zoomIn();
    }

    /**
     * 放大
     * @method zoomOut
     * @for D3Tree
     * @param 无
     * @return 无
     */
    zoomOut = () => {
        this.treeMap.zoomOut();
    }

    nodeClick = (event: any, currentNode: any) => {
        event.stopPropagation();
        const positionX = event.pageX + 40 + 'px';
        const positionY = event.pageY + (-50) + 'px';

        this.setState({ menuStatus: 'visible', currentNode, positionX, positionY });
    }

    addNode = () => {
        const { currentNode } = this.state;
        const NEWNODE = {
            name: 'new node',
            type: 'prod',
            tmp: '3240tpm',
            error: '19err',
            avgTime: '1334ms'
        };
        this.cancleActive();
        if (!currentNode.children) {
            currentNode.children = [];
        }
        NEWNODE.name = NEWNODE.name + Math.ceil(Math.random() * 10);
        currentNode.children.push(NEWNODE);

        let rootNode = currentNode;
        while (rootNode.parent) {
            rootNode = rootNode.parent;
        }
        delete rootNode.data;
        this.setState({ dataSource: rootNode });
    }

    deleteNode = () => {
        let { currentNode } = this.state;
        this.cancleActive();
        if (currentNode.children) {
            currentNode.children = null;
        }
        const currentNodeName = currentNode.name;
        const currentNodeParent = currentNode.parent;
        if (currentNodeParent) {
            for (let i = 0; i < currentNodeParent.children.length; i++) {
                if (currentNodeParent.children[i].name === currentNodeName) {
                    currentNodeParent.children.splice(i, 1);
                }
            }
        } else {
            currentNode = null;
        }
        let rootNode = currentNode;
        if (rootNode) {
            while (rootNode.parent) {
                rootNode = rootNode.parent;
            }
        }
        this.setState({ dataSource: rootNode });
    }

    cancleActive = () => {
        // reset node active
        this.setState({ menuStatus: 'hidden', currentNode: {} });
    }

    viewFullPage = () => {
        if (this.state.isFullScreen) {
            this.exitFullscreen();
        } else {
            this.requestFullScreen();
        }
    }

    requestFullScreen() {
        const de: any = document.documentElement;
        if (de.requestFullscreen) {
            de.requestFullscreen();
        } else if (de.mozRequestFullScreen) {
            de.mozRequestFullScreen();
        } else if (de.webkitRequestFullScreen) {
            de.webkitRequestFullScreen();
        }
    }

    // exit full screen
    exitFullscreen() {
        let document: any = window.document;
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }

    watchFullScreen() {
        let document: any = window.document;
        document.addEventListener(
            "fullscreenchange",
            () => {
                this.setState({
                    isFullScreen: document.fullscreen
                });
            },
            false
        );
        document.addEventListener(
            "mozfullscreenchange",
            () => {
                this.setState({
                    isFullScreen: document.mozFullScreen
                });
            },
            false
        );
        document.addEventListener(
            "webkitfullscreenchange",
            () => {
                this.setState({
                    isFullScreen: document.webkitIsFullScreen
                });
            },
            false
        );
    }

    render() {
        const {
            startBuf,
            endBuf,
            theme,
            currentNode,
            positionX,
            positionY,
            menuStatus,
            isFullScreen,
            dataSource,
            dragAble,
            zoomAble,
            direction } = this.state;

        return (
            <div onClick={this.cancleActive}>
                <TreeMap
                    width={1000}
                    height={800}
                    startBuf={startBuf}
                    endBuf={endBuf}
                    theme={theme}
                    dataSource={dataSource}
                    currentNode={currentNode}
                    nodeClick={this.nodeClick}
                    dragAble={dragAble}
                    zoomAble={zoomAble}
                    onDidMount={this.treeMapDidMount}
                    direction={direction}
                    props={{ style: { border: "1px solid #999" } }} />

                <div className="menu" style={{ visibility: menuStatus, left: positionX, top: positionY }}>
                    <div className="info-menu">
                        <span>Avg.response time<i>{currentNode.avgTime}</i></span>
                        <span>TMP<i style={{ width: '135px' }}>{currentNode.tmp}</i></span>
                        <span>Error/min.<i style={{ width: '105px' }}>{currentNode.error}</i></span>
                    </div>
                    <div className="add-menu">
                        <ul>
                            <li onClick={this.addNode}><DatabaseOutlined />&nbsp;&nbsp;Create Map</li>
                            <li onClick={this.deleteNode}><DeleteOutlined />&nbsp;&nbsp;Delete Map</li>
                        </ul>
                    </div>
                </div>
                <div className="operate-list">
                    <span title="add node" onClick={this.zoomOut}><PlusCircleFilled /></span>
                    <span title="delete node" onClick={this.zoomIn}><MinusCircleFilled /></span>
                    <span onClick={this.viewFullPage}>
                        {isFullScreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
                    </span>
                </div>
            </div>
        )
    }
}
export default D3Tree;