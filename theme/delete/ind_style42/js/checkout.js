var loopindex = parseInt(Cjs.url.getParamByName('loopindex'))-1;
var combo_id = Cjs.url.getParamByName('combo_id');
$("section[data-loopindex]").eq(loopindex).show();
$("section[data-loopindex]").map(function(index,item){
	if(!($(item).is(":visible"))){
		$(item).remove();
	}
})
var price = $("section[data-loopindex]:visible").attr('data-price');
if(price){
	$('.price span span').html(price);
}else{
	price = $('.price span span').html();
}
$("input[name=combo_id]").val(combo_id);

//切换属性图
$('select').on('change',function(){
	var imgSrc = $(this).find('option:selected').attr('data-img');
	if (imgSrc) {
		console.log(imgSrc)
		$(this).parents('.single').find('img').attr('src',imgSrc);
	}
	
})
//
function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    $('.textWrap .tt').html($('#num').val());
    refresh_price(); 
}

function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        $('.textWrap .tt').html($('#num').val());
        refresh_price();
    }
}
$('input:radio[name="payment_type"]').change(function () {
    var val=$('input:radio[name="payment_type"]:checked').val();
    $('.cell label').removeClass('check');
    $('.cell label').eq(val).addClass('check');
})
if(($('select[name="province"]').val()) == 15){
    $('#province').css('width','45%');

}
$('.back').on('click',function(){
    history.go(-1);
})
//刷新价格
function refresh_price(){
	var total =$('#num').val()*price;
	$('.price span span').html(total);
}
function postcheck(){
	var node = $('select.count_atrr');
    for (var i = node.length - 1; i >= 0; i--) {
        if (node.eq(i).val()== 0) {
            alert('请选择属性');
            return false;
        }
    }
    return true;
}