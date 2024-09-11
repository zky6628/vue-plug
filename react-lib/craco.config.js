const CracoLessPlugin = require('craco-less');
const apiMocker = require('mocker-api') //使用mocker-api库
const path = require('path')


module.exports = {
    plugins: [{
        plugin: CracoLessPlugin,
        options: {
            lessLoaderOptions: {
                lessOptions: {
                    modifyVars: { '@primary-color': '#1DA57A' },
                    javascriptEnabled: true,
                },
            },
        },
    }, ],
    devServer: {
        //如果使用mocker-api库
        before(app) {
            apiMocker(app, path.resolve('./mock/index.js'), {

            })
        }
    }
};