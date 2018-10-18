/**
 * Created by Administrator on 2017/2/21 0021.
 */
$(function(){
    // 初始化选择
    $("#comb .tab").eq(0).addClass('tab-sel').find('input').attr("checked", 'true');
    $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
    $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
    // 选择产品
    $("#comb .tab").click(function(event) {
        /* Act on the event */
        $(this).addClass('tab-sel').siblings().removeClass('tab-sel');
        $(this).find('input').attr("checked", 'true');
        $(this).siblings().find('input').attr("checked", false);
        $('#comb').attr('data-price', $(this).attr('data-price'));
        $('[currentprice]').html($(this).attr('data-price'));
        refresh_price();
    });

    $('.u-format.count_atrr').each(function(){
        var obj = $(this).find('.tab');
        obj.eq(0).addClass('tab-sel');
        var id = obj.attr('data-id');
        $(this).attr('data-select', id);
    });

    // 选择事件
    $('.u-format.count_atrr').on('click', '.tab', function(){
        var self = $(this);
        var id = self.attr('data-id');
        self.addClass('tab-sel').siblings().removeClass('tab-sel');
        self.parents('.u-format.count_atrr').attr('data-select', id);
        var src = self.attr('data-img');
        if( src ){ $('#attrimg').attr('src', src); }
    });
});

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

// 刷新价格
function refresh_price() {
    $.ajax({
        url: 'checkout.php?',
        type: 'post',
        data: $('#comb input[checked=checked], #act, input[name=\'num\']'),
        dataType: 'json',
        success: function(json) {
            if(json.ret)
            {
                $("#price").html(json.total);
                $("input[name='price']").val(json.total);
            }
            else{
                alert(json.msg)
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
        }
    });
}

// 提交表单
function postcheck() {
    /* Act on the event */
    var prototype = [];
    $('.tc:visible .u-format.count_atrr').each(function(){
        var groupId = $(this).attr('data-group');
        var prototypeId = $(this).attr('data-select');
        if( parseInt(prototypeId)>0 ){
            prototype.push(groupId+"-"+prototypeId);
        }
    });
    if( prototype.length == 0 ){
        $(".att_fixed").css("display","block")
        $(".att_fixed button").click(function () {
            $(".att_fixed").css("display","none")
        })
        $("body").click(function () {
            $(".att_fixed").css("display","none")
        })
        return false;
    }
    // 数量
    var count = parseInt($('input#num').val());

    var comb_id = $("#comb .tab-sel").find('input').val();
    // 跳转
    window.location.href="checkout.php?proto="+prototype.join('|')+"&count="+count+"&comb_id="+comb_id;
    return false;
}

//=======================================
$(function(){
    // 计时器

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


    // 显示属性层
    /*$('.btn-addToCart').on('click', function(event) {
        event.preventDefault();
        $('#page-order').show();
        $("#page-index").hide();
        $(window).scrollTop(0);
    });
    $('.detailback').on('click', function(event) {
        event.preventDefault();
        $('#page-order').hide();
        $("#page-index").show();
    });
    $('#val-sel').on('click', function(event) {
        event.preventDefault();
        $('#page-order').show();
        $("#page-index").hide();
        $(window).scrollTop(0);
    });*/
});
//投射预售价格
$(function () {
    var $pricePre = $(".tab span a").eq(0).text()
    $("._price_one a").html($pricePre)
        $(".package .tab").click(function () {
            var adds = $(this).index();
            var $pricePre = $(".tab span a").eq(adds).text()
            var $list = parseInt($("input#num").val())
            $("._price_one a").html($pricePre*$list)
        })
    })
$(function () {
    $(".package .tab").click(function () {
        var sds = $(this).index()
        var $pricePre2 =$(".tab span a").eq(sds).text()
        $(".more").click(function () {
            var $list = parseInt($("input#num").val())
            $("._price_one a").html($pricePre2*$list)
        })
        $(".less").click(function () {
            var $list = parseInt($("input#num").val())
            $("._price_one a").html($pricePre2*$list)
        })
    })

})
$(function () {
    $(".lun_right li img").click(function () {
        var dj = $(this).index()
        console.log(dj)
        $(".big_banner img").eq(dj).fadeIn()
        $(".big_banner").css({display:'block'})
    })
    $(".big_banner div").click(function () {
        $(".big_banner img").fadeOut()
        $(".big_banner").fadeOut()
    })
})
$(document).ready(function(){
    $("input[name='combo_id']").each(function(){
        if($(this).prop('checked')){
            $(".tc"+$(this).val()).show();
        }else{
            $(".tc"+$(this).val()).hide();
        }
        $(this).click(function(){
            $(".tc").hide();
            $(".tc"+$(this).val()+" .con .tab").addClass('tab-sel').siblings().removeClass('tab-sel');
            $(".tc .con tab").children('input').removeAttr("checked");
            $(".tc"+$(this).val()+" .con").each(function () {
                var obj = $(this).find('.tab');
                obj.eq(0).addClass('tab-sel').children('input').prop("checked", 'true');
            });
                //.eq(0).addClass('tab-sel').children('input').prop("checked", 'true');
            $(".tc"+$(this).val()).show();
        });

    })
});

