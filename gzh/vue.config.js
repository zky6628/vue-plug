const apiMocker = require('mocker-api') //使用mocker-api库
const path = require('path')

module.exports = {
    css: {
        loaderOptions: {
            less: {
                // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
                lessOptions: {
                    modifyVars: {
                        // 直接覆盖变量
                        'text-color': '#333',
                        'border-color': '#eee',
                    },
                },
            },
        },
    },
    devServer: {
        //如果使用mocker-api库
        before(app) {
            apiMocker(app, path.resolve('./mock/index.js'), {

            })
        },
        port: 8080,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'https://huiyan.baidu.com', //服务地址
                ws: false,
                changeOrigin: true,
                pathRewrite: { '^/api': '' }
            },
        }
    },
};