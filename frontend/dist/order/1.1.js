webpackJsonp([1],{

/***/ 52:
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__vue_script__ = __webpack_require__(53)
	__vue_template__ = __webpack_require__(54)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "/Users/cullenng/website/stoshop/frontend/source/order/region/basic.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),

/***/ 53:
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// <template>
	// <section>
	//     <div class="table">
	//         <div class="flexbox">
	//             <div class="flex regions">${ region.title }</div>
	//         </div>
	//         <div class="table-row">
	//             <input type="text" ref="address" v-model="form.address" :placeholder="lang.addr">
	//         </div>
	//         <div class="flexbox">
	//             <div class="flex tab_two">
	//                 <input type="text" ref="name" v-model="form.name" :placeholder="lang.name">
	//             </div>
	//             <div class="flex tab_two">
	//                 <input type="tel" ref="postal" v-model="form.postal" :placeholder="lang.postal">
	//             </div>
	//         </div> 
	//         <div class="flexbox">
	//             <div class="flex tab_two">
	//                 <input type="tel" ref="mobile" v-model="form.mobile" :placeholder="lang.phone">
	//             </div>
	//             <div class="flex tab_two">
	//                 <input type="email" ref="email" v-model="form.email" :placeholder="lang.email">
	//             </div>
	//         </div>
	//         <div class="table-row">
	//             <input type="text" ref="note" v-model="form.note" :placeholder="lang.note">
	//         </div>
	//         <div class="flexbox">
	//             <div class="flex tab_two tab_sele action" rel="0">
	//                 <i class="icon"></i>${ lang.cash_on_delivery }
	//             </div>
	//         </div>
	//     </div>
	// </section>
	// </template>
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
	                guest: ''
	            },
	            lang: window.lang,
	            region: {
	                id: window.region.id,
	                code: window.region.code,
	                title: window.region.title
	            }
	        };
	    },
	    mounted: function mounted() {
	        this.$emit('render', false);
	    },
	    methods: {
	        check: function check() {
	            if (this.form.address === '') {
	                alert(this.lang.addr);
	                this.$refs.address.focus();
	                return false;
	            };
	            if (this.form.name === '') {
	                alert('姓名不能为空！');
	                this.$refs.name.focus();
	                return false;
	            };

	            if (this.form.mobile === '') {
	                alert('手机号码不能为空！');
	                this.$refs.mobile.focus();
	                return false;
	            };

	            return {
	                mobile: this.form.mobile,
	                address: this.form.address,
	                name: this.form.name,
	                postal: this.form.postal,
	                guest: this.form.guest,
	                email: this.form.email
	            };
	        }
	    }
	    // </script>

	};

/***/ }),

/***/ 54:
/***/ (function(module, exports) {

	module.exports = "\n<section>\n    <div class=\"table\">\n        <div class=\"flexbox\">\n            <div class=\"flex regions\">${ region.title }</div>\n        </div>\n        <div class=\"table-row\">\n            <input type=\"text\" ref=\"address\" v-model=\"form.address\" :placeholder=\"lang.addr\">\n        </div>\n        <div class=\"flexbox\">\n            <div class=\"flex tab_two\">\n                <input type=\"text\" ref=\"name\" v-model=\"form.name\" :placeholder=\"lang.name\">\n            </div>\n            <div class=\"flex tab_two\">\n                <input type=\"tel\" ref=\"postal\" v-model=\"form.postal\" :placeholder=\"lang.postal\">\n            </div>\n        </div> \n        <div class=\"flexbox\">\n            <div class=\"flex tab_two\">\n                <input type=\"tel\" ref=\"mobile\" v-model=\"form.mobile\" :placeholder=\"lang.phone\">\n            </div>\n            <div class=\"flex tab_two\">\n                <input type=\"email\" ref=\"email\" v-model=\"form.email\" :placeholder=\"lang.email\">\n            </div>\n        </div>\n        <div class=\"table-row\">\n            <input type=\"text\" ref=\"note\" v-model=\"form.note\" :placeholder=\"lang.note\">\n        </div>\n        <div class=\"flexbox\">\n            <div class=\"flex tab_two tab_sele action\" rel=\"0\">\n                <i class=\"icon\"></i>${ lang.cash_on_delivery }\n            </div>\n        </div>\n    </div>\n</section>\n";

/***/ })

});