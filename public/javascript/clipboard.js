!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f();else if("function"==typeof define&&define.amd)define([],f);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).Clipboard=f()}}(function(){return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n||e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){var DOCUMENT_NODE_TYPE=9;if("undefined"!=typeof Element&&!Element.prototype.matches){var proto=Element.prototype;proto.matches=proto.matchesSelector||proto.mozMatchesSelector||proto.msMatchesSelector||proto.oMatchesSelector||proto.webkitMatchesSelector}module.exports=function(element,selector){for(;element&&element.nodeType!==DOCUMENT_NODE_TYPE;){if("function"==typeof element.matches&&element.matches(selector))return element;element=element.parentNode}}},{}],2:[function(require,module,exports){function listener(element,selector,type,callback){return function(e){e.delegateTarget=closest(e.target,selector),e.delegateTarget&&callback.call(element,e)}}var closest=require("./closest");module.exports=function(element,selector,type,callback,useCapture){var listenerFn=listener.apply(this,arguments);return element.addEventListener(type,listenerFn,useCapture),{destroy:function(){element.removeEventListener(type,listenerFn,useCapture)}}}},{"./closest":1}],3:[function(require,module,exports){exports.node=function(value){return void 0!==value&&value instanceof HTMLElement&&1===value.nodeType},exports.nodeList=function(value){var type=Object.prototype.toString.call(value);return void 0!==value&&("[object NodeList]"===type||"[object HTMLCollection]"===type)&&"length"in value&&(0===value.length||exports.node(value[0]))},exports.string=function(value){return"string"==typeof value||value instanceof String},exports.fn=function(value){return"[object Function]"===Object.prototype.toString.call(value)}},{}],4:[function(require,module,exports){function listenNode(node,type,callback){return node.addEventListener(type,callback),{destroy:function(){node.removeEventListener(type,callback)}}}function listenNodeList(nodeList,type,callback){return Array.prototype.forEach.call(nodeList,function(node){node.addEventListener(type,callback)}),{destroy:function(){Array.prototype.forEach.call(nodeList,function(node){node.removeEventListener(type,callback)})}}}function listenSelector(selector,type,callback){return delegate(document.body,selector,type,callback)}var is=require("./is"),delegate=require("delegate");module.exports=function(target,type,callback){if(!target&&!type&&!callback)throw new Error("Missing required arguments");if(!is.string(type))throw new TypeError("Second argument must be a String");if(!is.fn(callback))throw new TypeError("Third argument must be a Function");if(is.node(target))return listenNode(target,type,callback);if(is.nodeList(target))return listenNodeList(target,type,callback);if(is.string(target))return listenSelector(target,type,callback);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}},{"./is":3,delegate:2}],5:[function(require,module,exports){module.exports=function(element){var selectedText;if("SELECT"===element.nodeName)element.focus(),selectedText=element.value;else if("INPUT"===element.nodeName||"TEXTAREA"===element.nodeName){var isReadOnly=element.hasAttribute("readonly");isReadOnly||element.setAttribute("readonly",""),element.select(),element.setSelectionRange(0,element.value.length),isReadOnly||element.removeAttribute("readonly"),selectedText=element.value}else{element.hasAttribute("contenteditable")&&element.focus();var selection=window.getSelection(),range=document.createRange();range.selectNodeContents(element),selection.removeAllRanges(),selection.addRange(range),selectedText=selection.toString()}return selectedText}},{}],6:[function(require,module,exports){function E(){}E.prototype={on:function(name,callback,ctx){var e=this.e||(this.e={});return(e[name]||(e[name]=[])).push({fn:callback,ctx:ctx}),this},once:function(name,callback,ctx){function listener(){self.off(name,listener),callback.apply(ctx,arguments)}var self=this;return listener._=callback,this.on(name,listener,ctx)},emit:function(name){var data=[].slice.call(arguments,1),evtArr=((this.e||(this.e={}))[name]||[]).slice(),i=0,len=evtArr.length;for(i;i<len;i++)evtArr[i].fn.apply(evtArr[i].ctx,data);return this},off:function(name,callback){var e=this.e||(this.e={}),evts=e[name],liveEvents=[];if(evts&&callback)for(var i=0,len=evts.length;i<len;i++)evts[i].fn!==callback&&evts[i].fn._!==callback&&liveEvents.push(evts[i]);return liveEvents.length?e[name]=liveEvents:delete e[name],this}},module.exports=E},{}],7:[function(require,module,exports){!function(global,factory){if(void 0!==exports)factory(module,require("select"));else{var mod={exports:{}};factory(mod,global.select),global.clipboardAction=mod.exports}}(this,function(module,_select){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}var _select2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_select),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),ClipboardAction=function(){function ClipboardAction(options){_classCallCheck(this,ClipboardAction),this.resolveOptions(options),this.initSelection()}return _createClass(ClipboardAction,[{key:"resolveOptions",value:function(){var options=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action=options.action,this.container=options.container,this.emitter=options.emitter,this.target=options.target,this.text=options.text,this.trigger=options.trigger,this.selectedText=""}},{key:"initSelection",value:function(){this.text?this.selectFake():this.target&&this.selectTarget()}},{key:"selectFake",value:function(){var _this=this,isRTL="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return _this.removeFake()},this.fakeHandler=this.container.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[isRTL?"right":"left"]="-9999px";var yPosition=window.pageYOffset||document.documentElement.scrollTop;this.fakeElem.style.top=yPosition+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,this.container.appendChild(this.fakeElem),this.selectedText=(0,_select2.default)(this.fakeElem),this.copyText()}},{key:"removeFake",value:function(){this.fakeHandler&&(this.container.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(this.container.removeChild(this.fakeElem),this.fakeElem=null)}},{key:"selectTarget",value:function(){this.selectedText=(0,_select2.default)(this.target),this.copyText()}},{key:"copyText",value:function(){var succeeded=void 0;try{succeeded=document.execCommand(this.action)}catch(err){succeeded=!1}this.handleResult(succeeded)}},{key:"handleResult",value:function(succeeded){this.emitter.emit(succeeded?"success":"error",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}},{key:"clearSelection",value:function(){this.trigger&&this.trigger.focus(),window.getSelection().removeAllRanges()}},{key:"destroy",value:function(){this.removeFake()}},{key:"action",set:function(){var action=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"copy";if(this._action=action,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function(){return this._action}},{key:"target",set:function(target){if(void 0!==target){if(!target||"object"!==(void 0===target?"undefined":_typeof(target))||1!==target.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&target.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(target.hasAttribute("readonly")||target.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=target}},get:function(){return this._target}}]),ClipboardAction}();module.exports=ClipboardAction})},{select:5}],8:[function(require,module,exports){!function(global,factory){if(void 0!==exports)factory(module,require("./clipboard-action"),require("tiny-emitter"),require("good-listener"));else{var mod={exports:{}};factory(mod,global.clipboardAction,global.tinyEmitter,global.goodListener),global.clipboard=mod.exports}}(this,function(module,_clipboardAction,_tinyEmitter,_goodListener){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}function getAttributeValue(suffix,element){var attribute="data-clipboard-"+suffix;if(element.hasAttribute(attribute))return element.getAttribute(attribute)}var _clipboardAction2=_interopRequireDefault(_clipboardAction),_tinyEmitter2=_interopRequireDefault(_tinyEmitter),_goodListener2=_interopRequireDefault(_goodListener),_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),Clipboard=function(_Emitter){function Clipboard(trigger,options){_classCallCheck(this,Clipboard);var _this=_possibleConstructorReturn(this,(Clipboard.__proto__||Object.getPrototypeOf(Clipboard)).call(this));return _this.resolveOptions(options),_this.listenClick(trigger),_this}return _inherits(Clipboard,_Emitter),_createClass(Clipboard,[{key:"resolveOptions",value:function(){var options=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof options.action?options.action:this.defaultAction,this.target="function"==typeof options.target?options.target:this.defaultTarget,this.text="function"==typeof options.text?options.text:this.defaultText,this.container="object"===_typeof(options.container)?options.container:document.body}},{key:"listenClick",value:function(trigger){var _this2=this;this.listener=(0,_goodListener2.default)(trigger,"click",function(e){return _this2.onClick(e)})}},{key:"onClick",value:function(e){var trigger=e.delegateTarget||e.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new _clipboardAction2.default({action:this.action(trigger),target:this.target(trigger),text:this.text(trigger),container:this.container,trigger:trigger,emitter:this})}},{key:"defaultAction",value:function(trigger){return getAttributeValue("action",trigger)}},{key:"defaultTarget",value:function(trigger){var selector=getAttributeValue("target",trigger);if(selector)return document.querySelector(selector)}},{key:"defaultText",value:function(trigger){return getAttributeValue("text",trigger)}},{key:"destroy",value:function(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)}}],[{key:"isSupported",value:function(){var action=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],actions="string"==typeof action?[action]:action,support=!!document.queryCommandSupported;return actions.forEach(function(action){support=support&&!!document.queryCommandSupported(action)}),support}}]),Clipboard}(_tinyEmitter2.default);$.Clipboard=Clipboard,module.exports=Clipboard})},{"./clipboard-action":7,"good-listener":4,"tiny-emitter":6}]},{},[8])(8)});