require(['jquery', 'swiper','widget','gallery'],function($, Swiper){

    // 计时器
    //widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
    
    window.setInterval(function(){ShowCountDown(2018,4,20,'timer');}, 1000);
    //销售百分比
    //widget.percent();

    // 回到顶部
    $(".m-goToTop").click(function(event) {
        $(window).scrollTop(0);
    });

    // 轮播图
    var h = $(window).height();
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            text = '<span class="swiper-pagination-current">' + current + ' / <span class="swiper-pagination-total">'+ total +'</span>';
            return text;
        }
    });
    $('.hide_attr').on('click', function(event) {
        $('.attr_contant').animate({bottom:-$('.attr_contant').height()},500);
        //$('.attr_contant').css('bottom',0);
           $('.shade').delay(400).hide(0);
    })
    $(".buyinfo_hd").click(function () {
        $(".buyinfo_table").css({"display":"block"})
        $("#big-i").addClass("big-i")
    })
    $(".closeBtn").click(function () {
        $(".buyinfo_table").css({"display":"none"})
        $("#big-i").removeClass("big-i")

    })

    $('.top').click(function(){
        window.scrollTo(0,0);
    })
    //评论
    $('#review_area').click(function(){
        if($('.arrow_r').hasClass('down')){
            $('.review_info').hide();
            $('.arrow_r').removeClass('down').addClass('up');
        }else{
            $('.review_info').show();
            $('.arrow_r').addClass('down').removeClass('up');
        }
        
    });
    
    var isrun = true;
});
//订单查询
// $('.price_lost').on('click',function(){
//     var url = '/order_quality.php';
//     window.location.href = url;
// });


// 显示属性层
function showArrtibuteLayer(){
    if( $('#buy_now').hasClass('ok') ){
        postcheckGuige();
    }else{
        $('.shade').show();
        $('.attr_contant').show();
        $('.attr_contant').css('bottom',-$('.attr_contant').height());
        $('.attr_contant').animate({bottom:'0'});
        $('#buy_now').addClass('ok');
    }

}
$('.shade').click(function(){
    $('.shade').hide();
    $('.attr_contant').hide();
    $('#buy_now').removeClass('ok');
})

// 提交表单
function postcheckGuige() {
    var url = "/checkout.php?";

    // 数量
    var count = parseInt($('input#num').val()) || 1;
    url = url + "count="+count;

    // 套餐ID
    var comb_id = $("#comb .tab-sel").find('input').val();
    var loopindex = $("#comb .tab-sel").attr('data-loopindex');
    var section = $('section[data-loopindex="'+ loopindex +'"]');
    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comb_id + '&product_id=' + productId;
    /* Act on the event */
    if( section.find('.u-format.count_atrr').length > 0 ){
        var prototype = [];
        var len =  $('section.action').find('.count_atrr').length;
        var dom =  $('section.action').find('.count_atrr');
        for(var i = 0;i< len;i++){
            var groupId = dom.eq(i).attr('data-group');
            var prototypeId = dom.eq(i).attr('data-select');
            var goodsid = dom.eq(i).attr('data-goodid');
            if(parseInt(prototypeId) > 0){
                if(parseInt(comb_id) != 0){
                    prototype.push(goodsid+"-"+groupId+"-"+prototypeId);
                }else{
                    prototype.push(groupId+"-"+prototypeId);
                }
            }
        }
        if( prototype.length < section.find('.u-format.count_atrr').length ){
            alert($('#page-index').attr('data-error'));
            return false;
        }
        url = url + "&proto="+prototype.join('|');
    }
    // 跳转
    window.location.href = url;
    return false;
}







