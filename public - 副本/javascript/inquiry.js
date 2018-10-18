require(['jquery','clipboard'],function($, Swiper){
    $(document).ready(function(){
        var identity_tag = Cjs.url.getParamByName('identity_tag');
        var orderid = Cjs.url.getParamByName('order');
        var order_no = Cjs.url.getParamByName('order_no');
        var errormag = $('#go').attr('errormag');
        if(orderid){
            $('#loading').show();
            getOrderGoods(orderid, order_no);
        }else{
            $('.content').show();
        }
        var th_mob = Cjs.url.getParamByName('phone');
        if(th_mob){
            viewpage(th_mob,1,identity_tag);
            $('input[name="mob"]').val(th_mob);
        }
        $('#go').click(function(){
            var mob = $.trim($('input[name="mob"]').val());
            if(mob != ""){
                viewpage(mob,1,identity_tag);
            }
        });
        var pnum = 1;
        $('.nextpage').click(function(){
            var mobile = $.trim($('input[name="mob"]').val());
            var page = parseInt($(this).attr('allp'));
            var pnum = parseInt($(this).attr('nextp'));
            //pnum++;
            if(pnum > page){
                alert($(this).attr('error'));
            }else{
                viewpage(mobile,pnum,identity_tag);
            }
        })
        function viewpage(mob,p,identity_tag){
            //var datas = alldata;
            var time = $('#inquiry_list').attr('data_time');
            var num = $('#inquiry_list').attr('data_num');
            var viewT = $('#inquiry_list').attr('data_sea');
            var data_null = $('#inquiry_list').attr('data_null');
            var model = $('#model').html();
            var html  = "";
            $.ajax({
                url:"/order_quality.php?mobile="+mob+"&pnum="+p+"&identity_tag="+identity_tag,
                type:'get',
                dataType:"json",
                async:true,
                beforeSend:function(){
                    $('#loading').show();
                },
                success:function(data){
                    if(data.code == 200){
                        $('#loading').hide();
                        var datas = data.data;
                        if(datas.goodsList != ""){
                            for(var i = 0 ;i < datas.goodsList.length ; i++){
                                var dome = model;
                                if(datas.goodsList[i].thumb != ""){
                                    dome = dome.replace(/\{thumb\}/g,datas.goodsList[i].thumb);
                                }else{
                                    $('.pro_thumb').remove();
                                }
                                dome = dome.replace(/\{erp_no\}/g,datas.goodsList[i].erp_no);
                                switch(datas.goodsList[i].erp_info.id_order_status){
                                    case "1":
                                    case "2":
                                    case "3":
                                    case "4":
                                    case "5":
                                    case "6":
                                    case "7":
                                    case "17":
                                    case "22":
                                    case "25":
                                    case "26":
                                        dome = dome.replace(/\{state\}/g,ordererp_status.erp_status_df);
                                        break;
                                    case "8":
                                    case "18":
                                    case "27":
                                        dome = dome.replace(/\{state\}/g,ordererp_status.erp_status_yf);
                                        break;
                                    case "9": 
                                        dome = dome.replace(/\{state\}/g,ordererp_status.erp_status_ys);
                                        break;
                                    case "11":
                                    case "12":
                                    case "13":
                                    case "14":
                                    case "19":
                                        dome = dome.replace(/\{state\}/g,ordererp_status.erp_status_yx);
                                        break;
                                    case "15":
                                        dome = dome.replace(/\{state\}/g,ordererp_status.erp_status_dt);
                                        break;
                                    case "16":
                                        dome = dome.replace(/\{state\}/g,ordererp_status.erp_status_tz);
                                        break;
                                    case "10":
                                    case "21":
                                    case "23":
                                    case "24":
                                        dome = dome.replace(/\{state\}/g,ordererp_status.erp_status_yt);
                                        break;
                                    default:
                                        dome = dome.replace(/\{state\}/g,'');
                                }
                                dome = dome.replace(/\{title\}/g,datas.goodsList[i].title);
                                dome = dome.replace(/\{num\}/g,datas.goodsList[i].num);
                                if(parseInt(datas.goodsList[i].num) > 1){
                                    dome = dome.replace(/\{sss\}/g,'s');
                                }else{
                                    dome = dome.replace(/\{sss\}/g,'');
                                }
                                dome = dome.replace(/\{goodsnum\}/g,datas.goodsList[i].num);

                                if(datas.goodsList[i].new_price_format){
                                    dome = dome.replace(/\{currency_pay\}/g,datas.goodsList[i].new_price_format.symbol_left+datas.goodsList[i].new_price_format.price_format+datas.goodsList[i].new_price_format.symbol_right)
                                }else if(datas.goodsList[i].currency_prefix == 1){
                                    dome = dome.replace(/\{currency_pay\}/g,datas.goodsList[i].currency_code+datas.goodsList[i].payment_amount);
                                }else{
                                    dome = dome.replace(/\{currency_pay\}/g,datas.goodsList[i].payment_amount+datas.goodsList[i].currency_code);
                                }

                                dome = dome.replace(/\{order_no\}/g,datas.goodsList[i].order_no);
                                dome = dome.replace(/\{order_id\}/g,datas.goodsList[i].order_id);
                                dome = dome.replace(/\{add_time\}/g, datas.goodsList[i].add_time);
                                if(!datas.goodsList[i].attr){
                                    dome = dome.replace(/\{attr\}/g,'');
                                }
                                html = html +  dome;
                            }
                            $('#inquiry_list').html(html);
                            if(datas.total_p > 1){
                                $('.nextpage').show();
                                $('.nextpage').attr("allp",datas.total_p);
                                var nextp = (p + 1);
                                if(nextp > datas.total_p){
                                    nextp = datas.total_p;
                                }
                                $('.nextpage').attr("nextp",nextp);
                            }
                            if(datas.goodsList.length > 2){
                                $('.timetips_ab').css('position','relative');
                            }
                        }else{
                            $('#inquiry_list').html('<div class="data_null">'+data_null+'</div>');
                            $('.nextpage').hide();
                        }

                    }else{
                        $('#loading').hide();
                        alert(errormag);
                    }
                }
            })
        }
        $('#inquiry_list').off().on('click','.order_details',function(){
            var id = $(this).attr('rel');
            var orderno = $(this).attr('orderno');
            window.location.href = '/order_quality.php?order=' + id+'&order_no=' + orderno;
        })
        $('#showComboProduct_triggle2').click(function(event) {
            var close = $(this).attr('rel');
            var show  = $(this).attr('rel_s');
			/* Act on the event */
            if($(this).hasClass('action')){
                $(this).removeClass('action');
                $('#showComboProduct_content').slideDown();
                $('#lang').html(close);
            }else{
                $(this).addClass('action');
                $('#showComboProduct_content').slideUp();
                $('#lang').html(show);
            }
        });
        var clipboard = new $.Clipboard('#copyerp_no', {
            text: function() {
                var txts = $('#erp_no').val();
                return txts;
            }
        });
        function getOrderGoods(id, order_no){
            $.ajax({
                url:"/order_quality.php?order_id="+id+'&order_no='+order_no,
                type:'get',
                dataType:"json",
                async:true,
                beforeSend:function(){
                    $('#loading').show();
                },
                success:function(data){
                    if(data.code == 200){
                        $('#loading').hide();
                        var datas = data.data.goodsList[0];
                        var html = [],str = [];
                        $('#erp_status').html(datas.erp_status);
                        switch(datas.erp_info.id_order_status){
                            case "1":
                            case "2":
                            case "3":
                            case "4":
                            case "5":
                            case "6":
                            case "7":
                            case "17":
                            case "22":
                            case "25":
                            case "26":
                                $('#erp_status').html(ordererp_status.erp_status_df);
                                break;
                            case "8":
                            case "18":
                            case "27":
                                $('#erp_status').html(ordererp_status.erp_status_yf);
                                break;
                            case "9": 
                                dome = dome.replace(/\{state\}/g,ordererp_status.erp_status_ys);
                                break;
                            case "11":
                                $('#erp_status').html(ordererp_status.erp_status_yx);
                                $('#yx_reason').html(ordererp_status.yx_reason11);
                                break;
                            case "12":
                                $('#erp_status').html(ordererp_status.erp_status_yx);
                                $('#yx_reason').html(ordererp_status.yx_reason12);
                                break;
                            case "13":
                                $('#erp_status').html(ordererp_status.erp_status_yx);
                                $('#yx_reason').html(ordererp_status.yx_reason13);
                                break;
                            case "14":
                                $('#erp_status').html(ordererp_status.erp_status_yx);
                                $('#yx_reason').html(ordererp_status.yx_reason14);
                                break;
                            case "19":
                                $('#erp_status').html(ordererp_status.erp_status_yx);
                                break;
                            case "15":
                                $('#erp_status').html(ordererp_status.erp_status_dt);
                                break;
                            case "16":
                                $('#erp_status').html(ordererp_status.erp_status_tz);
                                break;
                            case "10":
                            case "21":
                            case "23":
                            case "24":
                                $('#erp_status').html(ordererp_status.erp_status_yt);
                                break;
                            default:
                                $('#erp_status').html('');
                        }
                        $('#shipping_name').html(datas.erp_info.shipping_name);
                        $('#delivery_time').html(datas.erp_info.date_delivery);
                        $('#add_time').html(datas.add_time);
                        $('#erp_no').val(datas.erp_no);
                        $('#address').html(datas.address);
                        $('#last_name').html(datas.last_name||'')
                        if(datas.email != ''){
                            $('#email').html(datas.email);
                        }else{
                            $('#email').parent('tr').remove();
                        }
                        if(datas.postal){
                            $('#postal').html(datas.postal);
                        }else{
                            $('#postal').parent('tr').remove();
                        }
                        if(datas.memo != ""){
                            $('#note div').html(datas.memo);
                            $('#note').html(datas.memo);
                        }else{
                            $('#note').parent('tr').remove();
                        }
                        $('#pay_type').html(datas.pay_type);
                        if(datas.new_price_format){
                            $('#payment_amount,.total').html(datas.new_price_format.symbol_left + datas.new_price_format.price_format + datas.new_price_format.symbol_right);
                        }else{
                            $('#payment_amount,.total').html(datas.currency_prefix == 1 ? datas.currency_code+datas.payment_amount : datas.payment_amount+datas.currency_code);
                        }
                        $('#name').html(datas.name);
                        $('#mobile').html(datas.mobile);
                        html.push('<div class="row-2 flexbox">');
                        html.push('<div class="goodImg">');
                        if(datas.combo_id == 0){
                            for(var i = 0; i < datas.orderGoods.length;i++){
                                if(datas.orderGoods[i].attr){
                                for(var a = 0 ;a < datas.orderGoods[i].attr.length;a++){
                                    if(datas.orderGoods[i].attr[a] != null){
                                        if(datas.orderGoods[i].attr[a].thumb){
                                            var thumbimg = datas.orderGoods[i].attr[a].thumb;
                                        }else{
                                            var thumbimg = datas.thumb;
                                        }
                                    }else{
                                        var thumbimg = datas.thumb;
                                    }
                                }
                                }else{
                                    var thumbimg = datas.thumb;
                                }
                                html.push('<img src="'+ thumbimg +'" width="100%" height="100%">');
                            }
                        }else{
                            html.push('<img src="'+ datas.thumb +'" width="100%" height="100%">');
                        }
                        
                        html.push('</div>');
                        html.push('<div class="goodInfo flex">');
                        html.push('<div class="goodName">'+ datas.title +'</div>');
                        if(datas.combo_id == 0){//单品，非套餐
                            html.push('<div class="details_attr">');
                            if(datas.orderGoods[0].attr){
                                for(var b = 0 ;b < datas.orderGoods[0].attr.length;b++){
                                    if(datas.orderGoods[0].attr[b] != null){
                                        html.push('<span class="attr">' + datas.orderGoods[0].attr[b].name +'&nbsp;&nbsp;</span>');
                                    }
                                }
                            }
                            html.push('</div>');
                        }
                        html.push('<div class="goodName ti">');
                        if(datas.combo_id == 0){
                            if(datas.currency_prefix == 1){
                                html.push('<span>'+ datas.currency_code + datas.orderGoods[0].promotion_price_format +'</span>');
                                html.push('<del>'+ datas.currency_code + datas.orderGoods[0].price_format +'</del>');
                            }else{
                                html.push('<span>'+ datas.orderGoods[0].promotion_price_format + datas.currency_code +'</span>');
                                html.push('<del>'+ datas.orderGoods[0].price_format + datas.currency_code +'</del>');
                            }
                        }else{
                            html.push('<span>'+datas.combo_title+'</span>');
                        }
                        html.push('<div class="goodStatus f-fr">');
                        html.push('<span>X</span><span>'+ datas.num +'</span>');
                        html.push('</div>');
                        html.push('</div>');

                        html.push('</div>');
                        html.push('</div>');
                        for(var i = 0; i < datas.orderGoods.length;i++){//套餐
                            str.push('<div class="row-2 flexbox">');
                            str.push('<div class="goodImg">');
                            if(datas.orderGoods[i].attr){
                            for(var a = 0 ;a < datas.orderGoods[i].attr.length;a++){
                                if(datas.orderGoods[i].attr != null){
                                    if(datas.orderGoods[i].attr[a].thumb){
                                        var imgsrc = datas.orderGoods[i].attr[a].thumb;
                                    }else{
                                        var imgsrc = datas.orderGoods[i].thumb
                                    }
                                }else{
                                    var imgsrc = datas.orderGoods[i].thumb;
                                }
                            }
                            }else{
                                var imgsrc = datas.orderGoods[i].thumb;
                            }
                            str.push('<img src="'+ imgsrc +'">');
                            str.push('</div>');
                            str.push('<div class="goodInfo flex u3">');
                            str.push('<div class="goodName">');
                            str.push('<span>'+ datas.orderGoods[i].sales_title +'</span>')
                            str.push('<div class="goodStatus">X '+ datas.orderGoods[i].num +'</div>');
                            str.push('<div class="goodName">');
                                if(datas.orderGoods[i].attr){
                                    for(var b = 0 ;b < datas.orderGoods[i].attr.length;b++){
                                        if(datas.orderGoods[i].attr[b] != null){
                                            str.push('<span class="attr">' + datas.orderGoods[i].attr[b].name +'&nbsp;&nbsp;</span>');
                                        }
                                    }
                                }
                            str.push('</div>');
                            str.push('<div class="goodName">');//属性价格
                            if(datas.show_detail == '1'){
                                if(datas.currency_prefix == 1){
                                    str.push('<span>'+ datas.currency_code + datas.orderGoods[i].promotion_price_format +'</span>');
                                    str.push('<del>'+ datas.currency_code + datas.orderGoods[i].price_format+'</del>');
                                }else{
                                    str.push('<span>'+ datas.orderGoods[i].promotion_price_format + datas.currency_code +'</span>');
                                    str.push('<del>'+ datas.orderGoods[i].price_format + datas.currency_code +'</del>');
                                }
                            }
                            str.push('</div>');//属性价格end

                            str.push('</div>');
                            str.push('</div>');
                            str.push('</div>');
                        }
                        if(datas.combo_id != 0){
                            $('#showComboProduct_content').html(str.join(''));
                        }else{
                            $('#showComboProduct_triggle2').hide();
                        }
                        //}
                        $('#goods').append(html.join(''));
                        $('#details').show();
                        $('.content').hide();
                    }else{
                        alert(errormag);
                        $('#loading').hide();
                    }
                }
            })
        }
    })
})
