webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(6);
var isBuffer = __webpack_require__(19);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

exports.updateFormRating = {
  methods: {
    updateRating: function updateRating(rating) {
      this.form.errors.clear();
      this.form.rating = rating;
    }
  }
};

exports.updateImage = {
  methods: {
    updateImg: function updateImg() {
      var input = this.$refs.image;
      this.form.errors.clear("image");
      // check if correct format
      if (input.files && input.files[0]) {
        this.imgName = input.files[0].name;
      } else {
        this.errMsg = "Please upload an image";
      }
    }
  }
};

exports.validateEmail = {
  methods: {
    checkEmail: function checkEmail(email) {
      var emailRegEx = /\S+@\S+\.\S+/;
      return emailRegEx.test(email);
    }
  }
};

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Errors__ = __webpack_require__(53);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Form = function () {
  function Form(schema) {
    var oldData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Form);

    this.originalData = schema;

    for (var field in schema) {
      oldData.hasOwnProperty(field) ? this[field] = oldData[field] : this[field] = schema[field];
    }

    this.errors = new __WEBPACK_IMPORTED_MODULE_0__Errors__["a" /* default */]();
  }

  _createClass(Form, [{
    key: "data",
    value: function data() {
      var data = {};

      for (var property in this.originalData) {
        data[property] = this[property];
      }

      return data;
    }
  }, {
    key: "isSet",
    value: function isSet() {
      for (var property in this.originalData) {
        if (this[property] === "") {
          this.errors.recordOne({
            name: property,
            message: "This field is required"
          });
        }
      }
      return true;
    }
  }, {
    key: "reset",
    value: function reset() {
      for (var field in this.originalData) {
        this[field] = "";
      }

      this.errors.clear();
    }
  }, {
    key: "post",
    value: function post(url) {
      return this.submit("post", url);
    }
  }, {
    key: "submit",
    value: function submit(requestType, url) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        axios[requestType](url, _this.data()).then(function (response) {
          _this.onSuccess();
          resolve(response.data);
        }).catch(function (error) {
          _this.onFail(error.response.data);

          reject(error.response.data);
        });
      });
    }
  }, {
    key: "onSuccess",
    value: function onSuccess() {
      this.reset();
    }
  }, {
    key: "onFail",
    value: function onFail(errors) {
      this.errors.record(errors);
    }
  }]);

  return Form;
}();

/* harmony default export */ __webpack_exports__["a"] = (Form);

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(0);
var normalizeHeaderName = __webpack_require__(21);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(8);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(8);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 5 */,
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var settle = __webpack_require__(22);
var buildURL = __webpack_require__(24);
var parseHeaders = __webpack_require__(25);
var isURLSameOrigin = __webpack_require__(26);
var createError = __webpack_require__(9);
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(27);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("development" !== 'test' &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(28);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(23);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(51)
/* template */
var __vue_template__ = __webpack_require__(52)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/comment/Star.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-626decb9", Component.options)
  } else {
    hotAPI.reload("data-v-626decb9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(15);
module.exports = __webpack_require__(79);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bootstrap__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_vue__);
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */



// bulma
//import "bulma/css/bulma.css";



// setup event bus
__WEBPACK_IMPORTED_MODULE_1_vue___default.a.prototype.$eventBus = new __WEBPACK_IMPORTED_MODULE_1_vue___default.a();

// all our vue components
__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("nav-search", __webpack_require__(38));

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("map-component", __webpack_require__(41));

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("add-comment", __webpack_require__(44), {
  props: ["courseid"]
});

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("add-course", __webpack_require__(55), {
  props: ["tags", "old", "errors"]
});

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("update-course", __webpack_require__(58), {
  props: ["current", "currentTags", "tags", "old", "errors"]
});

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("reviews-component", __webpack_require__(61), {
  props: ["comms"]
});

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("bookmark-component", __webpack_require__(67), {
  props: ["courseid"]
});

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("register-component", __webpack_require__(70), {
  props: ["old", "errors"]
});

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("login-component", __webpack_require__(73), {
  props: ["old", "errors"]
});

__WEBPACK_IMPORTED_MODULE_1_vue___default.a.component("modal-component", __webpack_require__(76));

// new vuejs root instance
var app = new __WEBPACK_IMPORTED_MODULE_1_vue___default.a({
  el: "#app",
  data: {
    token: document.head.querySelector('meta[name="csrf-token"]')["content"],
    mobSearchOpen: false,
    mobAccountOpen: false,
    showModal: false,
    status: "",
    header: "",
    message: ""
  },
  methods: {
    // toggle the mobile menu
    toggleMobile: function toggleMobile(el) {
      if (el == "search") {
        this.mobAccountOpen = false;

        if (this.mobSearchOpen) {
          this.mobSearchOpen = false;
        } else {
          this.mobSearchOpen = true;
        }
      } else {
        this.mobSearchOpen = false;

        if (this.mobAccountOpen) {
          this.mobAccountOpen = false;
        } else {
          this.mobAccountOpen = true;
        }
      }
    },
    openModal: function openModal() {
      this.showModal = true;
      var that = this;
      setTimeout(function () {
        that.showModal = false;
      }, 4000);
    }
  },
  created: function created() {
    var _this = this;

    this.$eventBus.$on("msg", function (data) {
      _this.status = data.status, _this.header = data.header, _this.message = data.message, _this.openModal();
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.$eventBus.$off("msg");
  }
});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = __webpack_require__(17);

window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

/**
 * Next we will register the CSRF Token as a common header with Axios so that
 * all outgoing HTTP requests automatically have it attached. This is just
 * a simple convenience so we don't have to attach every token manually.
 */

var token = document.head.querySelector('meta[name="csrf-token"]');
window.axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(18);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var bind = __webpack_require__(6);
var Axios = __webpack_require__(20);
var defaults = __webpack_require__(4);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(11);
axios.CancelToken = __webpack_require__(34);
axios.isCancel = __webpack_require__(10);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(35);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 19 */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(4);
var utils = __webpack_require__(0);
var InterceptorManager = __webpack_require__(29);
var dispatchRequest = __webpack_require__(30);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(9);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var transformData = __webpack_require__(31);
var isCancel = __webpack_require__(10);
var defaults = __webpack_require__(4);
var isAbsoluteURL = __webpack_require__(32);
var combineURLs = __webpack_require__(33);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(11);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 36 */,
/* 37 */,
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(39)
/* template */
var __vue_template__ = __webpack_require__(40)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/NavSearch.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c4dc71f8", Component.options)
  } else {
    hotAPI.reload("data-v-c4dc71f8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "NavSearch",
  data: function data() {
    return {
      userSearch: "",
      results: []
    };
  },

  methods: {
    findCourses: function findCourses() {
      var _this = this;

      if (this.userSearch.length < 2) return this.results.splice(0);

      axios.post("/api/courses/search", {
        search: this.userSearch
      }).then(function (res) {
        if (res.data) {
          _this.results = res.data;
        }
      }).catch(function (err) {
        console.warn(err);
      });
    }
  }
});

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "nav_search" }, [
    _c("div", { staticClass: "search_box" }, [
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.userSearch,
            expression: "userSearch"
          }
        ],
        attrs: {
          type: "text",
          "aria-label": "Search",
          placeholder: "Search...",
          name: "search"
        },
        domProps: { value: _vm.userSearch },
        on: {
          keyup: _vm.findCourses,
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.userSearch = $event.target.value
          }
        }
      }),
      _vm._v(" "),
      _vm.results.length
        ? _c("div", { staticClass: "search_results" }, [
            _c(
              "ul",
              _vm._l(_vm.results, function(course, index) {
                return _c("li", { key: index }, [
                  _c("a", { attrs: { href: "/courses/" + course.slug } }, [
                    _vm._v(_vm._s(course.name))
                  ])
                ])
              })
            )
          ])
        : _vm._e()
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-c4dc71f8", module.exports)
  }
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(42)
/* template */
var __vue_template__ = __webpack_require__(43)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/Map.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-20909bf5", Component.options)
  } else {
    hotAPI.reload("data-v-20909bf5", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "MapComponent",
  data: function data() {
    return {
      mapOptions: {
        center: { lat: 52.195731, lng: -2.226148 },
        mapTypeId: "roadmap",
        maxZoom: 16
      }
    };
  },

  methods: {
    focusSearch: function focusSearch() {
      this.$refs.search.focus();
    },
    setSearch: function setSearch(map) {
      var _this = this;

      var autoComplete = new google.maps.places.Autocomplete(this.$refs.search);
      autoComplete.addListener("place_changed", function () {
        var place = autoComplete.getPlace();
        if (!place || !place.geometry) return;
        _this.showCourses(map, place.geometry.location.lat(), place.geometry.location.lng());
      });
    },
    showCourses: function showCourses(map) {
      var _this2 = this;

      var lat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 52.195731;
      var lng = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -2.226148;

      axios.post("/api/courses/find", {
        lat: lat,
        lng: lng
      }).then(function (r) {
        if (!r.data.length) {
          return _this2.$eventBus.$emit("msg", {
            status: "is-info",
            header: "Info",
            message: "No courses found in this area"
          });
        }
        var courses = r.data;
        var bounds = new google.maps.LatLngBounds();

        var markers = courses.map(function (course) {
          var position = {
            lat: parseFloat(course.lat),
            lng: parseFloat(course.lng)
          };
          bounds.extend(position);
          var marker = new google.maps.Marker({ map: map, position: position });
          marker.course = course;
          return marker;
        });

        _this2.createMarkers(map, markers);
        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);
      });
    },
    createMarkers: function createMarkers(map, markers) {
      var infoWindow = new google.maps.InfoWindow();

      markers.forEach(function (marker) {
        return marker.addListener("click", function () {
          var html = "\n              <a class=\"courseWindow card\" href=\"/courses/" + this.course.slug + "\">\n                <div class=\"card-image\">\n                  <figure class=\"image is-4by3\">\n                    <img src=\"/storage/courses/" + this.course.thumbnail + "\" alt=\"" + this.course.name + " picture\" />\n                  </figure>\n                </div>\n                <div class=\"card-content\">\n                  <div class=\"content\">\n                    <p class=\"title is-6\">" + this.course.name + "</p>\n                    <p class=\"subtitle is-7\">" + this.course.address + "</p>\n                  </div>\n                </div>\n              </a>\n            ";
          infoWindow.setContent(html);
          infoWindow.open(map, this);
        });
      });
    },
    createMap: function createMap() {
      var gMap = new google.maps.Map(this.$refs.map, this.mapOptions);
      this.showCourses(gMap);
      this.setSearch(gMap);
    }
  },
  mounted: function mounted() {
    // if ('geolocation' in navigator) {
    //   this.userCoords = navigator.geolocation.getCurrentPosition();
    // } else {
    //   this.userCoords = false;
    // }
    this.createMap();
  }
});

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "map-pg" }, [
    _c("h1", { staticClass: "page_heading" }, [
      _vm._v("Find Your Next Course")
    ]),
    _vm._v(" "),
    _c("section", { staticClass: "map_section" }, [
      _c("div", { staticClass: "field search_bar" }, [
        _c(
          "div",
          {
            staticClass: "control has-icon-left",
            attrs: { "aria-label": "Search for courses" }
          },
          [
            _c(
              "span",
              {
                staticClass: "icon is-small is-left",
                on: { click: _vm.focusSearch }
              },
              [
                _c("i", {
                  staticClass: "fas fa-search",
                  attrs: { "aria-hidden": "true" }
                })
              ]
            ),
            _vm._v(" "),
            _c("input", {
              ref: "search",
              attrs: {
                type: "text",
                name: "search",
                "aria-label": "Search",
                placeholder: "Enter an address..."
              }
            })
          ]
        )
      ]),
      _vm._v(" "),
      _c("div", { ref: "map", staticClass: "map" })
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-20909bf5", module.exports)
  }
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(45)
}
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(50)
/* template */
var __vue_template__ = __webpack_require__(54)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3f3fc0b6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/comment/AddComment.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3f3fc0b6", Component.options)
  } else {
    hotAPI.reload("data-v-3f3fc0b6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(48)("3d5b34c0", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3f3fc0b6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/sass-loader/lib/loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AddComment.vue", function() {
     var newContent = require("!!../../../../../node_modules/css-loader/index.js!../../../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3f3fc0b6\",\"scoped\":true,\"hasInlineConfig\":true}!../../../../../node_modules/sass-loader/lib/loader.js!../../../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./AddComment.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(47)(false);
// imports


// module
exports.push([module.i, "\n.field[data-v-3f3fc0b6],\n.label[data-v-3f3fc0b6] {\n  margin-bottom: 0;\n}\n.field .help[data-v-3f3fc0b6] {\n  margin: 0;\n}\n", ""]);

// exports


/***/ }),
/* 47 */
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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(49)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 49 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Star__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Star___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Star__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixins__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Form__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
  name: "AddComment",
  props: ["courseid", "errors"],
  mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins__["updateFormRating"]],
  components: {
    StarComponent: __WEBPACK_IMPORTED_MODULE_0__Star___default.a
  },
  data: function data() {
    var commentForm = new __WEBPACK_IMPORTED_MODULE_2__Form__["a" /* default */]({
      comment: "",
      rating: 0
    });
    commentForm.errors.record(this.errors);
    return {
      form: commentForm,
      msgPosted: false
    };
  },

  methods: {
    submitReview: function submitReview() {
      var _this = this;

      if (this.form.comment.length < 7) {
        this.form.errors.recordOne({
          name: "comment",
          message: "The comment field is required, with at least 7 characters"
        });
      }

      if (this.form.rating < 1 || this.form.rating > 5) {
        this.form.errors.recordOne({
          name: "rating",
          message: "A star rating of between 1 and 5 is required"
        });
      }

      if (this.form.isSet() && !this.form.errors.any()) {
        //post and fetch data
        this.form.post("/api/courses/" + this.courseid + "/comments").then(function (data) {
          if (data.length) {
            _this.$eventBus.$emit("newcomments", data);
            _this.$eventBus.$emit("msg", {
              status: "is-success",
              header: "Success",
              message: "Your message has been added"
            });
            _this.msgPosted = true;
          }
        }).catch(function (err) {
          console.warn(err);
        });
      }
    }
  }
});

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "StarComponent",
  props: ["default"],
  data: function data() {
    return {
      stars: [1, 2, 3, 4, 5],
      hoveredStar: 0,
      selectedStar: 0
    };
  },

  methods: {
    clickStar: function clickStar(starID) {
      if (starID == this.selectedStar) {
        this.selectedStar = 0;
      } else {
        this.selectedStar = starID;
      }
      this.$emit("selected", this.selectedStar);
    },
    starHover: function starHover(starID) {
      this.hoveredStar = starID;
    }
  },
  filters: {
    stars: function stars(num) {
      return "★".repeat(num) + "☆".repeat(5 - num);
    }
  },
  created: function created() {
    if (this.default > 0) {
      this.selectedStar = this.default;
    }
  }
});

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "review_stars" },
    [
      _c("p", [_vm._v(_vm._s(_vm.selectedStar + " star"))]),
      _vm._v(" "),
      _vm._l(_vm.stars, function(star) {
        return _c(
          "label",
          {
            key: star,
            class: {
              hover: star <= _vm.hoveredStar,
              selected: star <= _vm.selectedStar
            },
            on: {
              mouseover: function($event) {
                _vm.starHover(star)
              },
              mouseout: function($event) {
                _vm.hoveredStar = 0
              }
            }
          },
          [
            _c("input", {
              attrs: { id: star + "star", type: "radio" },
              on: {
                click: function($event) {
                  _vm.clickStar(star)
                }
              }
            }),
            _vm._v(_vm._s(star) + " stars\n  ")
          ]
        )
      }),
      _vm._v(" "),
      _c("input", {
        attrs: { type: "hidden", name: "rating" },
        domProps: { value: _vm.selectedStar }
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-626decb9", module.exports)
  }
}

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Errors = function () {
  function Errors(errorObj) {
    _classCallCheck(this, Errors);

    this.errors = {};
  }

  _createClass(Errors, [{
    key: "has",
    value: function has(field) {
      return this.errors.hasOwnProperty(field);
    }
  }, {
    key: "any",
    value: function any() {
      return Object.keys(this.errors).length > 0;
    }
  }, {
    key: "all",
    value: function all() {
      return Object.keys(this.errors);
    }
  }, {
    key: "get",
    value: function get(field) {
      if (this.errors[field]) {
        return this.errors[field];
      }
    }
  }, {
    key: "record",
    value: function record(errors) {
      var _this = this;

      if (errors.length) {
        errors.forEach(function (err) {
          var name = err.split(" ")[1];
          _this.errors[name] = err;
        });
      }
    }
  }, {
    key: "recordOne",
    value: function recordOne(error) {
      this.errors[error.name] = error.message;
      this.errors = Object.assign({}, this.errors);
    }
  }, {
    key: "clear",
    value: function clear(field) {
      if (field) {
        delete this.errors[field];

        return;
      }

      this.errors = {};
    }
  }]);

  return Errors;
}();

/* harmony default export */ __webpack_exports__["a"] = (Errors);

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    !_vm.msgPosted
      ? _c("div", [
          _c(
            "form",
            {
              attrs: {
                method: "POST",
                action: "/courses/" + _vm.courseid + "/comments"
              },
              on: {
                submit: function($event) {
                  $event.preventDefault()
                  return _vm.submitReview($event)
                },
                keydown: function($event) {
                  _vm.form.errors.clear($event.target.name)
                }
              }
            },
            [
              _c("h3", [_vm._v("Enter a Review")]),
              _vm._v(" "),
              _c("div", [
                _c(
                  "div",
                  { staticClass: "field" },
                  [
                    _c(
                      "label",
                      { staticClass: "label", attrs: { for: "comment" } },
                      [_vm._v("Comment")]
                    ),
                    _vm._v(" "),
                    _vm._l(_vm.form.errors.all(), function(err, index) {
                      return _vm.form.errors.any()
                        ? _c("p", {
                            key: index,
                            staticClass: "help is-danger",
                            domProps: {
                              textContent: _vm._s(_vm.form.errors.get(err))
                            }
                          })
                        : _vm._e()
                    }),
                    _vm._v(" "),
                    _c("div", { staticClass: "control" }, [
                      _c("textarea", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model.trim",
                            value: _vm.form.comment,
                            expression: "form.comment",
                            modifiers: { trim: true }
                          }
                        ],
                        staticClass: "textarea",
                        attrs: {
                          name: "comment",
                          id: "comment",
                          placeholder:
                            "If you liked the course, please leave a review..."
                        },
                        domProps: { value: _vm.form.comment },
                        on: {
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.form,
                              "comment",
                              $event.target.value.trim()
                            )
                          },
                          blur: function($event) {
                            _vm.$forceUpdate()
                          }
                        }
                      })
                    ])
                  ],
                  2
                ),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "form_footer" },
                  [
                    _c("star-component", {
                      attrs: { default: 0 },
                      on: { selected: _vm.updateRating }
                    }),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "button is-primary",
                        attrs: { type: "submit" }
                      },
                      [_vm._v("Submit")]
                    )
                  ],
                  1
                )
              ])
            ]
          )
        ])
      : _c("h3", [_c("em", [_vm._v("Thank you for your comment!")])])
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3f3fc0b6", module.exports)
  }
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(56)
/* template */
var __vue_template__ = __webpack_require__(57)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/AddCourse.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-428a4c16", Component.options)
  } else {
    hotAPI.reload("data-v-428a4c16", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Form__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixins__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  name: "AddCourse",
  props: ["tags", "old", "errors"],
  mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins__["updateImage"]],
  data: function data() {
    var courseForm = new __WEBPACK_IMPORTED_MODULE_0__Form__["a" /* default */]({
      name: "",
      description: "",
      address: "",
      tel_no: "",
      lat: "",
      lng: "",
      tags: [],
      website: "",
      weekday_cost: "",
      weekend_cost: ""
    }, this.old);
    courseForm.errors.record(this.errors);

    return {
      form: courseForm,
      imgName: "",
      foundPlace: false
    };
  },

  methods: {
    setSearchLocation: function setSearchLocation() {
      var _this = this;

      var autoComplete = new google.maps.places.Autocomplete(this.$refs.search);
      google.maps.event.addDomListener(this.$refs.search, "keydown", function (e) {
        if (e.keyCode === 13) e.preventDefault();
      });
      autoComplete.addListener("place_changed", function () {
        var place = autoComplete.getPlace();
        if (place && place.geometry) {
          _this.foundPlace = true;
          _this.form.name = place.name;
          _this.form.address = place.formatted_address;
          _this.form.tel_no = place.formatted_phone_number;
          _this.form.website = place.website;
          _this.form.lat = place.geometry.location.lat();
          _this.form.lng = place.geometry.location.lng();
        } else {
          _this.foundPlace = false;
        }
      });
    },
    checkForm: function checkForm(e) {
      var _form$data = this.form.data(),
          tags = _form$data.tags;

      if (tags.length < 1) {
        this.form.errors.recordOne({
          name: "tags",
          message: "Please select at least one tag"
        });
      }

      if (this.form.isSet() && this.form.errors.any()) {
        e.preventDefault();
      }
    }
  },
  mounted: function mounted() {
    if (!Array.isArray(this.old) && Object.getOwnPropertyNames(this.old).length > 0) {
      this.foundPlace = true;
    }
    this.setSearchLocation();
    this.$refs.search.focus();
  }
});

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "form",
    {
      staticClass: "form",
      attrs: {
        method: "POST",
        action: "/courses",
        enctype: "multipart/form-data"
      },
      on: {
        submit: _vm.checkForm,
        keydown: function($event) {
          _vm.form.errors.clear($event.target.name)
        }
      }
    },
    [
      _c("h1", [_vm._v("Upload Course")]),
      _vm._v(" "),
      _c("input", {
        attrs: { type: "hidden", name: "_token" },
        domProps: { value: this.$root.token }
      }),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "search" } }, [
          _vm._v("Course Search")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            ref: "search",
            staticClass: "input",
            attrs: {
              id: "search",
              name: "search",
              type: "text",
              placeholder: "Search for the course"
            }
          }),
          _vm._v(" "),
          _vm._m(0)
        ])
      ]),
      _vm._v(" "),
      _vm.foundPlace
        ? _c("div", [
            _c("div", { staticClass: "field" }, [
              _c("label", { staticClass: "label", attrs: { for: "name" } }, [
                _vm._v("Course Name")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "control has-icons-left" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.form.name,
                      expression: "form.name",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "input",
                  class: { "is-danger": _vm.form.errors.has("name") },
                  attrs: {
                    id: "name",
                    name: "name",
                    type: "text",
                    placeholder: "Please enter the course name",
                    required: ""
                  },
                  domProps: { value: _vm.form.name },
                  on: {
                    keydown: function($event) {
                      _vm.form.errors.clear("course")
                    },
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "name", $event.target.value.trim())
                    },
                    blur: function($event) {
                      _vm.$forceUpdate()
                    }
                  }
                }),
                _vm._v(" "),
                _vm._m(1)
              ]),
              _vm._v(" "),
              _vm.form.errors.has("name")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("name"))
                    }
                  })
                : _vm._e(),
              _vm._v(" "),
              _vm.form.errors.has("course")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("course"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("label", { staticClass: "label", attrs: { for: "desc" } }, [
                _vm._v("Description")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "control" }, [
                _c("textarea", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.form.description,
                      expression: "form.description",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "textarea",
                  class: { "is-danger": _vm.form.errors.has("description") },
                  attrs: {
                    name: "description",
                    id: "desc",
                    placeholder: "Please Enter A Brief Description",
                    required: ""
                  },
                  domProps: { value: _vm.form.description },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.form,
                        "description",
                        $event.target.value.trim()
                      )
                    },
                    blur: function($event) {
                      _vm.$forceUpdate()
                    }
                  }
                })
              ]),
              _vm._v(" "),
              _vm.form.errors.has("description")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("description"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "input_label" }, [_vm._v("Image")]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("div", { staticClass: "file has-name is-fullwidth" }, [
                _c("label", { staticClass: "file-label" }, [
                  _c("input", {
                    ref: "image",
                    staticClass: "file-input",
                    attrs: {
                      type: "file",
                      name: "image",
                      accept: "image/*",
                      id: "file",
                      required: ""
                    },
                    on: { change: _vm.updateImg }
                  }),
                  _vm._v(" "),
                  _vm._m(2),
                  _vm._v(" "),
                  _vm.imgName
                    ? _c("span", { staticClass: "file-name" }, [
                        _vm._v(
                          "\n            " +
                            _vm._s(_vm.imgName.substring(0, 30)) +
                            "\n          "
                        )
                      ])
                    : _vm._e()
                ])
              ]),
              _vm._v(" "),
              _vm.form.errors.has("image")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("image"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("label", { staticClass: "label", attrs: { for: "address" } }, [
                _vm._v("Address")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "control has-icons-left" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.form.address,
                      expression: "form.address",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "input",
                  class: { "is-danger": _vm.form.errors.has("address") },
                  attrs: {
                    id: "address",
                    name: "address",
                    type: "text",
                    required: ""
                  },
                  domProps: { value: _vm.form.address },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "address", $event.target.value.trim())
                    },
                    blur: function($event) {
                      _vm.$forceUpdate()
                    }
                  }
                }),
                _vm._v(" "),
                _vm._m(3)
              ]),
              _vm._v(" "),
              _vm.form.errors.has("address")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("address"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("label", { staticClass: "label", attrs: { for: "lat" } }, [
                _vm._v("Latitude")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "control has-icons-left" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.form.lat,
                      expression: "form.lat",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "input",
                  class: { "is-danger": _vm.form.errors.has("lat") },
                  attrs: { id: "lat", name: "lat", type: "text", required: "" },
                  domProps: { value: _vm.form.lat },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "lat", $event.target.value.trim())
                    },
                    blur: function($event) {
                      _vm.$forceUpdate()
                    }
                  }
                }),
                _vm._v(" "),
                _vm._m(4)
              ]),
              _vm._v(" "),
              _vm.form.errors.has("lat")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("lat"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("label", { staticClass: "label", attrs: { for: "lng" } }, [
                _vm._v("Longitude")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "control has-icons-left" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.form.lng,
                      expression: "form.lng",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "input",
                  class: { "is-danger": _vm.form.errors.has("lng") },
                  attrs: { id: "lng", name: "lng", type: "text", required: "" },
                  domProps: { value: _vm.form.lng },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "lng", $event.target.value.trim())
                    },
                    blur: function($event) {
                      _vm.$forceUpdate()
                    }
                  }
                }),
                _vm._v(" "),
                _vm._m(5)
              ]),
              _vm._v(" "),
              _vm.form.errors.has("lng")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("lng"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("label", { staticClass: "label", attrs: { for: "tel" } }, [
                _vm._v("Tel No.")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "control has-icons-left" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.form.tel_no,
                      expression: "form.tel_no",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "input",
                  class: { "is-danger": _vm.form.errors.has("tel_no") },
                  attrs: {
                    id: "tel",
                    name: "tel_no",
                    type: "text",
                    required: ""
                  },
                  domProps: { value: _vm.form.tel_no },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "tel_no", $event.target.value.trim())
                    },
                    blur: function($event) {
                      _vm.$forceUpdate()
                    }
                  }
                }),
                _vm._v(" "),
                _vm._m(6)
              ]),
              _vm._v(" "),
              _vm.form.errors.has("tel_no")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("tel_no"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c("label", { staticClass: "label", attrs: { for: "website" } }, [
                _vm._v("Website URL")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "control has-icons-left" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.form.website,
                      expression: "form.website",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "input",
                  class: { "is-danger": _vm.form.errors.has("website") },
                  attrs: {
                    id: "website",
                    name: "website",
                    type: "text",
                    placeholder: "www.domain.co.uk",
                    required: ""
                  },
                  domProps: { value: _vm.form.website },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.form, "website", $event.target.value.trim())
                    },
                    blur: function($event) {
                      _vm.$forceUpdate()
                    }
                  }
                }),
                _vm._v(" "),
                _vm._m(7)
              ]),
              _vm._v(" "),
              _vm.form.errors.has("website")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("website"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("p", { staticClass: "input_label" }, [_vm._v("Tags")]),
            _vm._v(" "),
            _vm.tags
              ? _c(
                  "div",
                  { staticClass: "field is-grouped form_tags" },
                  [
                    _vm._l(_vm.tags, function(tag) {
                      return _c("p", { key: tag.id, staticClass: "control" }, [
                        _c("label", { staticClass: "checkbox" }, [
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.form.tags,
                                expression: "form.tags"
                              }
                            ],
                            attrs: {
                              type: "checkbox",
                              id: tag.id,
                              name: "tags[]"
                            },
                            domProps: {
                              value: tag.id,
                              checked: Array.isArray(_vm.form.tags)
                                ? _vm._i(_vm.form.tags, tag.id) > -1
                                : _vm.form.tags
                            },
                            on: {
                              click: function($event) {
                                _vm.form.errors.clear("tags")
                              },
                              change: function($event) {
                                var $$a = _vm.form.tags,
                                  $$el = $event.target,
                                  $$c = $$el.checked ? true : false
                                if (Array.isArray($$a)) {
                                  var $$v = tag.id,
                                    $$i = _vm._i($$a, $$v)
                                  if ($$el.checked) {
                                    $$i < 0 &&
                                      _vm.$set(
                                        _vm.form,
                                        "tags",
                                        $$a.concat([$$v])
                                      )
                                  } else {
                                    $$i > -1 &&
                                      _vm.$set(
                                        _vm.form,
                                        "tags",
                                        $$a
                                          .slice(0, $$i)
                                          .concat($$a.slice($$i + 1))
                                      )
                                  }
                                } else {
                                  _vm.$set(_vm.form, "tags", $$c)
                                }
                              }
                            }
                          }),
                          _vm._v(
                            "\n          " + _vm._s(tag.tag_name) + "\n        "
                          )
                        ])
                      ])
                    }),
                    _vm._v(" "),
                    _vm.form.errors.has("tags")
                      ? _c("p", {
                          staticClass: "tag_error help is-danger",
                          domProps: {
                            textContent: _vm._s(_vm.form.errors.get("tags"))
                          }
                        })
                      : _vm._e()
                  ],
                  2
                )
              : _vm._e(),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c(
                "label",
                { staticClass: "label", attrs: { for: "weekCost" } },
                [_vm._v("WeekDay Cost")]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "control has-icons-left" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.form.weekday_cost,
                      expression: "form.weekday_cost",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "input",
                  class: { "is-danger": _vm.form.errors.has("weekday_cost") },
                  attrs: {
                    id: "weekCost",
                    name: "weekday_cost",
                    type: "text",
                    placeholder: "20.50",
                    required: ""
                  },
                  domProps: { value: _vm.form.weekday_cost },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.form,
                        "weekday_cost",
                        $event.target.value.trim()
                      )
                    },
                    blur: function($event) {
                      _vm.$forceUpdate()
                    }
                  }
                }),
                _vm._v(" "),
                _vm._m(8)
              ]),
              _vm._v(" "),
              _vm.form.errors.has("weekday_cost")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("weekday_cost"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "field" }, [
              _c(
                "label",
                { staticClass: "label", attrs: { for: "weekendCost" } },
                [_vm._v("Weekend Cost")]
              ),
              _vm._v(" "),
              _c("div", { staticClass: "control has-icons-left" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model.trim",
                      value: _vm.form.weekend_cost,
                      expression: "form.weekend_cost",
                      modifiers: { trim: true }
                    }
                  ],
                  staticClass: "input",
                  class: { "is-danger": _vm.form.errors.has("weekend_cost") },
                  attrs: {
                    id: "weekendCost",
                    name: "weekend_cost",
                    type: "text",
                    placeholder: "30.50",
                    required: ""
                  },
                  domProps: { value: _vm.form.weekend_cost },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(
                        _vm.form,
                        "weekend_cost",
                        $event.target.value.trim()
                      )
                    },
                    blur: function($event) {
                      _vm.$forceUpdate()
                    }
                  }
                }),
                _vm._v(" "),
                _vm._m(9)
              ]),
              _vm._v(" "),
              _vm.form.errors.has("weekend_cost")
                ? _c("p", {
                    staticClass: "help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("weekend_cost"))
                    }
                  })
                : _vm._e()
            ]),
            _vm._v(" "),
            _vm._m(10)
          ])
        : _vm._e()
    ]
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-search" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-golf-ball" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "file-cta" }, [
      _c("span", { staticClass: "file-icon" }, [
        _c("i", { staticClass: "fas fa-upload" })
      ]),
      _vm._v(" "),
      _c("span", { staticClass: "file-label" }, [
        _vm._v("\n              Please Selete An Image…\n            ")
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-home" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-location-arrow" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-location-arrow" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-phone" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-external-link-alt" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-pound-sign" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-pound-sign" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "field" }, [
      _c("div", { staticClass: "control" }, [
        _c(
          "button",
          { staticClass: "button is-primary", attrs: { type: "submit" } },
          [_vm._v("Upload →")]
        )
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-428a4c16", module.exports)
  }
}

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(59)
/* template */
var __vue_template__ = __webpack_require__(60)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/UpdateCourse.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4de5d9fb", Component.options)
  } else {
    hotAPI.reload("data-v-4de5d9fb", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 59 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Form__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixins__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  name: "UpdateCourse",
  props: ["current", "currentTags", "tags", "old", "errors"],
  mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins__["updateImage"]],
  data: function data() {
    var currentDetails = void 0;
    if (!Array.isArray(this.old) && Object.getOwnPropertyNames(this.old).length > 0) {
      currentDetails = this.old;
    } else {
      currentDetails = this.current;
      currentDetails.tags = this.currentTags;
    }

    var courseForm = new __WEBPACK_IMPORTED_MODULE_0__Form__["a" /* default */]({
      name: "",
      description: "",
      address: "",
      tel_no: "",
      lat: "",
      lng: "",
      tags: [],
      website: "",
      weekday_cost: "",
      weekend_cost: ""
    }, currentDetails);
    courseForm.errors.record(this.errors);
    return {
      form: courseForm,
      imgName: ""
    };
  },

  methods: {
    checkForm: function checkForm(e) {
      var _form$data = this.form.data(),
          tags = _form$data.tags;

      if (tags.length < 1) {
        this.form.errors.recordOne({
          name: "tags",
          message: "Please select at least one tag"
        });
      }

      if (this.form.isSet() && this.form.errors.any()) {
        e.preventDefault();
      }
    }
  }
});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "form",
    {
      staticClass: "form",
      attrs: {
        method: "POST",
        action: "/courses/" + _vm.current.slug + "/update",
        enctype: "multipart/form-data"
      },
      on: {
        submit: _vm.checkForm,
        keydown: function($event) {
          _vm.form.errors.clear($event.target.name)
        }
      }
    },
    [
      _c("h1", [_vm._v("Update: " + _vm._s(_vm.form.name))]),
      _vm._v(" "),
      _c("input", {
        attrs: { type: "hidden", name: "_token" },
        domProps: { value: this.$root.token }
      }),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "name" } }, [
          _vm._v("Course Name")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.name,
                expression: "form.name",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("name") },
            attrs: {
              id: "name",
              name: "name",
              type: "text",
              placeholder: "Please enter the course name",
              required: ""
            },
            domProps: { value: _vm.form.name },
            on: {
              keydown: function($event) {
                _vm.form.errors.clear("course")
              },
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "name", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(0)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("name")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("name")) }
            })
          : _vm._e(),
        _vm._v(" "),
        _vm.form.errors.has("course")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("course")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "desc" } }, [
          _vm._v("Description")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control" }, [
          _c("textarea", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.description,
                expression: "form.description",
                modifiers: { trim: true }
              }
            ],
            staticClass: "textarea",
            class: { "is-danger": _vm.form.errors.has("description") },
            attrs: {
              name: "description",
              id: "desc",
              placeholder: "Please Enter A Brief Description",
              required: ""
            },
            domProps: { value: _vm.form.description },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "description", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          })
        ]),
        _vm._v(" "),
        _vm.form.errors.has("description")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: {
                textContent: _vm._s(_vm.form.errors.get("description"))
              }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("p", { staticClass: "input_label" }, [_vm._v("Image")]),
      _vm._v(" "),
      _c("div", { staticClass: "img_container" }, [
        _c("figure", { staticClass: "image is-2by1" }, [
          _c("img", {
            attrs: {
              src: "/storage/courses/" + _vm.current.img_src,
              alt: "Current " + _vm.form.name + " image"
            }
          })
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("div", { staticClass: "file has-name is-fullwidth" }, [
          _c("label", { staticClass: "file-label" }, [
            _c("input", {
              ref: "image",
              staticClass: "file-input",
              attrs: {
                type: "file",
                name: "image",
                accept: "image/*",
                id: "file"
              },
              on: { change: _vm.updateImg }
            }),
            _vm._v(" "),
            _vm._m(1),
            _vm._v(" "),
            _vm.imgName
              ? _c("span", { staticClass: "file-name" }, [
                  _vm._v(
                    "\n          " +
                      _vm._s(_vm.imgName.substring(0, 30)) +
                      "\n        "
                  )
                ])
              : _vm._e()
          ])
        ]),
        _vm._v(" "),
        _vm.form.errors.has("image")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("image")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "address" } }, [
          _vm._v("Address")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.address,
                expression: "form.address",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("address") },
            attrs: {
              id: "address",
              name: "address",
              type: "text",
              required: ""
            },
            domProps: { value: _vm.form.address },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "address", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(2)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("address")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("address")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "lat" } }, [
          _vm._v("Latitude")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.lat,
                expression: "form.lat",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("lat") },
            attrs: { id: "lat", name: "lat", type: "text", required: "" },
            domProps: { value: _vm.form.lat },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "lat", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(3)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("lat")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("lat")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "lng" } }, [
          _vm._v("Longitude")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.lng,
                expression: "form.lng",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("lng") },
            attrs: { id: "lng", name: "lng", type: "text", required: "" },
            domProps: { value: _vm.form.lng },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "lng", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(4)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("lng")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("lng")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "tel" } }, [
          _vm._v("Tel No.")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.tel_no,
                expression: "form.tel_no",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("tel_no") },
            attrs: { id: "tel", name: "tel_no", type: "text", required: "" },
            domProps: { value: _vm.form.tel_no },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "tel_no", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(5)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("tel_no")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("tel_no")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "website" } }, [
          _vm._v("Website URL")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.website,
                expression: "form.website",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("website") },
            attrs: {
              id: "website",
              name: "website",
              type: "text",
              placeholder: "www.domain.co.uk",
              required: ""
            },
            domProps: { value: _vm.form.website },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "website", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(6)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("website")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("website")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("p", { staticClass: "input_label" }, [_vm._v("Tags")]),
      _vm._v(" "),
      _vm.tags
        ? _c(
            "div",
            { staticClass: "field is-grouped form_tags" },
            [
              _vm._l(_vm.tags, function(tag) {
                return _c(
                  "p",
                  {
                    key: tag.id,
                    staticClass: "control",
                    attrs: {
                      role: "group",
                      "aria-label": "Course tags to ammend"
                    }
                  },
                  [
                    _c("label", { staticClass: "checkbox" }, [
                      _c("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.form.tags,
                            expression: "form.tags"
                          }
                        ],
                        attrs: { type: "checkbox", id: tag.id, name: "tags[]" },
                        domProps: {
                          value: tag.id,
                          checked: Array.isArray(_vm.form.tags)
                            ? _vm._i(_vm.form.tags, tag.id) > -1
                            : _vm.form.tags
                        },
                        on: {
                          click: function($event) {
                            _vm.form.errors.clear("tags")
                          },
                          change: function($event) {
                            var $$a = _vm.form.tags,
                              $$el = $event.target,
                              $$c = $$el.checked ? true : false
                            if (Array.isArray($$a)) {
                              var $$v = tag.id,
                                $$i = _vm._i($$a, $$v)
                              if ($$el.checked) {
                                $$i < 0 &&
                                  _vm.$set(_vm.form, "tags", $$a.concat([$$v]))
                              } else {
                                $$i > -1 &&
                                  _vm.$set(
                                    _vm.form,
                                    "tags",
                                    $$a.slice(0, $$i).concat($$a.slice($$i + 1))
                                  )
                              }
                            } else {
                              _vm.$set(_vm.form, "tags", $$c)
                            }
                          }
                        }
                      }),
                      _vm._v("\n        " + _vm._s(tag.tag_name) + "\n      ")
                    ])
                  ]
                )
              }),
              _vm._v(" "),
              _vm.form.errors.has("tags")
                ? _c("p", {
                    staticClass: "tag_error help is-danger",
                    domProps: {
                      textContent: _vm._s(_vm.form.errors.get("tags"))
                    }
                  })
                : _vm._e()
            ],
            2
          )
        : _vm._e(),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "weekCost" } }, [
          _vm._v("WeekDay Cost")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.weekday_cost,
                expression: "form.weekday_cost",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("weekday_cost") },
            attrs: {
              id: "weekCost",
              name: "weekday_cost",
              type: "text",
              placeholder: "20.50",
              required: ""
            },
            domProps: { value: _vm.form.weekday_cost },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "weekday_cost", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(7)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("weekday_cost")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: {
                textContent: _vm._s(_vm.form.errors.get("weekday_cost"))
              }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "weekendCost" } }, [
          _vm._v("Weekend Cost")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.weekend_cost,
                expression: "form.weekend_cost",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("weekendCost") },
            attrs: {
              id: "weekendCost",
              name: "weekend_cost",
              type: "text",
              placeholder: "30.50",
              required: ""
            },
            domProps: { value: _vm.form.weekend_cost },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "weekend_cost", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(8)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("weekend_cost")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: {
                textContent: _vm._s(_vm.form.errors.get("weekend_cost"))
              }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _vm._m(9)
    ]
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-golf-ball" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "file-cta" }, [
      _c("span", { staticClass: "file-icon" }, [
        _c("i", { staticClass: "fas fa-upload" })
      ]),
      _vm._v(" "),
      _c("span", { staticClass: "file-label" }, [
        _vm._v("\n            Choose a new image if required…\n          ")
      ])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-home" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-location-arrow" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-location-arrow" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-phone" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-external-link-alt" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-pound-sign" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-pound-sign" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "field" }, [
      _c("div", { staticClass: "control" }, [
        _c(
          "button",
          { staticClass: "button is-primary", attrs: { type: "submit" } },
          [_vm._v("Update →")]
        )
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-4de5d9fb", module.exports)
  }
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(62)
/* template */
var __vue_template__ = __webpack_require__(66)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/Reviews.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d93eea98", Component.options)
  } else {
    hotAPI.reload("data-v-d93eea98", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__comment_Comment__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__comment_Comment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__comment_Comment__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  name: "Reviews",
  props: ["comms"],
  components: { Comment: __WEBPACK_IMPORTED_MODULE_0__comment_Comment___default.a },
  data: function data() {
    return {
      comments: []
    };
  },

  methods: {
    updateReviews: function updateReviews(e) {
      if (e.target.value === "") return;
      switch (e.target.value) {
        case "latest":
          this.comments.sort(function (a, b) {
            return a.date > b.date ? -1 : 1;
          });
          break;
        case "oldest":
          this.comments.sort(function (a, b) {
            return a.date > b.date ? 1 : -1;
          });
          break;
        case "highest":
          this.comments.sort(function (a, b) {
            return a.rating > b.rating ? -1 : 1;
          });
          break;
        case "lowest":
          this.comments.sort(function (a, b) {
            return a.rating > b.rating ? 1 : -1;
          });
      }
    }
  },
  created: function created() {
    var _this = this;

    this.$eventBus.$on("newcomments", function (data) {
      _this.comments = data.sort(function (a, b) {
        return a.date > b.date ? -1 : 1;
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.$eventBus.$off("newcomments");
  },
  mounted: function mounted() {
    if (this.comms.length) {
      this.comments = this.comms;
    }
  }
});

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(64)
/* template */
var __vue_template__ = __webpack_require__(65)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/comment/Comment.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7dce4648", Component.options)
  } else {
    hotAPI.reload("data-v-7dce4648", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Star__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Star___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__Star__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixins__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Form__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["default"] = ({
  name: "Comment",
  props: ["comment"],
  mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins__["updateFormRating"]],
  components: {
    StarComponent: __WEBPACK_IMPORTED_MODULE_0__Star___default.a
  },
  data: function data() {
    var commentForm = new __WEBPACK_IMPORTED_MODULE_2__Form__["a" /* default */]({
      comment_id: this.comment.id,
      comment: "",
      rating: 0
    }, this.comment);
    return {
      form: commentForm,
      editMode: false,
      confirmModal: false
    };
  },

  filters: {
    stars: function stars(num) {
      return "★".repeat(num) + "☆".repeat(5 - num);
    }
  },
  methods: {
    updateMsg: function updateMsg() {
      var _this = this;

      if (this.form.comment.length < 7) {
        this.form.errors.recordOne({
          name: "comment",
          message: "The comment field is required, with at least 7 characters"
        });
      }

      if (this.form.rating < 1 || this.form.rating > 5) {
        this.form.errors.recordOne({
          name: "rating",
          message: "A star rating of between 1 and 5 is required"
        });
      }

      if (this.form.isSet() && !this.form.errors.any()) {
        var formData = this.form.data();
        this.form.post("/api/courses/comments/update").then(function (data) {
          _this.$eventBus.$emit("newcomments", data);
          _this.$eventBus.$emit("msg", {
            status: "is-success",
            header: "Success",
            message: "Your message has been updated"
          });
          _this.editMode = false;
          _this.form.comment_id = formData.comment_id;
          _this.form.comment = formData.comment;
          _this.form.rating = formData.rating;
        });
      }
    },
    deleteMsg: function deleteMsg() {
      this.form.post("/api/courses/comments/delete").then(function () {
        location.reload();
      }).catch(function (err) {
        console.warn(err);
      });
    }
  }
});

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "course_review" },
    [
      _c("div", { staticClass: "review_body" }, [
        _c("div", { staticClass: "review_header" }, [
          !_vm.editMode
            ? _c("div", { staticClass: "review_user" }, [
                _c("img", {
                  staticClass: "gravatar",
                  attrs: { src: _vm.comment.gravatar, alt: "User Gravitar" }
                }),
                _vm._v(" "),
                _c("p", [_vm._v(_vm._s(_vm.comment.username))])
              ])
            : _c("div", { staticClass: "review_edit_msg" }, [
                _c("p", [_vm._v("Please update your comment")])
              ]),
          _vm._v(" "),
          !_vm.editMode
            ? _c("div", { staticClass: "review_rating" }, [
                _vm._v(_vm._s(_vm._f("stars")(_vm.comment.rating)))
              ])
            : _c(
                "div",
                { staticClass: "review_rating" },
                [
                  _c("star-component", {
                    attrs: { default: _vm.comment.rating },
                    on: { selected: _vm.updateRating }
                  })
                ],
                1
              ),
          _vm._v(" "),
          !_vm.editMode
            ? _c("div", { staticClass: "review_time" }, [
                _vm._v(_vm._s(_vm.comment.updated_at))
              ])
            : _vm._e()
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "user_review" }, [
          !_vm.editMode
            ? _c("p", [_vm._v(_vm._s(_vm.comment.comment))])
            : _c(
                "div",
                [
                  _c("div", { staticClass: "field" }, [
                    _c("div", { staticClass: "control" }, [
                      _c("textarea", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model.trim",
                            value: _vm.form.comment,
                            expression: "form.comment",
                            modifiers: { trim: true }
                          }
                        ],
                        staticClass: "textarea",
                        attrs: { name: "comment", id: "comment" },
                        domProps: { value: _vm.form.comment },
                        on: {
                          keydown: function($event) {
                            _vm.form.errors.clear("comment")
                          },
                          input: function($event) {
                            if ($event.target.composing) {
                              return
                            }
                            _vm.$set(
                              _vm.form,
                              "comment",
                              $event.target.value.trim()
                            )
                          },
                          blur: function($event) {
                            _vm.$forceUpdate()
                          }
                        }
                      })
                    ])
                  ]),
                  _vm._v(" "),
                  _vm._l(_vm.form.errors.all(), function(err, index) {
                    return _vm.form.errors.any()
                      ? _c("p", {
                          key: index,
                          staticClass: "help is-danger",
                          domProps: {
                            textContent: _vm._s(_vm.form.errors.get(err))
                          }
                        })
                      : _vm._e()
                  }),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "field is-grouped is-grouped-right" },
                    [
                      _c("div", { staticClass: "control" }, [
                        _c(
                          "a",
                          {
                            staticClass: "button is-primary",
                            on: { click: _vm.updateMsg }
                          },
                          [_vm._v("Save")]
                        )
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass: "control",
                          on: {
                            click: function($event) {
                              _vm.editMode = false
                            }
                          }
                        },
                        [
                          _c("a", { staticClass: "button is-light" }, [
                            _vm._v("Cancel")
                          ])
                        ]
                      )
                    ]
                  )
                ],
                2
              )
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "review_edit" }, [
        _vm.comment.canEdit && !_vm.editMode
          ? _c("div", [
              _c(
                "div",
                {
                  attrs: { "aria-label": "Edit" },
                  on: {
                    click: function($event) {
                      _vm.editMode = true
                    }
                  }
                },
                [
                  _vm._v("Edit Review"),
                  _c("i", {
                    staticClass: "fas fa-pencil-alt fa-lg has-text-link",
                    attrs: { "aria-hidden": "true" }
                  })
                ]
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  attrs: { "aria-label": "Delete" },
                  on: {
                    click: function($event) {
                      _vm.confirmModal = true
                    }
                  }
                },
                [
                  _vm._v("Delete Review"),
                  _c("i", {
                    staticClass: "fas fa-trash-alt fa-lg has-text-danger",
                    attrs: { "aria-hidden": "true" }
                  })
                ]
              )
            ])
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("transition", { attrs: { name: "fade" } }, [
        _vm.confirmModal
          ? _c("div", { staticClass: "review_delete modal is-active" }, [
              _c("div", { staticClass: "modal-background" }),
              _vm._v(" "),
              _c("div", { staticClass: "modal-content" }, [
                _c("p", { staticClass: "has-text-centered" }, [
                  _vm._v("Are you sure you want to delete your comment?")
                ]),
                _vm._v(" "),
                _c(
                  "div",
                  { staticClass: "field is-grouped is-grouped-centered" },
                  [
                    _c("div", { staticClass: "control" }, [
                      _c(
                        "a",
                        {
                          staticClass: "button is-danger",
                          on: { click: _vm.deleteMsg }
                        },
                        [_vm._v("Delete Message")]
                      )
                    ]),
                    _vm._v(" "),
                    _c(
                      "div",
                      {
                        staticClass: "control",
                        on: {
                          click: function($event) {
                            _vm.confirmModal = false
                          }
                        }
                      },
                      [
                        _c("a", { staticClass: "button is-light" }, [
                          _vm._v("Cancel")
                        ])
                      ]
                    )
                  ]
                )
              ])
            ])
          : _vm._e()
      ])
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7dce4648", module.exports)
  }
}

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm.comments.length
    ? _c(
        "div",
        { staticClass: "course_reviews_section" },
        [
          _c("div", { staticClass: "level" }, [
            _c("h3", [_vm._v("User Reviews")]),
            _vm._v(" "),
            _c("div", { staticClass: "control" }, [
              _c("div", { staticClass: "select" }, [
                _c(
                  "select",
                  {
                    attrs: { "aria-label": "Sort Reviews" },
                    on: { change: _vm.updateReviews }
                  },
                  [
                    _c("option", { attrs: { value: "" } }, [
                      _vm._v("Order Reviews")
                    ]),
                    _vm._v(" "),
                    _c("option", { attrs: { value: "latest" } }, [
                      _vm._v("Latest")
                    ]),
                    _vm._v(" "),
                    _c("option", { attrs: { value: "oldest" } }, [
                      _vm._v("Oldest")
                    ]),
                    _vm._v(" "),
                    _c("option", { attrs: { value: "highest" } }, [
                      _vm._v("Highest")
                    ]),
                    _vm._v(" "),
                    _c("option", { attrs: { value: "lowest" } }, [
                      _vm._v("Lowest")
                    ])
                  ]
                )
              ])
            ])
          ]),
          _vm._v(" "),
          _c(
            "transition-group",
            {
              staticClass: "course_reviews",
              attrs: {
                name: "transition_comments",
                tag: "div",
                "aria-live": "polite",
                "aria-relevant": "additions removals"
              }
            },
            _vm._l(_vm.comments, function(comment) {
              return _c("comment", {
                key: comment.id,
                attrs: { comment: comment }
              })
            })
          )
        ],
        1
      )
    : _c("div", { staticClass: "course_reviews_section" })
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-d93eea98", module.exports)
  }
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(68)
/* template */
var __vue_template__ = __webpack_require__(69)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/Bookmark.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5dd2936d", Component.options)
  } else {
    hotAPI.reload("data-v-5dd2936d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "Bookmark",
  props: ["courseid", "saved"],
  data: function data() {
    return {
      isSaved: false
    };
  },

  computed: {
    icon: function icon() {
      return this.isSaved ? "fas" : "far";
    }
  },
  methods: {
    updateBookmark: function updateBookmark() {
      var _this = this;

      var uri = "/api/courses/bookmark" + (this.isSaved ? "/delete" : "");

      axios.post(uri, {
        course_id: this.courseid
      }).then(function (res) {
        _this.isSaved = res.data.includes(_this.courseid);
      }).catch(function (err) {
        console.warn(err);
      });
    }
  },
  mounted: function mounted() {
    this.isSaved = this.saved;
  }
});

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      ref: "bookmark",
      staticClass: "bookmark",
      on: {
        click: function($event) {
          $event.preventDefault()
          return _vm.updateBookmark($event)
        }
      }
    },
    [_c("i", { class: [_vm.icon, "fa-bookmark", "fa-3x"] })]
  )
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5dd2936d", module.exports)
  }
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(71)
/* template */
var __vue_template__ = __webpack_require__(72)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/auth/Register.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5f3035c3", Component.options)
  } else {
    hotAPI.reload("data-v-5f3035c3", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Form__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixins__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  name: "Register",
  props: ["old", "errors"],
  mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins__["validateEmail"]],
  data: function data() {
    var loginForm = new __WEBPACK_IMPORTED_MODULE_0__Form__["a" /* default */]({
      username: "",
      email: "",
      password: "",
      password_confirm: ""
    }, this.old);
    loginForm.errors.record(this.errors);
    return {
      form: loginForm
    };
  },

  methods: {
    checkForm: function checkForm(e) {
      var _form$data = this.form.data(),
          password = _form$data.password,
          password_confirm = _form$data.password_confirm,
          username = _form$data.username,
          email = _form$data.email;

      if (password !== password_confirm) {
        this.form.errors.recordOne({
          name: "password",
          message: "The passwords do not match"
        });
      }

      if (password.length < 6) {
        this.form.errors.recordOne({
          name: "password",
          message: "The password must be at least 7 characters."
        });
      }

      if (username.length < 6) {
        this.form.errors.recordOne({
          name: "username",
          message: "The username must be at least 7 characters."
        });
      }

      if (email.length < 6 || !this.checkEmail(email)) {
        this.form.errors.recordOne({
          name: "email",
          message: "Please enter a valid email address"
        });
      }

      if (this.form.isSet() && this.form.errors.any()) {
        e.preventDefault();
      }
    }
  }
});

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "form",
    {
      staticClass: "form",
      attrs: { method: "POST", action: "/register" },
      on: {
        submit: _vm.checkForm,
        keydown: function($event) {
          _vm.form.errors.clear($event.target.name)
          _vm.form.errors.clear("credentials")
        }
      }
    },
    [
      _c("input", {
        attrs: { type: "hidden", name: "_token" },
        domProps: { value: this.$root.token }
      }),
      _vm._v(" "),
      _c("h1", [_vm._v("Register")]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "username" } }, [
          _vm._v("Username")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.username,
                expression: "form.username",
                modifiers: { trim: true }
              }
            ],
            ref: "username",
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("username") },
            attrs: {
              id: "username",
              name: "username",
              type: "text",
              placeholder: "Username",
              required: ""
            },
            domProps: { value: _vm.form.username },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "username", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(0)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("username")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("username")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "email" } }, [
          _vm._v("E-Mail")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.email,
                expression: "form.email",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("email") },
            attrs: {
              id: "email",
              name: "email",
              type: "email",
              placeholder: "Email",
              required: ""
            },
            domProps: { value: _vm.form.email },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "email", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(1)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("email")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("email")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "password" } }, [
          _vm._v("Password")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.password,
                expression: "form.password",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("password") },
            attrs: {
              id: "password",
              name: "password",
              type: "password",
              placeholder: "Password",
              required: ""
            },
            domProps: { value: _vm.form.password },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "password", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(2)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("password")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("password")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c(
          "label",
          { staticClass: "label", attrs: { for: "password-confirm" } },
          [_vm._v("Confirm Password")]
        ),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.password_confirm,
                expression: "form.password_confirm",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            attrs: {
              id: "password-confirm",
              name: "password_confirmation",
              type: "password",
              placeholder: "Confirm Password",
              required: ""
            },
            domProps: { value: _vm.form.password_confirm },
            on: {
              focus: function($event) {
                _vm.form.errors.clear("password")
              },
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(
                  _vm.form,
                  "password_confirm",
                  $event.target.value.trim()
                )
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(3)
        ])
      ]),
      _vm._v(" "),
      _vm._m(4)
    ]
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-user" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-envelope" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-lock" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-lock" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "field" }, [
      _c("div", { staticClass: "control" }, [
        _c(
          "button",
          { staticClass: "button is-primary", attrs: { type: "submit" } },
          [_vm._v("Register →")]
        )
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-5f3035c3", module.exports)
  }
}

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(74)
/* template */
var __vue_template__ = __webpack_require__(75)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/auth/Login.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dca5370e", Component.options)
  } else {
    hotAPI.reload("data-v-dca5370e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Form__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__mixins__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  name: "Login",
  props: ["old", "errors"],
  mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins__["validateEmail"]],
  data: function data() {
    var loginForm = new __WEBPACK_IMPORTED_MODULE_0__Form__["a" /* default */]({
      email: "",
      password: ""
    }, this.old);
    loginForm.errors.record(this.errors);

    return {
      form: loginForm
    };
  },

  methods: {
    checkForm: function checkForm(e) {
      var _form$data = this.form.data(),
          email = _form$data.email;

      if (email.length < 6 || !this.checkEmail(email)) {
        this.form.errors.recordOne({
          name: "email",
          message: "Please enter a valid email address"
        });
      }

      if (this.form.isSet() && this.form.errors.any()) {
        e.preventDefault();
      }
    }
  }
});

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "form",
    {
      staticClass: "form",
      attrs: { method: "POST", action: "/login" },
      on: {
        submit: _vm.checkForm,
        keydown: function($event) {
          _vm.form.errors.clear($event.target.name)
          _vm.form.errors.clear("credentials")
        }
      }
    },
    [
      _c("input", {
        attrs: { type: "hidden", name: "_token" },
        domProps: { value: this.$root.token }
      }),
      _vm._v(" "),
      _c("h1", [_vm._v("Login")]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "email" } }, [
          _vm._v("E-Mail")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.email,
                expression: "form.email",
                modifiers: { trim: true }
              }
            ],
            ref: "email",
            staticClass: "input",
            class: {
              "is-danger":
                _vm.form.errors.has("email") ||
                _vm.form.errors.has("credentials")
            },
            attrs: {
              id: "email",
              name: "email",
              type: "email",
              placeholder: "Email",
              required: ""
            },
            domProps: { value: _vm.form.email },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "email", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(0)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("credentials")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: {
                textContent: _vm._s(_vm.form.errors.get("credentials"))
              }
            })
          : _vm._e(),
        _vm._v(" "),
        _vm.form.errors.has("email")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("email")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "field" }, [
        _c("label", { staticClass: "label", attrs: { for: "password" } }, [
          _vm._v("Password")
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "control has-icons-left" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model.trim",
                value: _vm.form.password,
                expression: "form.password",
                modifiers: { trim: true }
              }
            ],
            staticClass: "input",
            class: { "is-danger": _vm.form.errors.has("password") },
            attrs: {
              id: "password",
              name: "password",
              type: "password",
              placeholder: "Password",
              required: ""
            },
            domProps: { value: _vm.form.password },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(_vm.form, "password", $event.target.value.trim())
              },
              blur: function($event) {
                _vm.$forceUpdate()
              }
            }
          }),
          _vm._v(" "),
          _vm._m(1)
        ]),
        _vm._v(" "),
        _vm.form.errors.has("password")
          ? _c("p", {
              staticClass: "help is-danger",
              domProps: { textContent: _vm._s(_vm.form.errors.get("password")) }
            })
          : _vm._e()
      ]),
      _vm._v(" "),
      _vm._m(2),
      _vm._v(" "),
      _vm._m(3)
    ]
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-envelope" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "icon is-small is-left" }, [
      _c("i", { staticClass: "fas fa-lock" })
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "field flex" }, [
      _c("label", { staticClass: "checkbox" }, [
        _c("input", { attrs: { type: "checkbox", name: "remember" } }),
        _vm._v(" Remember Me\n      ")
      ]),
      _vm._v(" "),
      _c(
        "a",
        { staticClass: "pass_link", attrs: { href: "/password/reset" } },
        [_vm._v("Forgot Your Password?")]
      )
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "field" }, [
      _c("div", { staticClass: "control" }, [
        _c(
          "button",
          { staticClass: "button is-primary", attrs: { type: "submit" } },
          [_vm._v("Login")]
        )
      ])
    ])
  }
]
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-dca5370e", module.exports)
  }
}

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

var disposed = false
var normalizeComponent = __webpack_require__(1)
/* script */
var __vue_script__ = __webpack_require__(77)
/* template */
var __vue_template__ = __webpack_require__(78)
/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __vue_script__,
  __vue_template__,
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "resources/assets/js/components/Modal.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6e8d36f4", Component.options)
  } else {
    hotAPI.reload("data-v-6e8d36f4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

module.exports = Component.exports


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "Modal",
  data: function data() {
    return {};
  }
});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("transition", { attrs: { name: "fade" } }, [
    _vm.$root.showModal
      ? _c(
          "article",
          { staticClass: "modal_msg message", class: _vm.$root.status },
          [
            _c("div", { staticClass: "message-header" }, [
              _c("p", [_vm._v(_vm._s(_vm.$root.header))])
            ]),
            _vm._v(" "),
            _c("div", { staticClass: "message-body" }, [
              _vm._v("\n      " + _vm._s(_vm.$root.message) + "\n    ")
            ])
          ]
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true
module.exports = { render: render, staticRenderFns: staticRenderFns }
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-6e8d36f4", module.exports)
  }
}

/***/ }),
/* 79 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
],[14]);