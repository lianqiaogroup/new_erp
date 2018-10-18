define([], function(){
    +(function(){
        var style='<style>.autoFill{font-size:13px;position:fixed;right: 0;z-index: 10;top:60%;background:#fafafa;padding:10px 16px 20px;}.autoFill >div{margin-bottom:12px;}.autoFill .close{text-align:center}.autoFill >div label{display:block;width:60px;margin:0 auto;}.autoFill input[type="checkbox"]{-webkit-appearance:checkbox;margin-right:8px;width:auto;height:auto;}.autoFill a{border-radius:6px;padding:8px 16px;background:#169bd5;color:#fff;}</style>';
        var inputList = $('input[type="text"],input[type="number"],input[type="tel"],input[type="email"]');
        var inputJson = {'name':['姓名','测试'],'mob':['电话','0911111111'],'email':['邮箱','test@stosz.com'],'address':['地址','测试地址详细'],'postal':['邮编','000000'],'area':['地区','测试地区'],'last_name':['姓氏','测'],'postal_1':['邮编1','000'],'postal_2':['邮编2','000']};
      
        $('input[name="name"]').parents('#form').prepend('<div class="autoFill"><div class="close">展开/隐藏</div><div><label class="check_all"><input type="checkbox" name="check_all" value ="">全部</label></div><a>自动填充</a></div>');
        $('body').append(style);
        for(var i = 0;i<inputList.length;i++){
            if(inputList.eq(i).attr('name') in inputJson){
                $('.autoFill >div').eq(1).prepend('<label><input type="checkbox" name="fill_form" value="'+ inputList.eq(i).attr('name') +'">'+ inputJson[inputList.eq(i).attr('name')][0] +'</label>');
            }
        }                
        $('.autoFill .check_all').on('click',function(){
            $('[name="fill_form"],[name="check_all"]').prop('checked','checked'); 
        })
        $('.autoFill .close').on('click',function(){
            $(this).next().toggle();
        })
        //填充表单
        $('.autoFill a').on('click',function(){
            var obj=$('[name="fill_form"]');
            for(var i=0; i<obj.length; i++){ 
                if(obj[i].checked){
                    $('[name="'+ obj.eq(i).val() +'"]').val(inputJson[obj.eq(i).val()][1]);
                }
            }
        });
    })();
});
