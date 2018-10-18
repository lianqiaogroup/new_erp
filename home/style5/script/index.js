~(function(){
    if( window.Cjs ){ console.error('命名空间冲突, window.Cjs'); return false; }
    var Cjs = {}
    window.Cjs = Cjs;
})();

// url extend
Cjs.url = function(){
    var that = this;
    this.getParamByName = function(name){
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    this.getParams = function(names){
        if( !names.isArray() ){ return null; }
        var value = {};
        names.map(function(key, idx){
            value[key] = that.getParamByName(names[idx]);
        });
        return value;
    }
    return this;
}();
$(function(){
    $.config = {
        // 路由功能开关过滤器，返回 false 表示当前点击链接不使用路由
        routerFilter: function($link) {
            // 某个区域的 a 链接不想使用路由功能
            if ($link.is('.disable-router a')) {
                return false;
            }

            return true;
        }
    };
    // var category =  Cjs.url.getParamByName('category_id');

    var cat_id = Cjs.url.getParamByName('category_id');
    $('header .ui-icon-set').click(function(event) {
        /* Act on the event */
        var bd = $('body');
        var css = 'offcanvas-in';
        !bd.hasClass(css) ? bd.addClass(css) : bd.removeClass(css);
    });
    var dom = $('.ui-slider').length;
    if(dom != 0){
        /* fz 即 FrozenJS 的意思 */
        var slider = new fz.Scroll('.ui-slider', {
            role: 'slider',
            indicator: true,
            autoplay: true,
            interval: 3000
        });
        /* 滑动开始前 */
        slider.on('beforeScrollStart', function(from, to) {
            // from 为当前页，to 为下一页
        })

        /* 滑动结束 */
        slider.on('scrollEnd', function(cruPage) {
            // curPage 当前页
        });
    }
    var lilen = $('.type-nav li').length;
    var w = 13;
    for(var i = 0 ; i < lilen ;i++){
        w = w + parseInt($('.type-nav li').eq(i).offset().width) + 13;
        //console.log(w);
    }
    $('.type-nav ul').css('width',w+40);
    var scrollnav = new fz.Scroll('.type-nav', {
        scrollY: false,
        scrollX: true
    });

    var p = 1,bool=true;
    getData(1);
    $('.content').scroll(function(){
        if($('.products').length != 0){
            var height = $('.products').find('li').eq(0).offset().top
        }else{
            var height = $('.classify').find('li').eq(0).offset().top
        }
        //var height = $('.products').find('li').eq(0).offset().top ||  $('.classify').find('li').eq(0).offset().top;

        var top = $(window).scrollTop();
        if(top >= height){
            $('header.bar').hide();
            $('.nav').css('top','0');
            $('.content').css('top','1.5rem');
        }else{
            $('header.bar').show();
            $('.nav').css('top','2.2rem');
            $('.content').css('top','3.7rem');
        }
        if (bool) {
        $('.preload').show();
        setTimeout(function(){
            var domHeight = $('.page-index').height();
            var totalHeight = parseInt($('.content').height())+parseInt($('.content').scrollTop());
            if(domHeight<=totalHeight+50){
                p++;
                getData(p);
            }
            bool=true;
        // }
        },1000)};
        bool = false;
    })

    $('.pageTop').click(function(event) {
        /* Act on the event */
        $('body').scrollTop(0);
    });
 function getData(p){
    if(cat_id){
        $.get('/?act=getCategoryGoods&category_id='+cat_id+'&p='+p, function(data) {
            var datajson = JSON.parse(data);
            if( datajson.ModuleGoods == null ){ 
                if(p == 1){
                    $('.ui-panel .products').append("<div class='emptyimg'><img src='/home/style3/image/empty_home.png'></div>");
                }
                bool=false;
                $('.preload').html($('.preload').data('error'));
                setTimeout(function(){
                    $('.preload').hide();
                },3000);
                return false; 
            }
            $('.preload').hide();
            var fstPanelGoods = createGoods(datajson.ModuleGoods);
            $('.ui-panel .products').append(fstPanelGoods);
            timer(datajson.ModuleGoods.length);
        });
    }else{
        $.get('/?act=getAjaxGoods&p='+p, function(data) {
            if( data == '[]' ){ 
                if(p == 1){
                    container.append("<div class='emptyimg'><img src='/home/style3/image/empty_home.png'></div>");
                }
                bool=false;
                $('.preload').html($('.preload').data('error'));
                setTimeout(function(){
                    $('.preload').hide();
                },3000);
                return false; 
            }
            var datajson = JSON.parse(data);
            $('.preload').hide();
            var fstPanelGoods = createGoods(datajson.ModuleGoods);
            $('.ui-panel .products').append(fstPanelGoods);
            timer(datajson.ModuleGoods.length);
        });
    }
}
function createGoods(datas){
    var domstr = $("#goods-demo").clone().css('display','block').html();
    var sub = "";
    Array.isArray(datas) && datas.map(function(item, index){
        var newDom = domstr;
            newDom = newDom.replace(/\{thumb\}/g, item.thumb);
            newDom = newDom.replace(/\{title\}/g, item.title);
            newDom = newDom.replace(/\{product_id\}/g, item.product_id);
            newDom = newDom.replace(/\{price\}/g, moneyFormat(item.price, item.currency_prefix, item.currency_code) );
            newDom = newDom.replace(/\{market_price\}/g, moneyFormat(item.market_price, item.currency_prefix, item.currency_code) );
            newDom = newDom.replace(/\{type\}/g, item.type||"");
        sub = sub + newDom;
    });
    return sub;
}
// 格式化货币
function moneyFormat(price, prefix, code){
    if( prefix ==1 ){
        return code+price.toString();
    }else{
        return price.toString() + code;
    }
}
//随机数
//var year = 2018,month = 06,day = 06;
localStorage.year = 2018;
localStorage.month = 4;
localStorage.day = 20;
function timer(len){
    var mathday = 8;
    for(var i = 0 ; i < len ; i++){
        var day = mathday + i;
        var minute = Math.floor(mathday+i) ;//>= 9 ? Math.floor(mathday+i) : "0"+ Math.floor(mathday+i);
        var second = Math.floor(mathday + i) ;//>= 9 ? Math.floor(mathday+i) : "0"+ Math.floor(mathday+i);
        $('.time').eq(i).attr('data',day);
        $('.time').eq(i).attr('minute',minute);
        $('.time').eq(i).attr('second',second);
    }
    ShowCountDown();
}
function ShowCountDown(){
    for(var i = 0 ; i < $('.time').length-1;i++){
        var d = $('.time').eq(i).attr('data');
        var m = $('.time').eq(i).attr('minute');
        var s = $('.time').eq(i).attr('second');
        var now = new Date();
        var endDate = new Date(localStorage.year,localStorage.month-1, localStorage.day, now.getHours()+d);
        var leftTime= endDate.getTime()-now.getTime();
        var leftsecond = parseInt(leftTime/1000);
        var day1= Math.floor(leftsecond/(60*60*24));
        var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
        var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
        var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
        //if (day   <= 9) day = "0" + day;
        if (hour   <= 9) hour = "0" + hour;
        if (minute <= 9) minute = "0" + minute;
        if (second <= 9) second = "0" + second;
        $('.h').eq(i).html(hour);
        $('.m').eq(i).html(minute);
        $('.s').eq(i).html(second);
    }
}
window.setInterval(function(){
    ShowCountDown();
}, 1000);

});
