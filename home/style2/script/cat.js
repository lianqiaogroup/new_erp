var container, cat_id, docHeight, page;

$(function(){

    docHeight = $(document).height();
        
    $('header .ui-icon-scan1').click(function(event) {
        /* Act on the event */
        var bd = $('body');
        var css = 'offcanvas-in';
        !bd.hasClass(css) ? bd.addClass(css) : bd.removeClass(css);
    });


    container = $('.products');
    cat_id = $('#cat_id').val();
    page = $('.loadmore').attr('data-page');

    //
    getData();
    
});

function bindScroll(){
    $(window).off('scroll').on('scroll', function(event) {
        event.preventDefault();
        /* Act on the event */
        var scrolling = $(window).scrollTop()+$(window).height();
        if( scrolling >= docHeight ){
            $(window).off('scroll');
            getData();
        }
    });
}


function getData(){
    var id = $('#cat_id').val();
    var page = $('.loadmore').attr('data-page') || 0;
        page++;

    $.get('/?act=getCategoryGoods&category_id='+id+"&p="+page, function(data) {
        var datajson = JSON.parse(data);
        console.log(datajson)
        if( data.length > 0 ) {
            container.append(createGoods(datajson));
            docHeight = $(document).height();
            bindScroll();
            $('.loadmore').attr('data-page', page)
        }
        if(data=="[]"){
            $(window).off('scroll');
            $('.loadmore').css('opacity', '.1');
        }
    });
}


// 
function createGoods(datas){
    // var domstr = '<div class="ui-col ui-col-50"><a href="/{type}"><div class="product-grid"> <div class="product-thumb"><img src="{thumb}"></div> <div class="product-title">{title}</div>  <div class="product-price red">{price}{currency_code}</div> <div class="market_price">{market_price}{currency_code}</div> </div> </a></div>';
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
