/**
 * author: zhanghuan
 * created: 2020/4/28
 * describe: ajax的封装
 */
import Vue from 'vue'
import axios from 'axios'
import { Toast } from 'vant'


// 创建 axios 实例
const service = axios.create({
    /* headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}, */
	timeout: 60 * 1000 // 请求超时时间
})

// 在发送请求之前做某件事(添加请求拦截器)
service.interceptors.request.use(
	config => {
		const token = Vue.ls.get('Access-Token')
		if (token) {
			config.headers = Object.assign(config.headers, {
				'AccessToken': token // 让每个请求携带自定义 token 请根据实际情况自行修改
			})
		}
		if (config.method === 'get') {
			config.params = {
				_: Date.parse(new Date()) / 1000, //get方法加时间标识，防止缓存
				...config.params
			}
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// 返回状态判断(添加响应拦截器)
service.interceptors.response.use(
	response => {
        if (response.data.code !== 200) {
            Toast.fail(response.data.msg)
        }
		return response.data
	},
	error => {
		if (error.response) {
			let data = error.response.data
			
			switch (error.response.status) {
				case 403:
                    Toast.fail('拒绝访问！')
					break
				case 500:
                    Toast.fail('网络似乎有点问题！')
					break
				case 404:
                    Toast.fail('很抱歉，资源未找到!')
					break
				case 504:
                    Toast.fail('网络超时！')
					break
				case 401:
                    Toast.fail('未授权，请重新登录！')
					break
				default:
                    Toast.fail(data.message)
					break
			}
		}
		return Promise.reject(error)
	}
)

export default service
