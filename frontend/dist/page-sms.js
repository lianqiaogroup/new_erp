/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

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


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/frontend/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _sms = __webpack_require__(1);

	var _sms2 = _interopRequireDefault(_sms);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Vue = window.Vue;
	var axios = window.axios;

	Vue.prototype.$http = axios;

	var App = new Vue({
		el: '#app',
		delimiters: ['${', '}'],
		data: function data() {
			return {
				order: window.__GLOBAL__.orderId,
				product: window.__GLOBAL__.product_id,
				token: window.__GLOBAL__.token,
				mobile: window.__GLOBAL__.mobile
			};
		},
		components: {
			sms: _sms2.default
		}
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(2)
	__vue_script__ = __webpack_require__(7)
	__vue_template__ = __webpack_require__(13)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) { (typeof module.exports === "function" ? module.exports.options : module.exports).template = __vue_template__ }
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), true)
	  if (!hotAPI.compatible) return
	  var id = "/Users/cullenng/website/stoshop/frontend/source/components/sms.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	
	var content = __webpack_require__(3);

	if(typeof content === 'string') content = [[module.id, content, '']];

	var transform;
	var insertInto;



	var options = {"hmr":true}

	options.transform = transform
	options.insertInto = undefined;

	var update = __webpack_require__(5)(content, options);

	if(content.locals) module.exports = content.locals;

	if(false) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-45055dc9&file=sms.vue!../../../node_modules/less-loader/dist/cjs.js!../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./sms.vue", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/style-rewriter.js?id=_v-45055dc9&file=sms.vue!../../../node_modules/less-loader/dist/cjs.js!../../../node_modules/_vue-loader@7.5.3@vue-loader/lib/selector.js?type=style&index=0!./sms.vue");

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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)(false);
	// imports


	// module
	exports.push([module.id, ".sms-layer {\n  display: block;\n  width: 100%;\n  height: 100%;\n  max-width: 375px;\n  z-index: 1;\n  margin: 0 auto;\n  padding-top: 64px;\n}\n.sms-layer .sms-boxer {\n  display: block;\n  position: relative;\n}\n.sms-layer hr {\n  border: none;\n  margin: 16px 20px;\n  height: 1px;\n  background-color: #eee;\n}\n.sms-layer .button-layer {\n  display: block;\n  margin: 0 16px;\n}\n.sms-layer .button-layer button {\n  width: 100%;\n  display: block;\n  height: 44px;\n  color: #fff;\n  line-height: 44px;\n  border-radius: 2px;\n  background-color: #FC515F;\n  border: none;\n  font-size: 14px;\n  outline: none;\n}\n.sms-layer .button-layer button:active {\n  background-color: #fd838d;\n}\n.sms-layer p.link {\n  margin-top: 16px;\n  text-align: center;\n  height: 20px;\n  line-height: 20px;\n}\n.sms-layer p.link a {\n  color: #666;\n  font-size: 14px;\n  text-decoration: underline;\n}\n.sms-head {\n  position: relative;\n  display: block;\n  width: 100%;\n  margin-left: 16px;\n  margin-bottom: 10px;\n}\n.sms-head .text {\n  font-size: 24px;\n  color: #222;\n  line-height: 33px;\n}\n.sms-body {\n  position: relative;\n  width: 100%;\n}\n.sms-body .text {\n  word-break: break-all;\n  margin-top: 20px;\n  margin-left: 16px;\n  margin-right: 16px;\n  margin-bottom: 0;\n  display: block;\n  font-size: 14px;\n  color: #666;\n}\n.sms-body a.resendCode {\n  color: #0080FF;\n}\n.sms-footer {\n  position: relative;\n  padding: 0 16px;\n  margin-top: 32px;\n  box-sizing: border-box;\n  max-height: 160px;\n  font-size: 0px;\n}\n.sms-footer input {\n  position: relative;\n  width: 56px;\n  height: 56px;\n  max-width: 100px;\n  max-height: 100px;\n  font-size: 24px;\n  margin-right: 10px;\n  padding: 5px;\n  font-size: 20px;\n  color: #222;\n  line-height: 32px;\n  text-align: center !important;\n  background: #f6f6f6;\n  border: 1px solid #E1E1E1;\n  border-radius: 2px;\n  z-index: 2;\n  box-sizing: border-box;\n}\n.sms-footer input:nth-child(4) {\n  margin-right: 0;\n}\n.sms-footer input.active {\n  border-color: #333;\n}\n.sms-footer .actual-input {\n  position: absolute;\n  display: block;\n  top: 20px;\n  bottom: 20px;\n  left: 0;\n  right: 0;\n  width: 100%;\n  height: auto;\n  max-width: none;\n  max-height: none;\n  font-size: 1px;\n  box-sizing: border-box;\n  padding: 0;\n  z-index: -100;\n  opacity: 0;\n}\n.verify-popup {\n  background: #000;\n  border-radius: 4px;\n  font-size: 16px;\n  color: #FFF;\n  width: 240px;\n  height: 62px;\n  line-height: 62px;\n  position: fixed;\n  display: block;\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  opacity: 0;\n  text-align: center;\n  z-index: -1000;\n}\n.verify-popup.animation {\n  animation: verifypopup 5s;\n  -webkit-animation: verifypopup 5s;\n  -moz-animation: verifypopup 5s;\n  -o-animation: verifypopup 5s;\n}\n@keyframes verifypopup {\n  0% {\n    opacity: .8;\n    z-index: 10000;\n  }\n  90% {\n    opacity: .8;\n    z-index: 10000;\n  }\n  100% {\n    opacity: 0;\n    z-index: -1000;\n  }\n}\n@-webkit-keyframes verifypopup {\n  0% {\n    opacity: .8;\n    z-index: 10000;\n  }\n  90% {\n    opacity: .8;\n    z-index: 10000;\n  }\n  100% {\n    opacity: 0;\n    z-index: -1000;\n  }\n}\n", ""]);

	// exports


/***/ }),
/* 4 */
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
/* 5 */
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

	var	fixUrls = __webpack_require__(6);

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
/* 6 */
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	// <template>
	// 	<setion class="sms-layer" v-if="isShow">
	// 		<div :class="{'verify-popup': true, 'animation': lang.popuo!='' }">${ lang.popuo }</div>
	// 		<div class="sms-boxer">
	// 			<div class="sms-head">
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
	// 				<input readonly v-model="vcode1" @focus="handleFocus" :class="{ 'active': vcode.length==(1-1) }">
	// 				<input readonly v-model="vcode2" @focus="handleFocus" :class="{ 'active': vcode.length==(2-1) }">
	// 				<input readonly v-model="vcode3" @focus="handleFocus" :class="{ 'active': vcode.length==(3-1) }">
	// 				<input readonly v-model="vcode4" @focus="handleFocus" :class="{ 'active': vcode.length==(4-1) }">
	// 				<input
	// 					ref="input"
	// 					v-model="vcode"
	// 					@keyup="handleKeydown"
	// 					class="actual-input"
	// 					maxlength="4"
	// 					type="tel">
	// 			</div>
	// 		</div>
	// 		<hr>
	// 		<div class="button-layer">
	// 			<button class="submit" @click="handleVerify">
	// 				<template v-if="sending">
	// 					${ lang.sending }
	// 				</template>
	// 				<template v-else>
	// 					<template v-if="verlifing==false">${ lang.submit }</template>
	// 					<template v-if="verlifing==true">${ lang.submiting }</template>
	// 				</template>
	// 			</button>
	// 		</div>
	// 		<p class="link"><a href="javascript:;" @click="unVerlify">${ lang.error }</a></p>
	// 	</setion>
	// </template>
	//
	// <script>
	var qs = __webpack_require__(8);

	exports.default = {
		delimiters: ['${', '}'],
		props: ['order', 'product', 'mobile', 'token'],
		data: function data() {
			return {
				api: {
					send: '/api_sms_send.php?do=',
					verlify: '/api_sms_send.php?do=verify'
					// 是否显示弹窗(订单推送成功才显示)
				}, isShow: true
				// 能否重新发送
				, canResend: false
				// 发送中
				, sending: false
				// 时间(秒)
				, timeset: 120,
				timeout: null
				// 语言包
				, lang: {
					title: window.smsLang.title,
					message: window.smsLang.message,
					message2: window.smsLang.message2,
					resend: window.smsLang.resend,
					submit: window.smsLang.submit,
					submiting: window.smsLang.submiting,
					error: window.smsLang.error,
					sending: window.smsLang.sending,
					popuo: '',
					bodyText: ''
				},
				vcode: '',
				verlifing: false
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
			this.start('send');
		},
		methods: {
			start: function start(sendType) {
				// 区分第一次发送和重发
				var sendtype = sendType ? sendType : 'send';
				var self = this;
				// 初始化状态
				self.timeset = 120; // 倒计时秒数
				self.timeout = null; // 定时器ID
				self.sending = true; // 发送中状态
				self.isShow = true; // 弹窗显示
				self.canResend = false; // 是否可以重新发送
				self.lang.bodyText = ''; // 组件主内容
				self.lang.popuo = ''; // 消息提示内容

				// 对接后台
				self.$http.post('' + this.api.send + sendtype, qs.stringify({
					do: 'send',
					mobile: this.mobile,
					orderId: this.order,
					token: this.token,
					product_id: this.product
				}), {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				}).then(function (res) {
					// 消息提示
					self.sending = false;
					self.$refs.input.focus();
					// 回调
					var ret_code = res.data.ret_code;

					if (ret_code == 200 || ret_code == 403) {
						switch (ret_code) {
							case 200:
								// 200 才提示文案
								self.timeset = 120;
								self.lang.popuo = res.data.ret_msg;
								break;
							case 403:
								// 后台返回时间
								self.timeset = res.data.time;
								break;
							default:
								break;
						}
						// 更新文案
						self.lang.bodyText = self.lang.message.replace('{phone}', self.decode(self.mobile)).replace('{second}', self.timeset);
						// 开始倒计时
						self.timeout = setInterval(function () {
							if (self.timeset <= 0) {
								self.canResend = true;
								self.lang.bodyText = self.lang.message2.replace('{phone}', self.decode(self.mobile));
								clearInterval(self.timeout);
							} else {
								self.timeset = parseInt(self.timeset) - 1;
								self.lang.bodyText = self.lang.message.replace('{phone}', self.decode(self.mobile)).replace('{second}', self.timeset);
							}
						}, 1000);
					} else {
						self.lang.popuo = res.data.ret_msg;
						self.lang.bodyText = res.data.ret_msg;
						self.canResend = true;
					}
				});
			},
			moduleShow: function moduleShow() {
				this.isShow = true;
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
			handleKeydown: function handleKeydown(e) {}
			// 验证是否正确
			,
			handleVerify: function handleVerify() {
				var _this = this;

				if (this.sending == true) return false;
				if (this.vcode.length != 4) return this.handleFocus();
				if (this.verlifing == true) return false;
				// ajax锁
				this.verlifing = true;
				// 清除提示文字
				this.lang.popuo = '';
				// 请求
				this.$http.post(this.api.verlify, qs.stringify({
					orderId: this.order,
					mobile: this.mobile,
					vercode: this.vcode,
					token: this.token,
					product_id: this.product
				})).then(function (res) {
					// 关闭锁
					_this.verlifing = false;
					// 
					if (res.data.ret_code == 200) {
						window.location = "/api_order.php?orderId=" + _this.order;
					} else {
						_this.vcode = '';
						_this.lang.popuo = res.data.ret_msg;
						_this.handleFocus();
					}
				});
			}
			// 没有验证
			,
			unVerlify: function unVerlify() {
				window.location = "/api_order.php?orderId=" + this.order + "&verify=1";
			}
			// 电话加密
			,
			decode: function decode(mobile) {
				var arr = mobile.split('');
				arr[2] = arr[3] = arr[4] = arr[5] = '*';
				return arr.join('');
			}
		},
		watch: {
			vcode: function vcode() {
				var arr = this.vcode.split('').filter(function (x) {
					return !isNaN(x);
				});
				this.vcode = arr.join('');
				this.vcode = this.vcode.replace(' ', '');
				if (this.vcode.length == 4) {
					this.vcode = this.vcode.substring(0, 4);
					return false;
				}
			}
		}
		// </script>
		//
		// <style lang="less">
		//
		// .sms-layer {
		// 	display: block;
		// 	width: 100%;
		// 	height: 100%;
		// 	max-width: 375px;
		// 	z-index: 1;
		// 	margin: 0 auto;
		// 	padding-top: 64px;
		// 	.sms-boxer {
		// 		display: block;
		// 		position: relative;
		// 	}
		// 	hr {
		// 		border: none;
		// 		margin: 16px 20px;
		// 		height: 1px;
		// 		background-color: #eee;
		// 	}
		// 	.button-layer {
		// 		display: block;
		// 		margin: 0 16px;
		// 		button {
		// 			width: 100%;
		// 			display: block;
		// 			height: 44px;
		// 			color: #fff;
		// 			line-height: 44px;
		// 			border-radius: 2px;
		// 			background-color: #FC515F;
		// 			border: none;
		// 			font-size: 14px;
		// 			outline: none;
		// 			&:active {
		// 				background-color: lighten(#FC515F, 10%);
		// 			}
		// 		}
		// 	}
		// 	p.link {
		// 		margin-top: 16px;
		// 		text-align: center;
		// 		height: 20px;
		// 		line-height: 20px;
		// 		a {
		// 			color: #666;
		// 			font-size: 14px;
		// 			text-decoration: underline;
		// 		}
		// 	}
		// }
		// .sms-head {
		// 	position: relative;
		// 	display: block;
		// 	width: 100%;
		// 	margin-left: 16px;
		// 	margin-bottom: 10px;
		// 	.text {
		// 		font-size: 24px;
		// 		color: #222;
		// 		line-height: 33px;
		// 	}
		// }
		// .sms-body {
		// 	position: relative;
		// 	width: 100%;
		// 	.text {
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
		// 	position: relative;
		// 	padding: 0 16px;
		// 	margin-top: 32px;
		// 	-webkit-box-sizing: border-box;
		// 	-moz-box-sizing: border-box;
		// 	box-sizing: border-box;
		// 	max-height: 160px;
		// 	font-size: 0px;
		// 	input {
		// 		position: relative;
		// 		width: 56px;
		// 		height: 56px;
		// 		max-width: 100px;
		// 		max-height: 100px;
		// 		font-size: 24px;
		// 		margin-right: 10px;
		// 		padding: 5px;
		// 		font-size: 20px;
		// 		color: #222;
		// 		line-height: 32px;
		// 		text-align: center !important;
		// 		background: #f6f6f6;
		// 		border: 1px solid #E1E1E1;
		// 		border-radius: 2px;
		// 		z-index: 2;
		// 		box-sizing: border-box;
		// 		&:nth-child(4) {
		// 			margin-right: 0;
		// 		}
		// 		&.active {
		// 			border-color: #333;
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
		// </style>

	};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var stringify = __webpack_require__(9);
	var parse = __webpack_require__(12);
	var formats = __webpack_require__(11);

	module.exports = {
	    formats: formats,
	    parse: parse,
	    stringify: stringify
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(10);
	var formats = __webpack_require__(11);

	var arrayPrefixGenerators = {
	    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
	        return prefix + '[]';
	    },
	    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
	        return prefix + '[' + key + ']';
	    },
	    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
	        return prefix;
	    }
	};

	var toISO = Date.prototype.toISOString;

	var defaults = {
	    delimiter: '&',
	    encode: true,
	    encoder: utils.encode,
	    encodeValuesOnly: false,
	    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
	        return toISO.call(date);
	    },
	    skipNulls: false,
	    strictNullHandling: false
	};

	var stringify = function stringify( // eslint-disable-line func-name-matching
	    object,
	    prefix,
	    generateArrayPrefix,
	    strictNullHandling,
	    skipNulls,
	    encoder,
	    filter,
	    sort,
	    allowDots,
	    serializeDate,
	    formatter,
	    encodeValuesOnly
	) {
	    var obj = object;
	    if (typeof filter === 'function') {
	        obj = filter(prefix, obj);
	    } else if (obj instanceof Date) {
	        obj = serializeDate(obj);
	    } else if (obj === null) {
	        if (strictNullHandling) {
	            return encoder && !encodeValuesOnly ? encoder(prefix) : prefix;
	        }

	        obj = '';
	    }

	    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
	        if (encoder) {
	            var keyValue = encodeValuesOnly ? prefix : encoder(prefix);
	            return [formatter(keyValue) + '=' + formatter(encoder(obj))];
	        }
	        return [formatter(prefix) + '=' + formatter(String(obj))];
	    }

	    var values = [];

	    if (typeof obj === 'undefined') {
	        return values;
	    }

	    var objKeys;
	    if (Array.isArray(filter)) {
	        objKeys = filter;
	    } else {
	        var keys = Object.keys(obj);
	        objKeys = sort ? keys.sort(sort) : keys;
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (skipNulls && obj[key] === null) {
	            continue;
	        }

	        if (Array.isArray(obj)) {
	            values = values.concat(stringify(
	                obj[key],
	                generateArrayPrefix(prefix, key),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        } else {
	            values = values.concat(stringify(
	                obj[key],
	                prefix + (allowDots ? '.' + key : '[' + key + ']'),
	                generateArrayPrefix,
	                strictNullHandling,
	                skipNulls,
	                encoder,
	                filter,
	                sort,
	                allowDots,
	                serializeDate,
	                formatter,
	                encodeValuesOnly
	            ));
	        }
	    }

	    return values;
	};

	module.exports = function (object, opts) {
	    var obj = object;
	    var options = opts || {};

	    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
	        throw new TypeError('Encoder has to be a function.');
	    }

	    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
	    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
	    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
	    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
	    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
	    var sort = typeof options.sort === 'function' ? options.sort : null;
	    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
	    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
	    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
	    if (typeof options.format === 'undefined') {
	        options.format = formats.default;
	    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
	        throw new TypeError('Unknown format option provided.');
	    }
	    var formatter = formats.formatters[options.format];
	    var objKeys;
	    var filter;

	    if (typeof options.filter === 'function') {
	        filter = options.filter;
	        obj = filter('', obj);
	    } else if (Array.isArray(options.filter)) {
	        filter = options.filter;
	        objKeys = filter;
	    }

	    var keys = [];

	    if (typeof obj !== 'object' || obj === null) {
	        return '';
	    }

	    var arrayFormat;
	    if (options.arrayFormat in arrayPrefixGenerators) {
	        arrayFormat = options.arrayFormat;
	    } else if ('indices' in options) {
	        arrayFormat = options.indices ? 'indices' : 'repeat';
	    } else {
	        arrayFormat = 'indices';
	    }

	    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

	    if (!objKeys) {
	        objKeys = Object.keys(obj);
	    }

	    if (sort) {
	        objKeys.sort(sort);
	    }

	    for (var i = 0; i < objKeys.length; ++i) {
	        var key = objKeys[i];

	        if (skipNulls && obj[key] === null) {
	            continue;
	        }

	        keys = keys.concat(stringify(
	            obj[key],
	            key,
	            generateArrayPrefix,
	            strictNullHandling,
	            skipNulls,
	            encode ? encoder : null,
	            filter,
	            sort,
	            allowDots,
	            serializeDate,
	            formatter,
	            encodeValuesOnly
	        ));
	    }

	    return keys.join(delimiter);
	};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	'use strict';

	var has = Object.prototype.hasOwnProperty;

	var hexTable = (function () {
	    var array = [];
	    for (var i = 0; i < 256; ++i) {
	        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
	    }

	    return array;
	}());

	exports.arrayToObject = function (source, options) {
	    var obj = options && options.plainObjects ? Object.create(null) : {};
	    for (var i = 0; i < source.length; ++i) {
	        if (typeof source[i] !== 'undefined') {
	            obj[i] = source[i];
	        }
	    }

	    return obj;
	};

	exports.merge = function (target, source, options) {
	    if (!source) {
	        return target;
	    }

	    if (typeof source !== 'object') {
	        if (Array.isArray(target)) {
	            target.push(source);
	        } else if (typeof target === 'object') {
	            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
	                target[source] = true;
	            }
	        } else {
	            return [target, source];
	        }

	        return target;
	    }

	    if (typeof target !== 'object') {
	        return [target].concat(source);
	    }

	    var mergeTarget = target;
	    if (Array.isArray(target) && !Array.isArray(source)) {
	        mergeTarget = exports.arrayToObject(target, options);
	    }

	    if (Array.isArray(target) && Array.isArray(source)) {
	        source.forEach(function (item, i) {
	            if (has.call(target, i)) {
	                if (target[i] && typeof target[i] === 'object') {
	                    target[i] = exports.merge(target[i], item, options);
	                } else {
	                    target.push(item);
	                }
	            } else {
	                target[i] = item;
	            }
	        });
	        return target;
	    }

	    return Object.keys(source).reduce(function (acc, key) {
	        var value = source[key];

	        if (Object.prototype.hasOwnProperty.call(acc, key)) {
	            acc[key] = exports.merge(acc[key], value, options);
	        } else {
	            acc[key] = value;
	        }
	        return acc;
	    }, mergeTarget);
	};

	exports.decode = function (str) {
	    try {
	        return decodeURIComponent(str.replace(/\+/g, ' '));
	    } catch (e) {
	        return str;
	    }
	};

	exports.encode = function (str) {
	    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
	    // It has been adapted here for stricter adherence to RFC 3986
	    if (str.length === 0) {
	        return str;
	    }

	    var string = typeof str === 'string' ? str : String(str);

	    var out = '';
	    for (var i = 0; i < string.length; ++i) {
	        var c = string.charCodeAt(i);

	        if (
	            c === 0x2D || // -
	            c === 0x2E || // .
	            c === 0x5F || // _
	            c === 0x7E || // ~
	            (c >= 0x30 && c <= 0x39) || // 0-9
	            (c >= 0x41 && c <= 0x5A) || // a-z
	            (c >= 0x61 && c <= 0x7A) // A-Z
	        ) {
	            out += string.charAt(i);
	            continue;
	        }

	        if (c < 0x80) {
	            out = out + hexTable[c];
	            continue;
	        }

	        if (c < 0x800) {
	            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        if (c < 0xD800 || c >= 0xE000) {
	            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
	            continue;
	        }

	        i += 1;
	        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
	        out += hexTable[0xF0 | (c >> 18)] + hexTable[0x80 | ((c >> 12) & 0x3F)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]; // eslint-disable-line max-len
	    }

	    return out;
	};

	exports.compact = function (obj, references) {
	    if (typeof obj !== 'object' || obj === null) {
	        return obj;
	    }

	    var refs = references || [];
	    var lookup = refs.indexOf(obj);
	    if (lookup !== -1) {
	        return refs[lookup];
	    }

	    refs.push(obj);

	    if (Array.isArray(obj)) {
	        var compacted = [];

	        for (var i = 0; i < obj.length; ++i) {
	            if (obj[i] && typeof obj[i] === 'object') {
	                compacted.push(exports.compact(obj[i], refs));
	            } else if (typeof obj[i] !== 'undefined') {
	                compacted.push(obj[i]);
	            }
	        }

	        return compacted;
	    }

	    var keys = Object.keys(obj);
	    keys.forEach(function (key) {
	        obj[key] = exports.compact(obj[key], refs);
	    });

	    return obj;
	};

	exports.isRegExp = function (obj) {
	    return Object.prototype.toString.call(obj) === '[object RegExp]';
	};

	exports.isBuffer = function (obj) {
	    if (obj === null || typeof obj === 'undefined') {
	        return false;
	    }

	    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
	};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	'use strict';

	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;

	module.exports = {
	    'default': 'RFC3986',
	    formatters: {
	        RFC1738: function (value) {
	            return replace.call(value, percentTwenties, '+');
	        },
	        RFC3986: function (value) {
	            return value;
	        }
	    },
	    RFC1738: 'RFC1738',
	    RFC3986: 'RFC3986'
	};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(10);

	var has = Object.prototype.hasOwnProperty;

	var defaults = {
	    allowDots: false,
	    allowPrototypes: false,
	    arrayLimit: 20,
	    decoder: utils.decode,
	    delimiter: '&',
	    depth: 5,
	    parameterLimit: 1000,
	    plainObjects: false,
	    strictNullHandling: false
	};

	var parseValues = function parseQueryStringValues(str, options) {
	    var obj = {};
	    var parts = str.split(options.delimiter, options.parameterLimit === Infinity ? undefined : options.parameterLimit);

	    for (var i = 0; i < parts.length; ++i) {
	        var part = parts[i];
	        var pos = part.indexOf(']=') === -1 ? part.indexOf('=') : part.indexOf(']=') + 1;

	        var key, val;
	        if (pos === -1) {
	            key = options.decoder(part);
	            val = options.strictNullHandling ? null : '';
	        } else {
	            key = options.decoder(part.slice(0, pos));
	            val = options.decoder(part.slice(pos + 1));
	        }
	        if (has.call(obj, key)) {
	            obj[key] = [].concat(obj[key]).concat(val);
	        } else {
	            obj[key] = val;
	        }
	    }

	    return obj;
	};

	var parseObject = function parseObjectRecursive(chain, val, options) {
	    if (!chain.length) {
	        return val;
	    }

	    var root = chain.shift();

	    var obj;
	    if (root === '[]') {
	        obj = [];
	        obj = obj.concat(parseObject(chain, val, options));
	    } else {
	        obj = options.plainObjects ? Object.create(null) : {};
	        var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
	        var index = parseInt(cleanRoot, 10);
	        if (
	            !isNaN(index) &&
	            root !== cleanRoot &&
	            String(index) === cleanRoot &&
	            index >= 0 &&
	            (options.parseArrays && index <= options.arrayLimit)
	        ) {
	            obj = [];
	            obj[index] = parseObject(chain, val, options);
	        } else {
	            obj[cleanRoot] = parseObject(chain, val, options);
	        }
	    }

	    return obj;
	};

	var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
	    if (!givenKey) {
	        return;
	    }

	    // Transform dot notation to bracket notation
	    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

	    // The regex chunks

	    var brackets = /(\[[^[\]]*])/;
	    var child = /(\[[^[\]]*])/g;

	    // Get the parent

	    var segment = brackets.exec(key);
	    var parent = segment ? key.slice(0, segment.index) : key;

	    // Stash the parent if it exists

	    var keys = [];
	    if (parent) {
	        // If we aren't using plain objects, optionally prefix keys
	        // that would overwrite object prototype properties
	        if (!options.plainObjects && has.call(Object.prototype, parent)) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }

	        keys.push(parent);
	    }

	    // Loop through children appending to the array until we hit depth

	    var i = 0;
	    while ((segment = child.exec(key)) !== null && i < options.depth) {
	        i += 1;
	        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
	            if (!options.allowPrototypes) {
	                return;
	            }
	        }
	        keys.push(segment[1]);
	    }

	    // If there's a remainder, just add whatever is left

	    if (segment) {
	        keys.push('[' + key.slice(segment.index) + ']');
	    }

	    return parseObject(keys, val, options);
	};

	module.exports = function (str, opts) {
	    var options = opts || {};

	    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
	        throw new TypeError('Decoder has to be a function.');
	    }

	    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults.delimiter;
	    options.depth = typeof options.depth === 'number' ? options.depth : defaults.depth;
	    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults.arrayLimit;
	    options.parseArrays = options.parseArrays !== false;
	    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults.decoder;
	    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults.allowDots;
	    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults.plainObjects;
	    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults.allowPrototypes;
	    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults.parameterLimit;
	    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;

	    if (str === '' || str === null || typeof str === 'undefined') {
	        return options.plainObjects ? Object.create(null) : {};
	    }

	    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
	    var obj = options.plainObjects ? Object.create(null) : {};

	    // Iterate over the keys and setup the new object

	    var keys = Object.keys(tempObj);
	    for (var i = 0; i < keys.length; ++i) {
	        var key = keys[i];
	        var newObj = parseKeys(key, tempObj[key], options);
	        obj = utils.merge(obj, newObj, options);
	    }

	    return utils.compact(obj);
	};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = "\n\t<setion class=\"sms-layer\" v-if=\"isShow\">\n\t\t<div :class=\"{'verify-popup': true, 'animation': lang.popuo!='' }\">${ lang.popuo }</div>\n\t\t<div class=\"sms-boxer\">\n\t\t\t<div class=\"sms-head\">\n\t\t\t\t<div class=\"text\">${ lang.title }</div>\n\t\t\t</div>\n\t\t\t<div class=\"sms-body\">\n\t\t\t\t<div class=\"text\">\n\t\t\t\t\t${ lang.bodyText }\n\t\t\t\t\t<template v-if=\"canResend\">\n\t\t\t\t\t\t<a href=\"javascript:void(0);\" class=\"resendCode\" @click=\"handleResend\">${ lang.resend }</a>\n\t\t\t\t\t</template>\n\t\t\t\t\t<template v-if=\"sending\">${ lang.sending }</template>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div class=\"sms-footer\">\n\t\t\t\t<input readonly v-model=\"vcode1\" @focus=\"handleFocus\" :class=\"{ 'active': vcode.length==(1-1) }\">\n\t\t\t\t<input readonly v-model=\"vcode2\" @focus=\"handleFocus\" :class=\"{ 'active': vcode.length==(2-1) }\">\n\t\t\t\t<input readonly v-model=\"vcode3\" @focus=\"handleFocus\" :class=\"{ 'active': vcode.length==(3-1) }\">\n\t\t\t\t<input readonly v-model=\"vcode4\" @focus=\"handleFocus\" :class=\"{ 'active': vcode.length==(4-1) }\">\n\t\t\t\t<input\n\t\t\t\t\tref=\"input\"\n\t\t\t\t\tv-model=\"vcode\"\n\t\t\t\t\t@keyup=\"handleKeydown\"\n\t\t\t\t\tclass=\"actual-input\"\n\t\t\t\t\tmaxlength=\"4\"\n\t\t\t\t\ttype=\"tel\">\n\t\t\t</div>\n\t\t</div>\n\t\t<hr>\n\t\t<div class=\"button-layer\">\n\t\t\t<button class=\"submit\" @click=\"handleVerify\">\n\t\t\t\t<template v-if=\"sending\">\n\t\t\t\t\t${ lang.sending }\n\t\t\t\t</template>\n\t\t\t\t<template v-else>\n\t\t\t\t\t<template v-if=\"verlifing==false\">${ lang.submit }</template>\n\t\t\t\t\t<template v-if=\"verlifing==true\">${ lang.submiting }</template>\n\t\t\t\t</template>\n\t\t\t</button>\n\t\t</div>\n\t\t<p class=\"link\"><a href=\"javascript:;\" @click=\"unVerlify\">${ lang.error }</a></p>\n\t</setion>\n";

/***/ })
/******/ ]);