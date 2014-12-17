(function(){function e(e,t){k[C]=e,k[C+1]=t,C+=2,2===C&&P()}function t(e){return"function"==typeof e}function n(){return function(){process.nextTick(s)}}function o(){var e=0,t=new O(s),n=document.createTextNode("");return t.observe(n,{characterData:!0}),function(){n.data=e=++e%2}}function r(){var e=new MessageChannel;return e.port1.onmessage=s,function(){e.port2.postMessage(0)}}function i(){return function(){setTimeout(s,1)}}function s(){for(var e=0;C>e;e+=2)k[e](k[e+1]),k[e]=void 0,k[e+1]=void 0;C=0}function u(){}function a(e,t,n,o){try{e.call(t,n,o)}catch(r){return r}}function c(t,n,o){e(function(e){var t=!1,r=a(o,n,function(o){t||(t=!0,n!==o?f(e,o):h(e,o))},function(n){t||(t=!0,p(e,n))});!t&&r&&(t=!0,p(e,r))},t)}function l(e,t){1===t.a?h(e,t.b):2===e.a?p(e,t.b):g(t,void 0,function(t){f(e,t)},function(t){p(e,t)})}function f(e,n){if(e===n)p(e,new TypeError("You cannot resolve a promise with itself"));else if("function"==typeof n||"object"==typeof n&&null!==n)if(n.constructor===e.constructor)l(e,n);else{var o;try{o=n.then}catch(r){x.error=r,o=x}o===x?p(e,x.error):void 0===o?h(e,n):t(o)?c(e,n,o):h(e,n)}else h(e,n)}function d(e){e.f&&e.f(e.b),v(e)}function h(t,n){void 0===t.a&&(t.b=n,t.a=1,0!==t.e.length&&e(v,t))}function p(t,n){void 0===t.a&&(t.a=2,t.b=n,e(d,t))}function g(t,n,o,r){var i=t.e,s=i.length;t.f=null,i[s]=n,i[s+1]=o,i[s+2]=r,0===s&&t.a&&e(v,t)}function v(e){var t=e.e,n=e.a;if(0!==t.length){for(var o,r,i=e.b,s=0;s<t.length;s+=3)o=t[s],r=t[s+n],o?_(n,o,r,i):r(i);e.e.length=0}}function m(){this.error=null}function _(e,n,o,r){var i,s,u,a,c=t(o);if(c){try{i=o(r)}catch(l){D.error=l,i=D}if(i===D?(a=!0,s=i.error,i=null):u=!0,n===i)return void p(n,new TypeError("A promises callback cannot return that same promise."))}else i=r,u=!0;void 0===n.a&&(c&&u?f(n,i):a?p(n,s):1===e?h(n,i):2===e&&p(n,i))}function y(e,t){try{t(function(t){f(e,t)},function(t){p(e,t)})}catch(n){p(e,n)}}function b(e,t,n,o){this.n=e,this.c=new e(u,o),this.i=n,this.o(t)?(this.m=t,this.d=this.length=t.length,this.l(),0===this.length?h(this.c,this.b):(this.length=this.length||0,this.k(),0===this.d&&h(this.c,this.b))):p(this.c,this.p())}function w(e){if(A++,this.b=this.a=void 0,this.e=[],u!==e){if(!t(e))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof w))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");y(this,e)}}var P,M=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},C=0,j="undefined"!=typeof window?window:{},O=j.MutationObserver||j.WebKitMutationObserver,j="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,k=Array(1e3);P="undefined"!=typeof process&&"[object process]"==={}.toString.call(process)?n():O?o():j?r():i();var x=new m,D=new m;b.prototype.o=function(e){return M(e)},b.prototype.p=function(){return Error("Array Methods must be provided an Array")},b.prototype.l=function(){this.b=Array(this.length)},b.prototype.k=function(){for(var e=this.length,t=this.c,n=this.m,o=0;void 0===t.a&&e>o;o++)this.j(n[o],o)},b.prototype.j=function(e,t){var n=this.n;"object"==typeof e&&null!==e?e.constructor===n&&void 0!==e.a?(e.f=null,this.g(e.a,t,e.b)):this.q(n.resolve(e),t):(this.d--,this.b[t]=this.h(e))},b.prototype.g=function(e,t,n){var o=this.c;void 0===o.a&&(this.d--,this.i&&2===e?p(o,n):this.b[t]=this.h(n)),0===this.d&&h(o,this.b)},b.prototype.h=function(e){return e},b.prototype.q=function(e,t){var n=this;g(e,void 0,function(e){n.g(1,t,e)},function(e){n.g(2,t,e)})};var A=0;w.all=function(e,t){return new b(this,e,!0,t).c},w.race=function(e,t){function n(e){f(r,e)}function o(e){p(r,e)}var r=new this(u,t);if(!M(e))return p(r,new TypeError("You must pass an array to race.")),r;for(var i=e.length,s=0;void 0===r.a&&i>s;s++)g(this.resolve(e[s]),void 0,n,o);return r},w.resolve=function(e,t){if(e&&"object"==typeof e&&e.constructor===this)return e;var n=new this(u,t);return f(n,e),n},w.reject=function(e,t){var n=new this(u,t);return p(n,e),n},w.prototype={constructor:w,then:function(t,n){var o=this.a;if(1===o&&!t||2===o&&!n)return this;var r=new this.constructor(u),i=this.b;if(o){var s=arguments[o-1];e(function(){_(o,r,s,i)})}else g(this,r,t,n);return r},"catch":function(e){return this.then(null,e)}};var B={Promise:w,polyfill:function(){var e;e="undefined"!=typeof global?global:"undefined"!=typeof window&&window.document?window:self,"Promise"in e&&"resolve"in e.Promise&&"reject"in e.Promise&&"all"in e.Promise&&"race"in e.Promise&&function(){var n;return new e.Promise(function(e){n=e}),t(n)}()||(e.Promise=w)}};"function"==typeof define&&define.amd?define(function(){return B}):"undefined"!=typeof module&&module.exports?module.exports=B:"undefined"!=typeof this&&(this.ES6Promise=B)}).call(this),function(){var global={};global.__CONFIG__=window.__CONFIG__,function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.PathResolver=n}("undefined"!=typeof global?global:this,function(){"use strict";function e(){}return e.prototype={constructor:e,resolvePath:function(e,t){if("exports"===t)return t;var n=e.split("/");n.splice(-1);for(var o=t.split("/"),r=o.splice(-1),i=0;i<o.length;i++){var s=o[i];if("."!==s)if(".."===s){if(!n.length){n=n.concat(o.slice(i));break}n.splice(-1,1)}else n.push(s)}return n.push(r),n.join("/")}},e}),function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.EventEmitter=n}("undefined"!=typeof global?global:this,function(){"use strict";function e(){this._events={}}return e.prototype={constructor:e,on:function(e,t){var n=this._events[e]=this._events[e]||[];n.push(t)},off:function(e,t){var n=this._events[e];if(n){var o=n.indexOf(t);o>-1?n.splice(o,1):console.warn("Off: callback was not removed: "+t.toString())}else console.warn("Off: there are no listeners for event: "+e)},emit:function(e,t){var n=this._events[e];if(n){n=n.slice(0);for(var o=0;o<n.length;o++){var r=n[o];r.call(r,t)}}else console.warn("No listeners for event: "+e)}},e}),function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.ConfigParser=n}("undefined"!=typeof global?global:this,function(e){"use strict";function t(e){this._config={},this._modules={},this._conditionalModules={},this._parseConfig(e)}var n=Object.prototype.hasOwnProperty;return t.prototype={constructor:t,addModule:function(e){this._modules[e.name]=e,this.resolvePath(e),this._registerConditionalModule(e)},getConfig:function(){return this._config},getConditionalModules:function(){return this._conditionalModules},getModules:function(){return this._modules},resolvePath:function(e){for(var t=e.dependencies,n=0;n<t.length;n++){var o=this._getPathResolver().resolvePath(e.name,t[n]);t[n]=o}},_getPathResolver:function(){return this._pathResolver||(this._pathResolver=new e.PathResolver),this._pathResolver},_parseConfig:function(e){for(var t in e)n.call(e,t)&&("modules"===t?this._parseModules(e[t]):this._config[t]=e[t]);return this._config},_parseModules:function(e){for(var t in e)if(n.call(e,t)){var o=e[t];o.name=t,this.addModule(o)}return this._modules},_registerConditionalModule:function(e){if(e.condition){var t=this._conditionalModules[e.condition.trigger];t||(this._conditionalModules[e.condition.trigger]=t=[]),t.push(e.name)}}},t}),function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.DependencyBuilder=n}("undefined"!=typeof global?global:this,function(global){"use strict";function DependencyBuilder(e){this._configParser=e,this._result=[]}var hasOwnProperty=Object.prototype.hasOwnProperty;return DependencyBuilder.prototype={constructor:DependencyBuilder,resolveDependencies:function(e){this._queue=e.slice(0);var t;try{this._resolveDependencies(),t=this._result.reverse().slice(0)}finally{this._cleanup()}return t},_cleanup:function(){var e=this._configParser.getModules();for(var t in e)if(hasOwnProperty.call(e,t)){var n=e[t];n.conditionalMark=!1,n.mark=!1,n.tmpMark=!1}this._queue.length=0,this._result.length=0},_processConditionalModules:function(e){var t=this._configParser.getConditionalModules()[e.name];if(t&&!e.conditionalMark){for(var n=this._configParser.getModules(),o=0;o<t.length;o++){var r=n[t[o]];-1===this._queue.indexOf(r.name)&&this._testConditionalModule(r.condition.test)&&this._queue.push(r.name)}e.conditionalMark=!0}},_resolveDependencies:function(){for(var e=this._configParser.getModules(),t=0;t<this._queue.length;t++){var n=e[this._queue[t]];n.mark||this._visit(n)}},_testConditionalModule:function(testFunction){return"function"==typeof testFunction?testFunction():eval("false || "+testFunction)()},_visit:function(e){if(e.tmpMark)throw new Error("Error processing module: "+e.name+". The provided configuration is not Directed Acyclic Graph.");if(this._processConditionalModules(e),!e.mark){e.tmpMark=!0;for(var t=this._configParser.getModules(),n=0;n<e.dependencies.length;n++){var o=e.dependencies[n];if("exports"!==o){var r=t[o];this._visit(r,t)}}e.mark=!0,e.tmpMark=!1,this._result.unshift(e.name)}},_queue:[]},DependencyBuilder}),function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.URLBuilder=n}("undefined"!=typeof global?global:this,function(){"use strict";function e(e){this._configParser=e}return e.prototype={constructor:e,build:function(e){var t=[],n=[],o=this._configParser.getModules(),r=this._configParser.getConfig(),i=r.basePath;"/"!==i.charAt(i.length-1)&&(i+="/");for(var s=0;s<e.length;s++){var u=o[e[s]];u.fullPath?n.push(u.fullPath):r.combine?t.push(this._getModulePath(u)):n.push(r.url+i+this._getModulePath(u)),u.load=!0}return t.length&&(n.push(r.url+"?"+i+t.join("&"+i)),t.length=0),n},_getModulePath:function(e){return e.path?e.path:e.name.indexOf(".js")!==e.name.length-3?e.name+".js":e.name}},e}),function(e,t){"use strict";var n=t(e);"object"==typeof module&&module&&(module.exports=n),"function"==typeof define&&define.amd&&define(t),e.Loader=new n,e.require=e.Loader.require.bind(e.Loader),e.define=e.Loader.define.bind(e.Loader)}("undefined"!=typeof global?global:this,function(e){"use strict";function t(n){t.superclass.constructor.apply(this,arguments),this._config=n||e.__CONFIG__}function n(e,t,n){if(!t||!e)throw"extend failed, verify dependencies";var r=t.prototype,i=Object.create(r);return e.prototype=i,i.constructor=e,e.superclass=r,t!=Object&&r.constructor==Object.prototype.constructor&&(r.constructor=t),n&&o(i,n),e}function o(e,t){var n=Object.prototype.hasOwnProperty;for(var o in t)n.call(t,o)&&(e[o]=t[o]);return e}return n(t,e.EventEmitter,{define:function(e,t,n,o){var r=this;return new Promise(function(i){var s=o||{};s.name=e,s.dependencies=t,s.pendingImplementation=n,r._getConfigParser().resolvePath(s);var u=r._checkModuleDependencies(s);u?(r._registerModule(s),i(s)):r._waitForImplementation(s).then(function(e){r._registerModule(e)})})},getConditionalModules:function(){return this._getConfigParser().getConditionalModules()},getModules:function(){return this._getConfigParser().getModules()},require:function(){var e,t,n,o=this,r=Array.isArray?Array.isArray(arguments[0]):"[object Array]"===Object.prototype.toString.call(arguments[0]);if(r)t=arguments[0],n="function"==typeof arguments[1]?arguments[1]:null,e="function"==typeof arguments[2]?arguments[2]:null;else{t=[];for(var i=0;i<arguments.length;++i)if("string"==typeof arguments[i])t[i]=arguments[i];else if("function"==typeof arguments[i]){n=arguments[i],e="function"==typeof arguments[++i]?arguments[i]:null;break}}o._resolveDependencies(t).then(function(e){return o._loadModules(e)}).then(function(){var e=o._addModuleImplementations(t);n&&n.apply(n,e)},function(t){e&&e.call(e,t)})},_addModuleImplementations:function(e){for(var t=[],n=this._getConfigParser().getModules(),o=0;o<e.length;o++){var r=n[e[o]];t.push(r?r.implementation:void 0)}return t},_checkModuleDependencies:function(e){for(var t=this._getConfigParser().getModules(),n=!0,o=e.dependencies,r=0;r<o.length;r++){var i=o[r];if("exports"!==i){var s=t[i];if(!s)throw"Dependency "+o[r]+" not registered as module.";var u=s.implementation;if(!u){n=!1;break}}}return n},_getConfigParser:function(){return this._configParser||(this._configParser=new e.ConfigParser(this._config)),this._configParser},_getDependencyBuilder:function(){return this._dependencyBuilder||(this._dependencyBuilder=new e.DependencyBuilder(this._getConfigParser())),this._dependencyBuilder},_getURLBuilder:function(){return this._urlBuilder||(this._urlBuilder=new e.URLBuilder(this._getConfigParser())),this._urlBuilder},_filterModulesNoImpl:function(e){for(var t=[],n=this._getConfigParser().getModules(),o=0;o<e.length;o++){var r=n[e[o]];"exports"===r||r&&r.implementation||t.push(e[o])}return t},_filterNotLoadedModules:function(e){for(var t=[],n=this._getConfigParser().getModules(),o=0;o<e.length;o++){var r=n[e[o]];"exports"===r||r&&(r.implementation||r.load)||t.push(e[o])}return t},_loadModules:function(e){var t=this;return new Promise(function(n,o){var r=t._filterNotLoadedModules(e);if(r.length){for(var i=t._getURLBuilder().build(r),s=[],u=0;u<i.length;u++)s.push(t._loadScript(i[u]));Promise.all(s).then(function(){return t._waitForImplementations(e)}).then(function(e){n(e)}).catch(function(e){o(e)})}else t._waitForImplementations(e).then(function(e){n(e)}).catch(function(e){o(e)})})},_registerModule:function(e){for(var t,n=[],o=this._getConfigParser(),r=o.getModules(),i=0;i<e.dependencies.length;i++){var s,u=e.dependencies[i];if("exports"===u)t={},n.push(t);else{var a=r[u];s=a.implementation,n.push(s)}}var c=e.pendingImplementation.apply(e.pendingImplementation,n);e.implementation=c||t,o.addModule(e),this.emit("moduleRegister",e)},_resolveDependencies:function(e){var t=this;return new Promise(function(n,o){try{for(var r=t._getConfigParser().getModules(),i=[],s=0;s<e.length;s++)r[e[s]]&&i.push(e[s]);var u=t._getDependencyBuilder().resolveDependencies(i);n(u)}catch(a){o(a)}})},_loadScript:function(e){return new Promise(function(t,n){var o=document.createElement("script");o.src=e,o.onload=o.onreadystatechange=function(){this.readyState&&"complete"!==this.readyState&&"load"!==this.readyState||(o.onload=o.onreadystatechange=null,t(o))},o.onerror=function(){document.body.removeChild(o),n(o)},document.body.appendChild(o)})},_waitForImplementation:function(e){var t=this;return new Promise(function(n){if(e.implementation)n(e);else{var o=function(){var r=t._checkModuleDependencies(e);r&&(t.off("moduleRegister",o),n(e))};t.on("moduleRegister",o)}})},_waitForImplementations:function(e){var t=this;return new Promise(function(n){var o=t._filterModulesNoImpl(e);if(o.length){for(var r=[],i=t._getConfigParser().getModules(),s=0;s<e.length;s++)r.push(t._waitForImplementation(i[o[s]]));Promise.all(r).then(function(e){n(e)})}else n(e)})}}),t}),window.Loader=global.Loader,window.require=global.require,window.define=global.define}();