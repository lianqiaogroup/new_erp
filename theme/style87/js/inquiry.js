//删除元素
var screenWidth = parseInt($(window).width());
if(screenWidth > 1000){
    $('.panel_small').remove();
}else{
    $('.panel_large').remove();
}
$('#details').unwrap();
var host = window.location.host;
$('.copyright span').html(host.match(/^www\.(\S*)\./)[1]);

require(['widget']);