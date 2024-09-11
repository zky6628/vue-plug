/**
 * 系统常用方法
 * @module system
 * @author zhanghuan
 * @date 2020/12/24
 */

// 1、js判断移动端系统

var userAgent = navigator.userAgent;

var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1; //android终端

var isIOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端





// 2、js判断是否PC端

function IsPC() {

    var userAgent = navigator.userAgent;

    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

    var flag = true;

    for (var v = 0; v < Agents.length; v++) {

        if (userAgent.indexOf(Agents[v]) > 0) {

            flag = false;

            break;

        }

    }

    return flag;

}





// 3、js判断是否为微信内置浏览器

function isWeiXin() {

    var userAgent = window.navigator.userAgent.toLowerCase();

    if(userAgent.match(/MicroMessenger/i) == 'micromessenger') {

        return true;

    } else {

        return false;

    }

}






// 4、js判断是否为ie浏览器，并返回相应状态

function IEVersion() {

    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  

    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  

    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  

    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;

    if(isIE) {

        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");

        reIE.test(userAgent);

        var fIEVersion = parseFloat(RegExp["$1"]);

        if(fIEVersion == 7) {

            return 7;

        } else if(fIEVersion == 8) {

            return 8;

        } else if(fIEVersion == 9) {

            return 9;

        } else if(fIEVersion == 10) {

            return 10;

        } else {

            return 6;//IE版本<=7

        }   

    } else if(isEdge) {

         return 'edge';//edge

    } else if(isIE11) {

        return 11; //IE11  

    }else{

        return -1;//不是ie浏览器

    }

}






// 5、js判断浏览器内核

var browserInfo = {

    versions:function(){

        var userAgent = navigator.userAgent;

        return {

            trident: userAgent.indexOf('Trident') > -1, //IE内核

            presto: userAgent.indexOf('Presto') > -1, //opera内核

            webKit: userAgent.indexOf('AppleWebKit') > -1, //苹果、谷歌内核

            gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == -1,//火狐内核

            mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/), //是否为移动终端

            ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端

            android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1, //android终端

            iPhone: userAgent.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器

            iPad: userAgent.indexOf('iPad') > -1, //是否iPad

            webApp: userAgent.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部

            weixin: userAgent.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）

            qq: userAgent.match(/\sQQ/i) == " qq" //是否QQ

        };

    },

    language:(navigator.browserLanguage || navigator.language).toLowerCase()

}







// 6、js判断客户端操作系统

function detectOS() {

    var userAgent = navigator.userAgent;

    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");

    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");

    if (isMac) return "Mac";

    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;

    if (isUnix) return "Unix";

    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);

    if (isLinux) return "Linux";

    if (isWin) {

        var isWin2K = userAgent.indexOf("Windows NT 5.0") > -1 || userAgent.indexOf("Windows 2000") > -1;

        if (isWin2K) return "Win2000";

        var isWinXP = userAgent.indexOf("Windows NT 5.1") > -1 || userAgent.indexOf("Windows XP") > -1;

        if (isWinXP) return "WinXP";

        var isWin2003 = userAgent.indexOf("Windows NT 5.2") > -1 || userAgent.indexOf("Windows 2003") > -1;

        if (isWin2003) return "Win2003";

        var isWinVista= userAgent.indexOf("Windows NT 6.0") > -1 || userAgent.indexOf("Windows Vista") > -1;

        if (isWinVista) return "WinVista";

        var isWin7 = userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1;

        if (isWin7) return "Win7";

    }

    return "other";

}

document.writeln("您的操作系统是：" + detectOS());