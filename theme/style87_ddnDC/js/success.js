var screenWidth = parseInt($(window).width());
if(screenWidth > 1000){
    $('.panel_small').remove();
    $('.explain').unwrap()

}else{
    $('.panel_large').remove();
    $('.timetips').unwrap()
}
function skip(){
	var link = $('.order_quality').attr('href');
	window.location.href=link;
}
	$(document).ready(function(){
		if(screenWidth>1000){
			setTimeout(skip,3000);
		}
    });
    
//获取域名
var host = window.location.host;
$('.copyright span').html(host.match(/^www\.(\S*)\./)[1]);