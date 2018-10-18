require(['jquery', 'swiper','widget','commentsScroll','gallery'],function($, Swiper){
    $(document).ready(function(){
        var mySwiper1 = new window.Swiper('.swiper-container', {
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
        var c_price = $('.subnav.basecolor').attr('c_price')
        $('#price').html(c_price);
        $('.subnav').click(function(){
            var combo = $(this).attr('combo_id');
            $('input[name="combo_id"]').val(combo);
            var price = $(this).attr('c_price');
            $('input[name="price"]').val(price);
            $('[datakey]').hide();
            $('[datakey][comdid="'+ combo +'"]').show();
            $(this).siblings().removeClass("basecolor");
            $(this).addClass('basecolor');
            $('#list').show();
            $('body').addClass('modal-open');
            window.scrollTo(0,0);
        })
        $('li[data-attr="true"]').click(function(){
            var attrimg = $(this).attr('data-img');
            $(this).siblings('li').removeClass('action');
            $(this).addClass('action');
            var text = $(this).html();
            init();
            if(attrimg){
                $(this).parents('.item').find('.attrimg').attr('src',attrimg);
            }  
        })
        $('input[name="number"]').val();
        $('.btn_add').click(function(){
            var url = '/checkout.php?';
            var comboid = $('input[name="combo_id"]').val();
            var productId = $('input[name="product_id"]').val();
            url = url + 'combo_id=' + comboid +'&product_id=' +productId;
            var count = $('input[name="number"]').val();
            url = url + '&count=' + count;
            var prototype = [];
            var len = $('li[data-combo="'+ comboid +'"]').length;
            for(var i = 0; i < len; i++){
                if($('li[data-combo="'+ comboid +'"]').eq(i).hasClass('action')){
                    var data = $('li[data-combo="'+ comboid +'"]').eq(i).attr('data-number');
                    prototype.push(data);
                }
            }
            if( prototype.length > 0 ){
                url = url + '&proto=' + prototype.join('|');
            }
            window.location.href = url;
        })
        $('.btn_success').click(function(){
            var comboid = $('input[name="combo_id"]').val();
            var height = $('.title').offset().top;
            //console.log(height);
            window.scrollTo(0,height);
            if(!comboid){
                alert("請選擇產品");
            }else if(comboid == 0){
                $('#list').show();
                $('body').addClass('modal-open');
                window.scrollTo(0,0);
            }
        })
        init();
        function init(){
            var plen = $('[datakey]').length;
            for(var i = 0; i < plen; i++){
                var str = []
                var len = $('[datakey]').eq(i).find('li.action').length;
                for(var s = 0 ; s < len ; s++){
                    var pdom = $('[datakey]').eq(i).find('li.action');
                    var text = pdom.eq(s).html();
                    str.push(text+"   ");
                }
                $('[datakey]').eq(i).find('.keyword').html('').append(str.join(''));
            }
        }
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
    });
    function refresh_price() {
        var c_price = $('input[name="price"]').val();
        var number = $('input[name="number"]').val();
        var total = parseInt(c_price)*parseInt(number);
    }

})