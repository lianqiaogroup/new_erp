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
        
    $('header .ui-icon-set').click(function(event) {
        /* Act on the event */
        var bd = $('body');
        var css = 'offcanvas-in';
        !bd.hasClass(css) ? bd.addClass(css) : bd.removeClass(css);
    });
    window.addEventListener('load', function(){
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
    })


    $('.pageTop').click(function(event) {
        /* Act on the event */
        $('body').scrollTop(0);
    });


    var p = 1,bool=true;
    getData(1);
    $('.content').on('scroll',function(){
        if (bool) {
        $('.preload').show();
        setTimeout(function(){
            var domHeight = $('.page-index').height();
            var totalHeight = parseInt($('.content').height())+parseInt($('.content').scrollTop())-parseInt($('.ui-slider').height());

            if(domHeight<=totalHeight+50){
                p++;
                getData(p);
            }
            bool=true;
        // }
        },1000)};
        bool = false;
            
    })
        
});


var container = $('.page-index');


function getData(p){
    var cat_id = Cjs.url.getParamByName('category_id');
    // console.log(cat_id)
    if( cat_id  ){
        $.get('/?act=getCategoryGoods&category_id='+cat_id+'&p='+p, function(data) {
            var datajson = JSON.parse(data);
            // 
            if( datajson.ModuleGoods == null ){
                $('.content').off('scroll');
                $('.preload').html($('.preload').data('error'));
                setTimeout(function(){
                    $('.preload').hide();
                },3000);
                return false;
            }
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
        });
    }else{
        $.get('/?act=getAjaxGoods&p='+p, function(data) {
            var datajson = JSON.parse(data);
            // 
            if( datajson.ModuleGoods == null ){
                $('.content').off('scroll');
                $('.preload').html($('.preload').data('error'));
                setTimeout(function(){
                    $('.preload').hide();
                },3000);
                return false;
            }
            $('.preload').hide();
            var fstPanelGoods = createGoods(datajson.ModuleGoods);
            $('.ui-panel .products').append(fstPanelGoods);
            // var fstPanel = $(createPanel(datajson));
            // var fstPanelGoods = createGoods(datajson.ModuleGoods);
            // fstPanel.find('.products').append(fstPanelGoods);
            // container.append(fstPanel);
            // console.log('s')
            // return
            // console.log('a')
            // Array.isArray(datajson.sonModule) && datajson.sonModule.map(function(item, index){
            //     var newPanel = $(createPanel(item));
            //     var goods = createGoods(item.ModuleGoods);
            //     newPanel.find('.products').append(goods);
            //     container.append(newPanel);
            // });
        });
    }
}


    

// 
// function createPanel(data){
//     // var title = data.title || '';
//     var title ='';
//     var mid = data.mid || 0;
//     var domstr = '<div class="ui-panel text-center" data-mid="{mid}"><ul class="ui-grid-trisect products"></ul> </div>';
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
            // newDom = newDom.replace(/\{thumb\}/g, item.thumb);
            newDom = newDom.replace(/\<img src=\"/g, '<img src="'+item.thumb);
            newDom = newDom.replace(/\{title\}/g, item.title);
            newDom = newDom.replace(/\{product_id\}/g, item.product_id);
            newDom = newDom.replace(/\{price\}/g, moneyFormat(item.price, item.currency_prefix, item.currency_code) );
            newDom = newDom.replace(/\{market_price\}/g, moneyFormat(item.market_price, 1, '¥') );
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
 $('.parent_category').on('click',function(){
    if($(this).parent().hasClass('action')){
        window.location.href = $(this).data('link');
    }else{
        $(this).parent().siblings().removeClass('action').find('.child_category').hide();
        $(this).next().show();
        $(this).parent().addClass('action')
    };
})
