/**
 * @author: zhanghuan
 * @create: 2020/07/20
 * @describe: canvas常用方法
 */
;
(function(window, document) {
    window.Cvs = function() {
        this.context = null; // canvas上下文
        this.width = 0; // canvas元素的宽，样式
        this.height = 0; // canvas元素的高，样式
        this.X = 0; // 最大横坐标
        this.Y = 0; // 最大纵坐标
        this.ratio = 1; // 屏幕的设备像素比
    }

    Cvs.prototype = {
        constructor: Cvs,
        /* 
        func: 获取canvas上下文对象
        params: canvas元素
        */
        getContext2d: function(canvas) {
            this.context = canvas.getContext('2d');
            this.ratio = this.getPixelRatio(canvas);
            this.width = canvas.offsetWidth;
            this.height = canvas.offsetHeight;
            this.X = canvas.width = canvas.offsetWidth * this.ratio
            this.Y = canvas.height = canvas.offsetHeight * this.ratio
            // 放大倍数, 解决线条模糊
            this.context.scale(this.ratio, this.ratio)
            return this.context;
        },
        /* 
        func: 获取屏幕的设备像素比
        params: canvas上下文对象
        */
        getPixelRatio: function(context) {
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            return (window.devicePixelRatio || 1) / backingStore;
        },
        /* 
        func: 画一条线
        params: opt配置对象 x1、y1、x2、y2必需
        */
        line(option) {
            var opt = option || {};
            this.context.beginPath();
            this.context.moveTo(opt.x1, opt.y1); // 起点坐标，
            this.context.lineTo(opt.x2, opt.y2); // 终点坐标，
            this.context.closePath();

            this.context.strokeStyle = opt.strokeStyle || '#000';
            this.context.lineWidth = opt.lineWidth || 1;

            this.context.stroke();
        },
        /* 
        func: 写字
        params: opt配置对象  x、y、text必需
        */
        text(option) {
            var opt = option || {};
            this.context.font = (opt.fontSize || '14px') + " Source Han Sans CN, Microsoft YaHei, Avenir, Helvetica, Arial, sans-serif";
            this.context.textAlign = opt.textAlign || 'center';
            this.context.textBaseline = opt.textBaseline || 'bottom';
            this.context.fillStyle = opt.fillStyle || '#000';
            this.context.fillText(opt.text, opt.x, opt.y, opt.maxWidth); // maxWidth绘制的最大宽度
        },
        /* 
        func: 画矩形背景
        params: opt配置对象   x、y、w、h必需
        */
        fillRect(option) {
            var opt = option || {};
            this.context.fillStyle = opt.fillStyle || '#000';
            this.context.fillRect(opt.x, opt.y, opt.w, opt.h);
        },
        /* 
        func: 移动到相对位置
        params: opt配置对象
        */
        translate(option) {
            var opt = option || {};
            this.context.translate(opt.x || 0, opt.y);
        },
        /* 
        func: 画圆
        params: opt配置对象 x、y、r 必需
        */
        arc(option) {
            var opt = option || {};
            this.context.beginPath()
            this.context.arc(opt.x, opt.y, opt.r, opt.start || 0, opt.end || 2 * Math.PI);
            this.context.lineWidth = opt.lineWidth || 1;
            this.context.strokeStyle = opt.strokeStyle || "#000";
            this.context.closePath()
            this.context.stroke()
        },
    };

})(window, document)