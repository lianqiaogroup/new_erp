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
        var rmoney = widget.fmoney($('#total').html());
        $('#total').html(rmoney);
        $('#price').html(rmoney);
        var c_id = $('.basecolor').attr('combo_id');
        $('input[name="combo_id"]').val(c_id);
        $('.subnav').click(function(){
            var combo = $(this).attr('combo_id');
            $('input[name="combo_id"]').val(combo);
            var price = $(this).attr('c_price');
            $('input[name="price"]').val(price);
            $('[datakey]').hide();
            $('[datakey][comdid="'+ combo +'"]').show();
            $(this).siblings().removeClass("basecolor");
            $(this).addClass('basecolor');
            //$('#price').html(price);
            refresh_price();
        })
        $('li[data-attr="true"]').click(function(){
            $(this).siblings('li').removeClass('action');
            $(this).addClass('action');
        })



    });
    function refresh_price() {//刷新价格
        var c_price = $('input[name="price"]').val();
        var rmoney = widget.fmoney(c_price,3);
        $('#total').html(rmoney);
        $('#price').html(rmoney);
    }
    //评论
    var timelen = $('.addtime').length;
    if(timelen){
        for(var i = 0;i< timelen;i++){
            var times = $('.addtime').eq(i).attr("d_time");
            var time = times.split(' ');
            $('.addtime').eq(i).html(time[0]);
        }
    }
    $('#sub').click(function(){
        //alert('Tạm thời không duy trì nhận xét');
        $('#com-layer').show();
    });
    $('#com_btn').click(function(){
        if($("input[name='name']").val()==''){
            alert('Họ tên người nhận');
            return false;
        }
        if($("input[name='mob']").val()==''){
            alert('Số điện thoại');
            return false;
        }
        var twphone = /^[0-9]*$/;
        if(!twphone.test($("input[name='mob']").val())){
            alert("Số điện thoại này không đúng");
            return;
        }
        if($('textarea[name="note"]').val() == ''){
            alert('Để lại tin nhắn');
            return;
        }
        $('#com-layer').hide();
        $("input[name='name']").val("");
        $("input[name='mob']").val("");
        $('textarea[name="note"]').val("");
    });
    $('#close').click(function(){
        $('#com-layer').hide();
    });
    $('#go_top').click(function(){
        window.scrollTo(0,0);
    })
});


function postCheck(){
    var url = '/checkout.php?';
    var comboid = $('input[name="combo_id"]').val();
    var productId = $('input[name="product_id"]').val();
    url = url + 'combo_id=' + comboid + '&product_id=' + productId;
    var prototype = [];
    var len = $('li[data-combo="'+ comboid +'"]').length;
    for(var i = 0; i < len; i++){
        if($('li[data-combo="'+ comboid +'"]').eq(i).hasClass('action')){
            var data = $('li[data-combo="'+ comboid +'"]').eq(i).attr('data-number');
            prototype.push(data);
        }
    }
    url = url + '&proto=' + prototype.join('|');
    //console.log(prototype);
    if(comboid){
        window.location.href = url;
    }else{
        alert("Chọn sản phẩm");
    }
}