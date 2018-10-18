$(function(){
        
    $('header .ui-icon-set').click(function(event) {
        /* Act on the event */
        var bd = $('body');
        var css = 'offcanvas-in';
        !bd.hasClass(css) ? bd.addClass(css) : bd.removeClass(css);
    });
    
    /* fz 即 FrozenJS 的意思 */
    var slider = new fz.Scroll('.ui-slider', {
        role: 'slider',
        indicator: true,
        autoplay: true,
        interval: 3000
    });

    var scrollnav = new fz.Scroll('.type-nav', {
        scrollY: false,
        scrollX: true
    });
 

    /* 滑动开始前 */
    slider.on('beforeScrollStart', function(from, to) {
        // from 为当前页，to 为下一页
    })

    /* 滑动结束 */
    slider.on('scrollEnd', function(cruPage) {
        // curPage 当前页
    });

    $('.pageTop').click(function(event) {
        /* Act on the event */
        $('body').scrollTop(0);
    });
        
        
});

// var container = $('.page-index');

// $.get('/?act=getAjaxGoods', function(data) {
//      //<!-- var data = '{"mid":"1","title":"\u9996\u9875","sort":"1","num":"2","parent_id":"0","add_time":"2017-02-23 11:18:35","is_del":"0","ModuleGoods":[{"gid":"3","mid":"1","product_id":"1","sort":"2","is_del":"0","thumb":"\/upload\/wnczxzd.com\/thumb\/17-02-24\/1487334958_14_\u770b\u56fe\u738b.jpg","title":"\u7b2c\u4e8c\u4ee3\u5347\u7d1a\u7248\u5fb7\u570b\u5c0f\u92fc\u70ae\u6e26\u8f2a\u589e\u58d3\u91cd\u4f4e\u97f3\u4fbf\u651c\u85cd\u7259\u97f3\u7bb1","price":1599,"market_price":1599,"currency_code":"NT$"},{"gid":"4","mid":"1","product_id":"2","sort":"0","is_del":"0","thumb":"\/upload\/index\/thumb\/17-02-28\/2.jpg","title":"MEEE GOU \/\u7c73\u72d7M74K\u904b\u52d5\u76f8\u6a5f\u5fae\u578b\u6578\u78bc\u651d\u50cf\u6a5f\u9632\u6c34\u6f5b\u6c34wifi\u667a\u80fd","price":1899,"market_price":1899,"currency_code":"\uffe5"}],"sonModule":[{"mid":"2","title":"1\u697c","sort":"8","num":"4","parent_id":"1","add_time":"2017-02-23 11:29:48","is_del":"0","ModuleGoods":[{"gid":"2","mid":"2","product_id":"1","sort":"3","is_del":"0","thumb":"\/upload\/wnczxzd.com\/thumb\/17-02-24\/1487334958_14_\u770b\u56fe\u738b.jpg","title":"\u7b2c\u4e8c\u4ee3\u5347\u7d1a\u7248\u5fb7\u570b\u5c0f\u92fc\u70ae\u6e26\u8f2a\u589e\u58d3\u91cd\u4f4e\u97f3\u4fbf\u651c\u85cd\u7259\u97f3\u7bb1","price":1599,"market_price":1599,"currency_code":"NT$"}]},{"mid":"3","title":"2\u697c","sort":"0","num":"5","parent_id":"1","add_time":"2017-02-23 13:55:50","is_del":"0","ModuleGoods":null},{"mid":"5","title":"3\u697c","sort":"0","num":"6","parent_id":"1","add_time":"2017-02-23 14:15:13","is_del":"0","ModuleGoods":null}]}'; -->
//     var datajson = JSON.parse(data);

//     var fstPanel = $(createPanel(datajson));
//     var fstPanelGoods = createGoods(datajson.ModuleGoods);
//     fstPanel.find('.classify').append(fstPanelGoods);
//     container.append(fstPanel);

//     //return
//     Array.isArray(datajson.sonModule) && datajson.sonModule.map(function(item, index){
//         var newPanel = $(createPanel(item));
//         var goods = createGoods(item.ModuleGoods);
//         newPanel.find('.classify').append(goods);
//         container.append(newPanel);
//     });
//     timer(datajson.ModuleGoods.length);

// });
    

// // 
// function createPanel(data){
//     // var title = data.title || '';
//     var title ='';
//     var mid = data.mid || 0;
//     var domstr = '<div class="ui-panel text-center" data-mid="{mid}"><ul class="ui-grid-halve classify"></ul> </div>';
//         domstr = domstr.replace(/\{title\}/g, title);
//         domstr = domstr.replace(/\{mid\}/g, mid);
//     return domstr;
// }
// // 
// function createGoods(datas){
//     // var domstr = '<div class="ui-col ui-col-50"><a href="{type}"><div class="product-grid"> <div class="product-thumb"><img src="{thumb}"></div> <div class="product-title">{title}</div>  <div class="product-price red">{price}{currency_code}</div> <div class="market_price">{market_price}{currency_code}</div> </div> </a></div>';
//     var domstr = $("#goods-demo").clone().css('display','block').html();
//     var sub = "";
//     Array.isArray(datas) && datas.map(function(item, index){
//         var cutoff = (item.price/item.market_price*1000)/100.00 + "%";
//         var newDom = domstr;
//             newDom = newDom.replace(/\{thumb\}/g, item.thumb);
//             newDom = newDom.replace(/\{title\}/g, item.title);
//             newDom = newDom.replace(/\{product_id\}/g, item.product_id);
//             newDom = newDom.replace(/\{price\}/g, moneyFormat(item.price, item.currency_prefix, item.currency_code) );
//             newDom = newDom.replace(/\{market_price\}/g, moneyFormat(item.market_price,item.currency_prefix,item.currency_code) );
//             //newDom = newDom.replace(/\{cutoff\}/g,cutoff);
//             //newDom = newDom.replace(/\{sales_num\}/g,item.sales_num);
//             newDom = newDom.replace(/\{type\}/g, item.type||"");
//         sub = sub + newDom;
//     });
//     return sub;
// }

// // 格式化货币
// function moneyFormat(price, prefix, code){
//     if( prefix ==1 ){
//         return code+price.toString();
//     }else{
//         return price.toString() + code;
//     }
// }
//随机数
//var year = 2018,month = 06,day = 06;
localStorage.year = 2018;
localStorage.month = 06;
localStorage.day = 06;
function timer(len){
    var mathday = 3;
    for(var i = 0 ; i < len ; i++){
        var day = mathday + i;
        var minute = Math.floor(mathday+i) >= 9 ? Math.floor(mathday+i) : "0"+ Math.floor(mathday+i);
        var second = Math.floor(mathday + i) >= 9 ? Math.floor(mathday+i) : "0"+ Math.floor(mathday+i);
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
        var endDate = new Date(localStorage.year,localStorage.month-1, localStorage.day, now.getHours()+d,m,s);
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
