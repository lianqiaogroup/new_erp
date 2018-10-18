// iamge delay load
$(function lazyload(){
    var screenHeight = $(window).height();
    showImg(screenHeight);
    window.addEventListener('scroll', function(){
        var img = $('.lazyload');
        if(img.length<=0){
            // window.removeEventListener('scroll',arguments.callee);
            return false;
        }else{
            var screenHeight = window.scrollY+$(window).height();
            setTimeout(function(){
                showImg(screenHeight);
            }, 50)
        }
    });
    // open img
    function showImg(height){
        var img = $('.lazyload');
        for (var i = 0; i < img.length; i++) {
            var top = img.eq(i).offset().top;
            var src = img.eq(i).attr('data-img');
            var nextTop = img.eq(i+1).length > 0 ? img.eq(i+1).offset().top : -1;
            // console.log(nextTop);
            if( top!=nextTop && top!=0 && top<=height) {
                if( src ){
                    img.eq(i).attr('src',src).removeClass('lazyload');
                }
            }
        }
    }
});