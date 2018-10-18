require(['jquery', 'swiper','widget','gallery'],function($, Swiper){
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        
        paginationCustomRender: function(swiper, current, total,index,className) {
            var text = "";
            var width = 1/total*100+'%';
            for (var i = 1; i <= total; i++) {
              if (current == i) {
                text += '<i style="width:'+ width +';background:#cdcdcd;"></i>';
              }else{
                text += '<i style="width:'+ width+';"></i>';
              }
            }
            return text;
        },
        uniqueNavElements :false
    });
//倒计时
    widget.timeSet(2018,4,20,'timer','tw'); //timer:倒计时的id，tw:地区语言
    $("#combo .tab").eq(0).addClass('tab-sel');
})
//选择套餐
$("#combo .tab").click(function(event) {
    event.preventDefault();
    /* Act on the event */
    $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
    $('#combo').attr('data-price', $(this).attr('data-price'));
});

//订单查询
$('.order_query').on('click',function(){
    var url = '/order_quality.php';
    window.location.href = url;
})
//添加评论
$('.comment button').on('click',function(){
    $('#add_comment').fadeIn();
})
//关闭添加评论
$(".close").on('click',function(){
    $('#add_comment').fadeOut();
})
//评论
var boxer = $('[data-fn=commentScroll]');
var list = $(boxer).children().eq(0);
var clone = list.clone();
var clone2 = list.clone();
$(boxer).append(clone).append(clone2);
var speed = 35;
function Marquee(){
    if( list.height() < boxer.height() ){
        if( boxer.scrollTop() >= list.height()+14 ){
            boxer.scrollTop(0);
        }else{
            boxer.scrollTop(boxer.scrollTop()+1);
        }
    }else{
        if( boxer.scrollTop() - list.height() >=4 ){
             boxer.scrollTop(0); 
        }else{
             boxer.scrollTop(boxer.scrollTop()+1);
        }
    }
}
setInterval(Marquee,speed);

//提交数据
function postcheckGuige() {
    var url = "/checkout.php?";
    var loopindex = $(".package .tab-sel").attr('data-loopindex');
    url = url+ 'loopindex='+loopindex;

    var comb_id = $(".package .tab-sel").attr('combo_id');
    var productId = $('input[name="product_id"]').val();
    url = url + "&combo_id="+comb_id + '&product_id=' + productId;
    // 跳转
    window.location.href = url;
    return false;
}
$("#add").on('click',function(){
    postcheckGuige()
})
//评论满意度
$('span.right span').on('click',function(){
    var index = $(this).index();
    $('span.right span').removeClass('star');
    for (var i = 0; i<=index;i++) {
        $('span.right span').eq(i).addClass('star');
    }
})