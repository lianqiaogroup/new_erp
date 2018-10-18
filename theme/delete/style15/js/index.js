require(['jquery', 'swiper-3.4.0.jquery.min'], function ($, Swiper){


    // 回到顶部
    $(".m-goToTop").click(function(event) {
        $(window).scrollTop(0);
    });

    // 轮播图

    var galleryTop = new window.Swiper('.gallery-top', {
        spaceBetween: 10
    });
    var galleryThumbs = new window.Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true
    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;

    $('[render=format]').html(moneyFormat($('[render=format]').html()));


    // 初始化选择
    var hClass = 'active';
    var combos = $('#combo .ui-col');
        combos.eq(0).addClass(hClass);
        // 选择产品
        combos.click(function(event) {
            /* Act on the event */
            $(this).addClass(hClass).siblings().removeClass(hClass);
            $('[name="combo_id"]').val($(this).attr('data-id'));
            refresh_price();
        });

    refresh_price();


    // 属性都选第一个
    var attrs = $('.product_attr');
        attrs.each(function(){
            var obj = $(this).find('div');
                obj.eq(0).addClass('active');
            var id = obj.attr('data-id');
            $(this).attr('data-id', id);
        });
        // 选择事件
        attrs.on('click', 'div', function(){
            var self = $(this);
            var id = self.attr('data-id');
            self.addClass('active').siblings().removeClass('active');
            self.parents('.product_attr').attr('data-id', id);
            self.parents('.product_attr').find('.title span').html(self.html());
            var src = self.attr('data-img');
            if( src ){ $('#attrimg').attr('src', src); }
        });


    //
    $('[btn-act-buy]').click(function(){
        postcheckGuige();
    });

})



// 提交表单
function postcheckGuige() {
    var url = "/checkout.php?";

    // 数量
    var count = parseInt($('input#num').val()) || 1;
    url = url + "count="+count;

    // 产品ID
    var comb_id = $('[name="combo_id"]').val();

    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comb_id + '&product_id=' + productId;;
    
    /* Act on the event */
    if( $('.product_attr').length > 0 ){
        var prototype = [];
        $('.product_attr').each(function(){
            var groupId = $(this).attr('data-group');
            var prototypeId = $(this).attr('data-id');
            if( parseInt(prototypeId)>0 ){
                prototype.push(groupId+"-"+prototypeId);
            }
        });
        if( prototype.length == 0 ){
            alert('请选择属性');
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }
                
    // 跳转
    window.location.href = url;
    return false;
}



// 刷新价格
function refresh_price() {
    var priceDom = $('[render=price]');
    var totalDom = $('[render=total]');
    $.ajax({
        url: '/checkout.php?',
        type: 'post',
        data: $('input[name="combo_id"], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
           if(json.ret)
           {
              priceDom.html(moneyFormat(json.price));
              totalDom.html(moneyFormat(json.total));
           }
           else{
               alert(json.msg)
           }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });
}


function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    refresh_price(); 
}
function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        refresh_price();
    }
}
function inputnumber(){
    var number=parseInt($('#num').val());
    if(isNaN(number)||number < 1){
        $('#num').val('1');
        refresh_price();
    }else if(number > 1){
        $('#num').val(number);
    }
    refresh_price();
}


function moneyFormat(input) {
    var number = new Number(input);
    var str = number.toString();
    var newstr = str.replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){
        return s+','
    });
    return newstr;
}

$(function () {
    var $doc=$(document);
    $(".back_top").hide();
    //窗口加滚动触发
    $(window).scroll(scrollfun);
    function scrollfun(){
        var hei=$(window).height();
        //如果滚动高度>窗口的高度,隐藏
        if($doc.scrollTop()>hei){
            $(".back_top").slideDown();
        }else{$(".back_top").slideUp();}
    }
    $(".back_top").click(back);
    function back(){
        //全兼容各浏览器
        $('html,body').scrollTop(0);
    }
    //评论显示和隐藏
    var pinluna = $(".rr").length;
    if (pinluna <= 0 ){
        $(".product_t").css({border:'none',width:'100%',textAlign:'center'})
        $(".eva_this").hide();
    }

})
