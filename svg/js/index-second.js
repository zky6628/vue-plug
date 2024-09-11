// <g><path d="M250 150 L150 350 L350 350 Z" fill="none" stroke="#f00" stroke-width="1" /></g>
window.addEventListener('load', function() {
    var lineColor = "#000";
    var points = {
        source: {x: 50, y: 100},
        target: {x: 150, y: 50}
    };
    var points2 = {
        source: {x: 50, y: 150},
        target: {x: 80, y: 200}
    };
    var points3 = {
        source: {x: 50, y: 220},
        target: {x: 150, y: 220}
    };

    var points4 = {
        source: {x: 50, y: 250},
        target: {x: 150, y: 400}
    };
    var points5 = {
        source: {x: 50, y: 300},
        target: {x: 150, y: 400}
    };
    var points6 = {
        source: {x: 50, y: 450},
        target: {x: 150, y: 400}
    };

    var rootSvg = document.getElementById('root-svg');
    var defs = '<defs><marker id="arrow" markerWidth="13" markerHeight="13" refX="2" refY="7" orient="auto" ><path d="M2,2 L2,13 L8,7 L2,2" fill="' + lineColor + '" /></marker></defs>';

    /* 
    * 获取一条线的路径
    * source：起点 例 {x: 50, y: 450}
    * target：终点 例 {x: 150, y: 400}
    * r： 弧度的半径
    * lineBuf：线的缓冲长度
    */
    var getLine = function(points) {
        var r = points.r || 10; // 弧度的半径
        var lineBuf = points.lineBuf || 20; // 线右端的缓冲长度
        var rightTopArc = 'a' + r + ',' + r + ' 0 0,1 ' + r + ',' + r; // 右上角的弧度
        var rightBottomArc = 'a' + r + ',' + r + ' 0 0,0 ' + r + ',' + (-r); // 右下角的弧度
        var leftTopArc = 'a' + r + ',' + r + ' 0 0,1 ' + r + ',' + (-r); // 左上角的弧度
        var leftBottomArc = 'a' + r + ',' + r + ' 0 0,0 ' + r + ',' + r; // 左下角的弧度
        var d = '';

        // 如果两点间x轴的距离小于了2倍圆角半径，则直接画一条直线，因为一条线要有圆就是两个，所以是2*r，否则不够画圆角
        if (Math.abs(points.target.x - points.source.x) < 2 * r) {
            d = 'M' + points.source.x + ',' + points.source.y + ' L' + points.target.x + ',' + points.target.y;
            return d;
        }
        // 如果两点间x轴的距离等于2倍圆角半径，那刚好能画两个圆角，缓冲长度就只能为0了。
        if (Math.abs(points.target.x - points.source.x) === 2 * r) {
            lineBuf = 0;
        }
        // 如果两点间x轴的距离大于2倍圆角半径，小于2倍圆角半径加缓冲长度，那么缓冲长度不能用设定的值只能剩多少用多少。
        if (Math.abs(points.target.x - points.source.x) > 2 * r && Math.abs(points.target.x - points.source.x) < 2 * r + lineBuf) {
            lineBuf = 2 * r + lineBuf - Math.abs(points.target.x - points.source.x);
        }

        // 如果目标点在起点的右边，也就是从左到右的方向
        if (points.target.x - points.source.x > 0) {
            // 如果目标在起点的下边
            if (points.target.y - points.source.y > 0) {
                d = 'M' + points.source.x + ',' + points.source.y + ' L' + (points.target.x - 2 * r - lineBuf) + ',' + points.source.y + ' ' + rightTopArc + ' L' + (points.target.x - r - lineBuf) + ',' + (points.target.y - r) + leftBottomArc + ' L' + points.target.x + ',' + points.target.y;
            } 
            // 如果目标在起点的上边
            else if (points.target.y - points.source.y < 0) {
                d = 'M' + points.source.x + ',' + points.source.y + ' L' + (points.target.x - 2 * r - lineBuf) + ',' + points.source.y + ' ' + rightBottomArc + ' L' + (points.target.x - r - lineBuf) + ',' + (points.target.y + r) + leftTopArc + ' L' + points.target.x + ',' + points.target.y;
            } else {
                d = 'M' + points.source.x + ',' + points.source.y + ' L' + points.target.x + ',' + points.target.y;
            }
        } else { // 从右到左的箭头和垂直线暂时用直线
            d = 'M' + points.source.x + ',' + points.source.y + ' L' + points.target.x + ',' + points.target.y;
        }
        
        return d;
    }

    var svgCnt = '<g>' + 
    '<path d="' + getLine(points) + '" fill="none" stroke="' + lineColor + '" stroke-width="1" style="marker-end: url(#arrow);"/>' + 
    '<path d="' + getLine(points2) + '" fill="none" stroke="' + lineColor + '" stroke-width="1" style="marker-end: url(#arrow);"/>' + 
    '<path d="' + getLine(points3) + '" fill="none" stroke="' + lineColor + '" stroke-width="1" style="marker-end: url(#arrow);"/>' + 
    '<path d="' + getLine(points4) + '" fill="none" stroke="' + lineColor + '" stroke-width="1" style="marker-end: url(#arrow);"/>' + 
    '<path d="' + getLine(points5) + '" fill="none" stroke="' + lineColor + '" stroke-width="1" style="marker-end: url(#arrow);"/>' + 
    '<path d="' + getLine(points6) + '" fill="none" stroke="' + lineColor + '" stroke-width="1" style="marker-end: url(#arrow);"/>' + 

    '</g>';
    rootSvg.innerHTML = svgCnt + defs;
    
});