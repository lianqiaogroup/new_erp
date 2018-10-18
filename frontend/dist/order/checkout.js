/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);

/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		0:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + chunkId + "." + ({}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/frontend/dist/order/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _vueResource = __webpack_require__(1);

	var _vueResource2 = _interopRequireDefault(_vueResource);

	var _extend = __webpack_require__(3);

	var _extend2 = _interopRequireDefault(_extend);

	var _reorder = __webpack_require__(36);

	var _reorder2 = _interopRequireDefault(_reorder);

	var _sms = __webpack_require__(44);

	var _sms2 = _interopRequireDefault(_sms);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 重复下单显示层
	var region_basic = function region_basic(resolve) {
	    return __webpack_require__.e/* require */(1, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(52)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this));
	};

	// 短信模块

	var region_malaysia = function region_malaysia(resolve) {
	    return __webpack_require__.e/* require */(2, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(55)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this));
	};
	var region_indonesia = function region_indonesia(resolve) {
	    return __webpack_require__.e/* require */(3, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(58)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this));
	};
	var region_india = function region_india(resolve) {
	    return __webpack_require__.e/* require */(4, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(63)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this));
	};
	var region_qatar = function region_qatar(resolve) {
	    return __webpack_require__.e/* require */(5, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(68)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this));
	};
	var region_oman = function region_oman(resolve) {
	    return __webpack_require__.e/* require */(6, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(73)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this));
	};
	var region_philippines = function region_philippines(resolve) {
	    return __webpack_require__.e/* require */(7, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(78)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this));
	};
	var region_myanmar = function region_myanmar(resolve) {
	    return __webpack_require__.e/* require */(8, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(83)]; (resolve.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}.bind(this));
	};

	var pages = {
	    basic: region_basic,
	    MYS: region_malaysia,
	    Rp: region_indonesia,
	    IND: region_india,
	    QAT: region_qatar,
	    OMN: region_oman,
	    PHL: region_philippines,
	    MMR: region_myanmar
	};

	Vue.use(_extend2.default);
	Vue.use(_vueResource2.default);

	var vue = new Vue({
	    el: '#app',
	    delimiters: ['${', '}'],
	    data: {
	        api: {
	            order: '/api_sms_send.php?do=order'
	            // 各地区组件
	        }, page: null,
	        isShowCombo: false
	        // 订单信息
	        , order: window.orderInfo
	        // 存储表单信息
	        , formdata: {},
	        rendering: true,
	        dialog: {
	            reorder: false,
	            sms: false
	        }
	    },
	    computed: {
	        total_currency: function total_currency() {}
	    },
	    components: {
	        reorder: _reorder2.default, sms: _sms2.default
	        // 获取url数据
	    }, created: function created() {
	        var self = this;
	        window.location.search.replace('?', '').split("&").map(function (row) {
	            var key = row.split('=')[0];
	            var val = row.split('=')[1];
	            self.order[key] = val;
	        });
	    },
	    mounted: function mounted() {
	        // 加载对应地区的组件

	        this.page = pages[window.region.code] || pages['basic'];
	    },
	    methods: {
	        // 地区组件渲染完毕
	        afterRender: function afterRender(e) {
	            this.rendering = e;
	        }
	        // (显示/关闭)套餐
	        ,
	        showCombo: function showCombo() {
	            this.isShowCombo = !this.isShowCombo;
	        }
	        /*
	        提交订单流程
	        -- 检查表单是否完整
	        -- 检查是否重复下单
	        -- 检查是否开启短信验证码
	        -- 下单成功
	        */
	        ,
	        handleSubmit: function handleSubmit(formdata) {

	            // 阻止多次点击
	            if (this.$loading() == true) {
	                return false;
	            };

	            // 1. 开启遮罩层
	            this.$loading(true);

	            // 2. 验证表单
	            var formvalid = this.$refs.formlayer.check();
	            if (formvalid == false) {
	                this.$loading(false);return false;
	            }
	            this.formdata = formvalid;

	            // 3. 是否重复下单
	            var reorderData = {
	                mobile: this.formdata.mobile,
	                product_id: this.order.product_id,
	                combo_id: this.order.combo_id,
	                count: this.order.count,
	                proto: this.order.proto
	            };
	            if (this.$refs.reorder.check(reorderData) == false) {
	                return false;
	            };

	            // 4. 短信验证码
	            if (this.order.is_sms_open == 1) {
	                this.dialog.sms = true;
	                return false;
	            }

	            // 4. 开始推送订单
	            this.submiting();
	        }
	        // 推送订单
	        ,
	        submiting: function submiting(callback) {
	            var _this = this;

	            var data = {};
	            this.$http.post(this.api.order, {}).then(function (res) {

	                var testdata = {
	                    ret_code: 200,
	                    fbpixel: [],
	                    ga: [],
	                    orderId: '1234',
	                    pay_method: '货到付款',
	                    ret_msg: 'successed',
	                    token: 'c3b4a393772a7d0b158998ebd4b36058',
	                    total: 10000,
	                    website: 'www.dzpas.com/vbb'
	                };
	                _this.order.orderId = testdata.orderId;
	                callback && callback(testdata);
	            });
	        }
	        // 
	        ,
	        gotoCheckOrder: function gotoCheckOrder() {
	            window.location.href = '/order_quality.php?mob=' + this.formdata.mobile + '&product_id=' + this.order.product_id;
	        }
	        // 货币格式化
	        ,
	        formatCurrency: function formatCurrency(val) {
	            var code = this.order.currency_code;
	            var prefix = this.order.currency_prefix == 1 ? true : false;
	            var strArr = [val];
	            prefix == true ? strArr.unshift(code) : strArr.push(code);
	            return strArr.join(' ');
	        }
	    }
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/*!
	 * vue-resource v1.3.5
	 * https://github.com/pagekit/vue-resource
	 * Released under the MIT License.
	 */

	'use strict';

	/**
	 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
	 */

	var RESOLVED = 0;
	var REJECTED = 1;
	var PENDING  = 2;

	function Promise$1(executor) {

	    this.state = PENDING;
	    this.value = undefined;
	    this.deferred = [];

	    var promise = this;

	    try {
	        executor(function (x) {
	            promise.resolve(x);
	        }, function (r) {
	            promise.reject(r);
	        });
	    } catch (e) {
	        promise.reject(e);
	    }
	}

	Promise$1.reject = function (r) {
	    return new Promise$1(function (resolve, reject) {
	        reject(r);
	    });
	};

	Promise$1.resolve = function (x) {
	    return new Promise$1(function (resolve, reject) {
	        resolve(x);
	    });
	};

	Promise$1.all = function all(iterable) {
	    return new Promise$1(function (resolve, reject) {
	        var count = 0, result = [];

	        if (iterable.length === 0) {
	            resolve(result);
	        }

	        function resolver(i) {
	            return function (x) {
	                result[i] = x;
	                count += 1;

	                if (count === iterable.length) {
	                    resolve(result);
	                }
	            };
	        }

	        for (var i = 0; i < iterable.length; i += 1) {
	            Promise$1.resolve(iterable[i]).then(resolver(i), reject);
	        }
	    });
	};

	Promise$1.race = function race(iterable) {
	    return new Promise$1(function (resolve, reject) {
	        for (var i = 0; i < iterable.length; i += 1) {
	            Promise$1.resolve(iterable[i]).then(resolve, reject);
	        }
	    });
	};

	var p$1 = Promise$1.prototype;

	p$1.resolve = function resolve(x) {
	    var promise = this;

	    if (promise.state === PENDING) {
	        if (x === promise) {
	            throw new TypeError('Promise settled with itself.');
	        }

	        var called = false;

	        try {
	            var then = x && x['then'];

	            if (x !== null && typeof x === 'object' && typeof then === 'function') {
	                then.call(x, function (x) {
	                    if (!called) {
	                        promise.resolve(x);
	                    }
	                    called = true;

	                }, function (r) {
	                    if (!called) {
	                        promise.reject(r);
	                    }
	                    called = true;
	                });
	                return;
	            }
	        } catch (e) {
	            if (!called) {
	                promise.reject(e);
	            }
	            return;
	        }

	        promise.state = RESOLVED;
	        promise.value = x;
	        promise.notify();
	    }
	};

	p$1.reject = function reject(reason) {
	    var promise = this;

	    if (promise.state === PENDING) {
	        if (reason === promise) {
	            throw new TypeError('Promise settled with itself.');
	        }

	        promise.state = REJECTED;
	        promise.value = reason;
	        promise.notify();
	    }
	};

	p$1.notify = function notify() {
	    var promise = this;

	    nextTick(function () {
	        if (promise.state !== PENDING) {
	            while (promise.deferred.length) {
	                var deferred = promise.deferred.shift(),
	                    onResolved = deferred[0],
	                    onRejected = deferred[1],
	                    resolve = deferred[2],
	                    reject = deferred[3];

	                try {
	                    if (promise.state === RESOLVED) {
	                        if (typeof onResolved === 'function') {
	                            resolve(onResolved.call(undefined, promise.value));
	                        } else {
	                            resolve(promise.value);
	                        }
	                    } else if (promise.state === REJECTED) {
	                        if (typeof onRejected === 'function') {
	                            resolve(onRejected.call(undefined, promise.value));
	                        } else {
	                            reject(promise.value);
	                        }
	                    }
	                } catch (e) {
	                    reject(e);
	                }
	            }
	        }
	    });
	};

	p$1.then = function then(onResolved, onRejected) {
	    var promise = this;

	    return new Promise$1(function (resolve, reject) {
	        promise.deferred.push([onResolved, onRejected, resolve, reject]);
	        promise.notify();
	    });
	};

	p$1.catch = function (onRejected) {
	    return this.then(undefined, onRejected);
	};

	/**
	 * Promise adapter.
	 */

	if (typeof Promise === 'undefined') {
	    window.Promise = Promise$1;
	}

	function PromiseObj(executor, context) {

	    if (executor instanceof Promise) {
	        this.promise = executor;
	    } else {
	        this.promise = new Promise(executor.bind(context));
	    }

	    this.context = context;
	}

	PromiseObj.all = function (iterable, context) {
	    return new PromiseObj(Promise.all(iterable), context);
	};

	PromiseObj.resolve = function (value, context) {
	    return new PromiseObj(Promise.resolve(value), context);
	};

	PromiseObj.reject = function (reason, context) {
	    return new PromiseObj(Promise.reject(reason), context);
	};

	PromiseObj.race = function (iterable, context) {
	    return new PromiseObj(Promise.race(iterable), context);
	};

	var p = PromiseObj.prototype;

	p.bind = function (context) {
	    this.context = context;
	    return this;
	};

	p.then = function (fulfilled, rejected) {

	    if (fulfilled && fulfilled.bind && this.context) {
	        fulfilled = fulfilled.bind(this.context);
	    }

	    if (rejected && rejected.bind && this.context) {
	        rejected = rejected.bind(this.context);
	    }

	    return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
	};

	p.catch = function (rejected) {

	    if (rejected && rejected.bind && this.context) {
	        rejected = rejected.bind(this.context);
	    }

	    return new PromiseObj(this.promise.catch(rejected), this.context);
	};

	p.finally = function (callback) {

	    return this.then(function (value) {
	            callback.call(this);
	            return value;
	        }, function (reason) {
	            callback.call(this);
	            return Promise.reject(reason);
	        }
	    );
	};

	/**
	 * Utility functions.
	 */

	var ref = {};
	var hasOwnProperty = ref.hasOwnProperty;

	var ref$1 = [];
	var slice = ref$1.slice;
	var debug = false;
	var ntick;

	var inBrowser = typeof window !== 'undefined';

	function Util (ref) {
	    var config = ref.config;
	    var nextTick = ref.nextTick;

	    ntick = nextTick;
	    debug = config.debug || !config.silent;
	}

	function warn(msg) {
	    if (typeof console !== 'undefined' && debug) {
	        console.warn('[VueResource warn]: ' + msg);
	    }
	}

	function error(msg) {
	    if (typeof console !== 'undefined') {
	        console.error(msg);
	    }
	}

	function nextTick(cb, ctx) {
	    return ntick(cb, ctx);
	}

	function trim(str) {
	    return str ? str.replace(/^\s*|\s*$/g, '') : '';
	}

	function trimEnd(str, chars) {

	    if (str && chars === undefined) {
	        return str.replace(/\s+$/, '');
	    }

	    if (!str || !chars) {
	        return str;
	    }

	    return str.replace(new RegExp(("[" + chars + "]+$")), '');
	}

	function toLower(str) {
	    return str ? str.toLowerCase() : '';
	}

	function toUpper(str) {
	    return str ? str.toUpperCase() : '';
	}

	var isArray = Array.isArray;

	function isString(val) {
	    return typeof val === 'string';
	}



	function isFunction(val) {
	    return typeof val === 'function';
	}

	function isObject(obj) {
	    return obj !== null && typeof obj === 'object';
	}

	function isPlainObject(obj) {
	    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
	}

	function isBlob(obj) {
	    return typeof Blob !== 'undefined' && obj instanceof Blob;
	}

	function isFormData(obj) {
	    return typeof FormData !== 'undefined' && obj instanceof FormData;
	}

	function when(value, fulfilled, rejected) {

	    var promise = PromiseObj.resolve(value);

	    if (arguments.length < 2) {
	        return promise;
	    }

	    return promise.then(fulfilled, rejected);
	}

	function options(fn, obj, opts) {

	    opts = opts || {};

	    if (isFunction(opts)) {
	        opts = opts.call(obj);
	    }

	    return merge(fn.bind({$vm: obj, $options: opts}), fn, {$options: opts});
	}

	function each(obj, iterator) {

	    var i, key;

	    if (isArray(obj)) {
	        for (i = 0; i < obj.length; i++) {
	            iterator.call(obj[i], obj[i], i);
	        }
	    } else if (isObject(obj)) {
	        for (key in obj) {
	            if (hasOwnProperty.call(obj, key)) {
	                iterator.call(obj[key], obj[key], key);
	            }
	        }
	    }

	    return obj;
	}

	var assign = Object.assign || _assign;

	function merge(target) {

	    var args = slice.call(arguments, 1);

	    args.forEach(function (source) {
	        _merge(target, source, true);
	    });

	    return target;
	}

	function defaults(target) {

	    var args = slice.call(arguments, 1);

	    args.forEach(function (source) {

	        for (var key in source) {
	            if (target[key] === undefined) {
	                target[key] = source[key];
	            }
	        }

	    });

	    return target;
	}

	function _assign(target) {

	    var args = slice.call(arguments, 1);

	    args.forEach(function (source) {
	        _merge(target, source);
	    });

	    return target;
	}

	function _merge(target, source, deep) {
	    for (var key in source) {
	        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
	                target[key] = {};
	            }
	            if (isArray(source[key]) && !isArray(target[key])) {
	                target[key] = [];
	            }
	            _merge(target[key], source[key], deep);
	        } else if (source[key] !== undefined) {
	            target[key] = source[key];
	        }
	    }
	}

	/**
	 * Root Prefix Transform.
	 */

	function root (options$$1, next) {

	    var url = next(options$$1);

	    if (isString(options$$1.root) && !/^(https?:)?\//.test(url)) {
	        url = trimEnd(options$$1.root, '/') + '/' + url;
	    }

	    return url;
	}

	/**
	 * Query Parameter Transform.
	 */

	function query (options$$1, next) {

	    var urlParams = Object.keys(Url.options.params), query = {}, url = next(options$$1);

	    each(options$$1.params, function (value, key) {
	        if (urlParams.indexOf(key) === -1) {
	            query[key] = value;
	        }
	    });

	    query = Url.params(query);

	    if (query) {
	        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
	    }

	    return url;
	}

	/**
	 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
	 */

	function expand(url, params, variables) {

	    var tmpl = parse(url), expanded = tmpl.expand(params);

	    if (variables) {
	        variables.push.apply(variables, tmpl.vars);
	    }

	    return expanded;
	}

	function parse(template) {

	    var operators = ['+', '#', '.', '/', ';', '?', '&'], variables = [];

	    return {
	        vars: variables,
	        expand: function expand(context) {
	            return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
	                if (expression) {

	                    var operator = null, values = [];

	                    if (operators.indexOf(expression.charAt(0)) !== -1) {
	                        operator = expression.charAt(0);
	                        expression = expression.substr(1);
	                    }

	                    expression.split(/,/g).forEach(function (variable) {
	                        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
	                        values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
	                        variables.push(tmp[1]);
	                    });

	                    if (operator && operator !== '+') {

	                        var separator = ',';

	                        if (operator === '?') {
	                            separator = '&';
	                        } else if (operator !== '#') {
	                            separator = operator;
	                        }

	                        return (values.length !== 0 ? operator : '') + values.join(separator);
	                    } else {
	                        return values.join(',');
	                    }

	                } else {
	                    return encodeReserved(literal);
	                }
	            });
	        }
	    };
	}

	function getValues(context, operator, key, modifier) {

	    var value = context[key], result = [];

	    if (isDefined(value) && value !== '') {
	        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
	            value = value.toString();

	            if (modifier && modifier !== '*') {
	                value = value.substring(0, parseInt(modifier, 10));
	            }

	            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
	        } else {
	            if (modifier === '*') {
	                if (Array.isArray(value)) {
	                    value.filter(isDefined).forEach(function (value) {
	                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
	                    });
	                } else {
	                    Object.keys(value).forEach(function (k) {
	                        if (isDefined(value[k])) {
	                            result.push(encodeValue(operator, value[k], k));
	                        }
	                    });
	                }
	            } else {
	                var tmp = [];

	                if (Array.isArray(value)) {
	                    value.filter(isDefined).forEach(function (value) {
	                        tmp.push(encodeValue(operator, value));
	                    });
	                } else {
	                    Object.keys(value).forEach(function (k) {
	                        if (isDefined(value[k])) {
	                            tmp.push(encodeURIComponent(k));
	                            tmp.push(encodeValue(operator, value[k].toString()));
	                        }
	                    });
	                }

	                if (isKeyOperator(operator)) {
	                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
	                } else if (tmp.length !== 0) {
	                    result.push(tmp.join(','));
	                }
	            }
	        }
	    } else {
	        if (operator === ';') {
	            result.push(encodeURIComponent(key));
	        } else if (value === '' && (operator === '&' || operator === '?')) {
	            result.push(encodeURIComponent(key) + '=');
	        } else if (value === '') {
	            result.push('');
	        }
	    }

	    return result;
	}

	function isDefined(value) {
	    return value !== undefined && value !== null;
	}

	function isKeyOperator(operator) {
	    return operator === ';' || operator === '&' || operator === '?';
	}

	function encodeValue(operator, value, key) {

	    value = (operator === '+' || operator === '#') ? encodeReserved(value) : encodeURIComponent(value);

	    if (key) {
	        return encodeURIComponent(key) + '=' + value;
	    } else {
	        return value;
	    }
	}

	function encodeReserved(str) {
	    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
	        if (!/%[0-9A-Fa-f]/.test(part)) {
	            part = encodeURI(part);
	        }
	        return part;
	    }).join('');
	}

	/**
	 * URL Template (RFC 6570) Transform.
	 */

	function template (options) {

	    var variables = [], url = expand(options.url, options.params, variables);

	    variables.forEach(function (key) {
	        delete options.params[key];
	    });

	    return url;
	}

	/**
	 * Service for URL templating.
	 */

	function Url(url, params) {

	    var self = this || {}, options$$1 = url, transform;

	    if (isString(url)) {
	        options$$1 = {url: url, params: params};
	    }

	    options$$1 = merge({}, Url.options, self.$options, options$$1);

	    Url.transforms.forEach(function (handler) {

	        if (isString(handler)) {
	            handler = Url.transform[handler];
	        }

	        if (isFunction(handler)) {
	            transform = factory(handler, transform, self.$vm);
	        }

	    });

	    return transform(options$$1);
	}

	/**
	 * Url options.
	 */

	Url.options = {
	    url: '',
	    root: null,
	    params: {}
	};

	/**
	 * Url transforms.
	 */

	Url.transform = {template: template, query: query, root: root};
	Url.transforms = ['template', 'query', 'root'];

	/**
	 * Encodes a Url parameter string.
	 *
	 * @param {Object} obj
	 */

	Url.params = function (obj) {

	    var params = [], escape = encodeURIComponent;

	    params.add = function (key, value) {

	        if (isFunction(value)) {
	            value = value();
	        }

	        if (value === null) {
	            value = '';
	        }

	        this.push(escape(key) + '=' + escape(value));
	    };

	    serialize(params, obj);

	    return params.join('&').replace(/%20/g, '+');
	};

	/**
	 * Parse a URL and return its components.
	 *
	 * @param {String} url
	 */

	Url.parse = function (url) {

	    var el = document.createElement('a');

	    if (document.documentMode) {
	        el.href = url;
	        url = el.href;
	    }

	    el.href = url;

	    return {
	        href: el.href,
	        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
	        port: el.port,
	        host: el.host,
	        hostname: el.hostname,
	        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
	        search: el.search ? el.search.replace(/^\?/, '') : '',
	        hash: el.hash ? el.hash.replace(/^#/, '') : ''
	    };
	};

	function factory(handler, next, vm) {
	    return function (options$$1) {
	        return handler.call(vm, options$$1, next);
	    };
	}

	function serialize(params, obj, scope) {

	    var array = isArray(obj), plain = isPlainObject(obj), hash;

	    each(obj, function (value, key) {

	        hash = isObject(value) || isArray(value);

	        if (scope) {
	            key = scope + '[' + (plain || hash ? key : '') + ']';
	        }

	        if (!scope && array) {
	            params.add(value.name, value.value);
	        } else if (hash) {
	            serialize(params, value, key);
	        } else {
	            params.add(key, value);
	        }
	    });
	}

	/**
	 * XDomain client (Internet Explorer).
	 */

	function xdrClient (request) {
	    return new PromiseObj(function (resolve) {

	        var xdr = new XDomainRequest(), handler = function (ref) {
	            var type = ref.type;


	            var status = 0;

	            if (type === 'load') {
	                status = 200;
	            } else if (type === 'error') {
	                status = 500;
	            }

	            resolve(request.respondWith(xdr.responseText, {status: status}));
	        };

	        request.abort = function () { return xdr.abort(); };

	        xdr.open(request.method, request.getUrl());

	        if (request.timeout) {
	            xdr.timeout = request.timeout;
	        }

	        xdr.onload = handler;
	        xdr.onabort = handler;
	        xdr.onerror = handler;
	        xdr.ontimeout = handler;
	        xdr.onprogress = function () {};
	        xdr.send(request.getBody());
	    });
	}

	/**
	 * CORS Interceptor.
	 */

	var SUPPORTS_CORS = inBrowser && 'withCredentials' in new XMLHttpRequest();

	function cors (request, next) {

	    if (inBrowser) {

	        var orgUrl = Url.parse(location.href);
	        var reqUrl = Url.parse(request.getUrl());

	        if (reqUrl.protocol !== orgUrl.protocol || reqUrl.host !== orgUrl.host) {

	            request.crossOrigin = true;
	            request.emulateHTTP = false;

	            if (!SUPPORTS_CORS) {
	                request.client = xdrClient;
	            }
	        }
	    }

	    next();
	}

	/**
	 * Form data Interceptor.
	 */

	function form (request, next) {

	    if (isFormData(request.body)) {

	        request.headers.delete('Content-Type');

	    } else if (isObject(request.body) && request.emulateJSON) {

	        request.body = Url.params(request.body);
	        request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
	    }

	    next();
	}

	/**
	 * JSON Interceptor.
	 */

	function json (request, next) {

	    var type = request.headers.get('Content-Type') || '';

	    if (isObject(request.body) && type.indexOf('application/json') === 0) {
	        request.body = JSON.stringify(request.body);
	    }

	    next(function (response) {

	        return response.bodyText ? when(response.text(), function (text) {

	            type = response.headers.get('Content-Type') || '';

	            if (type.indexOf('application/json') === 0 || isJson(text)) {

	                try {
	                    response.body = JSON.parse(text);
	                } catch (e) {
	                    response.body = null;
	                }

	            } else {
	                response.body = text;
	            }

	            return response;

	        }) : response;

	    });
	}

	function isJson(str) {

	    var start = str.match(/^\s*(\[|\{)/);
	    var end = {'[': /]\s*$/, '{': /}\s*$/};

	    return start && end[start[1]].test(str);
	}

	/**
	 * JSONP client (Browser).
	 */

	function jsonpClient (request) {
	    return new PromiseObj(function (resolve) {

	        var name = request.jsonp || 'callback', callback = request.jsonpCallback || '_jsonp' + Math.random().toString(36).substr(2), body = null, handler, script;

	        handler = function (ref) {
	            var type = ref.type;


	            var status = 0;

	            if (type === 'load' && body !== null) {
	                status = 200;
	            } else if (type === 'error') {
	                status = 500;
	            }

	            if (status && window[callback]) {
	                delete window[callback];
	                document.body.removeChild(script);
	            }

	            resolve(request.respondWith(body, {status: status}));
	        };

	        window[callback] = function (result) {
	            body = JSON.stringify(result);
	        };

	        request.abort = function () {
	            handler({type: 'abort'});
	        };

	        request.params[name] = callback;

	        if (request.timeout) {
	            setTimeout(request.abort, request.timeout);
	        }

	        script = document.createElement('script');
	        script.src = request.getUrl();
	        script.type = 'text/javascript';
	        script.async = true;
	        script.onload = handler;
	        script.onerror = handler;

	        document.body.appendChild(script);
	    });
	}

	/**
	 * JSONP Interceptor.
	 */

	function jsonp (request, next) {

	    if (request.method == 'JSONP') {
	        request.client = jsonpClient;
	    }

	    next();
	}

	/**
	 * Before Interceptor.
	 */

	function before (request, next) {

	    if (isFunction(request.before)) {
	        request.before.call(this, request);
	    }

	    next();
	}

	/**
	 * HTTP method override Interceptor.
	 */

	function method (request, next) {

	    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
	        request.headers.set('X-HTTP-Method-Override', request.method);
	        request.method = 'POST';
	    }

	    next();
	}

	/**
	 * Header Interceptor.
	 */

	function header (request, next) {

	    var headers = assign({}, Http.headers.common,
	        !request.crossOrigin ? Http.headers.custom : {},
	        Http.headers[toLower(request.method)]
	    );

	    each(headers, function (value, name) {
	        if (!request.headers.has(name)) {
	            request.headers.set(name, value);
	        }
	    });

	    next();
	}

	/**
	 * XMLHttp client (Browser).
	 */

	function xhrClient (request) {
	    return new PromiseObj(function (resolve) {

	        var xhr = new XMLHttpRequest(), handler = function (event) {

	            var response = request.respondWith(
	                'response' in xhr ? xhr.response : xhr.responseText, {
	                    status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
	                    statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
	                }
	            );

	            each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
	                response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
	            });

	            resolve(response);
	        };

	        request.abort = function () { return xhr.abort(); };

	        if (request.progress) {
	            if (request.method === 'GET') {
	                xhr.addEventListener('progress', request.progress);
	            } else if (/^(POST|PUT)$/i.test(request.method)) {
	                xhr.upload.addEventListener('progress', request.progress);
	            }
	        }

	        xhr.open(request.method, request.getUrl(), true);

	        if (request.timeout) {
	            xhr.timeout = request.timeout;
	        }

	        if (request.responseType && 'responseType' in xhr) {
	            xhr.responseType = request.responseType;
	        }

	        if (request.withCredentials || request.credentials) {
	            xhr.withCredentials = true;
	        }

	        if (!request.crossOrigin) {
	            request.headers.set('X-Requested-With', 'XMLHttpRequest');
	        }

	        request.headers.forEach(function (value, name) {
	            xhr.setRequestHeader(name, value);
	        });

	        xhr.onload = handler;
	        xhr.onabort = handler;
	        xhr.onerror = handler;
	        xhr.ontimeout = handler;
	        xhr.send(request.getBody());
	    });
	}

	/**
	 * Http client (Node).
	 */

	function nodeClient (request) {

	    var client = __webpack_require__(2);

	    return new PromiseObj(function (resolve) {

	        var url = request.getUrl();
	        var body = request.getBody();
	        var method = request.method;
	        var headers = {}, handler;

	        request.headers.forEach(function (value, name) {
	            headers[name] = value;
	        });

	        client(url, {body: body, method: method, headers: headers}).then(handler = function (resp) {

	            var response = request.respondWith(resp.body, {
	                    status: resp.statusCode,
	                    statusText: trim(resp.statusMessage)
	                }
	            );

	            each(resp.headers, function (value, name) {
	                response.headers.set(name, value);
	            });

	            resolve(response);

	        }, function (error$$1) { return handler(error$$1.response); });
	    });
	}

	/**
	 * Base client.
	 */

	function Client (context) {

	    var reqHandlers = [sendRequest], resHandlers = [], handler;

	    if (!isObject(context)) {
	        context = null;
	    }

	    function Client(request) {
	        return new PromiseObj(function (resolve, reject) {

	            function exec() {

	                handler = reqHandlers.pop();

	                if (isFunction(handler)) {
	                    handler.call(context, request, next);
	                } else {
	                    warn(("Invalid interceptor of type " + (typeof handler) + ", must be a function"));
	                    next();
	                }
	            }

	            function next(response) {

	                if (isFunction(response)) {

	                    resHandlers.unshift(response);

	                } else if (isObject(response)) {

	                    resHandlers.forEach(function (handler) {
	                        response = when(response, function (response) {
	                            return handler.call(context, response) || response;
	                        }, reject);
	                    });

	                    when(response, resolve, reject);

	                    return;
	                }

	                exec();
	            }

	            exec();

	        }, context);
	    }

	    Client.use = function (handler) {
	        reqHandlers.push(handler);
	    };

	    return Client;
	}

	function sendRequest(request, resolve) {

	    var client = request.client || (inBrowser ? xhrClient : nodeClient);

	    resolve(client(request));
	}

	/**
	 * HTTP Headers.
	 */

	var Headers = function Headers(headers) {
	    var this$1 = this;


	    this.map = {};

	    each(headers, function (value, name) { return this$1.append(name, value); });
	};

	Headers.prototype.has = function has (name) {
	    return getName(this.map, name) !== null;
	};

	Headers.prototype.get = function get (name) {

	    var list = this.map[getName(this.map, name)];

	    return list ? list.join() : null;
	};

	Headers.prototype.getAll = function getAll (name) {
	    return this.map[getName(this.map, name)] || [];
	};

	Headers.prototype.set = function set (name, value) {
	    this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
	};

	Headers.prototype.append = function append (name, value){

	    var list = this.map[getName(this.map, name)];

	    if (list) {
	        list.push(trim(value));
	    } else {
	        this.set(name, value);
	    }
	};

	Headers.prototype.delete = function delete$1 (name){
	    delete this.map[getName(this.map, name)];
	};

	Headers.prototype.deleteAll = function deleteAll (){
	    this.map = {};
	};

	Headers.prototype.forEach = function forEach (callback, thisArg) {
	        var this$1 = this;

	    each(this.map, function (list, name) {
	        each(list, function (value) { return callback.call(thisArg, value, name, this$1); });
	    });
	};

	function getName(map, name) {
	    return Object.keys(map).reduce(function (prev, curr) {
	        return toLower(name) === toLower(curr) ? curr : prev;
	    }, null);
	}

	function normalizeName(name) {

	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	        throw new TypeError('Invalid character in header field name');
	    }

	    return trim(name);
	}

	/**
	 * HTTP Response.
	 */

	var Response = function Response(body, ref) {
	    var url = ref.url;
	    var headers = ref.headers;
	    var status = ref.status;
	    var statusText = ref.statusText;


	    this.url = url;
	    this.ok = status >= 200 && status < 300;
	    this.status = status || 0;
	    this.statusText = statusText || '';
	    this.headers = new Headers(headers);
	    this.body = body;

	    if (isString(body)) {

	        this.bodyText = body;

	    } else if (isBlob(body)) {

	        this.bodyBlob = body;

	        if (isBlobText(body)) {
	            this.bodyText = blobText(body);
	        }
	    }
	};

	Response.prototype.blob = function blob () {
	    return when(this.bodyBlob);
	};

	Response.prototype.text = function text () {
	    return when(this.bodyText);
	};

	Response.prototype.json = function json () {
	    return when(this.text(), function (text) { return JSON.parse(text); });
	};

	Object.defineProperty(Response.prototype, 'data', {

	    get: function get() {
	        return this.body;
	    },

	    set: function set(body) {
	        this.body = body;
	    }

	});

	function blobText(body) {
	    return new PromiseObj(function (resolve) {

	        var reader = new FileReader();

	        reader.readAsText(body);
	        reader.onload = function () {
	            resolve(reader.result);
	        };

	    });
	}

	function isBlobText(body) {
	    return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
	}

	/**
	 * HTTP Request.
	 */

	var Request = function Request(options$$1) {

	    this.body = null;
	    this.params = {};

	    assign(this, options$$1, {
	        method: toUpper(options$$1.method || 'GET')
	    });

	    if (!(this.headers instanceof Headers)) {
	        this.headers = new Headers(this.headers);
	    }
	};

	Request.prototype.getUrl = function getUrl (){
	    return Url(this);
	};

	Request.prototype.getBody = function getBody (){
	    return this.body;
	};

	Request.prototype.respondWith = function respondWith (body, options$$1) {
	    return new Response(body, assign(options$$1 || {}, {url: this.getUrl()}));
	};

	/**
	 * Service for sending network requests.
	 */

	var COMMON_HEADERS = {'Accept': 'application/json, text/plain, */*'};
	var JSON_CONTENT_TYPE = {'Content-Type': 'application/json;charset=utf-8'};

	function Http(options$$1) {

	    var self = this || {}, client = Client(self.$vm);

	    defaults(options$$1 || {}, self.$options, Http.options);

	    Http.interceptors.forEach(function (handler) {

	        if (isString(handler)) {
	            handler = Http.interceptor[handler];
	        }

	        if (isFunction(handler)) {
	            client.use(handler);
	        }

	    });

	    return client(new Request(options$$1)).then(function (response) {

	        return response.ok ? response : PromiseObj.reject(response);

	    }, function (response) {

	        if (response instanceof Error) {
	            error(response);
	        }

	        return PromiseObj.reject(response);
	    });
	}

	Http.options = {};

	Http.headers = {
	    put: JSON_CONTENT_TYPE,
	    post: JSON_CONTENT_TYPE,
	    patch: JSON_CONTENT_TYPE,
	    delete: JSON_CONTENT_TYPE,
	    common: COMMON_HEADERS,
	    custom: {}
	};

	Http.interceptor = {before: before, method: method, jsonp: jsonp, json: json, form: form, header: header, cors: cors};
	Http.interceptors = ['before', 'method', 'jsonp', 'json', 'form', 'header', 'cors'];

	['get', 'delete', 'head', 'jsonp'].forEach(function (method$$1) {

	    Http[method$$1] = function (url, options$$1) {
	        return this(assign(options$$1 || {}, {url: url, method: method$$1}));
	    };

	});

	['post', 'put', 'patch'].forEach(function (method$$1) {

	    Http[method$$1] = function (url, body, options$$1) {
	        return this(assign(options$$1 || {}, {url: url, method: method$$1, body: body}));
	    };

	});

	/**
	 * Service for interacting with RESTful services.
	 */

	function Resource(url, params, actions, options$$1) {

	    var self = this || {}, resource = {};

	    actions = assign({},
	        Resource.actions,
	        actions
	    );

	    each(actions, function (action, name) {

	        action = merge({url: url, params: assign({}, params)}, options$$1, action);

	        resource[name] = function () {
	            return (self.$http || Http)(opts(action, arguments));
	        };
	    });

	    return resource;
	}

	function opts(action, args) {

	    var options$$1 = assign({}, action), params = {}, body;

	    switch (args.length) {

	        case 2:

	            params = args[0];
	            body = args[1];

	            break;

	        case 1:

	            if (/^(POST|PUT|PATCH)$/i.test(options$$1.method)) {
	                body = args[0];
	            } else {
	                params = args[0];
	            }

	            break;

	        case 0:

	            break;

	        default:

	            throw 'Expected up to 2 arguments [params, body], got ' + args.length + ' arguments';
	    }

	    options$$1.body = body;
	    options$$1.params = assign({}, options$$1.params, params);

	    return options$$1;
	}

	Resource.actions = {

	    get: {method: 'GET'},
	    save: {method: 'POST'},
	    query: {method: 'GET'},
	    update: {method: 'PUT'},
	    remove: {method: 'DELETE'},
	    delete: {method: 'DELETE'}

	};

	/**
	 * Install plugin.
	 */

	function plugin(Vue) {

	    if (plugin.installed) {
	        return;
	    }

	    Util(Vue);

	    Vue.url = Url;
	    Vue.http = Http;
	    Vue.resource = Resource;
	    Vue.Promise = PromiseObj;

	    Object.defineProperties(Vue.prototype, {

	        $url: {
	            get: function get() {
	                return options(Vue.url, this, this.$options.url);
	            }
	        },

	        $http: {
	            get: function get() {
	                return options(Vue.http, this, this.$options.http);
	            }
	        },

	        $resource: {
	            get: function get() {
	                return Vue.resource.bind(this);
	            }
	        },

	        $promise: {
	            get: function get() {
	                var this$1 = this;

	                return function (executor) { return new Vue.Promise(executor, this$1); };
	            }
	        }

	    });
	}

	if (typeof window !== 'undefined' && window.Vue) {
	    window.Vue.use(plugin);
	}

	module.exports = plugin;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/* (ignored) */

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = __webpack_require__(4);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var EventHub = {};
	EventHub.install = function (Vue, options) {
		var globalLoading = null;
		Vue.prototype.$loading = function (value) {
			if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) == undefined) {
				return globalLoading ? true : false;
			} else {
				if (value) {
					// 1、创建构造器
					var loadingTpl = Vue.extend({
						template: '<div class="ajaxLoading"></div>'
					});
					// 2、创建实例，挂载到文档以后的地方
					globalLoading = new loadingTpl().$mount().$el;
					// 3、把创建的实例添加到body中
					document.getElementById('app').appendChild(globalLoading);
				} else {
					// 4、移除
					if (globalLoading) {
						document.getElementById('app').removeChild(globalLoading);
						globalLoading = null;
					}
				}
			}
		};
	};
	module.exports = EventHub;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _Symbol = __webpack_require__(5)["default"];

	exports["default"] = function (obj) {
	  return obj && obj.constructor === _Symbol ? "symbol" : typeof obj;
	};

	exports.__esModule = true;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(6), __esModule: true };

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(7);
	__webpack_require__(35);
	module.exports = __webpack_require__(14).Symbol;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __webpack_require__(8)
	  , global         = __webpack_require__(9)
	  , has            = __webpack_require__(10)
	  , DESCRIPTORS    = __webpack_require__(11)
	  , $export        = __webpack_require__(13)
	  , redefine       = __webpack_require__(17)
	  , $fails         = __webpack_require__(12)
	  , shared         = __webpack_require__(20)
	  , setToStringTag = __webpack_require__(21)
	  , uid            = __webpack_require__(23)
	  , wks            = __webpack_require__(22)
	  , keyOf          = __webpack_require__(24)
	  , $names         = __webpack_require__(29)
	  , enumKeys       = __webpack_require__(30)
	  , isArray        = __webpack_require__(31)
	  , anObject       = __webpack_require__(32)
	  , toIObject      = __webpack_require__(25)
	  , createDesc     = __webpack_require__(19)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(setDesc({}, 'a', {
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = getDesc(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  setDesc(it, key, D);
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	} : setDesc;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};

	var isSymbol = function(it){
	  return typeof it == 'symbol';
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
	    ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toIObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , $$   = arguments
	    , replacer, $replacer;
	  while($$.length > i)args.push($$[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});

	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });

	  isSymbol = function(it){
	    return it instanceof $Symbol;
	  };

	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(34)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}

	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	  'species,split,toPrimitive,toStringTag,unscopables'
	).split(','), function(it){
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});

	setter = true;

	$export($export.G + $export.W, {Symbol: $Symbol});

	$export($export.S, 'Symbol', symbolStatics);

	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 10 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(12)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(9)
	  , core      = __webpack_require__(14)
	  , ctx       = __webpack_require__(15)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(16);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(18);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(8)
	  , createDesc = __webpack_require__(19);
	module.exports = __webpack_require__(11) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(9)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(8).setDesc
	  , has = __webpack_require__(10)
	  , TAG = __webpack_require__(22)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var store  = __webpack_require__(20)('wks')
	  , uid    = __webpack_require__(23)
	  , Symbol = __webpack_require__(9).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(8)
	  , toIObject = __webpack_require__(25);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(26)
	  , defined = __webpack_require__(28);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(27);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(25)
	  , getNames  = __webpack_require__(8).getNames
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(8);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(27);
	module.exports = Array.isArray || function(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(33);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(37)
	__vue_script__ = __webpack_require__(42)
	__vue_template__ = __webpack_require__(43)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "/Users/cullenng/website/stoshop/frontend/source/order/global/reorder.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	
	var content = __webpack_require__(38);

	if(typeof content === 'string') content = [[module.id, content, '']];

	var transform;
	var insertInto;



	var options = {"hmr":true}

	options.transform = transform
	options.insertInto = undefined;

	var update = __webpack_require__(40)(content, options);

	if(content.locals) module.exports = content.locals;

	if(false) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-819794ce&file=reorder.vue&scoped=true!../../../../node_modules/less-loader/dist/cjs.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./reorder.vue", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-819794ce&file=reorder.vue&scoped=true!../../../../node_modules/less-loader/dist/cjs.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./reorder.vue");

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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)(false);
	// imports


	// module
	exports.push([module.id, ".reorder-layer[_v-819794ce] {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  background: rgba(0, 0, 0, 0.65);\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n.reorder-boxer[_v-819794ce] {\n  width: 86%;\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  padding: 4%;\n  background: #fff;\n  color: #222;\n  z-index: 3;\n  -webkit-transform: translateX(-50%) translateY(-50%);\n          transform: translateX(-50%) translateY(-50%);\n}\n@media screen and (min-width: 640px) {\n  .reorder-boxer[_v-819794ce] {\n    width: 30%;\n  }\n}\n.reorder-header[_v-819794ce] {\n  font-size: 14px;\n  text-align: center;\n}\n.reorder-body[_v-819794ce] {\n  font-size: 14px;\n}\n.reorder-footer[_v-819794ce] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  display: -webkit-flex;\n}\n.reorder-footer > div[_v-819794ce] {\n  -webkit-box-flex: 1;\n      -ms-flex: 1;\n          flex: 1;\n  -webkit-flex: 1;\n  text-align: center;\n  color: #ff5a5f;\n  font-size: 14px;\n  padding: 10px 0;\n  cursor: pointer;\n}\n", ""]);

	// exports


/***/ }),
/* 39 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function(useSourceMap) {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			return this.map(function (item) {
				var content = cssWithMappingToString(item, useSourceMap);
				if(item[2]) {
					return "@media " + item[2] + "{" + content + "}";
				} else {
					return content;
				}
			}).join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

	function cssWithMappingToString(item, useSourceMap) {
		var content = item[1] || '';
		var cssMapping = item[3];
		if (!cssMapping) {
			return content;
		}

		if (useSourceMap && typeof btoa === 'function') {
			var sourceMapping = toComment(cssMapping);
			var sourceURLs = cssMapping.sources.map(function (source) {
				return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
			});

			return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
		}

		return [content].join('\n');
	}

	// Adapted from convert-source-map (MIT)
	function toComment(sourceMap) {
		// eslint-disable-next-line no-undef
		var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
		var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

		return '/*# ' + data + ' */';
	}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/

	var stylesInDom = {};

	var	memoize = function (fn) {
		var memo;

		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	};

	var isOldIE = memoize(function () {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	});

	var getTarget = function (target) {
	  return document.querySelector(target);
	};

	var getElement = (function (fn) {
		var memo = {};

		return function(target) {
	                // If passing function in options, then use it for resolve "head" element.
	                // Useful for Shadow Root style i.e
	                // {
	                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
	                // }
	                if (typeof target === 'function') {
	                        return target();
	                }
	                if (typeof memo[target] === "undefined") {
				var styleTarget = getTarget.call(this, target);
				// Special case to return head of iframe instead of iframe itself
				if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
					try {
						// This will throw an exception if access to iframe is blocked
						// due to cross-origin restrictions
						styleTarget = styleTarget.contentDocument.head;
					} catch(e) {
						styleTarget = null;
					}
				}
				memo[target] = styleTarget;
			}
			return memo[target]
		};
	})();

	var singleton = null;
	var	singletonCounter = 0;
	var	stylesInsertedAtTop = [];

	var	fixUrls = __webpack_require__(41);

	module.exports = function(list, options) {
		if (false) {
			if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};

		options.attrs = typeof options.attrs === "object" ? options.attrs : {};

		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

		// By default, add <style> tags to the <head> element
	        if (!options.insertInto) options.insertInto = "head";

		// By default, add <style> tags to the bottom of the target
		if (!options.insertAt) options.insertAt = "bottom";

		var styles = listToStyles(list, options);

		addStylesToDom(styles, options);

		return function update (newList) {
			var mayRemove = [];

			for (var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];

				domStyle.refs--;
				mayRemove.push(domStyle);
			}

			if(newList) {
				var newStyles = listToStyles(newList, options);
				addStylesToDom(newStyles, options);
			}

			for (var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];

				if(domStyle.refs === 0) {
					for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

					delete stylesInDom[domStyle.id];
				}
			}
		};
	};

	function addStylesToDom (styles, options) {
		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			if(domStyle) {
				domStyle.refs++;

				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}

				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];

				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}

				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles (list, options) {
		var styles = [];
		var newStyles = {};

		for (var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = options.base ? item[0] + options.base : item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};

			if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
			else newStyles[id].parts.push(part);
		}

		return styles;
	}

	function insertStyleElement (options, style) {
		var target = getElement(options.insertInto)

		if (!target) {
			throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
		}

		var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

		if (options.insertAt === "top") {
			if (!lastStyleElementInsertedAtTop) {
				target.insertBefore(style, target.firstChild);
			} else if (lastStyleElementInsertedAtTop.nextSibling) {
				target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				target.appendChild(style);
			}
			stylesInsertedAtTop.push(style);
		} else if (options.insertAt === "bottom") {
			target.appendChild(style);
		} else if (typeof options.insertAt === "object" && options.insertAt.before) {
			var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
			target.insertBefore(style, nextSibling);
		} else {
			throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
		}
	}

	function removeStyleElement (style) {
		if (style.parentNode === null) return false;
		style.parentNode.removeChild(style);

		var idx = stylesInsertedAtTop.indexOf(style);
		if(idx >= 0) {
			stylesInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement (options) {
		var style = document.createElement("style");

		options.attrs.type = "text/css";

		addAttrs(style, options.attrs);
		insertStyleElement(options, style);

		return style;
	}

	function createLinkElement (options) {
		var link = document.createElement("link");

		options.attrs.type = "text/css";
		options.attrs.rel = "stylesheet";

		addAttrs(link, options.attrs);
		insertStyleElement(options, link);

		return link;
	}

	function addAttrs (el, attrs) {
		Object.keys(attrs).forEach(function (key) {
			el.setAttribute(key, attrs[key]);
		});
	}

	function addStyle (obj, options) {
		var style, update, remove, result;

		// If a transform function was defined, run it on the css
		if (options.transform && obj.css) {
		    result = options.transform(obj.css);

		    if (result) {
		    	// If transform returns a value, use that instead of the original css.
		    	// This allows running runtime transformations on the css.
		    	obj.css = result;
		    } else {
		    	// If the transform function returns a falsy value, don't add this css.
		    	// This allows conditional loading of css
		    	return function() {
		    		// noop
		    	};
		    }
		}

		if (options.singleton) {
			var styleIndex = singletonCounter++;

			style = singleton || (singleton = createStyleElement(options));

			update = applyToSingletonTag.bind(null, style, styleIndex, false);
			remove = applyToSingletonTag.bind(null, style, styleIndex, true);

		} else if (
			obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function"
		) {
			style = createLinkElement(options);
			update = updateLink.bind(null, style, options);
			remove = function () {
				removeStyleElement(style);

				if(style.href) URL.revokeObjectURL(style.href);
			};
		} else {
			style = createStyleElement(options);
			update = applyToTag.bind(null, style);
			remove = function () {
				removeStyleElement(style);
			};
		}

		update(obj);

		return function updateStyle (newObj) {
			if (newObj) {
				if (
					newObj.css === obj.css &&
					newObj.media === obj.media &&
					newObj.sourceMap === obj.sourceMap
				) {
					return;
				}

				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;

			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag (style, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (style.styleSheet) {
			style.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = style.childNodes;

			if (childNodes[index]) style.removeChild(childNodes[index]);

			if (childNodes.length) {
				style.insertBefore(cssNode, childNodes[index]);
			} else {
				style.appendChild(cssNode);
			}
		}
	}

	function applyToTag (style, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			style.setAttribute("media", media)
		}

		if(style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			while(style.firstChild) {
				style.removeChild(style.firstChild);
			}

			style.appendChild(document.createTextNode(css));
		}
	}

	function updateLink (link, options, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		/*
			If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
			and there is no publicPath defined then lets turn convertToAbsoluteUrls
			on by default.  Otherwise default to the convertToAbsoluteUrls option
			directly
		*/
		var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

		if (options.convertToAbsoluteUrls || autoFixUrls) {
			css = fixUrls(css);
		}

		if (sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = link.href;

		link.href = URL.createObjectURL(blob);

		if(oldSrc) URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 41 */
/***/ (function(module, exports) {

	
	/**
	 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
	 * embed the css on the page. This breaks all relative urls because now they are relative to a
	 * bundle instead of the current page.
	 *
	 * One solution is to only use full urls, but that may be impossible.
	 *
	 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
	 *
	 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
	 *
	 */

	module.exports = function (css) {
	  // get current location
	  var location = typeof window !== "undefined" && window.location;

	  if (!location) {
	    throw new Error("fixUrls requires window.location");
	  }

		// blank or null?
		if (!css || typeof css !== "string") {
		  return css;
	  }

	  var baseUrl = location.protocol + "//" + location.host;
	  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

		// convert each url(...)
		/*
		This regular expression is just a way to recursively match brackets within
		a string.

		 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
		   (  = Start a capturing group
		     (?:  = Start a non-capturing group
		         [^)(]  = Match anything that isn't a parentheses
		         |  = OR
		         \(  = Match a start parentheses
		             (?:  = Start another non-capturing groups
		                 [^)(]+  = Match anything that isn't a parentheses
		                 |  = OR
		                 \(  = Match a start parentheses
		                     [^)(]*  = Match anything that isn't a parentheses
		                 \)  = Match a end parentheses
		             )  = End Group
	              *\) = Match anything and then a close parens
	          )  = Close non-capturing group
	          *  = Match anything
	       )  = Close capturing group
		 \)  = Match a close parens

		 /gi  = Get all matches, not the first.  Be case insensitive.
		 */
		var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
			// strip quotes (if they exist)
			var unquotedOrigUrl = origUrl
				.trim()
				.replace(/^"(.*)"$/, function(o, $1){ return $1; })
				.replace(/^'(.*)'$/, function(o, $1){ return $1; });

			// already a full url? no change
			if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			  return fullMatch;
			}

			// convert the url to a full url
			var newUrl;

			if (unquotedOrigUrl.indexOf("//") === 0) {
			  	//TODO: should we add protocol?
				newUrl = unquotedOrigUrl;
			} else if (unquotedOrigUrl.indexOf("/") === 0) {
				// path should be relative to the base url
				newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
			} else {
				// path should be relative to current directory
				newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
			}

			// send back the fixed url(...)
			return "url(" + JSON.stringify(newUrl) + ")";
		});

		// send back the fixed css
		return fixedCss;
	};


/***/ }),
/* 42 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// <template>
	// 	<setion class="reorder-layer" v-if="isShow">
	// 		<div class="reorder-boxer">
	// 			<div class="reorder-header">${ lang.reorder_title }</div>
	// 			<div class="reorder-body">${ content }</div>
	// 			<div class="reorder-footer">
	// 				<div @click="handleClickBtn1">${ lang.reorder_btn1 }</div>
	// 				<div @click="handleClickBtn2">${ lang.reorder_btn2 }</div>
	// 			</div>
	// 		</div>
	// 	</setion>
	// </template>
	//
	// <script>
	exports.default = {
		delimiters: ['${', '}'],
		props: ['order', 'formdata', 'confirm', 'cancel'],
		data: function data() {
			return {
				isShow: false,
				checked: false,
				lang: window.lang,
				api: '/api_sms.php?do=is_same_buy',
				product_title: '产品名字'
				// 距离上次下单的时间（单位：秒）
				, interval_time: 0,
				unit: '单位',
				product_attr: ''
			};
		},
		computed: {
			content: function content() {
				var timeStr = '';
				var unitStr = '';
				if (this.interval_time < 60) {
					timeStr = '';
					unitStr = this.lang.reorder_before_now;
				} else if (this.interval_time >= 60 && this.interval_time < 3600) {
					timeStr = parseInt(this.interval_time / 3600);
					unitStr = this.lang.reorder_before_minute;
				} else if (this.interval_time >= 3600 && this.interval_time < 86400) {
					timeStr = parseInt(this.interval_time / 3600);
					unitStr = this.lang.reorder_before_hour;
				} else if (this.interval_time >= 86400 && this.interval_time < 259200) {
					timeStr = parseInt(this.interval_time / 3600 / 24);
					unitStr = this.lang.reorder_before_day;
				}
				return this.lang.reorder_content.replace('{product_title}', this.product_title).replace('{time}', timeStr).replace('{unit}', unitStr);
			}
		},
		created: function created() {},
		mounted: function mounted() {},
		methods: {
			// 显示窗口
			show: function show(tof) {
				// 弹窗控制
				this.isShow = tof;
				// 外层遮罩层控制
				this.$loading(false);
			}
			/*
	  检查是否有重复订单
	  	data {
	  		mobile: 电话
	  		product_id: 产品ID
	  		combo_id: 套餐ID
	  		count: 数量
	  		proto: 属性组合
	  	}
	  */
			,
			check: function check(data) {
				var _this = this;

				// 避免重复验证
				if (this.checked == true) {
					return true;
				}
				this.checked = true;

				// 发起ajax请求
				this.$http.post(this.api, {
					mobile: data.mobile,
					combo_id: data.combo_id,
					product_id: data.product_id,
					count: data.count,
					proto: data.proto
				}).then(function (res) {
					var ress = { body: {
							ret: 1,
							name: 'goods',
							interval_time: 8760
						} };
					if (ress.body.ret == 1) {
						_this.interval_time = ress.body.interval_time;
						_this.product_title = ress.body.name;
						// 超过三天重新下单
						if (_this.interval_time >= 259200) {
							// 关闭弹窗
							_this.show(false);
							// 执行父组件提交事件
							_this.$emit('confirm');
						} else {
							_this.show(true);
						}
					} else {
						alert(res.body.msg);
						_this.checked = false;
						_this.$loading(false);
					}
				});
				return false;
			}

			// 确认下单
			,
			handleClickBtn1: function handleClickBtn1() {
				// 关闭弹窗
				this.show(false);
				// 执行父组件提交事件
				this.$emit('confirm');
			}

			// 取消订单
			,
			handleClickBtn2: function handleClickBtn2() {
				this.$emit('cancel');
			}
		}
		// </script>
		//
		// <style lang="less" scoped>
		// 	.reorder-layer {
		// 		position: fixed;
		// 		width: 100%;
		// 		height: 100%;
		// 		overflow: hidden;
		// 		background: rgba(0, 0, 0, 0.65);
		// 		top: 0;
		// 		left:0;
		// 		z-index:2;
		// 	}
		// 	.reorder-boxer {
		// 		width: 86%;
		// 		position: fixed;
		// 		top: 50%;
		// 		left: 50%;
		// 		padding: 4%;
		// 		background: #fff;
		// 		color: #222;
		// 		z-index:3;
		// 		transform: translateX(-50%) translateY(-50%);
		// 	}
		// 	@media screen and (min-width: 640px){
		// 		.reorder-boxer {
		// 			width:30%;
		// 		}
		// 	}
		// 	.reorder-header {
		// 		font-size: 14px;
		// 		text-align: center;
		// 	}
		// 	.reorder-body {
		// 		font-size: 14px;
		// 	}
		// 	.reorder-footer {
		// 		display: flex;
		// 		display: -webkit-flex;
		// 		> div {
		// 			flex: 1;
		// 			-webkit-flex:1;
		// 			text-align: center;
		// 			color:#ff5a5f;
		// 			font-size: 14px;
		// 			padding:10px 0;
		// 			cursor: pointer;
		// 		}
		// 	}
		//
		// </style>

	};

/***/ }),
/* 43 */
/***/ (function(module, exports) {

	module.exports = "\n\t<setion class=\"reorder-layer\" v-if=\"isShow\" _v-819794ce=\"\">\n\t\t<div class=\"reorder-boxer\" _v-819794ce=\"\">\n\t\t\t<div class=\"reorder-header\" _v-819794ce=\"\">${ lang.reorder_title }</div>\n\t\t\t<div class=\"reorder-body\" _v-819794ce=\"\">${ content }</div>\n\t\t\t<div class=\"reorder-footer\" _v-819794ce=\"\">\n\t\t\t\t<div @click=\"handleClickBtn1\" _v-819794ce=\"\">${ lang.reorder_btn1 }</div>\n\t\t\t\t<div @click=\"handleClickBtn2\" _v-819794ce=\"\">${ lang.reorder_btn2 }</div>\n\t\t\t</div>\n\t\t</div>\n\t</setion>\n";

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(45)
	__vue_script__ = __webpack_require__(47)
	__vue_template__ = __webpack_require__(51)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "/Users/cullenng/website/stoshop/frontend/source/order/global/sms.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	
	var content = __webpack_require__(46);

	if(typeof content === 'string') content = [[module.id, content, '']];

	var transform;
	var insertInto;



	var options = {"hmr":true}

	options.transform = transform
	options.insertInto = undefined;

	var update = __webpack_require__(40)(content, options);

	if(content.locals) module.exports = content.locals;

	if(false) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-4d37e5f7&file=sms.vue&scoped=true!../../../../node_modules/less-loader/dist/cjs.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./sms.vue", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-4d37e5f7&file=sms.vue&scoped=true!../../../../node_modules/less-loader/dist/cjs.js!../../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./sms.vue");

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
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(39)(false);
	// imports


	// module
	exports.push([module.id, ".sms-layer[_v-4d37e5f7] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n  overflow: hidden;\n  background: rgba(0, 0, 0, 0.65);\n}\n.sms-layer .sms-boxer[_v-4d37e5f7] {\n  top: 50%;\n  left: 20px;\n  right: 20px;\n  position: absolute;\n  background: #F6F6F6;\n  -webkit-transform: translate(0%, -50%);\n          transform: translate(0%, -50%);\n  z-index: 1002;\n}\n.sms-head[_v-4d37e5f7] {\n  position: relative;\n  display: block;\n  left: 0;\n  right: 0;\n  background: #fff;\n  top: 0;\n  width: 100%;\n  padding: 6px 8px 6px 36px;\n  width: calc(100% - 44px);\n}\n.sms-head .close[_v-4d37e5f7] {\n  line-height: 22px;\n  color: #222;\n  height: 22px;\n  position: absolute;\n  left: 16px;\n  top: 50%;\n  font-size: 24px;\n  font-weight: 700;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n}\n.sms-head .text[_v-4d37e5f7] {\n  font-size: 16px;\n  color: #222;\n  line-height: 22px;\n  text-align: center;\n}\n.sms-body[_v-4d37e5f7] {\n  position: relative;\n  width: 100%;\n  top: 0px;\n  background: #F6F6F6;\n  padding-bottom: calc(40px + 13vw);\n}\n.sms-body .text[_v-4d37e5f7] {\n  text-align: center;\n  word-break: break-all;\n  margin-top: 20px;\n  margin-left: 16px;\n  margin-right: 16px;\n  margin-bottom: 0;\n  display: block;\n  font-size: 14px;\n  color: #666;\n}\n.sms-body a.resendCode[_v-4d37e5f7] {\n  color: #0080FF;\n}\n.sms-footer[_v-4d37e5f7] {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0px;\n  padding: 20px;\n  height: calc(50px + 13vw);\n  text-align: center;\n  box-sizing: border-box;\n  max-height: 160px;\n}\n.sms-footer input[_v-4d37e5f7] {\n  position: relative;\n  width: 13vw;\n  height: 13vw;\n  max-width: 100px;\n  max-height: 100px;\n  font-size: 24px;\n  margin-right: 0;\n  padding: 5px;\n  font-size: 20px;\n  color: #222;\n  line-height: 32px;\n  text-align: center !important;\n  background: #FFF;\n  border: 1px solid #E1E1E1;\n  border-radius: 4px;\n  z-index: 2;\n}\n.sms-footer input[_v-4d37e5f7]:nth-child(4) {\n  margin-right: 0;\n}\n.sms-footer .actual-input[_v-4d37e5f7] {\n  position: absolute;\n  display: block;\n  top: 20px;\n  bottom: 20px;\n  left: 0;\n  right: 0;\n  width: 100%;\n  height: auto;\n  max-width: none;\n  max-height: none;\n  font-size: 1px;\n  box-sizing: border-box;\n  padding: 0;\n  z-index: -100;\n  opacity: 0;\n}\n.verify-popup[_v-4d37e5f7] {\n  background: #000;\n  border-radius: 4px;\n  font-size: 16px;\n  color: #FFF;\n  width: 240px;\n  height: 62px;\n  line-height: 62px;\n  position: fixed;\n  display: block;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  opacity: 0;\n  text-align: center;\n  z-index: -1000;\n}\n.verify-popup.animation[_v-4d37e5f7] {\n  animation: verifypopup 5s;\n  -webkit-animation: verifypopup 5s;\n  -moz-animation: verifypopup 5s;\n  -o-animation: verifypopup 5s;\n}\n@keyframes verifypopup {\n  0% {\n    opacity: .8;\n    z-index: 10000;\n  }\n  90% {\n    opacity: .8;\n    z-index: 10000;\n  }\n  100% {\n    opacity: 0;\n    z-index: -1000;\n  }\n}\n@-webkit-keyframes verifypopup {\n  0% {\n    opacity: .8;\n    z-index: 10000;\n  }\n  90% {\n    opacity: .8;\n    z-index: 10000;\n  }\n  100% {\n    opacity: 0;\n    z-index: -1000;\n  }\n}\n", ""]);

	// exports


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _defineProperty2 = __webpack_require__(48);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// <template>
	// 	<setion class="sms-layer" v-if="isShow">
	// 		<div :class="{'verify-popup': true, 'animation': lang.popuo!='' }">${ lang.popuo }</div>
	// 		<div class="sms-boxer">
	// 			<div class="sms-head">
	// 				<div class="close" @click="moduleClose">&times;</div>
	// 				<div class="text">${ lang.title }</div>
	// 			</div>
	// 			<div class="sms-body">
	// 				<div class="text">
	// 					${ lang.bodyText }
	// 					<template v-if="canResend">
	// 						<a href="javascript:void(0);" class="resendCode" @click="handleResend">${ lang.resend }</a>
	// 					</template>
	// 					<template v-if="sending">${ lang.sending }</template>
	// 				</div>
	// 			</div>
	// 			<div class="sms-footer">
	// 				<input readonly v-model="vcode1" @focus="handleFocus">
	// 				<input readonly v-model="vcode2" @focus="handleFocus">
	// 				<input readonly v-model="vcode3" @focus="handleFocus">
	// 				<input readonly v-model="vcode4" @focus="handleFocus">
	// 				<input ref="input" v-model="vcode" @keyup="handleKeydown" class="actual-input" maxlength="4" type="int">
	// 			</div>
	// 		</div>
	// 	</setion>
	// </template>
	//
	// <script>
	exports.default = {
		delimiters: ['${', '}'],
		props: ['order', 'formdata', 'submiting', 'cancel'],
		data: function data() {
			return {
				api: {
					send: '/api_sms_send.php?do=',
					verlify: '/api_sms_send.php?do=verify'
					// 是否显示弹窗(订单推送成功才显示)
				}, isShow: false
				// 能否重新发送
				, canResend: false
				// 发送中
				, sending: false
				// 时间(秒)
				, timeset: 1,
				timeout: null
				// 语言包
				, lang: {
					title: '请输入短信验证码',
					message: '驗證碼已發送到手機{phone}，請注意查收。如果收不到驗證碼，{second}秒后可重新發送',
					message2: '驗證碼已發送到手機{phone}，請注意查收。',
					resend: '重新发送',
					popuo: '',
					bodyText: '',
					sending: '发送中'
				},
				vcode: ''
			};
		},
		computed: {
			vcode1: function vcode1() {
				return this.vcode[0] || '';
			},
			vcode2: function vcode2() {
				return this.vcode[1] || '';
			},
			vcode3: function vcode3() {
				return this.vcode[2] || '';
			},
			vcode4: function vcode4() {
				return this.vcode[3] || '';
			}
		},
		created: function created() {},
		mounted: function mounted() {
			var _this = this;

			var self = this;

			// 推送订单
			this.$emit('submiting', function (res) {
				if (res.ret_code == 200) {
					_this.start();
					_this.$loading(false);
				} else {
					alert('request数据错误');
					_this.$loading(false);
				}
			});
		},
		methods: {
			start: function start(sendType) {
				// 区分第一次发送和重发
				var sendtype = sendType ? sendType : 'send';
				var self = this;
				// 初始化状态
				self.timeset = 3; // 倒计时秒数
				self.timeout = null; // 定时器ID
				self.sending = true; // 发送中状态
				self.isShow = true; // 弹窗显示
				self.canResend = false; // 是否可以重新发送
				self.lang.bodyText = ''; // 组件主内容
				self.lang.popuo = ''; // 消息提示内容

				// 对接后台
				self.$http.post('' + this.api.send + sendtype, (0, _defineProperty3.default)({
					do: 'send',
					mobile: this.formdata.mobile,
					orderId: this.order.orderId,
					token: this.order.token
				}, 'orderId', this.order.orderId)).then(function (res) {
					var ress = {
						ret: 1,
						message: '发送成功'
					};
					// 消息提示
					self.sending = false;
					self.lang.popuo = res.body.ret_msg;
					self.$refs.input.focus();
					// 回调
					if (res.body.ret == 1) {
						self.lang.bodyText = self.lang.message.replace('{phone}', '').replace('{second}', self.timeset);
						self.timeout = setInterval(function () {
							if (self.timeset <= 0) {
								self.canResend = true;
								self.lang.bodyText = self.lang.message2.replace('{phone}', '');
								clearInterval(self.timeout);
							} else {
								self.timeset = parseInt(self.timeset) - 1;
								self.lang.bodyText = self.lang.message.replace('{phone}', '').replace('{second}', self.timeset);
							}
						}, 1000);
					} else {
						self.lang.bodyText = res.body.ret_msg;
						self.canResend = true;
					}
				});
			},
			moduleShow: function moduleShow() {
				this.isShow = true;
			}
			// 关闭弹窗
			,
			moduleClose: function moduleClose() {
				// this.isShow = false;
				this.$loading(true);
				this.$emit('cancel');
			}
			// 重新发送
			,
			handleResend: function handleResend() {
				this.start('resend');
			}
			// 输入框获得焦点
			,
			handleFocus: function handleFocus() {
				this.$refs.input.focus();
			}
			// 输入框事件
			,
			handleKeydown: function handleKeydown() {
				if (this.$loading() == true) {
					return false;
				}
				if (this.vcode.length == 4) {
					this.vcode = this.vcode.substring(0, 4);
					this.handleVerify();
					return false;
				}
			}
			// 验证是否正确
			,
			handleVerify: function handleVerify() {
				var _this2 = this;

				this.$loading(true);
				this.$http.post(this.api.verlify, {
					order_id: this.order.orderId,
					mobile: this.formdata.mobile,
					vcode: this.vcode
				}).then(function (res) {
					_this2.$loading(false);
					var ress = {
						ret: 0,
						message: '错误'
					};
					if (ress.ret == 1) {
						window.location.href = "/";
					} else {
						_this2.lang.popuo = '';
						_this2.lang.popuo = ress.message;
					}
				});
			}
		}
		// </script>
		//
		// <style lang="less" scoped>
		//
		// .sms-layer {
		// 	position: fixed;
		// 	top: 0;
		// 	left: 0;
		// 	bottom: 0;
		// 	right: 0;
		// 	width: 100%;
		// 	height: 100%;
		// 	z-index: 1;
		// 	overflow: hidden;
		// 	background: rgba(0, 0, 0, 0.65);
		// 	.sms-boxer {
		// 		top: 50%;
		// 		left: 20px;
		// 		right: 20px;
		// 		position: absolute;
		// 		background: #F6F6F6;
		// 		transform: translate(0%,-50%);
		// 		z-index: 1002
		// 	}
		// }
		// .sms-head {
		// 	position: relative;
		// 	display: block;
		// 	left: 0;
		// 	right: 0;
		// 	background: #fff;
		// 	top: 0;
		// 	width: 100%;
		// 	padding: 6px 8px 6px 36px;
		//     width: calc(~'100% - 44px');
		// 	.close {
		// 		line-height: 22px;
		// 		color: #222;
		// 		height: 22px;
		// 		position: absolute;
		// 		left: 16px;
		// 		top: 50%;
		// 		font-size: 24px;
		// 		font-weight: 700;
		// 		transform: translateY(-50%)
		// 	}
		// 	.text {
		// 		font-size: 16px;
		// 		color: #222;
		// 		line-height: 22px;
		// 		text-align:center;
		// 	}
		// }
		// .sms-body {
		// 	position: relative;
		// 	width: 100%;
		// 	top: 0px;
		// 	background: #F6F6F6;
		// 	padding-bottom: calc(~"40px + 13vw");
		// 	.text {
		// 		text-align: center;
		// 		word-break: break-all;
		// 		margin-top: 20px;
		// 		margin-left: 16px;
		// 		margin-right: 16px;
		// 		margin-bottom: 0;
		// 		display: block;
		// 		font-size: 14px;
		// 		color: #666
		// 	}
		// 	a.resendCode {
		// 		color: #0080FF
		// 	}
		// }
		//
		// .sms-footer {
		// 	position: absolute;
		// 	left: 0;
		// 	right: 0;
		// 	bottom: 0px;
		// 	padding: 20px;
		// 	height: calc(~"50px + 13vw");
		// 	text-align: center;
		// 	-webkit-box-sizing: border-box;
		// 	-moz-box-sizing: border-box;
		// 	box-sizing: border-box;
		// 	max-height: 160px;
		// 	input {
		// 		position: relative;
		// 		width: 13vw;
		// 		height: 13vw;
		// 		max-width: 100px;
		// 		max-height: 100px;
		// 		font-size: 24px;
		// 		margin-right: 0;
		// 		padding: 5px;
		// 		font-size: 20px;
		// 		color: #222;
		// 		line-height: 32px;
		// 		text-align: center !important;
		// 		background: #FFF;
		// 		border: 1px solid #E1E1E1;
		// 		border-radius: 4px;
		// 		z-index: 2;
		// 		&:nth-child(4) {
		// 			margin-right: 0;
		// 		}
		// 	}
		// 	.actual-input {
		// 		position: absolute;
		// 		display: block;
		// 		top: 20px;
		// 		bottom: 20px;
		// 		left: 0;
		// 		right: 0;
		// 		width: 100%;
		// 		height: auto;
		// 		max-width: none;
		// 		max-height: none;
		// 		font-size: 1px;
		// 		-webkit-box-sizing: border-box;
		// 		-moz-box-sizing: border-box;
		// 		box-sizing: border-box;
		// 		padding: 0;
		// 		z-index: -100;
		// 		opacity: 0;
		// 	}
		// }
		//
		//
		//
		// .verify-popup {
		// 	background: #000;
		// 	border-radius: 4px;
		// 	font-size: 16px;
		// 	color: #FFF;
		// 	width: 240px;
		// 	height: 62px;
		// 	line-height: 62px;
		// 	position: fixed;
		// 	display: block;
		// 	left: 50%;
		// 	top: 50%;
		// 	transform: translate(-50%,-50%);
		// 	opacity: 0;
		// 	text-align: center;
		// 	z-index: -1000;
		// 	&.animation {
		// 		animation: verifypopup 5s;
		// 		-webkit-animation:verifypopup 5s;
		// 		-moz-animation:verifypopup 5s;
		// 		-o-animation:verifypopup 5s;
		// 	}
		// }
		// @keyframes verifypopup {
		// 	0% {
		// 		opacity: .8;
		// 		z-index: 10000
		// 	}
		// 	90% {
		// 		opacity: .8;
		// 		z-index: 10000
		// 	}
		// 	100% {
		// 		opacity: 0;
		// 		z-index: -1000
		// 	}
		// }
		// @-webkit-keyframes verifypopup {
		// 	0% {
		// 		opacity: .8;
		// 		z-index: 10000
		// 	}
		// 	90% {
		// 		opacity: .8;
		// 		z-index: 10000
		// 	}
		// 	100% {
		// 		opacity: 0;
		// 		z-index: -1000
		// 	}
		// }
		// @-moz-keyframes verifypopup {
		// 	0% {
		// 		opacity: .8;
		// 		z-index: 10000
		// 	}
		// 	90% {
		// 		opacity: .8;
		// 		z-index: 10000
		// 	}
		// 	100% {
		// 		opacity: 0;
		// 		z-index: -1000
		// 	}
		// }
		// @-o-keyframes verifypopup {
		// 	0% {
		// 		opacity: .8;
		// 		z-index: 10000
		// 	}
		// 	90% {
		// 		opacity: .8;
		// 		z-index: 10000
		// 	}
		// 	100% {
		// 		opacity: 0;
		// 		z-index: -1000
		// 	}
		// }
		//
		//
		//
		//
		//
		//
		//
		// </style>

	};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(49);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(50), __esModule: true };

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(8);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ }),
/* 51 */
/***/ (function(module, exports) {

	module.exports = "\n\t<setion class=\"sms-layer\" v-if=\"isShow\" _v-4d37e5f7=\"\">\n\t\t<div :class=\"{'verify-popup': true, 'animation': lang.popuo!='' }\" _v-4d37e5f7=\"\">${ lang.popuo }</div>\n\t\t<div class=\"sms-boxer\" _v-4d37e5f7=\"\">\n\t\t\t<div class=\"sms-head\" _v-4d37e5f7=\"\">\n\t\t\t\t<div class=\"close\" @click=\"moduleClose\" _v-4d37e5f7=\"\">×</div>\n\t\t\t\t<div class=\"text\" _v-4d37e5f7=\"\">${ lang.title }</div>\n\t\t\t</div>\n\t\t\t<div class=\"sms-body\" _v-4d37e5f7=\"\">\n\t\t\t\t<div class=\"text\" _v-4d37e5f7=\"\">\n\t\t\t\t\t${ lang.bodyText }\n\t\t\t\t\t<template v-if=\"canResend\" _v-4d37e5f7=\"\">\n\t\t\t\t\t\t<a href=\"javascript:void(0);\" class=\"resendCode\" @click=\"handleResend\" _v-4d37e5f7=\"\">${ lang.resend }</a>\n\t\t\t\t\t</template>\n\t\t\t\t\t<template v-if=\"sending\" _v-4d37e5f7=\"\">${ lang.sending }</template>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"sms-footer\" _v-4d37e5f7=\"\">\n\t\t\t\t<input readonly=\"\" v-model=\"vcode1\" @focus=\"handleFocus\" _v-4d37e5f7=\"\">\n\t\t\t\t<input readonly=\"\" v-model=\"vcode2\" @focus=\"handleFocus\" _v-4d37e5f7=\"\">\n\t\t\t\t<input readonly=\"\" v-model=\"vcode3\" @focus=\"handleFocus\" _v-4d37e5f7=\"\">\n\t\t\t\t<input readonly=\"\" v-model=\"vcode4\" @focus=\"handleFocus\" _v-4d37e5f7=\"\">\n\t\t\t\t<input ref=\"input\" v-model=\"vcode\" @keyup=\"handleKeydown\" class=\"actual-input\" maxlength=\"4\" type=\"int\" _v-4d37e5f7=\"\">\n\t\t\t</div>\n\t\t</div>\n\t</setion>\n";

/***/ })
/******/ ]);