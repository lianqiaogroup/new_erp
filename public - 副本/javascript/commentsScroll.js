define(['jquery'], function($){

    var boxer = $('[data-fn=commentScroll]');

        boxer.map(function(index, dom){
            var list = $(dom).children().eq(0);
            var clone = list.clone();
            $(dom).append(clone);
            var speed = 35;
            function Marquee(){
                if( $(dom).scrollTop() - list.height() >= 4 ){
                     $(dom).scrollTop(0); 
                }else{
                     $(dom).scrollTop($(dom).scrollTop()+1);
                }
            }
            setInterval(Marquee,speed);
        });


    return {}

});