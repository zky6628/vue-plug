/**
 * @author: zhanghuan
 * @create: 2020/05/09
 * @describe: 带查询条的列表-宏
 */
import moment from 'moment'

/* =========== 列表-宏 ============ */
export const ListMixin = {
    data() {
        return {
            params: {
                pageSize: 10,
                pageNo: 1
            },
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                total: 0,
                pageSize: 10,
                pageSizeOptions: ['5', '10', '20', '50', '100']
            },
            withRangePicker: true // 是否带有二次时间范围筛选
        }
    },
    methods: {
        /* 
        func: 设置参数
        params: 要设置的参数对象
        return: 无
        */
        setParams(data) {
            this.params = Object.assign(this.params, data)
            if (data.pageNo) {
                this.$refs.table.pagination.current = data.pageNo
            }

            // 如果参数里有开始时间这个字段，就设置时间的回显
            if (data.startDate && data.endDate) {
                this.$refs.table.dateRange = [moment(data.startDate), moment(data.endDate)]
            } else {
                this.$refs.table.dateRange = []
            }
        },
        /* 
        func: 加载数据
        params: 无
        return: 无
        */
        loadData() {

        },
    }
}

/* =========== table-宏 ============ */
export const tableMixin = {
    data() {
        return {
            pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: 1,
                total: 0,
                pageSize: 10,
                pageSizeOptions: ['5', '10', '20', '50', '100']
            }
        }
    },
    methods: {
        /* 
        func: 时间二次筛选
        params: moment时间， string时间
        return: 无
        */
        onChange(date, dateString) {
            this.$parent.setParams({ pageNo: 1, startDate: dateString[0], endDate: dateString[1] })
            this.$parent.loadData()
        },
        /* 
        func: 页码变化,分页条数变化
        params: 分页信息
        return: 无
        */
        change(pagination) {
            let pageNo = pagination.current
            let pageSize = pagination.pageSize
            
            if (pageSize !== this.$parent.params.pageSize) {
                pageNo = 1
                this.pagination.pageSize = pageSize
                this.$parent.setParams({ pageSize: pageSize })
            }
            this.pagination.current = pageNo
            this.$parent.setParams({ pageNo: pageNo })
            this.$parent.loadData()
        }
    }
}

/* =========== 查询表单-宏 ============ */
export const SearchFormMixin = {
    data() {
        return {
            form: this.$form.createForm(this),
            labelCol: { span: 9 },
            wrapperCol: { span: 15 },
            colSpan: 6,
            size: 'small'
        }
    },
    methods: {
        /* 
        func: 查询
        params: 事件源
        return: 无
        */
        search(e) {
            e && e.preventDefault()
            this.form.validateFields((err, values) => {
                if (!err) {
                    // 如果有二次时间筛选
                    if (this.$parent.withRangePicker) {
                        this.$parent.setParams({ startDate: undefined, endDate: undefined })
                    }

                    this.$parent.setParams({ pageNo: 1, ...values })
                    this.$parent.loadData()
                }
            })
        },
        /* 
        func: 重置
        params: 无
        return: 无
        */
        reset() {
            this.form.resetFields()
        },
    },
    mounted() {
        this.search()
    }
}