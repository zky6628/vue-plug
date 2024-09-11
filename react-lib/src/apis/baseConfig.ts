/**
 * 基础路径配置
 * @module apis
 * @author zhanghuan
 * @date 2020/12/24
 */
const basePath = process.env.NODE_ENV === 'development' ? `/api/` : ``;

export {
    basePath
};

export default basePath