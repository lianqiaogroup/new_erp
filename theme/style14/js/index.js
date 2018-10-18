require(['jquery', 'swiper','widget','commentsScroll','gallery'],function($, Swiper){
    $(document).ready(function(){
        var mySwiper1 = new window.Swiper('.gallery-top', {
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
        var galleryThumbs = new window.Swiper('.gallery-thumbs', {
            spaceBetween: 10,
            centeredSlides: true,
            slidesPerView: 'auto',
            touchRatio: 0.2,
            slideToClickedSlide: true,
            height:80
        });
        mySwiper1.params.control = galleryThumbs;
        galleryThumbs.params.control = mySwiper1;
        widget.timeSet('2018','12','12');
        var user = $('li[star_li]').length;
        if(user){
            var html = [];
            for(var i = 0;i < user;i++){
                var stars =  parseInt($('li[star_li]').eq(i).attr('rel'),10);
                for(var j = 0 ;j < stars;j++){
                    $('.stars').eq(i).append('<span class="red"></span>');
                }
            } 
        }
        var combo = $('input[name="combo_id"]').val();
        setCombPrototypeInit(combo);
        $('.combo_nav ').click(function(){
            var context = window.jQuery(this).closest(".screen-large, .screen-small");
            var $ = function(a){
                return window.jQuery(a, context);
            };
            var combo = $(this).attr('comob_id');
            $('[datakey]').hide();
            $('[datakey][data-goods="'+ combo +'"]').show();
            $(this).siblings().removeClass("check");
            $(this).addClass('check');
            var combo = $(this).attr('comob_id');
            $('input[name="combo_id"]').val(combo);
            var price = $(this).attr('c_price');
            $('input[name="price"]').val(price);
            $('#c_price').html(price);
            var single_c = $(this).attr('single');
            if(parseInt(single_c) == 1){
                $(this).parents('section').find('input[name="number"]').val(1);
                $(this).parents('section').find('.quantity').hide();
            }else{
                $(this).parents('section').find('.quantity').show();
            }
            setCombPrototypeInit(combo);
        });
        // 根据套餐初始化
        function setCombPrototypeInit(combo){
            var section = $('[datakey][data-goods="'+ combo +'"]');
            section.find('ul.attrs').each(function(){
                if($(this).find('li').length == 1){
                    $(this).find('li[data-attr="true"]').eq(0).addClass('action');
                }
            });
        }

        $('li[data-attr="true"]').click(function(){
            var context = window.jQuery(this).closest(".screen-large, .screen-small");
            var $ = function(a){
                return window.jQuery(a, context);
            }
            $(this).siblings('li').removeClass('action');
            $(this).addClass('action');
        });
        
        $('.btn_success').click(function(){
            $('#list').show();
            $('body').addClass('modal-open');
            window.scrollTo(0,0);
        });

        addnumber = function(){
            $('#num').val(parseInt($('#num').val())+1);
            refresh_price($('#num')); 
        }
        minnumber = function(){
            if($('#num').val() > 1){
                $('#num').val(parseInt($('#num').val())-1);
                refresh_price($('#num'));
            }
        }
        inputnumber = function(){
            var number=parseInt($('#num').val());
            if(isNaN(number)||number < 1){
                $('#num').val('1');
            }else if(number > 1){
                $('#num').val(number);
            }
            refresh_price($("#num"));
        }
        $('.subnav').click(function(){
            var context = window.jQuery(this).closest(".screen-large, .screen-small");
            var $ = function(a){
                return window.jQuery(a, context);
            }
            var tab = $(this).attr("rel");
            $('.subnav').removeClass('blue');
            $(this).addClass('blue');
            if(tab == "1"){
                $('#tab1').addClass('action');
                $('#tab2').removeClass('action');
            }else{
                $('#tab2').addClass('action');
                $('#tab1').removeClass('action');
            }
        });
    });
    function refresh_price(e) {
        var context = window.jQuery(e).closest(".screen-large, .screen-small");
        var $ = function(a){
           return window.jQuery(a, context);
        }
        var c_price = $('input[name="price"]').val();
        var number = $('input[name="number"]').val();
        var total = parseInt(c_price)*parseInt(number);
        $('#c_price').html(total);
    }
    $(function(){
        /*
        $(document).on('click', '.screen-large .goods_title', function(e){
            var index = $(this).data('index');
            $(".screen-large .products").hide();
            $(".screen-large .products[data-index='" + index + "']").show();
            $(".screen-large .goods_title").removeClass("active");
            $(this).addClass("active");
        });
        $(".screen-large .goods_title").eq(0).click();
        */
    });
});



// 
function postCheck(){
    var url = '/checkout.php?';
    var width = jQuery(window).width();
    if(width>1000){
       var context = jQuery('.screen-large');
    }else{
       var context = jQuery('.screen-small');
    }
    var $ = function(a){
        return window.jQuery(a, context);
    };
    var comboid = $('input[name="combo_id"]').val();
    var productId = $('input[name="product_id"]').val();
    url = url + 'combo_id=' + comboid + '&product_id=' + productId;
    var count = $('input[name="number"]').val();
    url = url + '&count=' + count;
    var prototype = [];
    if(context.find('li[data-combo="'+ comboid +'"]').length > 0){
        var len = $('li[data-combo="'+ comboid +'"]').length;
        for(var i = 0; i < len; i++){       
            if(context.find('li[data-combo="'+ comboid +'"]').eq(i).hasClass('action')){
                var data = $('li[data-combo="'+ comboid +'"]').eq(i).attr('data-number');
                prototype.push(data);
            }
        }
        if( prototype.length < $('[datakey][data-goods="'+ comboid +'"]').find('ul.attrs').length ){
            alert(context.attr('data-error'));
            return false;
        }
        url = url + '&proto=' + prototype.join('|');
    }
    window.location.href = url;
}

