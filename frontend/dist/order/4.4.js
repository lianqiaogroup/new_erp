webpackJsonp([4],{

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(64)
	__vue_script__ = __webpack_require__(66)
	__vue_template__ = __webpack_require__(67)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "/Users/cullenng/website/stoshop/frontend/source/order/region/ind.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

	
	var content = __webpack_require__(65);

	if(typeof content === 'string') content = [[module.id, content, '']];

	var transform;
	var insertInto;



	var options = {"hmr":true}

	options.transform = transform
	options.insertInto = undefined;

	var update = __webpack_require__(40)(content, options);

	if(content.locals) module.exports = content.locals;

	if(false) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-75636064&file=ind.vue!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./ind.vue", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-75636064&file=ind.vue!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./ind.vue");

			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];

			var locals = (function(a, b) {
				var key, idx = 0;

				for(key in a) {
					if(!b || a[key] !== b[key]) return false;
					idx++;
				}

				for(key in b) idx--;

				return idx === 0;
			}(content.locals, newContent.locals));

			if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

			update(newContent);
		});

		module.hot.dispose(function() { update(); });
	}

/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)(false);
	// imports


	// module
	exports.push([module.id, "\n    .cardidtext{\n        height: 44px;\n        width: 100%;\n        font-size: 14px;\n        color: #666;\n        border: 1px solid #eee;\n        border-radius: 4px;\n        text-indent: 16px;\n        margin-bottom: 4px;\n    }\n    .cardidtext span{\n        display: inline-block;\n        height: 44px;\n        line-height: 44px;\n    }\n    .tt{\n        width: 90px;\n        text-indent: 0;\n        border-right: 1px solid #eee;\n        padding-right: 28px;\n        background-image: url('/public/image/arrow.png');\n        background-size: 32px;\n        background-position: right;\n        background-repeat: no-repeat;\n    }\n    .layer{\n        position: fixed;\n        top: 0;\n        left: 0;\n        height: 100%;\n        width: 100%;\n        background: rgba(70, 68, 68, 0.7);\n        z-index: 2;\n        display: none;\n    }\n    .layer_box{\n        position: fixed;\n        width: 90%;\n        top: 50%;\n        -webkit-transform: translateY(-50%);\n                transform: translateY(-50%);\n        left: 5%;\n        background: #fff;\n        z-index: 2;\n        display: none;\n    }\n    .layer.active,.layer_box.active{\n        display: block;\n    }\n    .layer_box .main{\n        padding: 0 10px;\n        height: 100%;\n        overflow-y: auto;\n    }\n    .top{\n        text-align: center;\n        margin-bottom: 15px;\n        padding-top: 10px;\n    }\n    .bottom{\n        padding-bottom: 10px;\n    }\n    .bottom .tip{\n        color: #EF5350;\n        font-size: 12px;\n        margin-bottom: 10px;\n    }\n    .centre{\n        font-size: 12px;\n        margin-bottom: 15px;\n    }\n    @media screen and (max-height: 480px) {\n        .centre .maintips{\n            max-height: 200px;\n            overflow-y: auto;\n        }\n    }\n    .autoFill{\n        display: none;\n    }\n    .box{\n        display: -webkit-box;\n        display: -ms-flexbox;\n        display: flex; display: -ms-flex; display: -moz-flex;\n        height: 44px;\n        border: 1px solid #ccc;\n        overflow:hidden;\n    }\n    .box select[name=\"selid\"]{\n        width: 125px;\n        padding-left: 10px;\n        border: none;\n        border-right: 1px solid #ccc;\n    }\n    .box .text{\n        -webkit-box-flex: 1;\n                flex: 1; -webkit-flex: 1; -ms-flex: 1; -moz-flex: 1;\n        overflow: hidden;\n    }\n    .box .text input{\n        height: 42px;\n        border: none;\n        width: 100%;\n        text-indent: 16px;\n    }\n    .fbicon{\n        display: inline-block;\n        width: 24px;\n        height: 24px;\n        background-image: url('/public/image/Facebook.png');\n        background-size: 24px 24px;\n        background-position: center;\n        background-repeat: no-repeat;\n        vertical-align: middle;\n        margin-right: 10px;\n    }\n    .btnnext{\n        background: #4460a0;\n        color: #fff;\n        font-size: 14px;\n        text-align: center;\n        height: 44px;\n        line-height: 44px;\n        margin-top: 20px;\n    }\n    .errortips{\n        display: none;\n    }\n    .erroract{\n        color: #EF5350;\n    }\n    .erroract .box{\n        border: 2px solid #EF5350;\n    }\n    .erroract .errortips{\n        display: block;\n    }\n", ""]);

	// exports


/***/ }),

/***/ 66:
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// <template>
	//   <section>
	//     <div class="table">
	//         <div class="flexbox">
	//             <div class="flex regions">${ region.title }</div>
	//         </div>
	//         <div class="flexbox">
	//             <div class="flex tab_two">
	//                 <select @change="getCity($event)" name="city" :placeholder="lang.district" required="required">
	//                     <option value="">${lang.district}</option>
	//                     <option v-for="item in seleaddress.city" :value="item.id_region">${item.name}</option>
	//                 </select>
	//             </div>
	//         </div>
	//         <div class="flexbox">
	//             <div class="flex tab_two">
	//                 <select name="district" @change="getDistrict($event)" :placeholder="lang.addr" required="required">
	//                     <option value="">${lang.addr}</option>
	//                     <option v-for="item in seleaddress.district" :value="item.id_region">${item.name}</option>
	//                 </select>
	//             </div>
	//         </div>
	//         <div class="table-row">
	//             <input type="text" required="required"  ref="address" v-model="form.address" name="address" :placeholder="lang.addr">
	//         </div>
	//         <div class="flexbox">
	//             <div class="flex tab_two">
	//                 <input type="text" required="required"  ref="name" v-model="form.name" name="name" :placeholder="lang.name">
	//             </div>
	//             <div class="flex tab_two">
	//                 <select required="required" @change="postalchange(event)" name="postal" :placeholder="lang.postal">
	//                     <option value="">${lang.postal}</option>
	//                     <option v-for="item in seleaddress.postal" :value="item.name">${item.name}</option>
	//                 </select>
	//             </div>
	//         </div>
	//         <div class="flexbox">
	//             <div class="flex tab_two">
	//                 <input type="tel" required="required"  ref="mobile" v-model="form.mobile" name="mobile" :placeholder="lang.phone">
	//             </div>
	//         </div>    
	//         <div class="flex tab_two">
	//               <input type="email" name="email"  ref="email" v-model="form.email" :placeholder="lang.email">
	//         </div>
	//         <div class="table-row" @click="modifyid()">
	//             <div class="cardidtext" v-show="seleid.cardid == 1"><span class="tt">${lang.id_card}</span><span class="vv">${form.id_card}</span></div>
	//             <div class="cardidtext" v-show="seleid.cardid == 2"><span class="tt">${lang.passport}</span><span class="vv">${form.passport}</span></div>
	//         </div>
	//         <div class="table-row">
	//             <input type="text" name="guest" v-model="form.note" :placeholder="lang.note">
	//         </div>
	//         <div class="flexbox">
	//             <div class="flex tab_two tab_sele action" rel="0" v-if="paymentType.payment_underline === '1'">
	//                 <i class="icon"></i>${ lang.cash_on_delivery }
	//             </div>
	//             <div class="flex tab_two tab_sele action" rel="0" v-if="paymentType.payment_online === '1' || paymentType.payment_paypal === '1' || paymentType.payment_asiabill === '1'">
	//                 <i class="icon"></i>${ lang.cash_on_delivery }
	//             </div>
	//         </div>
	//     </div>
	//     <div class="layer" v-bind:class="{active: seleid.isActive}"></div>
	//     <div class="layer_box" v-bind:class="{active: seleid.isActive}">
	//         <div class="main">
	//             <div class="top"><i class="fbicon"></i>${lang.id_top}</div>
	//             <div class="centre"><div>${lang.id_center1}</div><div class="maintips" style="line-height:16px;">${lang.id_center2}</div></div>
	//             <div class="bottom" v-bind:class="{'erroract': seleid.hasError}">
	//                 <div class="tip">${lang.id_tips}</div>
	//                 <div class="box">
	//                     <select name="selid" @change="idchange($event)">
	//                         <option value="1">${lang.id_card}</option>
	//                         <option value="2">${lang.passport}</option>
	//                     </select>
	//                     <div class="text">
	//                         <input v-show="seleid.cardid == 1" class="idval" type="text" name="id_card" v-model="form.id_card">
	//                         <input v-show="seleid.cardid == 2" class="idval" type="text" name="passport" v-model="form.passport">
	//                     </div>
	//                 </div>
	//                 <div class="errortips">${lang.id_bottom} <span id="idtext">${lang.id_card}</span></div>
	//                 <div class="btnnext" @click="checkbtnid()">${lang.id_btn}</div>
	//             </div>
	//         </div>
	//     </div>
	//   </section>
	// </template>
	//
	// <script>
	exports.default = {
	    delimiters: ['${', '}'],
	    data: function data() {
	        return {
	            form: {
	                address: '',
	                name: '',
	                postal: '',
	                mobile: '',
	                email: '',
	                guest: '',
	                note: '',
	                id_card: '',
	                passport: ''
	            },
	            lang: window.lang,
	            region: {
	                id: window.region.id,
	                code: window.region.code,
	                title: window.region.title
	            },
	            paymentType: {
	                payment_underline: window.paymentType.payment_underline,
	                payment_online: window.paymentType.payment_online,
	                payment_paypal: window.paymentType.payment_paypal,
	                payment_asiabill: window.paymentType.payment_asiabill
	            },
	            parameterId: {
	                region_id: window.region.id,
	                city_id: '',
	                district_id: ''
	            },
	            seleaddress: {
	                city: '',
	                district: '',
	                postal: ''
	            },
	            seleid: {
	                cardid: 1,
	                isActive: true,
	                hasError: false
	            }
	        };
	    },
	    mounted: function mounted() {
	        this.$emit('render', false);
	        this.loadstate();
	    },
	    methods: {
	        loadstate: function loadstate() {
	            var _this = this;

	            this.$http.post('/region.php', { region_id: this.parameterId.region_id }, { emulateJSON: true }).then(function (res) {
	                if (res.status === 200) {
	                    _this.seleaddress.city = res.body;
	                    _this.seleaddress.district = '';
	                }
	            }, function () {
	                console.log("fail");
	            });
	        },
	        getCity: function getCity(event) {
	            var _this2 = this;

	            this.parameterId.city_id = event.target.value;
	            this.$http.post('/region.php', { yn_region_id: this.parameterId.city_id }, { emulateJSON: true }).then(function (res) {
	                if (res.status === 200) {
	                    _this2.seleaddress.district = res.body;
	                }
	            }, function () {
	                console.log("fail");
	            });
	        },
	        getDistrict: function getDistrict(event) {
	            var _this3 = this;

	            this.parameterId.district_id = event.target.value;
	            this.$http.post('/region.php', { yn_region_id: this.parameterId.district_id }, { emulateJSON: true }).then(function (res) {
	                if (res.status === 200) {
	                    _this3.seleaddress.postal = res.body;
	                }
	            }, function () {
	                console.log("fail");
	            });
	        },
	        idchange: function idchange(event) {
	            this.seleid.cardid = event.target.value;
	        },
	        checkbtnid: function checkbtnid() {
	            var if1 = this.form.id_card != '' && /^\d{12}$/.test(this.form.id_card) == true ? 1 : 0;
	            var if2 = this.form.passport != '' && /^[A-Z]{1}\d{7}$/.test(this.form.passport) == true ? 1 : 0;
	            if (if1 + if2 == 0) {
	                this.seleid.hasError = true;
	                if (this.seleid.cardid == 1) {
	                    document.getElementById('idtext').innerHTML = window.lang.id_card;
	                } else {
	                    document.getElementById('idtext').innerHTML = window.lang.passport;
	                }
	            } else {
	                this.seleid.isActive = false;
	            }
	        },
	        modifyid: function modifyid() {
	            this.seleid.isActive = true;
	        },
	        postalchange: function postalchange(event) {
	            this.form.postal = event.target.value;
	        },
	        check: function check() {
	            if (true) {
	                if (this.parameterId.city_id === '') {
	                    alert(this.lang.addr);
	                    return false;
	                };
	                if (this.parameterId.district_id === '') {
	                    alert(this.lang.addr);
	                    return false;
	                };

	                if (this.form.address === '') {
	                    alert(this.lang.addr);
	                    this.$refs.address.focus();
	                    return false;
	                };

	                if (this.form.name === '') {
	                    alert(this.lang.name);
	                    this.$refs.name.focus();
	                    return false;
	                };

	                if (this.form.postal === '') {
	                    alert(this.lang.postal);
	                    return false;
	                };

	                if (this.form.mobile === '') {
	                    alert(this.lang.phone);
	                    this.$refs.mobile.focus();
	                    return false;
	                };
	                return {
	                    mobile: this.form.mobile,
	                    address: this.form.address,
	                    city: this.parameterId.city_id,
	                    district: this.parameterId.district_id,
	                    name: this.form.name,
	                    postal: this.form.postal,
	                    guest: this.form.guest,
	                    email: this.form.email,
	                    id_card: this.form.id_card,
	                    passport: this.form.passport,
	                    note: this.form.note
	                };
	            } else {
	                return false;
	            }
	        }
	    }
	    // </script>
	    // <style>
	    //     .cardidtext{
	    //         height: 44px;
	    //         width: 100%;
	    //         font-size: 14px;
	    //         color: #666;
	    //         border: 1px solid #eee;
	    //         border-radius: 4px;
	    //         text-indent: 16px;
	    //         margin-bottom: 4px;
	    //     }
	    //     .cardidtext span{
	    //         display: inline-block;
	    //         height: 44px;
	    //         line-height: 44px;
	    //     }
	    //     .tt{
	    //         width: 90px;
	    //         text-indent: 0;
	    //         border-right: 1px solid #eee;
	    //         padding-right: 28px;
	    //         background-image: url('/public/image/arrow.png');
	    //         background-size: 32px;
	    //         background-position: right;
	    //         background-repeat: no-repeat;
	    //     }
	    //     .layer{
	    //         position: fixed;
	    //         top: 0;
	    //         left: 0;
	    //         height: 100%;
	    //         width: 100%;
	    //         background: rgba(70, 68, 68, 0.7);
	    //         z-index: 2;
	    //         display: none;
	    //     }
	    //     .layer_box{
	    //         position: fixed;
	    //         width: 90%;
	    //         top: 50%;
	    //         transform: translateY(-50%);
	    //         left: 5%;
	    //         background: #fff;
	    //         z-index: 2;
	    //         display: none;
	    //     }
	    //     .layer.active,.layer_box.active{
	    //         display: block;
	    //     }
	    //     .layer_box .main{
	    //         padding: 0 10px;
	    //         height: 100%;
	    //         overflow-y: auto;
	    //     }
	    //     .top{
	    //         text-align: center;
	    //         margin-bottom: 15px;
	    //         padding-top: 10px;
	    //     }
	    //     .bottom{
	    //         padding-bottom: 10px;
	    //     }
	    //     .bottom .tip{
	    //         color: #EF5350;
	    //         font-size: 12px;
	    //         margin-bottom: 10px;
	    //     }
	    //     .centre{
	    //         font-size: 12px;
	    //         margin-bottom: 15px;
	    //     }
	    //     @media screen and (max-height: 480px) {
	    //         .centre .maintips{
	    //             max-height: 200px;
	    //             overflow-y: auto;
	    //         }
	    //     }
	    //     .autoFill{
	    //         display: none;
	    //     }
	    //     .box{
	    //         display: flex; display: -webkit-flex; display: -ms-flex; display: -moz-flex;
	    //         height: 44px;
	    //         border: 1px solid #ccc;
	    //         overflow:hidden;
	    //     }
	    //     .box select[name="selid"]{
	    //         width: 125px;
	    //         padding-left: 10px;
	    //         border: none;
	    //         border-right: 1px solid #ccc;
	    //     }
	    //     .box .text{
	    //         flex: 1; -webkit-flex: 1; -ms-flex: 1; -moz-flex: 1;
	    //         overflow: hidden;
	    //     }
	    //     .box .text input{
	    //         height: 42px;
	    //         border: none;
	    //         width: 100%;
	    //         text-indent: 16px;
	    //     }
	    //     .fbicon{
	    //         display: inline-block;
	    //         width: 24px;
	    //         height: 24px;
	    //         background-image: url('/public/image/Facebook.png');
	    //         background-size: 24px 24px;
	    //         background-position: center;
	    //         background-repeat: no-repeat;
	    //         vertical-align: middle;
	    //         margin-right: 10px;
	    //     }
	    //     .btnnext{
	    //         background: #4460a0;
	    //         color: #fff;
	    //         font-size: 14px;
	    //         text-align: center;
	    //         height: 44px;
	    //         line-height: 44px;
	    //         margin-top: 20px;
	    //     }
	    //     .errortips{
	    //         display: none;
	    //     }
	    //     .erroract{
	    //         color: #EF5350;
	    //     }
	    //     .erroract .box{
	    //         border: 2px solid #EF5350;
	    //     }
	    //     .erroract .errortips{
	    //         display: block;
	    //     }
	    // </style>

	};

/***/ }),

/***/ 67:
/***/ (function(module, exports) {

	module.exports = "\n  <section>\n    <div class=\"table\">\n        <div class=\"flexbox\">\n            <div class=\"flex regions\">${ region.title }</div>\n        </div>\n        <div class=\"flexbox\">\n            <div class=\"flex tab_two\">\n                <select @change=\"getCity($event)\" name=\"city\" :placeholder=\"lang.district\" required=\"required\">\n                    <option value=\"\">${lang.district}</option>\n                    <option v-for=\"item in seleaddress.city\" :value=\"item.id_region\">${item.name}</option>\n                </select>\n            </div>\n        </div>\n        <div class=\"flexbox\">\n            <div class=\"flex tab_two\">\n                <select name=\"district\" @change=\"getDistrict($event)\" :placeholder=\"lang.addr\" required=\"required\">\n                    <option value=\"\">${lang.addr}</option>\n                    <option v-for=\"item in seleaddress.district\" :value=\"item.id_region\">${item.name}</option>\n                </select>\n            </div>\n        </div>\n        <div class=\"table-row\">\n            <input type=\"text\" required=\"required\"  ref=\"address\" v-model=\"form.address\" name=\"address\" :placeholder=\"lang.addr\">\n        </div>\n        <div class=\"flexbox\">\n            <div class=\"flex tab_two\">\n                <input type=\"text\" required=\"required\"  ref=\"name\" v-model=\"form.name\" name=\"name\" :placeholder=\"lang.name\">\n            </div>\n            <div class=\"flex tab_two\">\n                <select required=\"required\" @change=\"postalchange(event)\" name=\"postal\" :placeholder=\"lang.postal\">\n                    <option value=\"\">${lang.postal}</option>\n                    <option v-for=\"item in seleaddress.postal\" :value=\"item.name\">${item.name}</option>\n                </select>\n            </div>\n        </div>\n        <div class=\"flexbox\">\n            <div class=\"flex tab_two\">\n                <input type=\"tel\" required=\"required\"  ref=\"mobile\" v-model=\"form.mobile\" name=\"mobile\" :placeholder=\"lang.phone\">\n            </div>\n        </div>    \n        <div class=\"flex tab_two\">\n              <input type=\"email\" name=\"email\"  ref=\"email\" v-model=\"form.email\" :placeholder=\"lang.email\">\n        </div>\n        <div class=\"table-row\" @click=\"modifyid()\">\n            <div class=\"cardidtext\" v-show=\"seleid.cardid == 1\"><span class=\"tt\">${lang.id_card}</span><span class=\"vv\">${form.id_card}</span></div>\n            <div class=\"cardidtext\" v-show=\"seleid.cardid == 2\"><span class=\"tt\">${lang.passport}</span><span class=\"vv\">${form.passport}</span></div>\n        </div>\n        <div class=\"table-row\">\n            <input type=\"text\" name=\"guest\" v-model=\"form.note\" :placeholder=\"lang.note\">\n        </div>\n        <div class=\"flexbox\">\n            <div class=\"flex tab_two tab_sele action\" rel=\"0\" v-if=\"paymentType.payment_underline === '1'\">\n                <i class=\"icon\"></i>${ lang.cash_on_delivery }\n            </div>\n            <div class=\"flex tab_two tab_sele action\" rel=\"0\" v-if=\"paymentType.payment_online === '1' || paymentType.payment_paypal === '1' || paymentType.payment_asiabill === '1'\">\n                <i class=\"icon\"></i>${ lang.cash_on_delivery }\n            </div>\n        </div>\n    </div>\n    <div class=\"layer\" v-bind:class=\"{active: seleid.isActive}\"></div>\n    <div class=\"layer_box\" v-bind:class=\"{active: seleid.isActive}\">\n        <div class=\"main\">\n            <div class=\"top\"><i class=\"fbicon\"></i>${lang.id_top}</div>\n            <div class=\"centre\"><div>${lang.id_center1}</div><div class=\"maintips\" style=\"line-height:16px;\">${lang.id_center2}</div></div>\n            <div class=\"bottom\" v-bind:class=\"{'erroract': seleid.hasError}\">\n                <div class=\"tip\">${lang.id_tips}</div>\n                <div class=\"box\">\n                    <select name=\"selid\" @change=\"idchange($event)\">\n                        <option value=\"1\">${lang.id_card}</option>\n                        <option value=\"2\">${lang.passport}</option>\n                    </select>\n                    <div class=\"text\">\n                        <input v-show=\"seleid.cardid == 1\" class=\"idval\" type=\"text\" name=\"id_card\" v-model=\"form.id_card\">\n                        <input v-show=\"seleid.cardid == 2\" class=\"idval\" type=\"text\" name=\"passport\" v-model=\"form.passport\">\n                    </div>\n                </div>\n                <div class=\"errortips\">${lang.id_bottom} <span id=\"idtext\">${lang.id_card}</span></div>\n                <div class=\"btnnext\" @click=\"checkbtnid()\">${lang.id_btn}</div>\n            </div>\n        </div>\n    </div>\n  </section>\n";

/***/ })

});