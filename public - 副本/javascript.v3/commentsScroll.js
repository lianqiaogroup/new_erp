$(function(){
    var boxer = $('[data-fn=commentScroll]');
        boxer.map(function(index, dom){
            var list = $(dom).children().eq(0);
            var clone = list.clone();
            $(dom).append(clone);
            var speed = 35;
            function Marquee(){
                if( $(dom)[0].scrollTop - list.height() >= 4 ){
                     $(dom)[0].scrollTop = 0; 
                }else{
                     $(dom)[0].scrollTop = $(dom)[0].scrollTop+1;
                }
            }
            setInterval(Marquee,speed);
        });
});
