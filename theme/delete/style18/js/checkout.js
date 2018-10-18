require(['jquery','widget'],function($, Swiper){
    $(document).ready(function(){
        var count = Cjs.url.getParamByName('count');
        $('input[name="num"]').val(count);
        $('.num').html("Số lượng x"+count);
        var combo_id = Cjs.url.getParamByName('combo_id');
        $('input[name="combo_id"]').val(combo_id);
        $('#combo_' + combo_id).show();
        var str = Cjs.url.getParamByName('proto');
        
        if(str){
            var strAttr = str.split('|');
            var html = [];
            if(parseInt(combo_id) != 0){
                strAttr.map(function(elem, index) {
                    var obj = elem.split('-');
                    var goodsid = obj[0]
                    var group = obj[1];
                    var value = obj[2]; 
                    html.push('<input type="hidden" name="attr['+ obj[0]+'-'+ obj[1] +']" value="'+ obj[2] +'">');
                    var data = elem;
                    $('span[optionskey][data-id="'+ data +'"]').show();
                    var img = $('span[optionskey][data-id="'+ data +'"]').attr('data-img');
                    if(img){
                        $('#attr_img').attr('src',img);
                    }
                });
            }else{
                strAttr.map(function(elem, index) {
                    var obj = elem.split('-');
                    //var goodsid = obj[0]
                    var group = obj[0];
                    var value = obj[1];
                    html.push('<input type="hidden" name="attr['+obj[0] +']" value="'+ obj[1] +'">');
                    $('[optionsKey][data-id="'+ value +'"]').show();
                });
            }
            $('#form').append(html.join(''));
        }
        refresh_price();
        setDistrict = function(){
            var cid = $("select[name='city']").find("option:selected").attr('cid');
            $.post('region.php',{'yn_region_id':cid}).success(function (data) {
                if (data){
                    var option ='<select name="district" style="">';
                    var ret = JSON.parse(data);
                    for(var i in ret){
                        option += '<option value="'+ret[i].name+'">'+ret[i].name+'</option>';
                    }
                    option +='</select>';
                    $(".district").html(option);
                }
            })
        }
        setDistrict();
    })
    var _region = $("#_region").val();
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name=combo_id], #act, input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
               if(json.ret){
                    $('#price').html(json.price);
                    $("input[name='price']").val(json.total);
               }
               else{
                   alert(json.msg)
               }
            },
            error: function(xhr, ajaxOptions, thrownError) {
            }
        });
    }
    // postcheck = function (){
    //     try{
    //         if (document.form.name.value==""){
    //             alert('xin ghi họ tên');
    //             document.form.name.focus();
    //             return false;
    //         }
    //     }
    //     catch(ex){
    //     }
    //     try{
    //         if (document.form.mob.value==""){
    //             alert('xin ghi số điện thoại');
    //             document.form.mob.focus();
    //             return false;
    //         }
    //     }
    //     catch(ex){
    //     }
    //     try{
    //         if (document.form.province.value==""){
    //             alert('xin chọn khu vực');
    //             document.form.province.focus();
    //             return false;
    //         }
    //     }
    //     catch(ex){
    //     }
    //     try{
    //         if (document.form.address.value==""){
    //             alert('xin ghi địa chỉ cụ thể(số nhà,huyển/xã,thành phố/tỉnh)');
    //             document.form.address.focus();
    //             return false;
    //         }
    //     }
    //     catch(ex){
    //     }   
    //     return true;
    // }
    window.widget.repeatOrder.init();
    window.widget.repeatOrder.getproattr();
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
})