var State = {}
State.selected = {
    combo_id: ''
    , combo_price: '0'
    , count: 1
    , loopIndex: 0
    , multiple: true
}
var fbqstatus = {
    AddToCart: 0,
    InitiateCheckout: 0,
    AddPaymentInfo: 0
}

require(['swiper'], function(){
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
    var video = document.getElementById("video");
    if(video){
        video.addEventListener("play", function () {
            mySwiper1.stopAutoplay();
        }, false);
        $(".swiper-container").on("touchmove", function () {
            video.pause();
        });
        $(".swiper-container").on("mouseup", function () {
            video.pause();
        });
        $(document).scroll(function () {
            var top = $(window).scrollTop();
            var h = $("header").height() + $(".img_wrap").height()
            if (top > h) {
                video.pause();
            }
        });
    }
   
});

$(function(){

    // people like
    +(function(dom){
        dom.show().on('click', '[act-close]', function(event) {
            event.preventDefault();
            dom.hide();
        });
    })($('.like_wrap'));


    // 延时加载图文详情
    setTimeout(function(){
        var content = $('#ceontentTemplate').text();
            // content = content.replace(/poster=\"[^\"]*\"/g, '');
            // content = content.replace(/preload=/g, 'poster="/public/image/videoPlay.jpg" preload=');
        $('.m-img').html(content);
    }, 1000);


    // 倒计时模块
    +(function(){
        var interval = 1000;
        var deadline_date = $('#timer').attr('data-value');
        if( !deadline_date ) return false;

        var time_step = $('#timer').attr('data-step') || '8';
        // reset
        function resetDate(){
            var _currentTime = new Date().getTime()+28800000+(parseInt(time_step)*3600*1000);
            var _currentDate = new Date();
                _currentDate.setTime(_currentTime);
                _currentDate = _currentDate.toISOString().replace('T',' ');
                _currentDate = _currentDate.replace(/\.[0-9a-zA-Z]*/g,'');
            deadline_date = _currentDate;
            $('#timer').attr('data-value', deadline_date);
        }
        // module core
        function ShowCountDown() {
            var time = deadline_date;
                time = time.replace(/-/g, '/'); 
            var deadline = Date.parse(time);
            var now = new Date().getTime();
            if( deadline <= now ){
                resetDate();
                deadline = Date.parse(time);
            }
            var leftTime = deadline - now;
            var leftsecond = parseInt(leftTime/1000);
            var day1=Math.floor(leftsecond/(60*60*24));
            var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
            var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
            var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
            $('#timer').html("<span id='h'>"+0+hour+"</span>"+"<span class='colon'>:</span>"+"<span id='m'>"+minute+"</span>"+"<span class='colon'>:</span>"+"<span id='s'>"+second+"</span>"+"<span class='colon'></span>");
            
        }
        deadline_date == '' && resetDate();
        ShowCountDown();
        window.setInterval(function(){ ShowCountDown(); }, interval);
    })();

    // make default choosen
    // $('.dxbox').each(function(){
    //     if($(this).find('label').length == 1){
    //         $(this).find('input[type="radio"]').eq(0).prop('checked',true);
    //         $(this).find('label').eq(0).addClass('tab-sel');
    //     }
    // })
    // 
    $('label.attrs').on('click',function(){
        var allItem = $(this).parent().find('label');
        for(var i = 0;i<allItem.length;i++){
            allItem.eq(i).removeClass('tab-sel');
            $(this).addClass('tab-sel');
        }
        var data_index = $(this).parents('section').attr('data-loopindex');
        $('.combo[data-loopindex="'+ data_index +'"]').addClass('tab-sel');
        $('.combo[data-loopindex="'+ data_index +'"]').find('input').prop("checked", 'true');
    });

    // handleComboChange
    $('.combo').on('click',function(event){
        $('.combo').removeClass('tab-sel');
        $(this).addClass('tab-sel');
        var data_index = $(this).attr('data-loopindex');
        $('.combo[data-loopindex="'+ data_index +'"]').find('input').prop("checked", 'true');
        handleComboChange(data_index);
    });

    var region_code = $("#region_code").val();
    //泰国及台湾地区加入fb三个事件；
    if (region_code == 'THA' || region_code == 'TW' || region_code == 'HK') {
        //fb加入购物车事件
        $('.buy_now').on('click', function () {
            if (fbqstatus.AddToCart == 0) {
                fbq('track', 'AddToCart');
                fbqstatus.AddToCart++;
            };
        });
        //fb发起结账事件
        var list = $('.dxbox .attrs ');
        for (var i = 0; i < list.length; i++) {
            list[i].onclick = function () {
                if (fbqstatus.InitiateCheckout == 0) {
                    fbq('track', 'InitiateCheckout');
                    fbqstatus.InitiateCheckout++;
                };
                if (fbqstatus.AddToCart == 0) {
                    fbq('track', 'AddToCart');
                    fbqstatus.AddToCart++;
                };
            }
        }
        //fb添加支付信息
        $('input[name="name"]').on("keydown", function () {
            if (fbqstatus.AddPaymentInfo == 0) {
                fbq('track', 'AddPaymentInfo');
                fbqstatus.AddPaymentInfo++;
                if (fbqstatus.InitiateCheckout == 0) {
                    fbq('track', 'InitiateCheckout');
                    fbqstatus.InitiateCheckout++;
                };
                if (fbqstatus.AddToCart == 0) {
                    fbq('track', 'AddToCart');
                    fbqstatus.AddToCart++;
                };
            };
        });
    };
    // 
    handleComboChange(1);


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
function handleComboChange(index){
    var target = $('.combo[data-loopindex="'+ index +'"]');
    //
    State.selected.combo_id = target.attr('data-comboId');
    State.selected.combo_price = target.attr('data-price');
    State.selected.loopIndex = target.attr('data-loopIndex') ? target.attr('data-loopIndex') : 1;
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
        if($(this).find('label').length == 1){
            $(this).find('input[type="radio"]').eq(0).prop('checked',true);
            $(this).find('label').eq(0).addClass('tab-sel');
        }
        if($(this).find('.tab-sel').length != 0){
            $(this).find('.tab-sel').find('input[type="radio"]').prop('checked',true);
        }
    });
}

// 
function handleScrollTop(){
    // $('body,html').animate({ scrollTop: 0 }, 500);
    $(window).scrollTop(0)
}

// get price
function handleRefreshPrice(){
    $('input[name="price"]').val(State.selected.count*State.selected.combo_price);
}

// check comobo multiple
function handleRefreshMultiple(){
    State.selected.multiple ? $('#num').val(1).parents('.bdbox').hide() : $('#num').parents('.bdbox').show();
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

// malaysia address code
// $('#region_code').val()=='MYS' && (function(){
//     window.ajaxLocked = false;
//     $('[name="postal"]').blur(function(){
//         var postal_code = $(this).val();
//         if( postal_code=='' ) return false;
//         window.ajaxLocked = true;
//         $.ajax({
//             url: '/api_postcode_address_mapping.php'
//             , type: 'post'
//             , data:{'postName': postal_code }
//             , dataType: 'json'
//             , success: function(response){
//                 ajaxLocked = false;
//                 if( response && response.ret==1 ){
//                     $('[name="state"]').val(response.data['state']||'-');
//                     $('[name="city"]').val(response.data['city']||'-');
//                     $('[name="district"]').val(response.data['district']||'-');
//                 }else{
//                     $('[name="state"]').val('-');
//                     $('[name="city"]').val('-');
//                     $('[name="district"]').val('-');
//                     var errorText = $('[name="postal"]').attr('data-error') || '';
//                     alert(errorText);
//                     $('[name="postal"]').val('');
//                     return false;
//                 }
//             }
//         });
//     });
// })();
function checkattrs(ev){
    var loop = $('.combo.tab-sel').attr('data-loopindex');
    var attr = $('section[data-loopIndex="'+ loop +'"] ').find('.dxbox[datattr]');
    if( attr.length > 0 ){
        var prototype = [];
        attr.each(function(){
            var dom = $(this).find('label.tab-sel');
            var prototypeId = dom.find('input[type="radio"]:checked').val();
            if(typeof prototypeId != 'undefined'){
                prototype.push(prototypeId);
            }
        });
        if(prototype.length < attr.length){
            alert($('#page-order').attr('data-error'));
            $(window).scrollTop($('#form').offset().top);
        }else{
            $('a[data-cuckootag="confirm_order"]').trigger('click');
        }
    }else{
        $('a[data-cuckootag="confirm_order"]').trigger('click');
    }
}

//泰国选择市区
$(function(){

    // 判断地区
    var region_code = $('#region_code').val();
    if (region_code!='THA') return;

    // 清除表单函数
    function cleanRegionForm() {
        $('#tha_postal').val('');
        $(".tha_district").html('').append('<option>ตำบล อำเภอ</option>');
        $('.regions').html($('.regions').attr('placeholder'));
        $('input[name="city"]').val('');
    }

    // 用语判断是否正在请求
    window.ajaxLocked = false;
    // 绑定事件
    $('#tha_postal').change(function(){
        var id = $(this).val();
        ajaxLocked = true;
        $.ajax({
            url: 'region.php',
            type: 'post',
            data:{'postName':id},
            dataType: 'json',
            success: function(ret) {
                if (ret && ret.length!=0) {
                    if(ret.length != 0){
                        var option = "";
                        for (var i in ret) {
                            option += '<option value="'+ret[i].name+'" data-city="'+ret[i].parent_name+'">'+ret[i].name+'</option>';
                            $('.regions').html(ret[0].parent_name);
                            $('input[name="city"]').val(ret[0].parent_name);
                        }
                        $(".tha_district").html('').append(option);
                        ajaxLocked = false;
                    }
                }else{
                    ajaxLocked = true;
                    cleanRegionForm();
                    alert('รหัสไปรษณีย์ ผิด!');
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
})

var region_code = $('#region_code').val() || '';

// 
region_code == 'MYS' && (function(){
    $("[name='state']").change(function (event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        loadCity(id);
    });
    $('[name="city"]').change(function (event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        loadDistrict(id);
    });
    $('[name="district"]').change(function (event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        loadStreet(id);
    });
    $('[name="street"]').change(function (event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-postal');
        if (id) {
            $('[name="postal"]').val(id)
        } else {
            $('[name="postal"]').val("")
        }
    });
    function loadstate() {
        var region_id = $("#region_code").attr('data-id');
        $.post('/region.php', { 'region_id': region_id }, function (data) {
            var data = JSON.parse(data);
            data.map(function (item, index) {
                $('[name="state"]').append('<option value="' + item.name + '" data-id="' + item.id_region + '">' + item.name + '</option>');
            });
            var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        });
    }
    function loadCity(id, callback) {
        $.post('/region.php', { 'yn_region_id': id }, function (data, textStatus, xhr) {
            var first = $('[name="city"]').children().first();
            $('[name="city"]').children().remove();
            $('[name="city"]').append(first);
            var districtFirst = $('[name="district"]').children().first();
            $('[name="district"]').children().remove();
            $('[name="district"]').append(districtFirst);
            var postalFirst = $('[name="street"]').children().first();
            $('[name="street"]').children().remove();
            $('[name="street"]').append(postalFirst);
            $('[name="postal"]').val("");
            var data = JSON.parse(data);
            data.map(function (item, index) {
                $('[name="city"]').append('<option value="' + item.name + '" data-id="' + item.id_region + '">' + item.name + '</option>');

            });
        });
    }
    function loadDistrict(id) {
        $.post('/region.php', { 'yn_region_id': id }, function (data) {
            var districtFirst = $('[name="district"]').children().first();
            $('[name="district"]').children().remove();
            $('[name="district"]').append(districtFirst);
            var postalFirst = $('[name="street"]').children().first();
            $('[name="street"]').children().remove();
            $('[name="street"]').append(postalFirst);
            $('[name="postal"]').val("");
            var data = JSON.parse(data);

            var newInput = '<select name="district"></select>';
            $('input[name="district"]').before(newInput);
            $('input[name="district"]').remove();
            data.map(function (item, index) {
                $('[name="district"]').append('<option data-id="' + item.id_region + '" value="' + item.name + '">' + item.name + '</option>');
            });

        });
    }
    function loadStreet(id) {
        $.post('/region.php', { 'yn_region_id': id }, function (data) {
            var first = $('[name="street"]').children().first();
            $('[name="street"]').children().remove();
            $('[name="street"]').append(first);
            var data = JSON.parse(data);
            data.map(function (item, index) {
                $('[name="street"]').append('<option data-postal="' + item.post_code + '" value="' + item.name + '">' + item.name + '</option>');
            });
        });
    };
    loadstate();
})();

// 
region_code == "TW" && (function(){
    loadstate();
    $('[name="city"]').change(function(event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        loadCity(id);
    });
    function loadstate(){
        var region_id = $("#region_code").attr('data-id');
        $.post('/region.php', { 'region_id': region_id }, function(data) {
            var data = JSON.parse(data);
                data.map(function(item, index){
                    $('[name="city"]').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');
                });
            var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        });
    }
    function loadCity(id, callback){
        $.post('/region.php', { 'yn_region_id': id }, function(data, textStatus, xhr) {
            var districtFirst = $('[name="district"]').children().first();
            $('[name="district"]').children().remove();
            $('[name="district"]').append(districtFirst);
            $('[name="district"]').val('');
            var data = JSON.parse(data);
            data.map(function(item, index){
                $('[name="district"]').append('<option value="'+item.name+'" data-id="'+item.id_region+'">'+item.name+'</option>');
            });
        });
    }
})()

region_code == "KHM" && (function(){
    $('[name="city"]').change(function(event) {
        var id = $(this).find("option").not(function () { return !this.selected }).attr('data-id') * 1;
        loadCity(id);
    });
    function loadCity(id, callback){
        if(id){
            $.post('/region.php', { 'yn_region_id': id }, function(data) {
                var data = JSON.parse(data);
                $('[name="district"]').val(data[0].name);
                $('[name="postal"]').val(data[0].post_code)
            });
        }else{
            $('[name="district"]').val("");
            $('[name="postal"]').val("")
        }
    }
})()