/**
 * author: zhanghuan
 * created: 2020/3/31
 * describe: 接口基础配置
 */
let prefix = window._CONFIG.prefix
let mockPrefix = window._CONFIG.mockPrefix
if (process.env.NODE_ENV === 'development') {
    prefix = '/api'
    mockPrefix = '/mock'
}
export {
    prefix,
    mockPrefix
}