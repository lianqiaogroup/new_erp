
$(document).ready(function() {
    TouchSlide({ 
        slideCell:"#mainImages",
        mainCell:"#mainImages ul",
        titCell:"#imgNum span",
        autoPlay:true,
        effect:"leftLoop",
        prevCell:'.prev',
        nextCell:'.next'
    });
    $('.js_BottomClose').click(function(params) {
        $('.js_Info').hide();
        $('.js_NaviIcon').removeClass('iconArw01ubl').addClass('iconArw01dbl');
    })
    $('.js_InfoTitle').click(function(){
        $('.js_Info').show();
        $('.js_NaviIcon').removeClass('iconArw01dbl').addClass('iconArw01ubl');
    });

    $(window).scroll(function() {
        var sroheight = $(window).scrollTop();
        if(sroheight >= 800){
            $('#fixedToTop').show();
            $('.js_PageTop').animate({width:'76px',height:'76px',opacity:'1'},1000);
        }else{
            $('#fixedToTop').hide();
            $('.js_PageTop').animate({width:'0px',height:'0px',opacity:'0'},1000);
            
        }
    });
    $('.js_PageTop').click(function(){
        window.scrollTo(0,0);
    });

})