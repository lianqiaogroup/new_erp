 $(function(){


    // 回到顶部
    $(".m-goToTop").click(function(event) {
        $(window).scrollTop(0);
    });

    // 轮播图
    var h = $(window).height();
    var mySwiper1 = new Swiper('.swiper-container', {
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


    $('[render=format]').html(moneyFormat($('[render=format]').html()));


    // 初始化选择
    var hClass = 'active';
    var combos = $('#combo .ui-col');
        combos.eq(0).addClass(hClass);
        $('[name="combo_id"]').val(combos.eq(0).attr('data-id'));
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
            var obj = $(this).find('span');
                obj.eq(0).addClass('active');
            var id = obj.attr('data-id');
            $(this).attr('data-id', id);
        });
        // 选择事件
        attrs.on('click', 'span', function(){
            var self = $(this);
            var id = self.attr('data-id');
            self.addClass('active').siblings().removeClass('active');
            self.parents('.product_attr').attr('data-id', id);
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
    url = url + "&comb_id="+comb_id;
    
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


