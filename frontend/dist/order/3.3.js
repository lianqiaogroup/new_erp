webpackJsonp([3],{

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(59)
	__vue_script__ = __webpack_require__(61)
	__vue_template__ = __webpack_require__(62)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "/Users/cullenng/website/stoshop/frontend/source/order/region/idr.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

	
	var content = __webpack_require__(60);

	if(typeof content === 'string') content = [[module.id, content, '']];

	var transform;
	var insertInto;



	var options = {"hmr":true}

	options.transform = transform
	options.insertInto = undefined;

	var update = __webpack_require__(40)(content, options);

	if(content.locals) module.exports = content.locals;

	if(false) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-95f9bab4&file=idr.vue!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./idr.vue", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-95f9bab4&file=idr.vue!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./idr.vue");

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

/***/ 60:
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)(false);
	// imports


	// module
	exports.push([module.id, "\nselect[name=\"state\"],\nselect[name=\"city\"] {\n    height: 44px;\n    width: 100%;\n    font-size: 14px;\n    color: #666;\n    border: 1px solid #eee;\n    border-radius: 4px;\n    text-indent: 16px;\n}\n", ""]);

	// exports


/***/ }),

/***/ 61:
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// <template>
	//     <section>
	//         <div class="table">
	//             <div class="flexbox">
	//                 <div class="flex regions">${ region.name }</div>
	//             </div>
	//             <div class="flexbox">
	//                 <div class="flex tab_two">
	//                     <select @change="getCity($event)" v-model="form.province" ref="province" name="state" :placeholder="lang.city_" required="required">
	//                         <option value="">Propinsi</option>
	//                         <option :value="item.id_region" v-for="item in areaList.province">${item.name}</option>
	//                     </select>
	//                 </div>
	//             </div>
	//             <div class="flexbox">
	//                 <div class="flex tab_two">
	//                     <select @change="getDistrict($event)" v-model="form.city" ref="city" name="city" :placeholder="lang.district_" required="required">
	//                         <option value="">kota</option>
	//                         <option :value="item.id_region" v-for="item in areaList.city">${item.name}</option>
	//                     </select>
	//                 </div>
	//             </div>
	//             <div class="flexbox">
	//                 <div class="flex tab_two">
	//                     <select name="district" v-model="form.district" ref="district" :placeholder="lang.addr" required="required">
	//                         <option value="">Dearah</option>
	//                         <option :value="item.id_region" v-for="item in areaList.district">${item.name}</option>
	//                     </select>
	//                 </div>
	//             </div>
	//             <div class="table-row">
	//                 <input type="text" required="required" ref="address" v-model="form.address" name="address" :placeholder="lang.address_">
	//             </div>
	//             <div class="flexbox">
	//                 <div class="flex tab_two">
	//                     <input type="text" required="required" ref="name" v-model="form.name" name="name" :placeholder="lang.name">
	//                 </div>
	//                 <div class="flex tab_two">
	//                     <input required="required" type="tel" ref="postal" v-model="form.postal" name="postal" :placeholder="lang.postal" maxlength="5" pattern="[0-9]{5}">
	//                 </div>
	//             </div>
	//             <div class="flexbox">
	//                 <div class="flex tab_two">
	//                     <input type="tel" required="required" ref="mobile" v-model="form.mobile" name="mobile" :placeholder="lang.phone">
	//                 </div>
	//                 <div class="flex tab_two">
	//                     <input type="email" name="email" ref="email" v-model="form.email" :placeholder="lang.email">
	//                 </div>
	//             </div>
	//
	//             <div class="table-row">
	//                 <input type="text" name="guest" v-model="form.note" :placeholder="lang.note">
	//             </div>
	//             <div class="flexbox">
	//                 <div class="flex tab_two tab_sele action" rel="0" v-if="paymentType.payment_underline === '1'">
	//                     <i class="icon"></i>${ lang.cash_on_delivery }
	//                 </div>
	//                 <div class="flex tab_two tab_sele action" rel="0" v-if="paymentType.payment_online === '1' || paymentType.payment_paypal === '1' || paymentType.payment_asiabill === '1'">
	//                     <i class="icon"></i>${ lang.cash_on_delivery }
	//                 </div>
	//             </div>
	//         </div>
	//     </section>
	// </template>
	//
	// <script>
	exports.default = {
	    delimiters: ["${", "}"],
	    data: function data() {
	        return {
	            form: {
	                address: "",
	                name: "",
	                postal: "",
	                mobile: "",
	                email: "",
	                guest: "",
	                note: "",
	                city: "",
	                district: "",
	                province: ""
	            },
	            lang: window.lang,
	            region: {
	                id: window.region.id,
	                code: window.region.code,
	                title: window.region.title,
	                name: window.region.name
	            },
	            paymentType: {
	                payment_underline: window.paymentType.payment_underline,
	                payment_online: window.paymentType.payment_online,
	                payment_paypal: window.paymentType.payment_paypal,
	                payment_asiabill: window.paymentType.payment_asiabill
	            },
	            parameterId: {
	                region_id: window.region.id,
	                yn_region_id: "",
	                yn_region_id2: ""
	            },
	            areaList: {
	                province: "",
	                city: "",
	                district: ""
	            }
	        };
	    },
	    mounted: function mounted() {
	        this.$emit("render", false);
	        this.getProvince();
	    },

	    methods: {
	        getProvince: function getProvince() {
	            var _this = this;

	            this.$http.post("/region.php", { region_id: this.parameterId.region_id }, { emulateJSON: true }).then(function (res) {
	                if (res.status === 200) {
	                    _this.areaList.province = res.body;
	                    _this.areaList.district = "";
	                }
	            }, function () {
	                console.log("fail");
	            });
	        },
	        getCity: function getCity(event) {
	            var _this2 = this;

	            this.parameterId.yn_region_id = event.target.value;
	            this.$http.post("/region.php", { yn_region_id: this.parameterId.yn_region_id }, { emulateJSON: true }).then(function (res) {
	                if (res.status === 200) {
	                    _this2.areaList.city = res.body;
	                }
	            }, function () {
	                console.log("fail");
	            });
	        },
	        getDistrict: function getDistrict(event) {
	            var _this3 = this;

	            this.parameterId.yn_region_id2 = event.target.value;
	            this.$http.post("/region.php", { yn_region_id: this.parameterId.yn_region_id2 }, { emulateJSON: true }).then(function (res) {
	                if (res.status === 200) {
	                    _this3.areaList.district = res.body;
	                }
	            }, function () {
	                console.log("fail");
	            });
	        },
	        check: function check() {
	            if (true) {
	                if (this.form.province === "") {
	                    alert(this.lang.province);
	                    this.$refs.province.focus();
	                    return false;
	                }

	                if (this.form.city === "") {
	                    alert(this.lang.city);
	                    this.$refs.city.focus();
	                    return false;
	                }

	                if (this.form.district === "") {
	                    alert(this.lang.district);
	                    this.$refs.district.focus();
	                    return false;
	                }

	                if (this.form.address === "") {
	                    alert(this.lang.addr);
	                    this.$refs.address.focus();
	                    return false;
	                }

	                if (this.form.name === "") {
	                    alert(this.lang.name);
	                    this.$refs.name.focus();
	                    return false;
	                }

	                if (this.form.postal === "") {
	                    alert(this.lang.postal);
	                    this.$refs.postal.focus();
	                    return false;
	                }

	                if (this.form.mobile === "") {
	                    alert(this.lang.phone);
	                    this.$refs.mobile.focus();
	                    return false;
	                }
	                if (!/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.form.mobile)) {
	                    alert(this.lang.phone + " error");
	                    this.$refs.mobile.focus();
	                    return false;
	                }

	                if (this.form.email !== "" && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.form.email)) {
	                    alert(this.lang.email + " error");
	                    this.$refs.email.focus();
	                    return false;
	                }
	                return {
	                    mobile: this.form.mobile,
	                    address: this.form.address,
	                    name: this.form.name,
	                    postal: this.form.postal,
	                    guest: this.form.guest,
	                    email: this.form.email,
	                    note: this.form.note,
	                    state: this.form.province,
	                    city: this.form.city,
	                    district: this.form.district
	                };
	            } else {
	                return false;
	            }
	        }
	    }
	};
	// </script>
	//
	// <style>
	// select[name="state"],
	// select[name="city"] {
	//     height: 44px;
	//     width: 100%;
	//     font-size: 14px;
	//     color: #666;
	//     border: 1px solid #eee;
	//     border-radius: 4px;
	//     text-indent: 16px;
	// }
	// </style>
	//
	//
	//

/***/ }),

/***/ 62:
/***/ (function(module, exports) {

	module.exports = "\n    <section>\n        <div class=\"table\">\n            <div class=\"flexbox\">\n                <div class=\"flex regions\">${ region.name }</div>\n            </div>\n            <div class=\"flexbox\">\n                <div class=\"flex tab_two\">\n                    <select @change=\"getCity($event)\" v-model=\"form.province\" ref=\"province\" name=\"state\" :placeholder=\"lang.city_\" required=\"required\">\n                        <option value=\"\">Propinsi</option>\n                        <option :value=\"item.id_region\" v-for=\"item in areaList.province\">${item.name}</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"flexbox\">\n                <div class=\"flex tab_two\">\n                    <select @change=\"getDistrict($event)\" v-model=\"form.city\" ref=\"city\" name=\"city\" :placeholder=\"lang.district_\" required=\"required\">\n                        <option value=\"\">kota</option>\n                        <option :value=\"item.id_region\" v-for=\"item in areaList.city\">${item.name}</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"flexbox\">\n                <div class=\"flex tab_two\">\n                    <select name=\"district\" v-model=\"form.district\" ref=\"district\" :placeholder=\"lang.addr\" required=\"required\">\n                        <option value=\"\">Dearah</option>\n                        <option :value=\"item.id_region\" v-for=\"item in areaList.district\">${item.name}</option>\n                    </select>\n                </div>\n            </div>\n            <div class=\"table-row\">\n                <input type=\"text\" required=\"required\" ref=\"address\" v-model=\"form.address\" name=\"address\" :placeholder=\"lang.address_\">\n            </div>\n            <div class=\"flexbox\">\n                <div class=\"flex tab_two\">\n                    <input type=\"text\" required=\"required\" ref=\"name\" v-model=\"form.name\" name=\"name\" :placeholder=\"lang.name\">\n                </div>\n                <div class=\"flex tab_two\">\n                    <input required=\"required\" type=\"tel\" ref=\"postal\" v-model=\"form.postal\" name=\"postal\" :placeholder=\"lang.postal\" maxlength=\"5\" pattern=\"[0-9]{5}\">\n                </div>\n            </div>\n            <div class=\"flexbox\">\n                <div class=\"flex tab_two\">\n                    <input type=\"tel\" required=\"required\" ref=\"mobile\" v-model=\"form.mobile\" name=\"mobile\" :placeholder=\"lang.phone\">\n                </div>\n                <div class=\"flex tab_two\">\n                    <input type=\"email\" name=\"email\" ref=\"email\" v-model=\"form.email\" :placeholder=\"lang.email\">\n                </div>\n            </div>\n\n            <div class=\"table-row\">\n                <input type=\"text\" name=\"guest\" v-model=\"form.note\" :placeholder=\"lang.note\">\n            </div>\n            <div class=\"flexbox\">\n                <div class=\"flex tab_two tab_sele action\" rel=\"0\" v-if=\"paymentType.payment_underline === '1'\">\n                    <i class=\"icon\"></i>${ lang.cash_on_delivery }\n                </div>\n                <div class=\"flex tab_two tab_sele action\" rel=\"0\" v-if=\"paymentType.payment_online === '1' || paymentType.payment_paypal === '1' || paymentType.payment_asiabill === '1'\">\n                    <i class=\"icon\"></i>${ lang.cash_on_delivery }\n                </div>\n            </div>\n        </div>\n    </section>\n";

/***/ })

});