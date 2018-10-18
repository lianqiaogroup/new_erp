require(['jquery','swiper'],function($,swiper){
    $(document).ready(function(){
        var galleryTop = new window.Swiper('.swiper-container', {
            autoHeight:true,
            autoplay: 3000,
            loop: false,
            pagination: '.swiper-pagination',
            paginationType: 'custom',
            paginationCustomRender: function(swiper, current, total) {
                var text = "";
                for (var i = 1; i <= total; i++) {
                    if (current == i) {
                        text += "<span class='redicon'></span>";
                    } else {
                        text += "<span class='whiteicon'></span>";
                    }
                }
                return text;
            }
        });
        var height = document.body.clientHeight;
        $('.a-color-alternate-background').css('min-height',height);
        $('#quantity').click(function(){
        	$('.qty-box').fadeIn();
        	$('#a-popover-lgtbox').fadeIn();
        })
        var strq = [];
        for(var i = 2 ; i <= 30 ;i++){
        	strq.push('<li class="a-dropdown-item">');
            strq.push('<a class="a-dropdown-link qty-a" qty="'+ i +'">'+ i +'</a>');
            strq.push('</li>');
        }
        $('#qty').append(strq.join(''));
        $('.qty-a').click(function(){
        	var num = $(this).attr('qty');
        	$('input[name="num"]').val(num);
        	$('#qtynum').html(num);
        	$('.qty-box').fadeOut();
        	$('#a-popover-lgtbox').fadeOut();
        	refresh_price();
        });
        $('[aria-label="Close"]').click(function(){
        	$('.qty-box').fadeOut();
        	$('#a-popover-lgtbox').fadeOut();
        })
        $('.attr-group').click(function(){
        	var id = $(this).attr('data-view');
        	$('#a-popover-'+id).fadeIn();
        	$('#a-page').fadeOut();
        	$('input[name="combo"]').val(0);
        });
        $('.attr-key').click(function(){
        	$('.attr-key').removeClass('a-active');
        	$(this).addClass('a-active');
        	var id = $(this).attr('parent');
        	$('#a-popover-'+id).fadeOut();
        	$('#a-page').fadeIn();
        	//var img = $(this).find('.myCustomImageHeight').attr('data-a-hires');
        	var data = $(this).find('.a-declarative').attr('data-twister');
        		data = JSON.parse(data)
        	$('.attr-'+id).html(data.name);
        	$('.attr-group[data-view="'+id+'"]').attr('attrid',data.product_attr_id);
			var imgsrc = [];
        	if(data.thumb){
				imgsrc.push('<img src="'+ data.thumb +'" class="a-image-wrapper a-lazy-loaded a-manually-loaded dimension-thumbnail twister-swatch-manual-load twisterButtonSwatchSize">')
        		$('.attr-group[data-view="'+id+'"]').find('.imgattr').html(imgsrc.join(''));
        	}
        	var thatid = $(this).attr('attrid');
        	if(thatid){
        		$('.goods-li[attrid="'+ thatid +'"]').addClass('a-active');
        	}
        });
        $('.close').click(function(){
        	$('#a-page').fadeIn();
        	$('.a-popover').fadeOut();
        })
        $('#a-combo').click(function(){
        	$('#a-popover-combo').fadeIn();
        	$('#a-page').fadeOut();
			var comboid = $('input[name="combo"]').val();
			$('.combo-li[data="'+ comboid +'"]').siblings().removeClass('a-active');
			$('.combo-li[data="'+ comboid +'"]').addClass('a-active');
        });
        singleCombo();
        $('.combo-li').click(function(){
        	var comboid = $(this).attr('data');
        	var htmls = $(this).find('h4').html();
			if($('.combo-'+comboid).length != 0 ){
				$('.combo-'+comboid).eq(0).fadeIn();
			}else{
				$('.a-popover').fadeOut();
    			$('#a-page').fadeIn();
			}
        	$('#a-combo').find('strong').html(htmls);
        	$('[optionskey]').hide();
        	$('[optionskey][combo="'+ comboid +'"]').show();
        	$('input[name="combo"]').val(comboid);
        	var price = $(this).attr('cpirce');
        	$('input[name="price"]').val(price);
        	refresh_price();
            singleCombo();
        });
        var i = 0 , goback = false;
        $('.goods-li').click(function(){
        	i++;
        	var comid = $(this).attr('comboid');
        	var len  = $('.combo-'+ comid).length;
    		if(i >= len || goback){
    			$('.a-popover').fadeOut();
    			$('#a-page').fadeIn();
    			i=0;
    			goback = false;
    		}else{
    			$('.combo-'+ comid).eq(i).fadeIn();
    		}
    		var goods = $(this).attr('goods');
    		var groupid = $(this).attr('groupid');
    		var attrid = $(this).attr('attrid');
    		var text = $(this).find('h4').html();
    		var img = $(this).find('.myCustomImageHeight').attr('src');
    		$('[optionskey][combo="'+ comid +'"][goods="'+ goods +'"][groupid="'+ groupid +'"]').find('.comboattr').html(text);
    		if(img){
    			var str = [];
    			str.push('<img src="'+ img +'" class="a-image-wrapper a-lazy-loaded a-manually-loaded dimension-thumbnail twister-swatch-manual-load twisterButtonSwatchSize">');
    			$('[optionskey][combo="'+ comid +'"][goods="'+ goods +'"][groupid="'+ groupid +'"]').find('.imgattr').html(str.join(''));
    		}
    		$('[optionskey][combo="'+ comid +'"][goods="'+ goods +'"][groupid="'+ groupid +'"]').attr('attrid',attrid);
        });
        $('[optionskey]').click(function(){
        	goback = true;
        	var comid = $(this).attr('combo');
        	var goods = $(this).attr('goods');
    		var groupid = $(this).attr('groupid');
    		$('#a-popover-'+comid+'-'+goods+'-'+groupid).fadeIn();
    		$('#a-page').fadeOut();
    		var thatid = $(this).attr('attrid');
    		if(thatid){
    			$('.goods-li[comboid="'+ comid +'"][attrid="'+ thatid +'"]').addClass('a-active');
    		}
        });
        $('.buybox').click(function(){
        	
        	var url = "/checkout.php?";
        	var count = parseInt($('input[name="num"]').val()) || 1;
        	url = url + "count="+count;
        	var comb_id = $('input[name="combo"]').val();
            var productId = $('input[name="product_id"]').val();
            url = url + "&combo_id="+comb_id + '&product_id=' + productId;
            var prototype = [];
            if(comb_id != 0){
	            var alen = $('[optionskey][combo="'+ comb_id +'"]').length;
	            for(var i = 0 ; i < alen ; i++){
	            	var goods = $('[optionskey][combo="'+ comb_id +'"]').eq(i).attr('goods');
	    			var groupid = $('[optionskey][combo="'+ comb_id +'"]').eq(i).attr('groupid');
	    			var attrid = $('[optionskey][combo="'+ comb_id +'"]').eq(i).attr('attrid');
	    			if(attrid){
	    				prototype.push(goods+'-'+groupid+'-'+attrid);
	    			}
	            }
        	}else{
        		var plen = $('.attr-group').length;
        		for(var i = 0 ; i < plen ; i++){
        			var groupid = $('.attr-group').eq(i).attr('data-view');
	    			var attrid = $('.attr-group').eq(i).attr('attrid');
	    			if(attrid){
	    				prototype.push(groupid+'-'+attrid);
	    			}
        		}
        	}
        	var dom = $('#imageBlock_feature_div').length;
			var prodom = $('.combo-'+comb_id).length;
        	if(dom != 0){
        		var top = $('#imageBlock_feature_div').offset().top ;
        	}
            url = url + "&proto="+prototype.join('|');
            if(comb_id != "" && prototype != ""){
            	if(prototype.length == alen || prototype.length == plen){
            		window.location.href = url;
            	}else{
            		if(top){
            			window.scrollTo(0,top-100);
            		}
            	}
        	}else{
        		if(dom == 0){
	        		window.location.href = "/checkout.php?count=" +count + "&combo_id=0";
	        	}else if(comb_id != 0 && prodom == 0){
					window.location.href = "/checkout.php?count=" +count + "&combo_id="+comb_id;
				}else{
	        		if(top){
            			window.scrollTo(0,top-100);
            		}
	        	}
        	}
        })
        $('#descriptionSeeMoreContent').click(function(){
        	$(this).hide();
        	$('#productDescription_fullView').fadeIn();
        	$('#descriptionSeeLessContainer').show();
        });
        $('#descriptionSeeLessContainer').click(function(){
        	$(this).hide();
        	$('#productDescription_fullView').fadeOut(1000);
        	$('#descriptionSeeMoreContent').show();
        });
        function refresh_price() {
	        var num = $('input[name="num"]').val();
	        var price = $('input[name="price"]').val();
	        var total = parseInt(num)*parseInt(price);
	        $("#priceblock_ourprice").html(total);
	    }
        //套餐是否可选数量
        function singleCombo(){
            var combo = $('input[name="combo"]').val();
            var single_c =  $('.combo-li[data="'+ combo +'"]').attr('single_c');
            console.log(single_c)
            if(parseInt(single_c) == 1){
                $('input[name="num"]').val(1);
                $('#mobileQuantity_feature_div').hide();
            }else{
                $('#mobileQuantity_feature_div').show();
            }
        }
    })
})