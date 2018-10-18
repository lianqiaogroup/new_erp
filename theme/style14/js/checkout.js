require(['jquery', 'widget'],function($){
    $(document).ready(function(){
        var count = Cjs.url.getParamByName('count');
        $('input[name="num"]').val(count);
        var combo_id = Cjs.url.getParamByName('combo_id');
        $('input[name="combo_id"]').val(combo_id);
        refresh_price();
        $('#combo_' + combo_id).show();
        var imgsrc = $('#combo_' + combo_id).attr('dataimg');
        $('#imgsrc').attr('src',imgsrc);
        var str = Cjs.url.getParamByName('proto') || "";
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
        $('.pay_type').click(function(){
            $('.pay_type').removeClass('checked');
            $(this).addClass('checked');
            var type = $(this).attr('rel');
            var text = $(this).html();
            $('input[name="payment_type"]').val(type);
            $('.chip[payment_type]').html(text)
        })
        
    })
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
    var _region = $("#_region").val();
    function refresh_price() {
        $.ajax({
            url: '/checkout.php?',
            type: 'post',
            data: $('input[name=combo_id], #act, input[name=\'num\']'),
            dataType: 'json',
            success: function(json) {
               if(json.ret){
                    //$('combprice').html(json.price);
                    $("#price").html(json.total);
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
    function postcheck(){
        try{
            if (document.form.name.value==""){
                alert('請填寫姓名！');
                document.form.name.focus();
                return false;
            }
            var name = /^[a-zA-Z\u4e00-\u9fa5\s]{2,}$/;
            if (!name.test(document.form.name.value)){
                alert('姓名格式不正確，請重新填寫！');
                document.form.name.focus();
                return false;
            }
        }
        catch(ex){
        }
        try{
        }
        catch(ex){
        }
        try{
            if (document.form.mob.value==""){
                alert('請填寫手機號碼！');
                document.form.mob.focus();
                return false;
            }
            switch(_region){
                case "台灣":
                    if (/^09/.test(document.form.mob.value) && !/^\d{10}$/.test(document.form.mob.value)) {
                        alert('手機號碼格式不正確，請重新填寫！');
                        document.form.mob.focus();
                        return false;
                    }
                    if (!/^0\d{6,10}/.test(document.form.mob.value)) {
                        alert('手機號碼格式不正確，請重新填寫！');
                        document.form.mob.focus();
                        return false;
                    }
                    break;
                case "香港":
                    break;
            }
        }
        catch(ex){
        }
        try{
            if (document.form.province.value==""){
                alert('请选择所在地区！');
                document.form.province.focus();
                return false;
            }
        }
        catch(ex){
        }
        try{
            if (document.form.address.value==""){
                alert('请填写详细地址！');
                document.form.address.focus();
                return false;
            }
        }
        catch(ex){
        }   

        // sms valid
        if( window.smsAuth == true ){
            var formdata = $('#form').serialize();
            window.widget.smsvalid.start(formdata);
            return false;
        }

        return true;
    }



})