/**
 * 接口基础配置
 * @module api
 * @author zhanghuan
 * @date 2021/01/30
 */

let prefix = ''
let mockPrefix = ''
if (process.env.NODE_ENV === 'development') {
    prefix = '/api'
    mockPrefix = '/mock'
}
export {
    prefix,
    mockPrefix
}