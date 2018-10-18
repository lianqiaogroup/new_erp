require(['jquery',  'swiper','widget','gallery'],function($){
    $(document).ready(function(){
        var lilen = $('#list').find('li').length;
        // if(lilen > 1){
        //     TouchSlide({
        //         slideCell:"#banner",//（产生轮播效果的包裹元素）
        //         mainCell:"#list ul",//（产生轮播效果的元素）
        //         autoPlay:false,//（自动分页）
        //         titCell:"#bar_icon span",//（引导轮播效果的按钮元素）
        //         effect:"leftLoop" //（左循环滚动）
        //     });
        // }

        var mySwiper1 = new window.Swiper('.swiper-container', {
            autoplay: 3000,
            loop: false,
            autoHeight: true,
            pagination: '.swiper-pagination',
            paginationType: 'custom'
        });
        var video = document.getElementById("video");
        if(video){
            video.addEventListener("play", function () {
                mySwiper1.stopAutoplay();
            }, false);
            $(".swiper-container").on("touchmove", function () {
                video.pause();
            });
            $(".swiper-container").on("mouseup", function () {
                video.pause();
            });
            $(document).scroll(function () {
                var top = $(document).scrollTop();
                var h = $("#video").height();
                if (top > h) {
                    video.pause();
                }
            });
        }
        

        widget.timeSet(2018,6,6);
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
        var combid = $('.product').find('.action').attr('rel');
        $('input[name="comob"]').val(combid);
        singleCombo();
        $('.comob').click(function(){
            $('.comob').removeClass('action');
            $(this).addClass('action');
            var data = $(this).attr('rel');
            $('input[name="comob"]').val(data);
            $('.coco').hide();
            $('.combo_'+data).show();
            singleCombo();
        });
        $('.goodli').click(function(){
            $(this).siblings().removeClass('key');
            $(this).addClass('key');
            var data_index = $(this).attr('data-combo');
            $('.comob[rel="'+ data_index +'"]').addClass('action');
            $('input[name="comob"]').val(data_index);
        });
        $('a[name="comment"]').click(function(){
            $('#detail').hide();
            $('#comment').show();
            $(this).parent().siblings().removeClass('action');
            $(this).parent().addClass('action');
        })
        $('a[name="detail"]').click(function(){
            $('#detail').show();
            $('#comment').hide();
            $(this).parent().siblings().removeClass('action');
            $(this).parent().addClass('action');
        })
        addnumber = function(){
            $('#num').val(parseInt($('#num').val())+1);
            refresh_price(); 
        }

        minnumber = function(){
            if($('#num').val() > 1){
                $('#num').val(parseInt($('#num').val())-1);
                refresh_price();
            }
        }
        inputnumber = function(){
            var number=parseInt($('#num').val());
            if(isNaN(number)||number < 1){
                $('#num').val('1');
                refresh_price();
            }else if(number > 1){
                $('#num').val(number);
            }
            refresh_price();
        }
        function refresh_price() {
            var c_price = $('input[name="price"]').val();
            var number = $('input[name="number"]').val();
            var total = parseInt(c_price)*parseInt(number);
            $('#c_price').html(total);
        }
        //套餐是否可选数量
        function singleCombo(){
            var single_c =  $('.comob.action').attr('single_c') ? $('.comob.action').attr('single_c') : $('.comob').eq(0).attr('single_c');
            if(parseInt(single_c) == 1){
                $('#num').val(1);
                $('#num').parents('.qty').hide();
            }else{
                $('#num').parents('.qty').show();
            }
        }
    })
    $('.back').click(function(){
        $('.index').show();
        $('#attr').hide();
    });
    $(".onlinenot").click(function () {
        $(".buyinfo_table").css({"display":"block"})
        $("#big-i").addClass("big-i")
    })
    $(".closeBtn").click(function () {
        $(".buyinfo_table").css({"display":"none"})
        $("#big-i").removeClass("big-i")

    })
})
function getattr(){
    var url = "/checkout.php?";
    var comboid = $('input[name="comob"]').val();
    console.log(comboid)
    if(typeof(comboid) == 'undefined' || comboid == ''){
        alert($('#attr').attr('data-error'));
        return false;
    };
    var productId = $('input[name="product_id"]').val();
    url = url + 'combo_id=' + comboid + '&product_id=' + productId;
    var count = $('input[name="num"]').val();
    url = url + '&count=' + count;
    var len = $('li[data-combo="'+ comboid +'"]').length;
    var protype = [];
    if(len > 0){
        for(var i = 0; i < len; i++){
            if($('li[data-combo="'+ comboid +'"]').eq(i).hasClass('key')){
                var data = $('li[data-combo="'+ comboid +'"]').eq(i).attr('data-number');
                protype.push(data);
            }
        }
        if(protype.length < $('.combo_'+comboid).find('.size').length){
            alert($('#attr').attr('data-error'));
            return false;
        }
        url = url + '&proto=' + protype.join('|');
    }
    window.location.href = url;
}

function showAttr(){
    $('.index').hide();
    $('#attr').show();
};