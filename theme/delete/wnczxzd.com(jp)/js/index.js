function ShowCountDown(year,month,day,divname){
    var now = new Date();
    var endDate = new Date(year,month-1, day, now.getHours()+8);
    var leftTime=endDate.getTime()-now.getTime();
    var leftsecond = parseInt(leftTime/1000);
    var day1=Math.floor(leftsecond/(60*60*24));
    var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
    var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
    var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
    var cc = document.getElementById(divname);
    cc.innerHTML ="<span id='h'>"+0+hour+"</span>"+"<span class='colon'>時</span>"+"<span id='m'>"+minute+"</span>"+"<span class='colon'>分</span>"+"<span id='s'>"+second+"</span>"+"<span class='colon'>秒</span>";
}
window.setInterval(function(){ShowCountDown(2018,4,20,'timer');}, 1000);

//销售百分比
function percent(){
    //获取时间点
    var curhour= $('.percentBar').attr('data-value');
    var base=0,range=0;
    var percent   = document.getElementById("percentNum");
    var progress  = document.getElementById("progress");
    var soldNum  = document.getElementById("soldNum");
    if(curhour<=1000){
        base=70;range=5;
    }else
    if(curhour<=2000){
        base=70;range=10;
    }else
    if(curhour<=4000){
        base=70;range=15;
    }else
    if(curhour<=6000){
        base=70;range=20;
    }else
    if(curhour<=8000){
        base=70;range=25;
    }else
    if(curhour<10000){
        base=70;range=28;
    }
    var opercent=Math.floor(range+base);
    progress.style.width = percent.innerHTML = opercent+"%";
}

$(function(){
    percent();
});


//评论
$(function(){
    $('#sub').click(function(){
        $('#com-layer').show();
        $("body").addClass('over-hide');
    });
    $('.star').click(function(){
        $(this).addClass('action');
        $(this).prevAll().addClass('action');
        $(this).nextAll().removeClass('action');
        var star = $(this).attr('data_id');
        $('input[name="star"]').val(star);
    })

    var submitcount=0;
    $('#com_btn').click(function(){
        var self = this;
        if($("input[name='name']").val()=='')
        {
            alert('ご氏名を正しく入力ください');
            return false;
        }
        if($('textarea[name="note"]').val() == '')
        {
            alert('商品レビューの本文を入力してください');
            return;
        }
        var product_id = $(self).attr('data-id');
        var name = $("input[name='name']").val();
        var star = $("input[name='star']").val();
        var content = $('textarea[name="note"]').val();
        if (submitcount == 0)
        {
            $.post('/product_comment/'+product_id, { product_id, name, star, content , 'act': 'add'}, function(data, textStatus, xhr) {
                /*optional stuff to do after success */
                $('#com-layer').hide();
                $("body").removeClass('over-hide');
                $("input[name='name']").val("");
                $("input[name='mob']").val("");
                $('textarea[name="note"]').val("");
                var ret = JSON.parse(data);
                if(ret.ret)
                {
                    submitcount++;
                    alert("レビューを新規作成しましたが、審査完了 までしばらくお待ちください");
                }
                else
                {
                    alert('レビューの投稿に失敗しました。もう一度お試しください。');
                }
            });
        }
        else
        {
            alert("要求が頻繁すぎます。しばらくしてからもう一度お試しください。");
        }
    });

    $('#close').click(function(){
        $('#com-layer').hide();
        $("body").removeClass('over-hide');
    });
    
});

