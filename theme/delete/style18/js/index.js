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
        var sales = $('#surplus').attr('data_sale'),stock = $('#surplus').attr('data_stock');
        var surplus = Math.abs(parseInt(sales)-parseInt(stock));
        $('#surplus').html(surplus);
        widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
        var rmoney = fmoney($('#total').html());
        $('#total').html(rmoney);
        $('#price').html(rmoney);
        singleCombo();
        $('.subnav').click(function(){
            var combo = $(this).attr('combo_id');
            $('input[name="combo_id"]').val(combo);
            var price = $(this).attr('c_price');
            $('input[name="price"]').val(price);
            $('[datakey]').hide();
            $('[datakey][comdid="'+ combo +'"]').show();
            $(this).siblings().removeClass("basecolor");
            $(this).addClass('basecolor');
            refresh_price();
            singleCombo();
        })
        $('li[data-attr="true"]').click(function(){
            $(this).siblings('li').removeClass('action');
            $(this).addClass('action');
        })
        
        $('.btn_success').click(function(){
            var url = '/checkout.php?';
            var comboid = $('input[name="combo_id"]').val();
            var productId = $('input[name="product_id"]').val();
            url = url + 'combo_id=' + comboid + '&product_id=' + productId;
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
            if (len > 0) {
                url = url + '&proto=' + prototype.join('|');
            }
            
            //console.log(prototype);
            if(comboid){
                window.location.href = url;
            }else{
                alert("Chọn sản phẩm");
            }
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
    });
    //套餐是否可选数量
    function singleCombo(){
        var single_c =  $('.subnav.basecolor').attr('single_c');
        if(parseInt(single_c) == 1){
            $('#num').val(1);
            $('#num').parents('.quantity').hide();
        }else{
            $('#num').parents('.quantity').show();
        }
    }
    function refresh_price() {//刷新价格
        var c_price = $('input[name="price"]').val();
        var number = $('input[name="number"]').val();
        var total = parseInt(c_price)*parseInt(number);
        var rmoney = fmoney(total,3);
        $('#total').html(rmoney);
        $('#price').html(rmoney);
    }
    function fmoney(s, n) {//金额格式化
       n = n > 0 && n <= 20 ? n : 2;   
       s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";   
       var l = s.split(".")[0].split("").reverse(),      
       t = "";   
       for(i = 0; i < l.length; i ++ )   
       {   
          t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");   
       }   
       return t.split("").reverse().join("");   
    }
})