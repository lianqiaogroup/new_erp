require(['jquery', 'swiper'], function($){ 

    $(function(){
        // 初始化选择
        $("#comb .tab").eq(0).addClass('tab-sel').find('input').attr("checked", 'true');
        $('#comb').attr('data-price', $("#comb .tab-sel").attr('data-price'));
        $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
        // 选择产品
        $("#comb .tab").click(function(event) {
            /* Act on the event */
            var that = $(this);
            var price = $(this).attr('data-price');
            var data_comb = parseInt($(that).attr('data_comb'));
            //console.log(data_comb);
            //if($(that).attr('data_comb') == $('section[data-loopIndex]').attr('data-loopIndex')){
                $('section[data-loopIndex]').removeClass('action');
                $('section[data-loopIndex]').eq(data_comb).addClass('action');
                
            //}
            that.addClass('tab-sel').siblings().removeClass('tab-sel');
            that.find('input').attr("checked", 'true');
            that.siblings().find('input').attr("checked", false);
            $('#comb').attr('data-price', price);
            $('[currentprice]').html(price);
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

    // 刷新价格
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
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
    function postcheckGuige() {
        var url = "/checkout.php?";

        // 数量
        var count = parseInt($('input#num').val()) || 1;
        url = url + "count="+count;

        // 套餐ID
        var comb_id = $("#comb .tab-sel").find('input').val();
        url = url + "&comb_id="+comb_id;
        //console.log(comb_id);
        /* Act on the event */
        if( $('.u-format.count_atrr').length > 0 ){
            var prototype = [];
            var len =  $('section.action').find('.count_atrr').length;
            var dom =  $('section.action').find('.count_atrr');
            for(var i = 0;i< len;i++){
                var groupId = dom.eq(i).attr('data-group');
                var prototypeId = dom.eq(i).attr('data-select');
                var goodsid = dom.eq(i).attr('data-goodid');
                if(parseInt(comb_id) != 0){
                    prototype.push(goodsid+"-"+groupId+"-"+prototypeId);
                }else{
                    prototype.push(groupId+"-"+prototypeId);
                }
            }
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

    $('#add').on('click', function(event) {
        var w_top = parseInt($(window).scrollTop(),10);
        var w_height = parseInt(window.screen.height,10);
        var d_height = parseInt($('.option_detail').get(0).offsetHeight,10);
        var d_top = parseInt($('.option_detail').offset().top,10);
        //console.log(w_top+"+++"+top +"---"+w_heiht);
        if($('.arrow_d').hasClass('up')){
            // if(w_top >= 150){
                postcheckGuige();           
            // }
        }else{
            $('.option_detail').show();
            $('.arrow_d').addClass('up');
            $(window).scrollTop(d_top);
        } 
    });

})