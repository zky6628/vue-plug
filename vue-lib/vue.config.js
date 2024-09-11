/** @type { import('@vue/cli-service').ProjectOptions } */

const apiMocker = require('mocker-api') //使用mocker-api库
const path = require('path')

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    /* less 变量覆盖，用于自定义 ant design 主题 */
                    'primary-color': 'rgb(250, 84, 28)',
                    'link-color': 'rgb(250, 84, 28)',
                    'border-radius-base': '4px',
                    'text-color': 'rgb(17, 17, 17)',
                    'font-size-base': '16px', // 主字号
                },
                javascriptEnabled: true,
            }
        }
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

    lintOnSave: false //关闭代码审查
}