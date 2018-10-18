var State = {}
State.selected = {
    combo_id: ''
    , combo_price: '0'
    , count: 1
    , loopIndex: 0
    , multiple: true
}


require(['swiper'], function(){
    $('.swiper-wrapper').find('.lazyload').map(function(index, item){
        $(item).attr('src', $(item).attr('data-img')).show();
    });
    var mySwiper1 = new window.Swiper('.swiper-container', {
        autoplay: 3000,
        loop: false,
        autoHeight:true,
        pagination: '.swiper-pagination',
        paginationType: 'custom',
        paginationCustomRender: function(swiper, current, total) {
            var text = "";
            text = '<span class="swiper-pagination-current">' + current + ' / <span class="swiper-pagination-total">'+ total +'</span>';
            return text;
        }
    });
});

function timeSet(years,months,days) {
    var year = years,month = months,day = days;
    function ShowCountDown(){
        var now = new Date();
        var endDate = new Date(year,month-1, day, now.getHours()+8);
        var leftTime=endDate.getTime()-now.getTime();
        var leftsecond = parseInt(leftTime/1000);
        var day1= Math.floor(leftsecond/(60*60*24));
        var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
        var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
        var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
        if (hour   <= 9) hour = "0" + hour;
        if (minute <= 9) minute = "0" + minute;
        if (second <= 9) second = "0" + second;
        if( document.getElementById("h") ){
            document.getElementById("h").innerHTML = hour;
            document.getElementById("m").innerHTML = minute;
            document.getElementById("s").innerHTML = second;
        }
    }
    window.setInterval(function(){
        ShowCountDown();
    }, 1000);
}

$(function(){



    timeSet(2018,4,20,'timer','tw');


    setTimeout(function(){
        var content = $('#ceontentTemplate').text();
        //     content = content.replace(/poster=\"[^\"]*\"/g, '');
        //     content = content.replace(/preload=/g, 'poster="/public/image/videoPlay.jpg" preload=');
        $('.m-img').html(content);
    }, 2000);


    // people like
    +(function(dom){
        dom.show().on('click', '[act-close]', function(event) {
            event.preventDefault();
            dom.hide();
        });
    })($('.like_wrap'));

    // make default choosen
    $('.dxbox').each(function(){
        $(this).find('input[type="radio"]').eq(0).prop('checked',true);
        $(this).find('label').eq(0).addClass('tab-sel');
    })
    // 
    $('.dxbox label').on('click',function(){
        var allItem = $(this).parent().find('label');
        for(var i = 0;i<allItem.length;i++){
            allItem.eq(i).removeClass('tab-sel');
            $(this).addClass('tab-sel');
        }
    });

    // handleComboChange
    $('.combo').on('click',function(event){
        handleComboChange();
    });

    // 
    handleComboChange();


    // sms open check
    window.widget.smsvalid && window.widget.smsvalid.init();

    function attrval(){
        var count = $('input[name="num"]').val();
        var combo_id = $('input[name="combo_id"]:checked').val() ? $('input[name="combo_id"]:checked').val() : $('input[name="combo_id"][checked]').val();
        var product_id = $('input[name="product_id"]').val();
        var sectionIndex = $('input[name="combo_id"]:checked').parent('label').attr('data-loopIndex') ? $('input[name="combo_id"]:checked').parent('label').attr('data-loopIndex') : $('input[name="combo_id"][checked]').parent('label').attr('data-loopIndex');
        
        if(parseInt(combo_id) == 0){
            var attrs = [];
            $('section[data-loopIndex]').eq(sectionIndex-1).find('[data-prototype-group]').each(function(){
                var a = $(this).find('input[type="radio"]:checked').val();
                attrs.push(a);
            });
        }else{
            var attrs = [];
            $('section[data-loopindex]').eq(sectionIndex-1).find('[comboproduct]').each(function(index,element){
                attrs[index] = [];
                attrs[index].push(product_id);
                attrs[index].push(count);
                var a = [];
                $(this).find('[data-prototype-group]').each(function(i,e){
                    var that = this;
                    a.push($(that).find('input[type="radio"]:checked').val());
                });
                attrs[index].push(a);
            });
        }
        window.widget.repeatOrder.getproattr(product_id,attrs,combo_id);
    }
    $('button[type="submit"]').on('click',function(){
        attrval();
    })
    window.widget.repeatOrder.init();

});


// 切换套餐
function handleComboChange(){
    var target = $('#combo .combo.tab-sel');
    //
    State.selected.combo_id = target.attr('data-comboId');
    State.selected.combo_price = target.attr('data-price');
    State.selected.loopIndex = target.attr('data-loopIndex');
    State.selected.multiple = target.attr('data-multiple')==1 ? true : false;
    // 
    setCombPrototypeInit(State.selected.loopIndex);
    // 
    handleRefreshPrice();
    // 
    handleRefreshMultiple();
}

// 根据套餐初始化
function setCombPrototypeInit(sectionIndex){
    // 显示对应属性选择区域
    $('section[data-loopindex]').eq(State.selected.loopIndex-1).show().siblings().hide();
    // 先要清除选中状态
    $('section[data-loopindex]').find('input').removeAttr("checked");
    $('section[data-loopindex]').eq(sectionIndex-1).find('.dxbox').each(function(){
        $(this).find('label').removeClass('tab-sel').eq(0).addClass('tab-sel').find('input').prop("checked", true);
    });
}

// 
function handleScrollTop(){
    $('body,html').animate({ scrollTop: 0 }, 500);
}

// get price
function handleRefreshPrice(){
    $('input[name="price"]').val(State.selected.count*State.selected.combo_price);
}

// check comobo multiple
function handleRefreshMultiple(){
    State.selected.multiple ? $('#num').val(1).prev().find('span').html(1).parents('.bdbox').hide() : $('#num').parents('.bdbox').show();
    handleRefreshPrice();
}



var liNum = $('.new_order li');
for (var i =0; i <= liNum.length; i++) {
    liNum.eq(2*i+1).addClass('odd');
}

// +
function addnumber(){
    $('#num').val(parseInt($('#num').val())+1);
    var num = $('#num').val();
    $('.textWrap .tt span').html(num);
    handleRefreshPrice();
}
// -
function minnumber(){
    if($('#num').val() > 1){
        $('#num').val(parseInt($('#num').val())-1);
        var num = $('#num').val();
        $('.textWrap .tt span').html(num);
        handleRefreshPrice();
    }
}
// 绑定所有事件
$('[command-click]').each(function(index, item){
    var fname = $(item).attr('command-click');
    $(item).on('click', eval(fname));
});

//泰国选择市区
    // 用语判断是否正在请求
    window.ajaxLocked = false;
    $('#tha_postal').change(function(){
        var id = $(this).val();
        ajaxLocked = true;
        $.ajax({
            url: 'region.php',
            type: 'post',
            data:{'postName':id},
            dataType: 'json',
            success: function(ret) {
                if(ret){
                    if(ret.length != 0){
                        var option = "";
                        for(var i in ret)
                        {
                            option += '<option value="'+ret[i].name+'" data-city="'+ret[i].parent_name+'">'+ret[i].name+'</option>';
                            $('.regions').html(ret[0].parent_name);
                            $('input[name="city"]').val(ret[0].parent_name);
                        }
                        $(".tha_district").html('').append(option);
                        ajaxLocked = false;
                    }else{
                        alert('รหัสไปรษณีย์ ผิด!');
                        $('#tha_postal').val('');
                        $('.tha_district').html('');
                        $('.regions').html('');
                        $('input[name="city"]').val('');
                        ajaxLocked = true;
                    }
                }else{
                    alert('รหัสไปรษณีย์ ผิด!');
                    $('#tha_postal').val('');
                    $('.tha_district').html('');
                    $('.regions').html('');
                    $('input[name="city"]').val('');
                    ajaxLocked = true;
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
            }
        });
    })
    $('.tha_district').change(function(event) {
        var option = $(this).children().not(function(){ return !this.selected });
        var city = option.attr('data-city');
        if( city != "" ){
            $('.regions').html(city);
            $('input[name="city"]').val(city);
        }
    });