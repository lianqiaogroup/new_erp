;(function(){
    function setCookie(cname, cvalue) {
        var d = new Date(+new Date() + 3600 * 1000 * 12);
        //d.setUTCHours(23,59,59,999);
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires+";path=/";
    }

    //获取cookie
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
        }
        return "";
    }
    //清除cookie
    function delCookie(name) {
        setCookie(name, "", -1);
    }

    function jsonp(url, param){
        var arrs = [];
        for( name in param ){
            arrs.push(name + "=" + encodeURIComponent(param[name]));
        }
        var script = document.createElement('script');
        script.setAttribute('src', url + "&" + arrs.join('&'));
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    /**获得屏幕宽度**/
    function ScreenWidth() {
        return window.screen.width;
    }
    /***获得屏幕高度**/
    function ScreenHeight() {
        return window.screen.height;
    }
    /**获得浏览器***/
    function Browse() {
        var browser = {};
        var userAgent = navigator.userAgent.toLowerCase();
        var s;
        (s = userAgent.match(/msie ([\d.]+)/)) ? browser.ie = s[1] : (s = userAgent.match(/firefox\/([\d.]+)/)) ? browser.firefox = s[1] : (s = userAgent.match(/chrome\/([\d.]+)/)) ? browser.chrome = s[1] : (s = userAgent.match(/opera.([\d.]+)/)) ? browser.opera = s[1] : (s = userAgent.match(/version\/([\d.]+).*safari/)) ? browser.safari = s[1] : 0;
        var version = "";
        if (browser.ie) {
            version = 'IE ' + browser.ie;
        }
        else {
            if (browser.firefox) {
                version = 'firefox ' + browser.firefox;
            }
            else {
                if (browser.chrome) {
                    version = 'chrome ' + browser.chrome;
                }
                else {
                    if (browser.opera) {
                        version = 'opera ' + browser.opera;
                    }
                    else {
                        if (browser.safari) {
                            version = 'safari ' + browser.safari;
                        }
                        else {
                            version = '未知浏览器';
                        }
                    }
                }
            }
        }
        return version;
    }
    

    /**获得操作系统***/
    function ClientOs() {
        var sUserAgent = navigator.userAgent;
        !function(e,i,s){e[i]=e[i] || s()}(window,"bowser",function(){function e(e){function i(i){var s=e.match(i);return s&&s.length>1&&s[1]||""}function s(i){var s=e.match(i);return s&&s.length>1&&s[2]||""}function r(e){switch(e){case"NT":return"NT";case"XP":return"XP";case"NT 5.0":return"2000";case"NT 5.1":return"XP";case"NT 5.2":return"2003";case"NT 6.0":return"Vista";case"NT 6.1":return"7";case"NT 6.2":return"8";case"NT 6.3":return"8.1";case"NT 10.0":return"10";default:return}}var o,n=i(/(ipod|iphone|ipad)/i).toLowerCase(),a=/like android/i.test(e),d=!a&&/android/i.test(e),m=/nexus\s*[0-6]\s*/i.test(e),l=!m&&/nexus\s*[0-9]+/i.test(e),v=/CrOS/.test(e),p=/silk/i.test(e),f=/sailfish/i.test(e),c=/tizen/i.test(e),u=/(web|hpw)os/i.test(e),h=/windows phone/i.test(e),w=(/SamsungBrowser/i.test(e),!h&&/windows/i.test(e)),b=!n&&!p&&/macintosh/i.test(e),g=!d&&!f&&!c&&!u&&/linux/i.test(e),k=i(/edge\/(\d+(\.\d+)?)/i),y=i(/version\/(\d+(\.\d+)?)/i),x=/tablet/i.test(e),S=!x&&/[^-]mobi/i.test(e),B=/xbox/i.test(e);/opera/i.test(e)?o={name:"Opera",opera:t,version:y||i(/(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i)}:/opr|opios/i.test(e)?o={name:"Opera",opera:t,version:i(/(?:opr|opios)[\s\/](\d+(\.\d+)?)/i)||y}:/SamsungBrowser/i.test(e)?o={name:"Samsung Internet for Android",samsungBrowser:t,version:y||i(/(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i)}:/coast/i.test(e)?o={name:"Opera Coast",coast:t,version:y||i(/(?:coast)[\s\/](\d+(\.\d+)?)/i)}:/yabrowser/i.test(e)?o={name:"Yandex Browser",yandexbrowser:t,version:y||i(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)}:/ucbrowser/i.test(e)?o={name:"UC Browser",ucbrowser:t,version:i(/(?:ucbrowser)[\s\/](\d+(?:\.\d+)+)/i)}:/mxios/i.test(e)?o={name:"Maxthon",maxthon:t,version:i(/(?:mxios)[\s\/](\d+(?:\.\d+)+)/i)}:/epiphany/i.test(e)?o={name:"Epiphany",epiphany:t,version:i(/(?:epiphany)[\s\/](\d+(?:\.\d+)+)/i)}:/puffin/i.test(e)?o={name:"Puffin",puffin:t,version:i(/(?:puffin)[\s\/](\d+(?:\.\d+)?)/i)}:/sleipnir/i.test(e)?o={name:"Sleipnir",sleipnir:t,version:i(/(?:sleipnir)[\s\/](\d+(?:\.\d+)+)/i)}:/k-meleon/i.test(e)?o={name:"K-Meleon",kMeleon:t,version:i(/(?:k-meleon)[\s\/](\d+(?:\.\d+)+)/i)}:h?(o={name:"Windows Phone",windowsphone:t},k?(o.msedge=t,o.version=k):(o.msie=t,o.version=i(/iemobile\/(\d+(\.\d+)?)/i))):/msie|trident/i.test(e)?o={name:"Internet Explorer",msie:t,version:i(/(?:msie |rv:)(\d+(\.\d+)?)/i)}:v?o={name:"Chrome",chromeos:t,chromeBook:t,chrome:t,version:i(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:/chrome.+? edge/i.test(e)?o={name:"Microsoft Edge",msedge:t,version:k}:/vivaldi/i.test(e)?o={name:"Vivaldi",vivaldi:t,version:i(/vivaldi\/(\d+(\.\d+)?)/i)||y}:f?o={name:"Sailfish",sailfish:t,version:i(/sailfish\s?browser\/(\d+(\.\d+)?)/i)}:/seamonkey\//i.test(e)?o={name:"SeaMonkey",seamonkey:t,version:i(/seamonkey\/(\d+(\.\d+)?)/i)}:/firefox|iceweasel|fxios/i.test(e)?(o={name:"Firefox",firefox:t,version:i(/(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i)},/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(e)&&(o.firefoxos=t)):p?o={name:"Amazon Silk",silk:t,version:i(/silk\/(\d+(\.\d+)?)/i)}:/phantom/i.test(e)?o={name:"PhantomJS",phantom:t,version:i(/phantomjs\/(\d+(\.\d+)?)/i)}:/slimerjs/i.test(e)?o={name:"SlimerJS",slimer:t,version:i(/slimerjs\/(\d+(\.\d+)?)/i)}:/blackberry|\bbb\d+/i.test(e)||/rim\stablet/i.test(e)?o={name:"BlackBerry",blackberry:t,version:y||i(/blackberry[\d]+\/(\d+(\.\d+)?)/i)}:u?(o={name:"WebOS",webos:t,version:y||i(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)},/touchpad\//i.test(e)&&(o.touchpad=t)):/bada/i.test(e)?o={name:"Bada",bada:t,version:i(/dolfin\/(\d+(\.\d+)?)/i)}:c?o={name:"Tizen",tizen:t,version:i(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i)||y}:/qupzilla/i.test(e)?o={name:"QupZilla",qupzilla:t,version:i(/(?:qupzilla)[\s\/](\d+(?:\.\d+)+)/i)||y}:/chromium/i.test(e)?o={name:"Chromium",chromium:t,version:i(/(?:chromium)[\s\/](\d+(?:\.\d+)?)/i)||y}:/chrome|crios|crmo/i.test(e)?o={name:"Chrome",chrome:t,version:i(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:d?o={name:"Android",version:y}:/safari|applewebkit/i.test(e)?(o={name:"Safari",safari:t},y&&(o.version=y)):n?(o={name:"iphone"==n?"iPhone":"ipad"==n?"iPad":"iPod"},y&&(o.version=y)):o=/googlebot/i.test(e)?{name:"Googlebot",googlebot:t,version:i(/googlebot\/(\d+(\.\d+))/i)||y}:{name:i(/^(.*)\/(.*) /),version:s(/^(.*)\/(.*) /)},!o.msedge&&/(apple)?webkit/i.test(e)?(/(apple)?webkit\/537\.36/i.test(e)?(o.name=o.name||"Blink",o.blink=t):(o.name=o.name||"Webkit",o.webkit=t),!o.version&&y&&(o.version=y)):!o.opera&&/gecko\//i.test(e)&&(o.name=o.name||"Gecko",o.gecko=t,o.version=o.version||i(/gecko\/(\d+(\.\d+)?)/i)),o.windowsphone||o.msedge||!d&&!o.silk?o.windowsphone||o.msedge||!n?b?o.mac=t:B?o.xbox=t:w?o.windows=t:g&&(o.linux=t):(o[n]=t,o.ios=t):o.android=t;var T="";o.windows?T=r(i(/Windows ((NT|XP)( \d\d?.\d)?)/i)):o.windowsphone?T=i(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i):o.mac?(T=i(/Mac OS X (\d+([_\.\s]\d+)*)/i),T=T.replace(/[_\s]/g,".")):n?(T=i(/os (\d+([_\s]\d+)*) like mac os x/i),T=T.replace(/[_\s]/g,".")):d?T=i(/android[ \/-](\d+(\.\d+)*)/i):o.webos?T=i(/(?:web|hpw)os\/(\d+(\.\d+)*)/i):o.blackberry?T=i(/rim\stablet\sos\s(\d+(\.\d+)*)/i):o.bada?T=i(/bada\/(\d+(\.\d+)*)/i):o.tizen&&(T=i(/tizen[\/\s](\d+(\.\d+)*)/i)),T&&(o.osversion=T);var N=!o.windows&&T.split(".")[0];return x||l||"ipad"==n||d&&(3==N||N>=4&&!S)||o.silk?o.tablet=t:(S||"iphone"==n||"ipod"==n||d||m||o.blackberry||o.webos||o.bada)&&(o.mobile=t),o.msedge||o.msie&&o.version>=10||o.yandexbrowser&&o.version>=15||o.vivaldi&&o.version>=1||o.chrome&&o.version>=20||o.samsungBrowser&&o.version>=4||o.firefox&&o.version>=20||o.safari&&o.version>=6||o.opera&&o.version>=10||o.ios&&o.osversion&&o.osversion.split(".")[0]>=6||o.blackberry&&o.version>=10.1||o.chromium&&o.version>=20?o.a=t:o.msie&&o.version<10||o.chrome&&o.version<20||o.firefox&&o.version<20||o.safari&&o.version<6||o.opera&&o.version<10||o.ios&&o.osversion&&o.osversion.split(".")[0]<6||o.chromium&&o.version<20?o.c=t:o.x=t,o}function i(e){return e.split(".").length}function s(e,i){var s,r=[];if(Array.prototype.map)return Array.prototype.map.call(e,i);for(s=0;s<e.length;s++)r.push(i(e[s]));return r}function r(e){for(var r=Math.max(i(e[0]),i(e[1])),o=s(e,function(e){var o=r-i(e);return e+=Array(o+1).join(".0"),s(e.split("."),function(e){return Array(20-e.length).join("0")+e}).reverse()});--r>=0;){if(o[0][r]>o[1][r])return 1;if(o[0][r]!==o[1][r])return-1;if(0===r)return 0}}function o(i,s,o){var n=a;"string"==typeof s&&(o=s,s=void 0),void 0===s&&(s=!1),o&&(n=e(o));var t=""+n.version;for(var d in i)if(i.hasOwnProperty(d)&&n[d]){if("string"!=typeof i[d])throw Error("Browser version in the minVersion map should be a string: "+d+": "+(i+""));return r([t,i[d]])<0}return s}function n(e,i,s){return!o(e,i,s)}var t=!0,a=e("undefined"!=typeof navigator?navigator.userAgent||"":"");return a.test=function(e){for(var i=0;i<e.length;++i){var s=e[i];if("string"==typeof s&&s in a)return!0}return!1},a.isUnsupportedBrowser=o,a.compareVersions=r,a.check=n,a._detect=e,a});
        if(window.bowser.android){
            return 'And';
        }
        if(window.bowser.ios){
            return 'Ios';
        }
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac)
            return "Mac";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux)
            return "Lin";
        if (isWin) {
            /*var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K)
                return "Win2000";
            var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP)
                return "WinXP";
            var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003)
                return "Win2003";
            var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista)
                return "WinVista";
            var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7)
                return "Win7";
            */
            return 'Win';
        }
        return "Oth";
    }

    function UUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxx8xxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    var submitData = function(product){
        var product_id = product.product_id,
            template   = product.template,
            title      = product.title,
            type       = product.type;
        var dt1 = new Date();
        var q = window.location.search.slice(1);
        var query = {};
        q.split("&").forEach(function(y){
            var arr = y.split("=");
            query[arr[0]] = arr[1];
        })
        if(getCookie('uuid') == undefined || getCookie('uuid') ==''){
            setCookie('uuid',UUID());
            if(query["source"] && query["source"].match(/^EDM$/i)){
                setCookie('referer', "EDM");
            }else{
                setCookie('referer', document.referrer);
            }
            
            var json = {
                act:'uv',
                uuid:getCookie('uuid'),
                url_referer: document.referrer,
                product_id: product_id,
                title: title,
                template: template,
                browser:Browse(),
                os:ClientOs(),
                resolution:ScreenWidth()+'x'+ScreenHeight(),
                colorDepth: window.screen.colorDepth,
            };
            jsonp('/tongji.php?',json);
        }else{
            setCookie('uuid', getCookie('uuid'));
            setCookie('referer', getCookie('referer'));
        }
         var json = {
            act:'pv',
            uuid:getCookie('uuid'),
            url_referer: document.referrer,
            product_id: product_id,
            title: title,
            template: template,
            type: type
        };
        jsonp('/tongji.php?',json);
        window.onbeforeunload = function(){
            var dt2 = new Date();
            var ms = dt2.getTime() - dt1.getTime();
            var img = new Image();
            img.src = '/tongji.php?act=update&id_pv=' + id_pv+'&total_visit_time='+ms+"&uuid="+getCookie('uuid');
        }
        window.callbacka = function(req){
           id_pv=req.id_pv;
        }
   };

   window.submitData = submitData;

   var STAT_ALL = {
    Swipe:{
        Pos: 0,
        Timestamp: +new Date(),
        Delta: 1000,
        Type: '',
        Down: {
            times: 0,
            pixel: 0,
        },
        Up: {
            times: 0,
            pixel: 0,
        },
        Total: {
            times: 0,
            pixel: 0,
        }
    },

    Video:{
        
    }
  };
  
  
  window.addEventListener('scroll', function(e){
    var y = window.scrollY;
    var type;
    if(y > STAT_ALL.Swipe.Pos){
      STAT_ALL.Swipe.Down.pixel += y - STAT_ALL.Swipe.Pos;
      type = 'Down';
    }else if(y < STAT_ALL.Swipe.Pos){
      STAT_ALL.Swipe.Up.pixel += STAT_ALL.Swipe.Pos-y;
      type = 'Up';
    }
    STAT_ALL.Swipe.Pos = y;
    var t = +new Date();
    if(t - STAT_ALL.Swipe.Timestamp > STAT_ALL.Swipe.Delta || type != STAT_ALL.Swipe.Type){
      if(type){
        ++STAT_ALL.Swipe[type].times;
      }
    }
    STAT_ALL.Swipe.Timestamp = t;
    STAT_ALL.Swipe.Type = type;
    STAT_ALL.Swipe.Total.pixel = STAT_ALL.Swipe.Up.pixel + STAT_ALL.Swipe.Down.pixel;
    STAT_ALL.Swipe.Total.times = STAT_ALL.Swipe.Up.times + STAT_ALL.Swipe.Down.times;
    
  });

  var getUrl = function(el){
      var a = el.querySelector("video[src], source[src]");
      return a && a.src;
  }

  var getVideoObject = function(url){
    if(!url){
        return {};
    }
    STAT_ALL.Video[url] = STAT_ALL.Video[url] || {
        played: 0,
        seeked: 0,
    }
    return STAT_ALL.Video[url];
  }
  window.addEventListener("play", function(e){
    var el = e.target;
    if('HTMLVideoElement' in window && el instanceof HTMLVideoElement){
        ++getVideoObject(getUrl(el)).played;
    }
  }, true);
  window.addEventListener("seeked", function(e){
    var el = e.target;
    if('HTMLVideoElement' in window && el instanceof HTMLVideoElement){
        ++getVideoObject(getUrl(el)).seeked;
    }
  }, true);

  window.getStatAll = function(){
      return STAT_ALL;
  }
})();