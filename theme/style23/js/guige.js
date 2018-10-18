require(['jquery', 'swiper'], function($){ 
    $(function(){
        // 初始化选择
        setCombPrototypeInit(1);
        $('[currentprice]').html($("#comb .tab-sel").attr('data-price'));
        // 选择产品
        $("#comb .tab").click(function(event) {
            /* Act on the event */
            var that = $(this);
            var price = $(this).attr('data-price');
            var data_comb = parseInt($(that).attr('data_comb'));
            var loopindex = $(that).attr('data-loopindex');
            $('section[data-loopIndex]').removeClass('action');
            $('section[data-loopIndex]').eq(data_comb).addClass('action');
            that.addClass('tab-sel').siblings().removeClass('tab-sel');
            that.find('input').attr("checked", 'true');
            that.siblings().find('input').attr("checked", false);
            $('#comb').attr('data-price', price);
            $('[currentprice]').html(price);
            refresh_price();
            setCombPrototypeInit(loopindex);
        });

        // 根据套餐初始化
        function setCombPrototypeInit(sectionIndex){
            var section = $('section[data-loopindex]').eq(sectionIndex-1);
            section.find('.u-format.count_atrr').each(function(){
                if($(this).find('.tab').length == 1){
                    var first = $(this).find('.tab').eq(0).addClass('tab-sel');
                    var id = first.attr('data-id');
                    $(this).attr('data-select', id);
                }
            });
            singleCombo();
        }

        // 选择事件
        $('.u-format.count_atrr').on('click', '.tab', function(){
            var self = $(this);
            var id = self.attr('data-id');
            self.addClass('tab-sel').siblings().removeClass('tab-sel');
            self.parents('.u-format.count_atrr').attr('data-select', id);
            var src = self.attr('data-img');
            if( src ){ $('#attrimg').attr('src', src); }
        });
        singleCombo();
    });
    //套餐是否可选数量
    function singleCombo(){
        var single_c =  $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') ? $('input[name="combo_id"]:checked').parent('.tab').attr('single_c') : $('input[name="combo_id"][checked]').parent('.tab').attr('single_c');
        if(parseInt(single_c) == 1){
            $('#num').val(1);
            $('#num').parents('.quantity').hide();
        }else{
            $('#num').parents('.quantity').show();
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



})