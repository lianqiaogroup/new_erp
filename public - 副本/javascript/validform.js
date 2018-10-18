/*
检查表单是否完整
param: {
    region_code: '地区编码'
}
return true/false  
*/
function ValidForm(region_code, theme) {
    var region_code = region_code || '';
    var timestamp = new Date().getTime();
    var config = JSON.parse($.ajax({ url: "/public/config/form_valid.json?v="+timestamp, async: false }).responseText);
    var response = config[region_code];
    var checkStatus = true;

    function check() {
        // 缺少省市区就给下单
        if (region_code=='') return true;

        // 91_2 不做格式判断
        if (theme=='style92_1') return true;
        if (theme=='style92') return true;
        if(theme == "style39" && region_code == "PHL"){//菲律宾39模板地址非必填
            response.address.required = false;
        }
        // 检查各表单            
        for (key in response) {
            // 正则数组
            var regs = response[key].reg;
            // 必填
            var required = response[key].required;
            // 对应的dom
            var dom = $('[name="'+key+'"]');

            // 检查是否必填
            if( required == true ){
                if( $.trim(dom.val())=='' ){
                    // 不通过状态
                    checkStatus = false;
                    // 获取焦点
                    dom.focus();
                    if( response[key].error ){
                        alert(response[key].error);
                        break;
                    }else{
                        if (dom[0]) {
                            switch(dom[0].nodeName){
                                case 'SELECT':
                                    var _error = dom.find('option').eq(0).html();
                                    alert(_error);
                                    break;
                                default:
                                    if( dom.attr('error') ){
                                        alert(dom.attr('error'));
                                    }else{
                                        dom.attr('placeholder') && alert(dom.attr('placeholder'));
                                    }
                                    break;
                            }
                        }else{
                            break;
                        }    
                    }
                }
            }
            regs.length>0 && regs.map(function(item){
                if( checkStatus == false ){ return false; }
                var reg = eval(item);
                if( $.trim(dom.val())!="" && reg.test(dom.val())==false ){
                    checkStatus = false;
                    dom.focus();
                    if( response[key].error ){
                        alert(response[key].error);
                    }else{
                        switch(dom[0].nodeName){
                            case 'SELECT':
                                var _error = dom.find('option').eq(0).html();
                                alert(_error);
                                break;
                            default:
                                if( dom.attr('error') ){
                                    alert(dom.attr('error'));
                                }else{
                                    dom.attr('placeholder') && alert(dom.attr('placeholder'));
                                }
                                break;
                        }
                    }
                    console.error(key+" wrong");
                    return false;
                }
            });

            // 其中1个报错就不执行
            if (checkStatus==false) break;
        }

        //卡塔尔
        if (region_code=='SAU') {
            var id_card = $.trim($('input[name="id_card"]').val()) || '';
            if(id_card != '' && /^1\d{9}$/.test(id_card)==false){
                alert('يرجي تقديم رقم بطاقة الهوية الصحيح');
                checkStatus=false;
            }
        }

        /*if(region_code == 'HK'){
            var postalVal = $.trim($('input[name="postal"]').val()) || '';
            if (postalVal != '' && /^\d{6}\b/.test(postalVal) == false) {
                alert('填寫的郵編有誤，請重新輸入！');
                $('input[name="postal"]').focus();
                checkStatus = false;
            }
        }*/
        // 返回判断结果
        console.log('the form check is '+checkStatus);
        return checkStatus;
    }
    return {
        check: check
    }
}

