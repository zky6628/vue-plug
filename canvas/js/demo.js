/**
* @author: zhanghuan
* @create: 2020/07/20
* @describe: canvas例子
*/

window.addEventListener('load', function() {
    var canvas = document.getElementById('cvs');
    var cvs = new Cvs();
    var cnt = cvs.getContext2d(canvas); // 返回canvas上下文
    // 画一线直线
    cvs.line({x1: 100, y1: 100, x2: 200, y2: 200});
    // 写字
    cvs.text({x: 100, y: 50, text: '生活太艰难了!!!'});
    // 画矩形
    cvs.fillRect({x: 200, y: 150, w: 50, h: 50, fillStyle: '#f0f'});
    // 画圆
    cvs.arc({x: 250, y: 250, r: 25});
})