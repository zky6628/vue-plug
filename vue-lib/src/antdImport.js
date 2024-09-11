/**
 * author: zhanghuan
 * created: 2020/4/30
 * describe: antd组件引入
 */

import Vue from 'vue'
// 全部引入
/* import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less' 
Vue.use(Antd) */

// 按需引入
import {
    ConfigProvider,
    Layout,
    Table,
    Button,
    Form,
    Input,
    Row,
    Col,
    Select,
    Radio,
    Modal,
    DatePicker,
    Icon,
    Card,
    Tabs,
    Breadcrumb,
    Menu,
    Spin,
    Tree,
    Empty,
    Tooltip,
    Message,

} from 'ant-design-vue'

Vue.use(ConfigProvider)
Vue.use(Layout)
Vue.use(Table)
Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Radio)
Vue.use(Modal)
Vue.use(DatePicker)
Vue.use(Icon)
Vue.use(Card)
Vue.use(Tabs)
Vue.use(Breadcrumb)
Vue.use(Menu)
Vue.use(Spin)
Vue.use(Tree)
Vue.use(Empty)
Vue.use(Tooltip)
Vue.use(Message)

Vue.prototype.$message = Message
