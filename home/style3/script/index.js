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
    $('header .ui-icon-scan1').click(function(event) {
        /* Act on the event */
        var bd = $('body');
        var css = 'offcanvas-in';
        !bd.hasClass(css) ? bd.addClass(css) : bd.removeClass(css);
    });
    /* 輪番 */
    var mySwiper1 = Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            for (var i = 1; i <= total; i++) {
                if (current == i) {
                    text += "<span class='redicon'></span>";
                } else {
                    text += "<span class='whiteicon'></span>";
                }
            }
            return text;
        }
    });
    
    var p = 1,bool=true;
    getData(1);
    $(window).on('scroll',function(){
        if (bool) {
        $('.preload').show();
        setTimeout(function(){
            var domHeight = $('.page-index').height();
            var totalHeight = parseInt($(window).height())+parseInt($(window).scrollTop());


            if(domHeight<=totalHeight+50){
                p++;
                getData(p);
            }
            bool=true;
        // }
        },1000)};
        bool = false;
            
    })

    $('.ui-layer').click(function(){
        $('body').removeClass('offcanvas-in');
    })
});

var num = 0,last=[];
var container = $('.page-index');
function getData(p){
    var cat_id = Cjs.url.getParamByName('category_id');
    if(cat_id){
        $.get('/?act=getCategoryGoods&category_id='+cat_id+'&p='+p, function(data) {
            var datajson = JSON.parse(data);
            if( datajson.ModuleGoods == null ){ 
                if(p == 1){
                    container.append("<div class='emptyimg'><img src='/home/style3/image/empty_home.png'></div>");
                }
                $(window).off('scroll');
                $('.preload').html($('.preload').data('error'));
                setTimeout(function(){
                    $('.preload').hide();
                },3000);
                return false; 
            }
            $('.preload').hide();
            var fstPanelGoods = createGoods(datajson.ModuleGoods);
            $('.ui-panel .products').append(fstPanelGoods);
            // 
            // var fstPanel = $(createPanel(datajson));
            // var fstPanelGoods = createGoods(datajson.ModuleGoods);
            // fstPanel.find('.products').append(fstPanelGoods);
            // container.append(fstPanel);
            // // return
            // Array.isArray(datajson.sonModule) && datajson.sonModule.map(function(item, index){
            //     var newPanel = $(createPanel(item));
            //     var goods = createGoods(item.ModuleGoods);
            //     newPanel.find('.products').append(goods);
            //     container.html('').append(newPanel);
            // });
            timer(datajson.ModuleGoods.length);
            last.push(datajson.ModuleGoods.length);
            num = p==1?0:num+ last[last.length-2];
        });
    }else{
        $.get('/?act=getAjaxGoods&p='+p, function(data) {
            if( data == '[]' ){ 
                if(p == 1){
                    container.append("<div class='emptyimg'><img src='/home/style3/image/empty_home.png'></div>");
                }
                $(window).off('scroll');
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
            // var fstPanel = $(createPanel(datajson));
            // var fstPanelGoods = createGoods(datajson.ModuleGoods);
            // fstPanel.find('.products').append(fstPanelGoods);
            // container.append(fstPanel);
            // return
            // Array.isArray(datajson.sonModule) && datajson.sonModule.map(function(item, index){
            //     var newPanel = $(createPanel(item));
            //     var goods = createGoods(item.ModuleGoods);
            //     newPanel.find('.products').append(goods);
            //     container.append(newPanel);
            // });
            timer(datajson.ModuleGoods.length);
            last.push(datajson.ModuleGoods.length);
            num = p==1?0:num+ last[last.length-2];
        });
    }
}

// 
// function createPanel(data){
//     // var title = data.title || '';
//     var title ='';
//     var mid = data.mid || 0;
//     var domstr = '<div class="ui-panel text-center" data-mid="{mid}"><div class="ui-row products"></div> </div>';
//         domstr = domstr.replace(/\{title\}/g, title);
//         domstr = domstr.replace(/\{mid\}/g, mid);
//     return domstr;
// }
// 
function createGoods(datas){
    // var domstr = '<div class="ui-col ui-col-50"><a href="{type}"><div class="product-grid"> <div class="product-thumb"><img src="{thumb}"></div> <div class="product-title">{title}</div>  <div class="product-price red">{price}{currency_code}</div> <div class="market_price">{market_price}{currency_code}</div> </div> </a></div>';
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
    if( prefix==1 ){
        return code+price.toString();
    }else{
        return price.toString() + code;
    }
}
//随机数
function rnd(n, m){
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;
}
var maxtime = [],timers;
function timer(len){
    var mathday = [];
    for(var i = 0 ; i < len ; i++){
        var day = rnd(5,20)//mathday + i;
        mathday.push(day);
        var sday = rnd(120,3600);
        maxtime.push(parseInt(sday));
    }
    if(timers){
        clearInterval(timers);
    }
    timers = setInterval(function(){
        CountDown(mathday);
    },1000);

}
function CountDown(tnum){
    for(var i=0; i < tnum.length+num;i++){
        if(maxtime[i] >= 0){
            minutes = Math.floor(maxtime[i]/60); 
            seconds = Math.floor(maxtime[i]%60); 
            if (minutes <= 9) minutes = "0" + minutes;
            if (seconds <= 9) seconds = "0" + seconds;
            $('.h').eq(i).html("00");
            $('.m').eq(i).html(minutes);
            $('.s').eq(i).html(seconds);
            --maxtime[i];
        }
    }
    
} 