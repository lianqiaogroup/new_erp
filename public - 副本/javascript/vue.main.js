// 引用库
Vue.use(vuelib);

var app = new Vue({
	el: '#app'
	, delimiters: ['${', '}']
	, data: {
		// 愿数据
		sourceData: {}
		// 产品数据
		, productData: {
			product_id: ''
			, title: ''
			, currency_code: ''
			, currency_prefix: ''
			, price: ''
			, market_price: ''
		}
		, comment: window.comment
		, commentShowCount: 2
		, showLayer: 'index'
		, count: 1
		, product_id: window.product_id
		// 所有套餐数据
		, combo: window.combo
		// 套餐数
		, combo_len: Object.getOwnPropertyNames(combo).length
		// 已选择的套餐ID
		, comboSelected: 0
		// 已选择的属性列
		, comboAttrs: {}
		// 存放单品产品属性
		, options: window.pd_options
		// 判断购买按钮是否在视窗内
		, crossoverBuyButton: false
		// 
		, sales: '1'
		, stoke: '1'
		// 倒计时
		, countdown: {
			hour: '0'
			, minute: '0'
			, second: '0'
		}
		, extend: {}
	}
	, computed: {
		// 轮播图
		banner: function(){
			if( !this.sourceData.photos ) return [];
			return this.sourceData.photos.map(function(row){ return row.thumb });
		}
		// 销售库存百分比
		, salesStokePercent: function(){
			return parseInt((this.sales / this.stoke)*100);;
		}
	}
	, mounted: function(){
		var self = this;

		self.sourceData = window.sourceData;

		// 初始化轮播图
		this.handleSwiper();

		// 初始化默认套餐属性值
		if( this.combo_len > 1 ){
			for( combo_id in combo ){
				var _combo = combo[combo_id];
				// 初始化默认选择的套餐
				if( this.comboSelected == '' ){
					this.comboSelected = combo_id;
				}
				// 初始化默认属性
				Vue.set(this.comboAttrs, combo_id, {});
				for( good_id in _combo.goods ){
					var _goods = _combo.goods[good_id];
					// 设定(套餐－产品)变量
					Vue.set(this.comboAttrs[combo_id], good_id, {})
					for( attr_gourp_id in _goods.options ){
						var attr_gourp = _goods.options[attr_gourp_id];
						// 设定（套餐－产品－属性组）变量
						Vue.set(this.comboAttrs[combo_id][good_id], attr_gourp_id, "")
						for( product_attr_id in attr_gourp.attr ){
							if( this.comboAttrs[combo_id][good_id][attr_gourp_id] == "" ){
								this.comboAttrs[combo_id][good_id][attr_gourp_id] = product_attr_id;
							}
						}
					}
				}
			}
		}else{
			this.comboSelected = 0;
			Vue.set(this.comboAttrs, 0, {});
			Vue.set(this.comboAttrs[0], this.product_id, {});
			for( attr_gourp_id in this.options ){
				var attr_gourp = this.options[attr_gourp_id];
				// 设定（套餐－产品－属性组）变量
				Vue.set(this.comboAttrs[0][this.product_id], attr_gourp_id, "");
				for( product_attr_id in attr_gourp.attr ){
					if( this.comboAttrs[0][this.product_id][attr_gourp_id] == "" ){
						this.comboAttrs[0][this.product_id][attr_gourp_id] = product_attr_id;
					}
				}
			}
		}

		// 监控windoow scroll
		window.addEventListener("scroll", function(e){
			if( !self.$refs.buttonBuy ) return false;
			self.crossoverBuyButton = self.$refs.buttonBuy.offsetTop < document.body.scrollTop;
		});

		// 初始化倒计时
		this.handleCountdown();

	}
	, methods: {
		handleSwiper: function(){
			setTimeout(function(){
				new Swiper('.swiper-container', {
					autoplay: 3000,
					loop: false,
					autoHeight: true,
					pagination: '.swiper-pagination',
					paginationType: 'custom',
					paginationCustomRender: function(swiper, current, total) {
						var text = "";
						text = '<span class="swiper-pagination-current">' + current + ' | <span class="swiper-pagination-total">'+ total +'</span>';
						return text;
					}
				});
			}, 50)
		}
		// 显示更多评论
		, handleShowMoreComment: function(){
			this.commentShowCount = 5;
		}
		// 查询订单入口
		, handleCheckOrder: function(){
			window.location.href = '/order_quality.php';
		}
		// 回到顶部
		, handleScrollTop: function(){
			document.body.scrollTop = document.documentElement.scrollTop = 0;
		}
		// 切换页面 index, arrtibute
		, handlePageChange: function(page){
	        this.showLayer = page || 'index';
	        this.handleScrollTop();
		}
		// 计算数量最少
		, handleCountMinus: function(){
			this.count > 1 ? this.count-- : null;
		}
		// 计算数量最大
		, handleCountAdd: function(){
			this.count++;
		}
		// 切换套餐
		, handleChangeCombo: function(combo_id){
			this.comboSelected = combo_id;
		}
		// 选取属性
		, handleAttrSelection: function(combo_id, combo_goods_id, attr_gourp_id, product_attr_id){
			this.comboAttrs[combo_id][combo_goods_id][attr_gourp_id] = product_attr_id;
		}
		// 检测属性是否选中高亮
		, convert: function(combo_id, combo_goods_id, attr_gourp_id, product_attr_id){
			if( this.comboSelected != combo_id ) return false;
			return this.comboAttrs[combo_id][combo_goods_id][attr_gourp_id] == product_attr_id;
		}
		// 属性的ID和文字转换
		, convertAttrIdToLabel: function(){
			var labels = [];
			var product_attrs = this.comboAttrs[this.comboSelected];
			for( product_id in product_attrs ){
				var attr_groups = product_attrs[product_id];
				for( attr_group_id in attr_groups ){
					var attr_id = attr_groups[attr_group_id];
					if( this.combo_len > 1 ){
						var label = this.combo[this.comboSelected].goods[product_id].options[attr_group_id].attr[attr_id].name;
					}else{
						var label = this.options[attr_group_id].attr[attr_id].name;
					}
					labels.push(label);
				}
			}
			return labels.join(',');
		}
		// 获取单个属性文案
		, getAttrNameById: function(id){
			var attr_id = parseInt(id);
			var reg = '/\"'+attr_id+'\":\{[^}]*/';
			var _comboJson = JSON.stringify(this.combo);
			var singleAttr = "{"+_comboJson.match(eval(reg))[0]+"}";
			var singleAttrObj = JSON.parse(singleAttr.replace(/\{[^:]*/, '').replace(':',''));
			return singleAttrObj.name;
		}
		// 保存事件
		, handleSave: function(){
			var obj = {
				combo_id: this.comboSelected
				, product_id: this.product_id
				, count: this.count
				, proto: ""
			}
			var url = "/checkout.php";
			var proto = [];
			for( pid in this.comboAttrs[this.comboSelected] ){
				var attr_group = this.comboAttrs[this.comboSelected][pid];
				for( agid in attr_group ){
					var attr_value = attr_group[agid];
					var _sss = pid + "-" + agid + "-" + attr_value;
					proto.push(_sss);
				}
			}
			obj.proto = proto.join('|');
			window.location.href = url + '?' + this.serialize(obj);
		}
        , handleCountdown: function(){
            var self = this;
            setInterval(function(){ self.countdownCore(); }, 1000);
        }
        , countdownCore: function(){
            var now = new Date();
            var endDate = new Date(2018,4,20,now.getHours()+8);
            var leftTime=endDate.getTime()-now.getTime();
            var leftsecond = parseInt(leftTime/1000);
            var day1=Math.floor(leftsecond/(60*60*24));
            var hour=Math.floor((leftsecond-day1*24*60*60)/3600);
            var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60);
            var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60);
            this.countdown.hour = hour;
            this.countdown.minute = minute;
            this.countdown.second = second;
        }
	}
});