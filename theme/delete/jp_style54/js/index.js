
TouchSlide({
	slideCell:"#imgScroller",
	mainCell:"#imgScroller ul",
	effect:"leftLoop",
	autoPlay:true
});
$(document).ready(function(){
	var combo_id = $('input[name="combo_id"]').val();
	if(combo_id != 0){
		$('.goods[combo_id="'+ combo_id +'"]').show();
	}
    var is_single = $('#combo')[0]? $('#combo').find("option:selected").attr('data-single'):0;
    if(is_single == 1){
        $('.count_num').hide()
    }
	refresh_price();
	$('#combo').change(function(){
        is_single = $(this).find("option:selected").attr('data-single');
        if(is_single == 1){
            $('.count_num').hide();
        }else{
            $('.count_num').show();
        }
		var val = $(this).val();
		$('input[name="combo_id"]').val(val);
		$('.goods').hide();
		$('.goods[combo_id="'+ val +'"]').show();
		refresh_price();
	});
    addnumber = function(){
        $('#num').val(parseInt($('#num').val())+1);
        $(".less").css({color:'#252c41'});
        refresh_price(); 
    }
    minnumber = function(){
        if($('#num').val() > 1){
            $('#num').val(parseInt($('#num').val())-1);
            $(".less").css({color:'#252c41'});
            refresh_price();
        }else{
            $(".less").css({color:'#dddfe6'});
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
            data: $('input[name=\'combo_id\'],input[name=\'product_id\'],#act, input[name=\'num\']'),
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
    $('#buyItNowBtn').click(function(){
    	var url = "/checkout.php?";
    	// 数量
        var count = parseInt($('input#num').val()) || 1;
        url = url + "count="+count;
        // 产品ID
        var comb_id = $('input[name="combo_id"]').val();
        var productId = $('input[name="product_id"]').val();
        url = url + "&combo_id="+comb_id + '&product_id=' + productId;

        var prototype = [];
        if(comb_id == 0){
        	$('.trait-mnu').map(function(index,item){
        		var g = $('.trait-mnu').eq(index).attr('for');
        		var a = $('.trait-mnu').eq(index).val();
        		prototype.push(g+'-'+a);
        	})
        	url = url + "&proto="+prototype.join('|');
        }else{
        	$('.goods[combo_id="'+ comb_id +'"]').map(function(index,item){
        		var g = $('.goods[combo_id="'+ comb_id +'"]').eq(index).attr('goods_id');
        		var p = $('.goods[combo_id="'+ comb_id +'"]').eq(index).attr('group_id');
        		var a = $('.goods[combo_id="'+ comb_id +'"]').eq(index).find('.trait-mnu').val();
        		prototype.push(g+'-'+p+'-'+a);
        	})
        	url = url + "&proto="+prototype.join('|');
        }
        window.location.href = url;
    })
    $('#toplink').click(function(){
    	$(window).scrollTop(0,0);
    })
})
