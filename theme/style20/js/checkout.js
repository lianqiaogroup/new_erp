require(['jquery','widget'],function($, Swiper){
    $(document).ready(function(){
        var combo_id = Cjs.url.getParamByName('combo_id');
        $('input[name="combo_id"]').val(combo_id);
        $('#combo_' + combo_id).show();
        //套餐是否可选数量
        var single_c =  $('#combo_' + combo_id).attr('single_c');
        if(parseInt(single_c) == 1){
            $('#num').val(1);
            $('#num').parents('.check_num').hide();
        }else{
            $('#num').parents('.check_num').show();
        }

        var str = Cjs.url.getParamByName('proto') || "";
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
                        $('#attr_img_'+combo_id).attr('src',img);
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
                    var img = $('[optionsKey][data-id="'+ value +'"]').attr('data-img');
                    if(img){
                        $('#attr_img').attr('src',img);
                    }
                });
            }
            $('#form').append(html.join(''));
        }
        refresh_price();
        addnumber = function(){
            $('#num').val(parseInt($('#num').val())+1);
            refresh_price(); 
        }
        minnumber = function(){
            if($('#num').val() > 1){
                $('#num').val(parseInt($('#num').val())-1);
                refresh_price();
            }
        }
        inputnumber = function(){
            var number=parseInt($('#num').val());
            if(isNaN(number)||number < 1){
                $('#num').val('1');
                refresh_price();
            }else if(number > 1){
                $('#num').val(number);
            }
            refresh_price();
        }
        
        setDistrict = function(){
           var cid = $("select[name='city']").find("option:selected").attr('cid');
           $.post('region.php',{'yn_region_id':cid}).success(function (data) {
               if (data)
               { // <select name="district" style="display: none;">
                   var option ='<select name="district" style="">';
                   var ret = JSON.parse(data);
                   for(var i in ret)
                   {
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
        window.widget.repeatOrder.getproattr();
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name=combo_id], #act, input[name=\'product_id\'],input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
               if(json.ret){
                    var rmoney = widget.fmoney(json.total,3);
                    $('#price').html(rmoney);
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
    window.widget.repeatOrder.init();
    window.widget.repeatOrder.getproattr();
    window.widget.smsvalid && window.widget.smsvalid.init();//短信验证
})