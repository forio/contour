(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["d3"], factory);
	else if(typeof exports === 'object')
		exports["Contour"] = factory(require("d3"));
	else
		root["Contour"] = factory(root["d3"]);
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.warning = exports.getCentroid = exports.getStyle = exports.selectDom = exports.isSupportedDataFormat = exports.maxTickValues = exports.sum = exports.stackLayout = exports.normalizeSeries = exports.isCorrectSeriesFormat = exports.isCorrectDataFormat = exports.mergeArrays = exports.dateDiff = exports.textBounds = exports.getTicksThatFit = exports.doXLabelsFit = exports.calcXLabelsWidths = exports.niceTicks = exports.extractScaleDomain = exports.niceMinMax = exports.roundToNextTick = exports.niceRound = exports.linearRegression = exports.translatePoint = exports.rotatePoint = exports.radToDeg = exports.degToRad = exports.clampRight = exports.clampLeft = exports.clamp = exports.log10 = exports.decDigits = exports.digits = exports.trunc = exports.roundTo = exports.roundToNearest = exports.firstAndLast = exports.warn = exports.minMaxFilter = exports.cleanNullValues = exports.materialize = exports.seriesNameToClass = exports.getValue = exports.omit = exports.intersection = exports.compact = exports.flatten = exports.uniq = exports.range = exports.isString = exports.isNumber = exports.isDate = exports.isObjectLike = exports.isObject = exports.partialRight = exports.partial = exports.noop = exports.merge = exports.defaults = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = __webpack_require__(14);

Object.defineProperty(exports, 'defaults', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_lodash).default;
    }
});

var _lodash2 = __webpack_require__(15);

Object.defineProperty(exports, 'merge', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_lodash2).default;
    }
});

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// cheap trick to add decimals without hitting javascript issues
// note that this fails for very large numbers
var multiplier = function multiplier(x) {
    var dig = decDigits(x);return dig === 0 ? 1 : Math.pow(10, dig);
};
var maxMultiplier = function maxMultiplier(a, b) {
    return Math.max(multiplier(a), multiplier(b));
};
var addFloat = function addFloat(a, b) {
    var factor = maxMultiplier(a, b),
        aa = Math.round(a * factor),
        bb = Math.round(b * factor);return (aa + bb) / factor;
};
var subFloat = function subFloat(a, b) {
    var factor = maxMultiplier(a, b),
        aa = Math.round(a * factor),
        bb = Math.round(b * factor);return (aa - bb) / factor;
};
var mulFloat = function mulFloat(a, b) {
    var factor = maxMultiplier(a, b),
        aa = Math.round(a * factor),
        bb = Math.round(b * factor);return aa * bb / (factor * factor);
};
var divFloat = function divFloat(a, b) {
    var factor = maxMultiplier(a, b),
        aa = Math.round(a * factor),
        bb = Math.round(b * factor);return aa / bb;
};

var root = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : global;

// jshint -W079
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var toString = objectProto.toString;

// jshint undef:false
var symToStringTag = typeof Symbol !== 'undefined' ? Symbol.toStringTag : undefined;

function baseGetTag(value) {
    if (value == null) {
        return value === undefined ? '[object Undefined]' : '[object Null]';
    }

    if (!(symToStringTag && symToStringTag in Object(value))) {
        return toString.call(value);
    }

    var isOwn = hasOwnProperty.call(value, symToStringTag);
    var tag = value[symToStringTag];
    var unmasked = false;

    try {
        value[symToStringTag] = undefined;
        unmasked = true;
    } catch (e) {}

    var result = toString.call(value);
    if (unmasked) {
        if (isOwn) {
            value[symToStringTag] = tag;
        } else {
            delete value[symToStringTag];
        }
    }
    return result;
}

var noop = exports.noop = function noop() {};

var partial = exports.partial = function partial(fn /*args*/) {
    // prevent leaking arguments object outside of the current scope
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    var args = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; ++i) {
        args[i - 1] = arguments[i];
    }

    return function () {
        var newArgs = new Array(arguments.length);
        for (var i = 0; i < arguments.length; ++i) {
            newArgs[i] = arguments[i];
        }

        var fullArgs = args.concat(newArgs);
        return fn.apply(this, fullArgs);
    };
};

var partialRight = exports.partialRight = function partialRight(fn /*, args */) {
    // prevent leaking arguments object outside of the current scope
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    var args = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; ++i) {
        args[i - 1] = arguments[i];
    }

    return function () {
        var newArgs = new Array(arguments.length);
        for (var i = 0; i < arguments.length; ++i) {
            newArgs[i] = arguments[i];
        }

        var fullArgs = newArgs.concat(args);
        return fn.apply(this, fullArgs);
    };
};

var isObject = exports.isObject = function isObject(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
    return value != null && (type === 'object' || type === 'function');
};

var isObjectLike = exports.isObjectLike = function isObjectLike(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
};

var isDate = exports.isDate = function isDate(value) {
    return isObjectLike(value) && baseGetTag(value) === '[object Date]';
};

var isNumber = exports.isNumber = function isNumber(value) {
    return typeof value === 'number' || isObjectLike(value) && baseGetTag(value) === '[object Number]';
};

var isString = exports.isString = function isString(value) {
    return typeof value === 'string' || value instanceof String;
};

var range = exports.range = function range(start, end, step) {
    if (arguments.length === 1) {
        var t = start;
        start = 0;
        end = t;
    }

    step = step || (end >= start ? 1 : -1);
    var index = -1;
    var length = Math.max(Math.ceil((end - start) / (step || 1)), 0);
    var result = new Array(length);

    while (length--) {
        result[++index] = start;
        start += step;
    }
    return result;
};

// return the uniq elements in the array
// we are implementing our own version since this algorithm seems
// to be a lot faster than what lodash uses
var uniq = exports.uniq = function uniq(array) {
    if (array == null || !array.length) return [];
    var cache = {},
        result = [];
    var len = array.length;

    for (var j = 0; j < len; j++) {
        var el = array[j],
            key = el + '';

        if (!cache.hasOwnProperty(key)) {
            cache[key] = true;
            result.push(el);
        }
    }

    return result;
};

var flatten = exports.flatten = function flatten(array) {
    if (!array || !array.length) {
        return [];
    }

    return array.reduce(function (acc, cur) {
        return acc.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
};

var compact = exports.compact = function compact(array) {
    if (!array || !array.length) {
        return [];
    }

    return array.reduce(function (acc, cur) {
        if (cur) {
            acc.push(cur);
        }
        return acc;
    }, []);
};

var intersection = exports.intersection = function intersection(a, b) {
    if (!a || !b) return [];
    if (!a.length || !b.length) return [];

    var map = b.reduce(function (acc, cur) {
        acc[cur] = true;
        return acc;
    }, {});

    return a.reduce(function (acc, cur) {
        if (map[cur]) {
            acc.push(cur);
            delete map[cur];
        }

        return acc;
    }, []);
};

var omit = exports.omit = function omit(src, props) {
    if (!src || Object.prototype.toString.call(src) !== '[object Object]') {
        return src;
    }

    var index = [].concat(props).reduce(function (acc, prop) {
        return acc[prop] = true, acc;
    }, {});

    var res = {};
    Object.keys(src).forEach(function (prop) {
        if (!index[prop]) {
            res[prop] = src[prop];
        }
    });

    return res;
};

// the src is a function returns the function evaluated
// otherwise returns src
var getValue = exports.getValue = function getValue(src, deafult, ctx, args) {
    args = Array.prototype.slice.call(arguments, 3);
    return !src ? deafult : typeof src === 'function' ? src.apply(ctx, args) : src;
};

var seriesNameToClass = exports.seriesNameToClass = function seriesNameToClass(name) {
    return name || '';
};

var materialize = exports.materialize = function materialize(object, ctx, options, curPath) {

    var isDom = function isDom(obj) {
        return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.nodeType === 1 && _typeof(obj.style) === 'object' && _typeof(obj.ownerDocument) === 'object';
    };
    var skipList = (options || {}).skip || [];

    var shouldSkip = function shouldSkip(path) {
        return skipList.some(function (e) {
            if (!e) return false;
            if ((typeof e === 'undefined' ? 'undefined' : _typeof(e)) === 'object' && e instanceof RegExp) {
                return e.test(path);
            }

            return e.toString() === path;
        });
    };

    if (object == null) {
        return object;
    } else if (Array.isArray(object)) {
        return object;
    }if (isDom(object)) {
        return object;
    } else if (typeof object === 'function') {
        return getValue(object, null, ctx);
    } else if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
        return Object.keys(object).reduce(function (prev, key) {
            var curKeyPath = curPath ? curPath + '.' + key : key;
            var expectsParam = typeof object[key] === 'function' && !!object[key].length;
            var shouldMaterialize = !shouldSkip(curKeyPath) && !expectsParam;

            if (expectsParam && !shouldSkip(curKeyPath)) {
                console.warn('The funciton "' + curKeyPath + '" expects parameters and will not be resolved to a value before the render starts. It is assumed to be used inside a visualization. Add this function to the "skip" list to remove this message.');
            }

            if (shouldMaterialize) {
                prev[key] = materialize(object[key], ctx, options, curKeyPath);
            } else {
                prev[key] = object[key];
            }
            return prev;
        }, {});
    } else {
        return object;
    }
};

var cleanNullValues = exports.cleanNullValues = function cleanNullValues() {
    return function (series) {
        return series.map(function (s) {
            return Object.assign(s, {
                data: s.data.reduce(function (acum, datum) {
                    if (datum.y != null) {
                        acum.push(datum);
                    }

                    return acum;
                }, [])
            });
        });
    };
};

var minMaxFilter = exports.minMaxFilter = function minMaxFilter(desiredLen) {
    return function (data) {
        if (data.length <= desiredLen) return data;

        var toReturn = [data[0]]; //always want the first
        var index = 1;
        var increment = Math.floor(data.length / desiredLen);

        while (index < data.length - 1) {
            var hasValidPt = false;
            var maxPt;
            var minPt;
            var maxIndex = Math.min(index + increment, data.length);

            for (var intermediateIndex = index; intermediateIndex < maxIndex; intermediateIndex++) {
                var intermediatePt = data[index];
                if (intermediatePt.y) {
                    if (!hasValidPt || intermediatePt.y > maxPt.y) maxPt = intermediatePt;

                    if (!hasValidPt || intermediatePt.y < minPt.y) minPt = intermediatePt;

                    hasValidPt = true;
                }
            }

            if (hasValidPt) {
                if (minPt.x === maxPt.x) {
                    toReturn.push(minPt);
                } else if (minPt.x < maxPt.x) {
                    toReturn.push(minPt);
                    toReturn.push(maxPt);
                } else if (minPt.x > maxPt.x) {
                    toReturn.push(maxPt);
                    toReturn.push(minPt);
                }
            }

            index += Math.max(1, Math.min(data.length - 1 - index, increment));
        }
        toReturn.push(data[data.length - 1]); //always want the last
        return toReturn;
    };
};

var warn = exports.warn = function warn(msg) {
    if (console && console.log) console.log(msg);
};

var firstAndLast = exports.firstAndLast = function firstAndLast(ar) {
    return [ar[0], ar[ar.length - 1]];
};

var roundToNearest = exports.roundToNearest = function roundToNearest(number, multiple) {
    return mulFloat(Math.ceil(divFloat(number, multiple)), multiple);
};

var roundTo = exports.roundTo = function roundTo(value, digits) {
    return divFloat(Math.ceil(mulFloat(value, Math.pow(10, digits))), Math.pow(10, digits));
};

var trunc = exports.trunc = function trunc(value) {
    return value - value % 1;
};

// only works for integers
var digits = exports.digits = function digits(value) {
    var str = Math.abs(value).toString();
    var parts = str.split('e');
    if (parts.length === 2) {
        return Math.max(0, parts[1]) + 1;
    }
    parts = str.split('.');
    return parts[0].length;
};

var decDigits = exports.decDigits = function decDigits(value) {
    var str = Math.abs(value).toString();
    var parts = str.split('.');
    if (parts.length === 2) {
        return parts[1].length;
    }
    parts = str.split('e');
    if (parts.length === 2) {
        return -Math.min(0, parts[1]);
    }
    return 0;
};

var log10 = exports.log10 = function log10(value) {
    return Math.log(value) / Math.LN10;
};

var clamp = exports.clamp = function clamp(val, l, h) {
    return val > h ? h : val < l ? l : val;
};

var clampLeft = exports.clampLeft = function clampLeft(val, low) {
    return val < low ? low : val;
};

var clampRight = exports.clampRight = function clampRight(val, high) {
    return val > high ? high : val;
};

var degToRad = exports.degToRad = function degToRad(deg) {
    return deg * Math.PI / 180;
};

var radToDeg = exports.radToDeg = function radToDeg(rad) {
    return rad * 180 / Math.PI;
};

var rotatePoint = exports.rotatePoint = function rotatePoint(point, rad) {
    return {
        x: point.x * Math.cos(rad) - point.y * Math.sin(rad),
        y: point.x * Math.sin(rad) + point.y * Math.cos(rad)
    };
};

var translatePoint = exports.translatePoint = function translatePoint(point, delta) {
    return {
        x: point.x + delta.x,
        y: point.y + delta.y
    };
};

var linearRegression = exports.linearRegression = function linearRegression(dataSrc) {
    var lr = {};
    var n = dataSrc.length;
    var sum_x = 0;
    var sum_y = 0;
    var sum_xy = 0;
    var sum_xx = 0;
    var sum_yy = 0;

    for (var i = 0; i < n; i++) {
        sum_x += dataSrc[i].x;
        sum_y += dataSrc[i].y;
        sum_xy += dataSrc[i].x * dataSrc[i].y;
        sum_xx += dataSrc[i].x * dataSrc[i].x;
        sum_yy += dataSrc[i].y * dataSrc[i].y;
    }

    lr.slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr.intercept = (sum_y - lr.slope * sum_x) / n;
    lr.r2 = Math.pow((n * sum_xy - sum_x * sum_y) / Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)), 2);

    return lr;
};

var niceRound = exports.niceRound = function niceRound(val) {
    // for now just round(10% above the value)
    return Math.ceil(val + val * 0.10);

    // var digits = Math.floor(Math.log(val) / Math.LN10) + 1;
    // var fac = Math.pow(10, digits);

    // if(val < 1) return roundToNearest(val, 1);

    // if(val < fac / 2) return roundToNearest(val, fac / 2);

    // return roundToNearest(val, fac);
};

var roundToNextTick = exports.roundToNextTick = function roundToNextTick(num) {
    var abs = Math.abs(num);
    var sign = abs === num ? 1 : -1;
    var mag, step;
    if (abs >= 1) {
        mag = Math.floor(log10(abs));
        step = mag <= 1 ? 2 : Math.pow(10, mag - 1);
    } else {

        var exp = abs.toExponential().replace(/\.|e-\d+$/g, '');
        mag = exp.length;
        step = mulFloat(mag === 1 ? 2 : 10, Math.pow(10, -mag));
    }

    var raw = roundToNearest(abs, step);
    return sign * raw;
};

var niceMinMax = exports.niceMinMax = function niceMinMax(min, max, ticks, startAtZero) {
    // return divFloat(Math.ceil(mulFloat(value, Math.pow(10, digits))), Math.pow(10, digits));

    // check for errors... min cannot be > max
    if (min > max) {
        return {
            min: min,
            max: min,
            tickValues: []
        };
    }

    var swap = max < 0 && min < 0;
    var origMax = max;
    if (swap) {
        max = -min;
        min = -origMax;
    }

    // 2 ticks seem to work for min max and passing 5 ticks to d3
    ticks = ticks == null ? 2 : Math.max(1, ticks);
    // if ticks is an array, use that as order of preferred ticks; otherwise return a
    // variable number of ticks in order to keep values round
    if (isNumber(ticks)) {
        // for 1, check [1]
        // for 2, check [2, 1]
        // for 3, check [3, 2]
        // for 4, check [4, 5, 3]
        // for 5, check [5, 6, 4, 3]
        // for 6, check [6, 7, 5, 4]
        // for 7, check [7, 8, 6, 5]
        // for 8, check [8, 9, 10, 7, 6]
        // for 9, check [9, 10, 11, 8, 7, 6]
        // for 10, check [10, 11, 12, 9, 8, 7]
        ticks = range(ticks, ticks * 1.28).concat(range(ticks - 1, (ticks - 1) * 0.72, -1));
    }

    if (startAtZero == null) {
        startAtZero = min === 0 || origMax < 0;
    }

    var exponent;
    if (min === max) {
        if (max === 0) {
            exponent = -1.0;
        } else {
            exponent = log10(Math.abs(max));
        }
    } else {
        if (startAtZero) {
            exponent = log10(Math.abs(max)) - 0.5;
        } else {
            exponent = log10(max - min) - 0.5;
        }
    }

    var defaultRounding = -(exponent >= 0 ? trunc(exponent) : Math.floor(exponent));

    // var defaultRounding = -trunc((min === max ?
    //     max === 0 ? -1.0 : log10(Math.abs(max)) :
    //     startAtZero ? log10(Math.abs(max)) : log10(max-min)
    // ) - 0.5);

    var excelRoundUp = function excelRoundUp(value, up) {
        up = up != null ? up : 0;
        var roundFn = function roundFn(v) {
            return v >= 0 ? Math.ceil(v) : Math.floor(v);
        };
        return divFloat(roundFn(value * Math.pow(10, up)), Math.pow(10, up));
    };

    var nice = function nice(ticks) {
        var negativeMinAmount = excelRoundUp(Math.max(0, -min) / ticks, defaultRounding - 1);

        var intermediateMax = min === max ? max === 0 ? 1 : excelRoundUp(max + negativeMinAmount, defaultRounding) : excelRoundUp(max + negativeMinAmount, defaultRounding);

        var iMin = 0;
        if (!startAtZero && min !== max) {
            var inter = min + negativeMinAmount;
            var dig = digits(inter);
            var roundToDigits;
            if (inter > 0) {
                roundToDigits = -Math.floor(log10(inter));
            } else {
                roundToDigits = Math.max(1, Math.abs(dig - 2));
            }

            iMin = -roundTo(-inter, roundToDigits);
            iMin = iMin === 0 ? 0 : iMin;
            // old version:
            // iMin = excelRound(min + negativeMinAmount, defaultRounding + (min < 0 ? 1 : 0))
        }

        var intermediateMin = iMin;

        var interval = excelRoundUp(divFloat(subFloat(intermediateMax, intermediateMin), ticks), defaultRounding);
        var finalMin = subFloat(intermediateMin, negativeMinAmount);
        var finalMax = addFloat(finalMin, mulFloat(ticks, interval));
        var ticksValues = [finalMin];
        var prevTick = finalMin;

        for (var j = 1; j < ticks; j++) {
            var newTick = addFloat(prevTick, interval);

            ticksValues.push(newTick);
            prevTick = newTick;
        }

        // total ticks are going to be either ticks or ticks + 1
        if (Math.abs(prevTick - finalMax) > 1e-10) {
            ticksValues.push(finalMax);
        }

        return {
            min: swap ? -finalMax : finalMin,
            max: swap ? -finalMin : finalMax,
            tickValues: ticksValues.map(function (a) {
                return swap ? -a : a;
            })
        };
    };

    var defaultMinMax;
    var minMax;

    var foundSomethingRound = ticks.some(function (ticks) {
        minMax = nice(ticks);
        defaultMinMax = defaultMinMax || minMax;
        return minMax.tickValues.every(function (tick) {
            return tick === Math.round(tick);
        });
    });
    return foundSomethingRound ? minMax : defaultMinMax;
};

var extractScaleDomain = exports.extractScaleDomain = function extractScaleDomain(domain, min, max, ticks, zeroAnchor) {
    var dataMin = min != null ? min : Math.min.apply(null, domain);
    var dataMax = max != null ? max : Math.max.apply(null, domain);
    ticks = ticks == null ? 5 : ticks;

    var niced = niceMinMax(dataMin, dataMax, ticks, zeroAnchor);

    // return [niced.min, niced.max];

    // // we want null || undefined for all this comparasons
    // // that == null gives us
    if (min == null && max == null) {
        return [niced.min, niced.max];
    }

    if (min == null) {
        return [Math.min(niced.min, max), max];
    }

    if (max == null) {
        return [min, Math.max(min, niced.max)];
    }

    return [min, max];
};

var niceTicks = exports.niceTicks = function niceTicks(min, max, ticks, zeroAnchor, domain) {
    ticks = ticks == null ? 5 : ticks;
    min = min != null ? min : zeroAnchor ? Math.min(0, domain[0]) : domain[0];
    max = max != null ? max : domain[1];

    var niced = niceMinMax(min, max, ticks, zeroAnchor);
    var tickValues = niced.tickValues;

    // ensure that y-axis endpoints are labelled
    if (min !== domain[0]) {
        tickValues.push(min);
        tickValues = tickValues.filter(function (tick) {
            return tick >= min;
        });
    }

    if (max !== domain[1]) {
        tickValues.push(max);
        tickValues = tickValues.filter(function (tick) {
            return tick <= max;
        });
    }

    tickValues.sort(function (a, b) {
        return a - b;
    });

    return uniq(tickValues);
};

var calcXLabelsWidths = exports.calcXLabelsWidths = function calcXLabelsWidths(ticks) {
    var padding = 8;
    var compact = function compact(e) {
        return !!e;
    };
    return ticks.filter(compact).map(String).map(function (d) {
        if (!d) {
            return padding * 2;
        }
        return textBounds(d, '.x.axis text').width + padding * 2;
    });
};

var doXLabelsFit = exports.doXLabelsFit = function doXLabelsFit(ticks, labelFormatter, options) {
    var tickWidths = calcXLabelsWidths(ticks.map(labelFormatter));
    var availableWidthForLabels = options.chart.plotWidth + tickWidths[0] / 2 + tickWidths[ticks.length - 1] / 2;
    var axisLabelsWidth = sum(tickWidths);
    return axisLabelsWidth <= availableWidthForLabels;
};

var getTicksThatFit = exports.getTicksThatFit = function getTicksThatFit(ticks, labelFormatter, options) {
    // reduce the number of ticks incrementally by taking every 2nd, then every 3th, and so on
    // until we find a set of ticks that fits the available space
    function reduceTicksByMod() {
        var tickWidths = calcXLabelsWidths(ticks.map(labelFormatter));
        var axisLabelsWidth = sum(tickWidths);
        var availableWidthForLabels = options.chart.plotWidth + tickWidths[0] / 2 + tickWidths[ticks.length - 1] / 2;
        var iter = 1;
        var filterMod = function filterMod(d, i) {
            return i % iter === 0;
        };
        var finalTicks = ticks;
        while (axisLabelsWidth > availableWidthForLabels && finalTicks.length !== 0) {
            iter++;
            finalTicks = ticks.filter(filterMod);
            axisLabelsWidth = sum(calcXLabelsWidths(finalTicks.map(labelFormatter)));
        }

        return finalTicks;
    }

    // possible alternative way using d3 ticks to calculate the number
    // that fits
    // function reduceTicksByD3() {
    //     // while(axisLabelsWidth > availableWidthForLabels && ticks.length !== 1) {
    //     //     ticks = axis.scale().ticks(Math.floor(--numAutoTicks));
    //     //     axisLabelsWidth = sum(calcLabelsWidths(ticks.map(formatLabel)));
    //     // }

    //     // axis.ticks(ticks.length);
    // }

    return reduceTicksByMod();
};

// measure text inside a Contour chart container
var textBounds = exports.textBounds = function textBounds(text, css) {
    var body = document.getElementsByTagName('body')[0];
    var wrapper = document.createElement('span');
    var dummy = document.createElement('span');
    wrapper.className = 'contour-chart';
    dummy.style.position = 'absolute';
    dummy.style.width = 'auto';
    dummy.style.height = 'auto';
    dummy.style.visibility = 'hidden';
    dummy.style.lineHeight = '100%';
    dummy.style.whiteSpace = 'nowrap';

    dummy.innerHTML = text;
    dummy.className = css.replace(/\./g, ' ');
    wrapper.appendChild(dummy);
    body.appendChild(wrapper);
    var res = { width: dummy.clientWidth, height: dummy.clientHeight };
    wrapper.removeChild(dummy);
    body.removeChild(wrapper);
    return res;
};

var dateDiff = exports.dateDiff = function dateDiff(d1, d2) {
    var diff = d1.getTime() - d2.getTime();
    return diff / (24 * 60 * 60 * 1000);
};

// concatenate and sort two arrays to the resulting array
// is sorted ie. merge [2,4,6] and [1,3,5] = [1,2,3,4,5,6]
var mergeArrays = exports.mergeArrays = function mergeArrays(array1, array2) {
    if (typeof array1 === 'number') array1 = [array1];
    if (typeof array2 === 'number') array2 = [array2];
    if (!array1 || !array1.length) return array2;
    if (!array2 || !array2.length) return array1;

    return [].concat(array1, array2).sort(function (a, b) {
        return a - b;
    });
};

var isCorrectDataFormat = exports.isCorrectDataFormat = function isCorrectDataFormat(dataArray) {
    return Array.isArray(dataArray) && dataArray.every(function (p) {
        return p.hasOwnProperty('x') && p.hasOwnProperty('y');
    });
};

var isCorrectSeriesFormat = exports.isCorrectSeriesFormat = function isCorrectSeriesFormat(data) {
    var isArrayOfObjects = Array.isArray(data) && isObject(data[0]);
    if (!isArrayOfObjects) {
        return false;
    }

    var hasDataArrayPerSeries = data.every(function (d) {
        return d.hasOwnProperty('data');
    });
    var hasSeriesNamePerSeries = data.every(function (d) {
        return d.hasOwnProperty('name');
    });
    var datumInCorrectFormat = isArrayOfObjects && hasDataArrayPerSeries && isCorrectDataFormat(data[0].data);

    return isArrayOfObjects && hasDataArrayPerSeries && hasSeriesNamePerSeries && datumInCorrectFormat;
};

var normalizeSeries = exports.normalizeSeries = function normalizeSeries(data, categories) {
    var hasCategories = !!(categories && Array.isArray(categories));
    function sortFn(a, b) {
        return a.x - b.x;
    }
    function normal(set, name) {
        var d = {
            name: name,
            data: set.map(function (d, i) {
                var hasX = d != null && d.hasOwnProperty('x');
                var val = function val(v) {
                    return v != null ? v : null;
                };
                // make sure we return a valid category and not cast nulls as string
                var categoryAt = function categoryAt(i) {
                    return !hasCategories ? i : categories[i] == null ? null : categories[i] + '';
                };
                return hasX ? Object.assign(d, { x: d.x, y: val(d.y) }) : { x: categoryAt(i), y: val(d) };
            })
        };

        if (!hasCategories) {
            d.data.sort(sortFn);
        }

        return d;
    }

    var correctDataFormat = isCorrectDataFormat(data);
    var correctSeriesFormat = isCorrectSeriesFormat(data);

    // do not make a new copy, if the data is already in the correct format!
    if (correctSeriesFormat) {
        return data;
    }

    // do the next best thing if the data is a set of points in the correct format
    if (correctDataFormat) {
        if (!hasCategories) data.sort(sortFn);
        return [{ name: 'series 1', data: data }];
    }

    // for the rest of the cases we need to normalize to the full format of the series
    if (Array.isArray(data)) {
        if (isObject(data[0]) && data[0].hasOwnProperty('data') || Array.isArray(data[0])) {
            // this would be the shape for multiple series
            return data.map(function (d, i) {
                return normal(d.data ? d.data : d, d.name ? d.name : 'series ' + (i + 1));
            });
        } else {
            // this is just the shape [1,2,3,4] or [{x:0, y:1}, { x: 1, y:2}...]
            return [normal(data, 'series 1')];
        }
    }

    // nothing to do to the data if it's not in a supported format
    return data;
};

// returns a function to format the data into a 'stacked' d3 layout
// passing in a series data will add a y0 to each data point
// where the point should start relative to the reset of the series points
// at that x value
var stackLayout = exports.stackLayout = function stackLayout() {
    var stack = _d2.default.layout.stack().values(function (d) {
        return d.data;
    });
    // prepare satck to handle different x values with different lengths
    var outFn = function outFn() {
        var y0s = {};
        return function (d, y0, y) {
            d.y0 = y0s[d.x] != null ? y0s[d.x] : 0;
            d.y = y;
            y0s[d.x] = (y0s[d.x] || 0) + (y || 0);
        };
    };

    stack.out(outFn());

    return stack;
};

var sum = exports.sum = function sum(array) {
    return array.reduce(function (acc, cur) {
        return acc += cur;
    }, 0);
};

var maxTickValues = exports.maxTickValues = function maxTickValues(max, domain) {
    var len = domain.length;
    var values = [];

    if (max >= len) return domain.slice();

    // return d3.scale.linear().domain(domain).ticks(max);

    var tickInteval = Math.ceil(len / max);
    var cur = 0;
    while (cur < len) {
        values.push(domain[cur]);
        cur += tickInteval;
    }

    return values;
};

var isSupportedDataFormat = exports.isSupportedDataFormat = function isSupportedDataFormat(data) {
    // this covers all supported formats so far:
    // [ {data: [...] }, ... ]
    // [ [...], [...] ]
    return Array.isArray(data) && isObject(data[0]) && data[0].hasOwnProperty('data') && Array.isArray(data[0].data) || Array.isArray(data[0]);
};

var selectDom = exports.selectDom = function selectDom(selector) {
    return _d2.default.select(selector)[0][0];
};

var getStyle = exports.getStyle = function getStyle(el, style) {
    if (!el) return undefined;
    var elem = typeof el === 'string' ? this.selectDom(el) : el;
    // we need a good way to check if the element is detached or not
    var styles = elem.offsetParent ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.style;

    return style ? styles[style] : styles;
};

var getCentroid = exports.getCentroid = function getCentroid(element) {
    var getOffsetParent = function getOffsetParent() {
        if (element.offsetParent) {
            return element.offsetParent;
        }

        // we we don't have an offsetParent, we may be in firefox
        // let's just assume that the offset parent is the svg element
        var t = element;
        while (t && t.tagName !== 'svg') {
            t = t.parentNode;
        }

        return t;
    };

    var parentBox = getOffsetParent().getBoundingClientRect();
    var bbox = element.getBoundingClientRect();

    return [bbox.left - parentBox.left + bbox.width / 2, bbox.top - parentBox.top + bbox.height / 2];
};

var warning = exports.warning = function warning(msg) {
    if (console && console.log) {
        console.log('WARNING: ' + msg);
    }
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Contour;

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _visualizationContainer = __webpack_require__(13);

var _visualizationContainer2 = _interopRequireDefault(_visualizationContainer);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _axisScaleFactory = __webpack_require__(4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    chart: {
        animations: {
            enable: true,
            // duration of the animation in ms
            duration: 400
        },
        // by default take the size of the parent container
        defaultWidth: 400,
        // height = width * ratio
        defaultAspect: 1 / 1.61803398875,
        // calculated at render time based on the options & container
        width: undefined,
        // if defined, height takes precedence over aspect
        height: undefined,
        // margin between the container and the chart (ie labels or axis title)
        margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        // padding between the chart area and the inner plot area */
        padding: {
            top: null,
            right: null,
            bottom: null,
            left: null
        },
        internalPadding: {
            bottom: 0,
            left: 0
        },
        // automatically false by default anyway; adding here to help generate docs
        rotatedFrame: false,
        // width in pixels of the plot area (area inside the axis if any). This gets calculated on render
        plotWidth: undefined,
        // height in pixels of the plot area (area inside the axis if any). This gets calculated on render
        plotHeight: undefined,
        // top edge in pixels (from the edge of the svg) of the plot area (area inside the axis if any). This gets calculated on render
        plotTop: undefined,
        // left edge in pixels (from the edge of the svg) of the plot area (area inside the axis if any). This gets calculated on render
        plotLeft: undefined
    },

    xAxis: {},

    yAxis: {},

    tooltip: {}
};

/**
* Creates a Contour instance, based on the core Contour visualizations object. This instance can contain a set of related visualizations.
*
*   * Pass the constructor any configuration options in the *options* parameter. Make sure the `el` option contains the selector of the container in which the Contour instance will be rendered.
*   * Set the frame for this Contour instance (e.g. `.cartesian()`).
*   * Add one or more specific visualizations to this Contour instance (e.g. `.scatter()`, `.trend-line()`). Pass each visualization constructor the data it displays. Pass configuration options if desired.
*   * Invoke an action for this Contour instance (e.g. `.render()`).
*
* ### Example:
*
*     new Contour({el: 'myChart'})
*       .cartesian()
*       .line([1,3,2,5])
*       .render()
*
*
* @class Contour()
* @param {object} options The global configuration options object
*
*/
function Contour(options) {
    this.init(options);

    return this;
}
Contour.version = "1.0.1";
Contour.xScaleFactory = _axisScaleFactory.xScaleFactory;
Contour.yScaleFactory = _axisScaleFactory.yScaleFactory;
Contour.utils = nwt;
Contour.addAxis = _axisScaleFactory.addAxis;
Contour.axes = _axisScaleFactory.axes;

/**
* Adds a new kind of visualization to the core Contour object.
* The *renderer* function is called when you add this visualization to instances of Contour.
* See a sample in the [Contour Gallery](http://forio.com/contour/gallery.html#/chart/pie/pie-gauge).
*
* ### Example:
*
*     Contour.export("exampleVisualization", function(data, layer) {
*           //function body to create exampleVisualization
*           //for example using SVG and/or D3
*     });
*
*     //to include the visualization into a specific Contour instance
*     new Contour(options)
*           .exampleVisualization(data)
*           .render()
*
* @param {String} ctorName Name of the visualization, used as a constructor name.
* @param {Function} renderer Function called when this visualization is added to a Contour instance. This function receives the data that is passed in to the constructor.
*/
Contour.export = function (ctorName, renderer) {

    if (typeof renderer !== 'function') throw new Error('Invalid render function for ' + ctorName + ' visualization');

    function sortSeries(data) {
        if (!data || !data.length) return [];

        if (data[0].data) {
            data.forEach(sortSeries);
        }

        var shouldSort = nwt.isObject(data[0]) && nwt.isDate(data[0].x);
        var sortFunc = function sortFunc(a, b) {
            return a.x - b.x;
        };
        if (shouldSort) {
            data.sort(sortFunc);
        }

        return data;
    }

    Contour.prototype[ctorName] = function (data, options) {
        var vizOpt = {};
        vizOpt[ctorName] = options || {};
        var vis;
        var ownData = true;

        if (!data) {
            data = this.lastData || [];
            ownData = false;
        }

        sortSeries(data);
        vis = new _visualizationContainer2.default(data, vizOpt, ctorName, renderer, this);
        vis.ownData = ownData;
        this._visualizations.push(vis);

        // lastData is used to pass the last specified dataset
        // to the next visualiaztion in the chain wihtout
        // the need to specify it again.... this allows you to do
        // new Contour().cartesian().line(dataset).lengend().tooltip().render()
        // and legend and tooltip will recieve dataset
        this.lastData = data;

        return this;
    };

    /* expose the renderer function so it can be reused
    * by other visualizations though the constructor function
    * ie. Contour.export('customLineChart', function (data, layer, options) {
    *       // call the line chart directly
    *       return this.line.renderer(data, layer, options);
    *    });
    */
    Contour.prototype[ctorName].renderer = renderer;
};

/**
* Exposes functionality to the core Contour object.
* Use this to add *functionality* that will be available for any visualizations.
*
* ###Example:
*
*     Contour.expose('example', function ctor(params) {
*         // params are the parameters passed into the constructor function
*         return {
*             // the init function, if provided, is called automatically upon instantiation of the functionality
*             // the options parameter has the global Contour options object
*             init: function (options) { ... },
*
*             // when included in the instance, the function `.myFunction` is available in the visualizations
*             myFunction: function(data) { .... }
*         };
*     });
*
*     Contour.export('visualizationThatUsesMyFunction', function(data, layer) {
*           //function body including call to this.myFunction(data)
*     });
*
*     // to include the functionality into a specific instance
*     new Contour(options)
*           .example({ text: 'someText' })
*           .visualizationThatUsesMyFunction()
*           .render()
*

*/
Contour.expose = function (ctorName, functionalityConstructor) {
    var ctor = function ctor() {
        var functionality = functionalityConstructor;
        if (typeof functionalityConstructor === 'function') {
            functionality = Object.create(functionalityConstructor);
            functionality = functionalityConstructor.apply(functionality, arguments);
        }

        // extend the --instance-- we don't want all charts to be overriden...
        Object.assign(this, nwt.omit(functionality, 'init'));

        if (functionality.init) {
            functionality.init.call(this, this.originalOptions);
        }

        // keep a list of the included functionality into this instance
        // so we can match and check dependencies
        this._exposed.push(ctorName);

        return this;
    };

    Contour.prototype[ctorName] = ctor;

    return this;
};

Contour.prototype = Object.assign(Contour.prototype, {
    _visualizations: undefined,

    _extraOptions: undefined,

    _exposed: undefined,

    // Initializes the instance of Contour
    init: function init(options) {
        // for now, just  store this options here...
        // the final set of options will be composed before rendering
        // after all components/visualizations have been added
        this.originalOptions = options || {};

        this._extraOptions = [];
        this._visualizations = [];
        this._exposed = [];

        return this;
    },

    calculateWidth: function calculateWidth() {

        // assume all in pixel units and border-box box-sizing
        var outerWidth = parseInt(nwt.getStyle(this.options.el, 'width') || 0, 10);
        var paddingLeft = parseInt(nwt.getStyle(this.options.el, 'padding-left') || 0, 10);
        var paddingRight = parseInt(nwt.getStyle(this.options.el, 'padding-right') || 0, 10);

        var width = outerWidth - paddingRight - paddingLeft;

        return this.options.el ? width || this.options.chart.defaultWidth : this.options.chart.defaultWidth;
    },

    calculateHeight: function calculateHeight() {
        // assume all in pixel units and border-box box-sizing
        var outerHeight = parseInt(nwt.getStyle(this.options.el, 'height') || 0, 10);
        var paddingTop = parseInt(nwt.getStyle(this.options.el, 'padding-top') || 0, 10);
        var paddingBottom = parseInt(nwt.getStyle(this.options.el, 'padding-bottom') || 0, 10);
        var height = outerHeight - paddingTop - paddingBottom;

        var containerHeight = this.options.el ? height : undefined;
        var calcWidth = this.options.chart.width;
        var ratio = this.options.chart.aspect || this.options.chart.defaultAspect;

        return !!containerHeight && containerHeight > 1 ? containerHeight : Math.round(calcWidth * ratio);
    },

    calcMetrics: function calcMetrics() {
        var options = this.options;

        this.adjustPadding();

        this.adjustTitlePadding();

        options.chart.width = options.chart.width || this.calculateWidth();
        options.chart.height = options.chart.height || this.calculateHeight();

        this.options = nwt.merge(options, {
            chart: {
                plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.internalPadding.left - options.chart.padding.right,
                plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.internalPadding.bottom,
                plotLeft: options.chart.margin.left + options.chart.internalPadding.left,
                plotTop: options.chart.margin.top + options.chart.padding.top
            }
        });

        if (this.options.chart.plotWidth <= 0 || this.options.chart.plotHeight <= 0) {
            console.warn('The chart has no space to render. Either the width/height is zero or you have too much padding\nWidth: ' + options.chart.width + '\nHeight: ' + options.chart.height + '\npadding-left: ' + options.chart.padding.left + '\npadding-right: ' + options.chart.padding.right + '\npadding-top: ' + options.chart.padding.top + '\npadding-bottom: ' + options.chart.padding.bottom);

            this.options.chart.plotWidth = this.options.chart.plotWidth < 0 ? 0 : this.options.chart.plotWidth;
            this.options.chart.plotHeight = this.options.chart.plotHeight < 0 ? 0 : this.options.chart.plotHeight;
        }
    },

    adjustPadding: function adjustPadding() {
        // overriden by components that need to adjust padding
        return this;
    },

    adjustTitlePadding: function adjustTitlePadding() {
        // overriden by components that need to adjust padding
        return this;
    },

    composeOptions: function composeOptions() {
        var allDefaults = nwt.merge({}, defaults);
        var mergeExtraOptions = function mergeExtraOptions(opt) {
            nwt.merge(allDefaults, opt);
        };
        var mergeDefaults = function mergeDefaults(vis) {
            nwt.merge(allDefaults, vis.renderer.defaults);
        };

        this._extraOptions.forEach(mergeExtraOptions);
        this._visualizations.forEach(mergeDefaults);

        var forceSkip = ['skip', /formatter/, 'el', /preprocess/, 'column.style', 'bar.style', 'pie.style', /barClass/, /sliceClass/, /sliceClass/, /columnClass/];

        // compose the final list of options right before start rendering
        var opt = nwt.merge({}, allDefaults, this.originalOptions);
        this.options = nwt.materialize(opt, this, { skip: forceSkip.concat(this.originalOptions.skip) });
    },

    /**
     * Updates the contour configuration for the instance.
     * The passed options are merged with the current options in the object
     *
     * ### Example:
     *
     *     var chart = new Contour({
     *         el: '.myChart'
     *     })
     *     .cartesian()
     *     .line([1,2,3,4,5])
     *     .render();
     *
     *     chart.updateOptions({ yAxis: { max: 100 }}).render();
     *
     *
     * @param {object} options - Options object to be merged with current options.
     * @function updateOptions
     */
    updateOptions: function updateOptions(options) {
        this.originalOptions = nwt.merge({}, this.originalOptions, options);
        return this;
    },

    baseRender: function baseRender() {
        this.plotArea();

        return this;
    },

    /**
    * Renders this Contour instance and all its visualizations into the DOM.
    *
    * ### Example:
    *
    *     new Contour({ el:'.myChart' })
    *           .pie([1,2,3])
    *           .render();
    *
    * @function render
    *
    */
    render: function render() {
        this.composeOptions();

        this.calcMetrics();

        this.baseRender();

        this.renderVisualizations();

        return this;
    },

    /**
    * Clears this Contour instance and all its visualizations of any size information, so that on the next call to `render()` the instance is re-measured.
    *
    * The function takes two optional arguments `width` and `height`. If given a specific width/height the chart uses that sizing information on the next render.
    *
    * ### Example:
    *
    *     var contour = new Contour({ el:'.myChart' })
    *           .pie([1,2,3])
    *           .render();
    *
    *     var onResize = function(e) {
    *          contour.resize().render();
    *     }
    *
    *     window.addEventListener('resize', onResize);
    *
    * @function resize
    * @param {Number} width (optional) The new width for the visualizations. If left blank, the width will be calcuated from options.el's parent.
    * @param {Number} height (optional) The new height for the visualizations. If left blank, the height will be calcuated from options.el's parent.
    */
    resize: function resize(width, height) {

        if (this.container) this.container.style('height', 0);

        delete this.options.chart.width;
        delete this.options.chart.height;
        delete this.options.chart.plotWidth;
        delete this.options.chart.plotHeight;
        delete this.options.chart.plotLeft;
        delete this.options.chart.plotTop;

        if (width) this.options.chart.width = width;

        if (height) this.options.chart.height = height;
        return this;
    },

    update: function update() {
        this.calcMetrics();
        return this;
    },

    plotArea: function plotArea() {

        var chartOpt = this.options.chart;

        this.container = _d2.default.select(this.options.el);
        // fix a flicker im web-kit when animating opacity and the chart is in an iframe
        this.container.attr('style', '-webkit-backface-visibility: hidden; position: relative');

        if (!this.svg) {
            this.svg = this.container.append('svg').attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height).attr('preserveAspectRatio', 'xMinYMin').attr('class', 'contour-chart').attr('height', chartOpt.height).append('g').attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');
        } else {
            this.svg.attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');

            _d2.default.select(this.svg.node().parentNode).attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height).attr('height', chartOpt.height);
        }

        return this;
    },

    createVisualizationLayer: function createVisualizationLayer(vis, id) {
        return this.svg.append('g').attr('vis-id', id).attr('vis-type', vis.type);
    },

    renderVisualizations: function renderVisualizations() {

        this._visualizations.forEach(function (visualization, index) {
            var id = index + 1;
            var layer = visualization.layer || this.createVisualizationLayer(visualization, id);
            var opt = nwt.merge({}, this.options, visualization.options);

            layer.attr('transform', 'translate(' + this.options.chart.internalPadding.left + ',' + (this.options.chart.padding.top || 0) + ')');
            visualization.layer = layer;
            visualization.parent = this;
            visualization.normalizeData(opt);
            visualization.render(layer, opt, this);
        }.bind(this));

        return this;
    },

    /**
    * Assert that all the dependencies are in the Contour instance.
    * For example, if a visualization requires Cartesian to be included in the instance,
    * it could call this.checkDependencies('Cartesian'), and the framework would
    * give a helpful error message if Cartesian was not included.
    *
    * @function checkDependencies
    * @param {string|array} list of dependencies (as specified in the instance constructor)
    *
    */
    checkDependencies: function checkDependencies(listOfDependencies) {
        listOfDependencies = Array.isArray(listOfDependencies) ? listOfDependencies : [listOfDependencies];
        var _this = this;
        var missing = [];

        listOfDependencies.forEach(function (dep) {
            if (_this._exposed.indexOf(dep) === -1) {
                missing.push(dep);
            }
        });

        if (missing.length) {
            throw new Error('ERROR: Missing depeendencies in the Contour instance (ej. new Contour({}).cartesian())\n The missing dependencies are: [' + missing.join(', ') + ']\nGo to http://forio.com/contour/documentation.html#key_concepts for more information');
        }
    },

    ensureDefaults: function ensureDefaults(options, renderer) {
        if (nwt.isString(renderer)) {
            renderer = this[renderer].renderer;
        }

        if (renderer.defaults) {
            var defaults = renderer.defaults;
            options = nwt.defaults(options || {}, defaults);
            this.options = nwt.defaults(this.options, defaults);
        }
    },

    /**
    * Sets the same data into all visualizations for a Contour instance. Useful for creating interactive
    * visualizations: call after getting the additional data from the user.
    *
    * ###Example:
    *
    *     var data = [1,2,3,4,5];
    *     var chart = new Contour({ el:'.myChart' })
    *           .cartesian()
    *           .scatter(data)
    *           .trendLine(data);
    *
    *     data.push(10);
    *     chart.setData(data)
    *           .render();
    *
    * @function setData
    *
    */
    setData: function setData(data) {
        this._visualizations.forEach(function (v) {
            v.setData(data);
        });

        return this;
    },

    /**
    * Returns a VisualizationContainer object for the visualization at a given index (0-based).
    *
    * ###Example:
    *
    *     var chart = new Contour({ el:'.myChart' })
    *           .pie([1,2,3])
    *           .render();
    *
    *     var myPie = chart.select(0);
    *
    *     // do something with the visualization, for example updating its data set
    *     myPie.setData([6,7,8,9]).render();
    *
    * @function select
    *
    */
    select: function select(index) {
        return this._visualizations[index];
    },

    // place holder function for now
    data: function data() {},

    dataNormalizer: nwt.normalizeSeries,

    isSupportedDataFormat: nwt.isSupportedDataFormat
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function YAxis(data, options, domain) {
    this.data = data;
    this.options = options || {
        yAxis: {
            scaling: { options: {} },
            labels: { format: 's' }
        }
    };
    this.domain = domain || [0, 1];
}

function setRange(scale, options) {
    var rangeSize = options.chart.rotatedFrame ? options.chart.plotWidth : options.chart.plotHeight;
    var range = options.chart.rotatedFrame ? [0, rangeSize] : [rangeSize, 0];
    return scale.range(range);
}

YAxis.prototype = {
    axis: function axis() {
        var options = this.options.yAxis;
        var domain = this.domain;
        var zeroAnchor = options.zeroAnchor != null ? options.zeroAnchor : options.scaling.options.zeroAnchor;
        var tickValues = options.tickValues || nwt.niceTicks(options.min, options.max, options.ticks, zeroAnchor, domain);
        var numTicks = this.numTicks(domain, options.min, options.max);
        var format = options.labels.formatter || _d2.default.format(options.labels.format);

        return _d2.default.svg.axis().scale(this._scale).tickFormat(format).tickSize(options.innerTickSize, options.outerTickSize).tickPadding(options.tickPadding).ticks(numTicks).tickValues(tickValues);
    },

    scale: function scale(domain) {
        if (!this._scale) {
            this._scale = _d2.default.scale.linear();
            this.setDomain(domain);
        }

        setRange(this._scale, this.options);
        return this._scale;
    },

    setDomain: function setDomain(domain) {
        this._scale.domain(domain);
        this._niceTheScale();
        return this._scale;
    },

    update: function update(domain, dataSrc) {
        this.data = dataSrc;
        this.setDomain(domain);
        this.scale();
    },

    numTicks: function numTicks() {
        return this.options.yAxis.ticks != null ? this.options.yAxis.ticks : undefined;
    },

    _niceTheScale: function _niceTheScale() {
        // nothing to do for the regular y-axis
    }
};

exports.default = YAxis;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.yScaleFactory = exports.xScaleFactory = exports.addAxis = exports.axes = undefined;

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _yAxis = __webpack_require__(3);

var _yAxis2 = _interopRequireDefault(_yAxis);

var _centeredYAxis = __webpack_require__(6);

var _centeredYAxis2 = _interopRequireDefault(_centeredYAxis);

var _linearScaleAxis = __webpack_require__(7);

var _linearScaleAxis2 = _interopRequireDefault(_linearScaleAxis);

var _logYAxis = __webpack_require__(8);

var _logYAxis2 = _interopRequireDefault(_logYAxis);

var _ordinalScaleAxis = __webpack_require__(9);

var _ordinalScaleAxis2 = _interopRequireDefault(_ordinalScaleAxis);

var _smartYAxis = __webpack_require__(10);

var _smartYAxis2 = _interopRequireDefault(_smartYAxis);

var _timeScaleAxis = __webpack_require__(11);

var _timeScaleAxis2 = _interopRequireDefault(_timeScaleAxis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var axes = exports.axes = {
    'log': _logYAxis2.default,
    'smart': _smartYAxis2.default,
    'linear': _yAxis2.default,
    'centered': _centeredYAxis2.default,
    'ordinal': _ordinalScaleAxis2.default,
    'time': _timeScaleAxis2.default,
    'xLinear': _linearScaleAxis2.default
};
var addAxis = exports.addAxis = function addAxis(name, axisCtor) {
    axes[name] = axisCtor;
};

var xScaleFactory = exports.xScaleFactory = function xScaleFactory(data, options) {
    // if we have dates in the x field of the data points
    // we need a time scale, otherwise is an oridinal
    // two ways to shape the data for time scale:
    //  [{ x: date, y: 1}, {x: date, y: 2}]
    //  [{ data: [ x: date, y: 1]}, {data: [x: date, y: 100]}]
    // if we get no data, we return an ordinal scale
    var isTimeData = options.xAxis.type === 'time' || (Array.isArray(data) && data.length > 0 && data[0].data ? data[0].data[0].x && nwt.isDate(data[0].data[0].x) : Array.isArray(data) && data.length > 0 && data[0].x && nwt.isDate(data[0].x));

    if (isTimeData && options.xAxis.type !== 'ordinal') {
        return new _timeScaleAxis2.default(data, options);
    }

    if (!options.xAxis.categories && options.xAxis.type === 'linear') {
        return new _linearScaleAxis2.default(data, options);
    }

    return new _ordinalScaleAxis2.default(data, options);
};

var yScaleFactory = exports.yScaleFactory = function yScaleFactory(data, options, axisType, domain) {
    var map = {
        'log': _logYAxis2.default,
        'smart': _smartYAxis2.default,
        'linear': _yAxis2.default,
        'centered': _centeredYAxis2.default
    };

    if (!axisType) {
        axisType = 'linear';
    }

    if (axisType === 'linear' && (options.yAxis.smartAxis || options.yAxis.scaling.type === 'smart')) {
        axisType = 'smart';
    }

    if (axisType === 'linear' && options.yAxis.scaling.type === 'centered') {
        axisType = 'centered';
    }

    if (axisType in axes) {
        return new axes[axisType](data, options, domain);
    }

    throw new Error('Unknown axis type: "' + axisType + '"');
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _yAxis = __webpack_require__(3);

var _yAxis2 = _interopRequireDefault(_yAxis);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// focus on vertically centering data - zero anchor is ignored
function CenteredYAxis(data, options, domain) {
    this.data = data;
    this.options = options;
    this.yMax = domain[0];
    this.yMin = domain[1];
    this.NUM_DECIMALS = 1;
}

var __super = _yAxis2.default.prototype;
CenteredYAxis.prototype = Object.assign({}, __super, {
    axis: function axis() {
        var options = this.options.yAxis;
        this.domain = this._scale.domain();
        var numTicks = options.ticks || 5;
        var axis = __super.axis.call(this);
        var tickValues = this._extractYTickValues(options.min, options.max, numTicks);

        return axis.ticks(numTicks).tickValues(tickValues).tickFormat(undefined);
    },

    setDomain: function setDomain(domain) {
        var scaledDomain = this._getScaledDomain(domain);

        this.yMin = scaledDomain[0];
        this.yMax = scaledDomain[1];
        this._scale.domain(scaledDomain);
    },

    _getScaledDomain: function _getScaledDomain(domain) {
        var extent = _d2.default.extent(domain);
        var dataRange = extent[1] - extent[0];
        var domainPadding = dataRange * 0.1;

        var scaledMin = _d2.default.round(extent[0] - domainPadding, this.NUM_DECIMALS);
        var scaledMax = _d2.default.round(extent[1] + domainPadding, this.NUM_DECIMALS);

        return [scaledMin, scaledMax];
    },

    _extractYTickValues: function _extractYTickValues(min, max, numTicks) {
        var tickMin = min != null ? min : this.yMin;
        var tickMax = max != null ? max : this.yMax;

        var tickRange = tickMax - tickMin;
        var tickSpacing = tickRange / numTicks;

        var currentTick = tickMin;
        var tickValues = [tickMin];
        while (currentTick < tickMax) {
            currentTick += tickSpacing;
            tickValues.push(_d2.default.round(currentTick, this.NUM_DECIMALS));
        }
        tickValues.push(tickMax);

        return tickValues;
    }
});

exports.default = CenteredYAxis;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LinearScale(data, options) {
    this.options = options;
    this.data = data;

    this.init();
}

LinearScale.prototype = {
    init: function init() {
        delete this._scale;
    },

    scale: function scale(domain) {
        this._domain = domain ? this._getAxisDomain(domain) : this._getAxisDomain(this.data);
        this._scale = this._scale || _d2.default.scale.linear();
        this._scale.domain(this._domain);

        if (this.options.xAxis.min == null && this.options.xAxis.max == null) {
            this._scale.nice();
        }

        this._setRange();

        return this._scale;
    },

    axis: function axis() {
        var options = this.options.xAxis;
        var formatLabel = options.labels.formatter || _d2.default.format(options.labels.format || 'g');
        var axis = _d2.default.svg.axis().scale(this._scale).tickSize(options.innerTickSize, options.outerTickSize).tickPadding(options.tickPadding).tickFormat(function (d) {
            return nwt.isDate(d) ? d.getDate() : formatLabel(d);
        });

        var ticks = axis.scale().ticks();

        var labelsFit = nwt.doXLabelsFit(ticks, formatLabel, this.options);

        if (options.firstAndLast) {
            // show only first and last tick
            axis.tickValues(nwt.firstAndLast(this._domain));
        } else if (options.tickValues) {
            axis.tickValues(options.tickValues);
        } else if (options.ticks != null) {
            axis.ticks(options.ticks);
        } else if (!labelsFit) {
            var finalTicks = nwt.getTicksThatFit(ticks, formatLabel, this.options);
            axis.tickValues(finalTicks);
            axis.ticks(finalTicks.length);
        }

        return axis;
    },

    update: function update(domain, dataSrc, options) {
        this.data = dataSrc;
        this.options = options || this.options;
        this.scale(domain);
    },

    rangeBand: function rangeBand() {
        return 1;
    },

    postProcessAxis: function postProcessAxis() {
        return this;
    },

    _setRange: function _setRange() {
        var rangeSize = !!this.options.chart.rotatedFrame ? this.options.chart.plotHeight : this.options.chart.plotWidth;
        var range = !!this.options.chart.rotatedFrame ? [rangeSize, 0] : [0, rangeSize];
        return this._scale.range(range);
    },

    _getAxisDomain: function _getAxisDomain(domain) {
        var optMin = this.options.xAxis.min;
        var optMax = this.options.xAxis.max;
        var extents = _d2.default.extent(domain);

        if (optMin == null && optMax == null) {
            return extents;
        }

        if (optMin == null) {
            return [Math.min(extents[0], optMax), optMax];
        }

        if (optMax == null) {
            return [optMin, Math.max(extents[1], optMin)];
        }

        // options are invalid, use the extents
        if (optMin > optMax) {
            return extents;
        }

        return [optMin, optMax];
    }
};

exports.default = LinearScale;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _yAxis = __webpack_require__(3);

var _yAxis2 = _interopRequireDefault(_yAxis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function LogYAxis(data, options) {
    this.data = data;
    this.options = options;
}

function setRange(scale, options) {
    var rangeSize = options.chart.rotatedFrame ? options.chart.plotWidth : options.chart.plotHeight;
    var range = options.chart.rotatedFrame ? [0, rangeSize] : [rangeSize, 0];
    return scale.range(range);
}

var __super = _yAxis2.default.prototype;
LogYAxis.prototype = Object.assign({}, __super, {
    axis: function axis() {
        var options = this.options.yAxis;
        var domain = this._scale.domain();
        var ticksHint = Math.ceil(Math.log(domain[1]) / Math.log(10));
        var format = options.labels.formatter || _d2.default.format(options.labels.format || ',.0f');

        var axis = _d2.default.svg.axis().scale(this._scale).tickSize(options.innerTickSize, options.outerTickSize).tickPadding(options.tickPadding);
        if (options.labels.formatter) {
            axis.tickFormat(options.labels.formatter);
        } else {
            axis.ticks(options.ticks || ticksHint, format);
        }

        return axis;
    },

    scale: function scale(domain) {
        if (!this._scale) {
            if (domain[0] <= 0.1) domain[0] = 0.1; //throw new Error('Log scales don\'t support 0 or negative values');

            this._scale = _d2.default.scale.log();
            this.setDomain(domain).clamp(true);
        }

        setRange(this._scale, this.options);

        return this._scale;
    },

    update: function update(domain, dataSrc) {
        this.data = dataSrc;
        if (domain[0] <= 0.1) domain[0] = 0.1; //throw new Error('Log scales don\'t support 0 or negative values');
        this.setDomain(domain).clamp(true);
        this.scale();
    }
});

exports.default = LogYAxis;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// implements the following interface
/*
{
    scale: returns the d3 scale for the type

    axis: returns the d3 axis

    range: returns the d3 range for the type

    postProcessAxis:
}
*/

function OrdinalScale(data, options) {
    this.options = options;
    this.data = data;

    this.init();
}

OrdinalScale.prototype = {
    init: function init() {
        this.isCategorized = true;
        delete this._scale;
    },

    scale: function scale(domain) {
        if (!this._scale) {
            this._scale = new _d2.default.scale.ordinal();
        }

        this.setDomain(domain || this.data);

        return this._scale;
    },

    /* jshint eqnull:true */
    axis: function axis() {
        var options = this.options.xAxis;
        var optFormat = options.labels.format ? _d2.default.format(options.labels.format) : 0;
        var formatLabel = options.labels.formatter || _d2.default.format(options.labels.format || 'g');

        var tickFormat = options.labels.formatter || (!this.isCategorized ? optFormat : 0) || function (d) {
            return nwt.isDate(d) ? d.getDate() : d;
        };
        var axis = _d2.default.svg.axis().scale(this._scale).innerTickSize(options.innerTickSize).outerTickSize(options.outerTickSize).tickPadding(options.tickPadding).tickFormat(tickFormat);

        var ticks = this.isCategorized && options.categories ? options.categories : nwt.range(this._domain.length) || [];
        var labelsFit = nwt.doXLabelsFit(ticks, formatLabel, this.options);

        if (options.firstAndLast) {
            // show only first and last tick
            axis.tickValues(nwt.firstAndLast(this._domain));
        } else if (options.maxTicks) {
            axis.tickValues(nwt.maxTickValues(options.maxTicks, this._domain));
        } else if (options.tickValues) {
            axis.tickValues(options.tickValues);
        } else if (options.ticks != null) {
            axis.ticks(options.ticks);
            if (options.ticks === 0) {
                axis.tickValues([]);
            }
        } else if (!labelsFit) {
            var finalTicks = nwt.getTicksThatFit(ticks, formatLabel, this.options);
            axis.tickValues(finalTicks);
            axis.ticks(finalTicks.length);
        } else {
            axis.tickValues(options.categories);
        }

        return axis;
    },

    /* jshint eqnull:true */
    postProcessAxis: function postProcessAxis(axisGroup) {
        var options = this.options.xAxis;
        if (!options.labels || options.labels.rotation == null) return;

        var deg = options.labels.rotation;
        var rad = nwt.degToRad(deg);
        var sign = deg > 0 ? 1 : deg < 0 ? -1 : 0;
        var pos = deg < 0 ? -1 : 1;
        var lineHeight = 0.71;
        var lineCenter = lineHeight / 2; // center of text line is at .31em
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        var anchor = options.labels.rotation < 0 ? 'end' : options.labels.rotation > 0 ? 'start' : 'middle';

        axisGroup.selectAll('.tick text').style({ 'text-anchor': anchor }).attr('transform', function (d, i, j) {
            var x = _d2.default.select(this).attr('x') || 0;
            var y = _d2.default.select(this).attr('y') || 0;
            return 'rotate(' + options.labels.rotation + ' ' + x + ',' + y + ')';
        }).attr('dy', function (d, i, j) {
            var ref = deg === 0 ? lineHeight : lineCenter;
            var num = cos * ref + sin * ref * pos;
            return num.toFixed(4) + 'em';
            // return (sign * ((cos * lineCenter) + (sin * lineCenter))).toFixed(4) + 'em';
        }).attr('dx', function (d, i, j) {
            // var num = ((sin * lineCenter * pos));
            // return -num.toFixed(4) + 'em';
            return -(sin * lineCenter - 0.31 * sign).toFixed(4) + 'em';
        });
    },

    update: function update(domain, data, options) {
        this.data = data;
        this.options = options || this.options;
        this.scale(domain);
    },

    setDomain: function setDomain(domain) {
        this._domain = domain;
        this._scale.domain(domain);
        this._range();
    },

    rangeBand: function rangeBand() {
        var band = this._scale.rangeBand();
        if (!band) nwt.warn('rangeBand is 0, you may have too many points in in the domain for the size of the chart (ie. chartWidth = ' + this.options.chart.plotWidth + 'px and ' + this._domain.length + ' X-axis points (plus paddings) means less than 1 pixel per band and there\'re no half pixels');

        return this._scale.rangeBand();
    },

    _range: function _range() {
        var range = this.options.chart.rotatedFrame ? [this.options.chart.plotHeight, 0] : [0, this.options.chart.plotWidth];
        var numCats = (this._domain || []).length;
        var threshold = 30;
        var rangeType = numCats <= threshold ? 'rangeRoundBands' : 'rangeBands';

        return this.isCategorized ?
        // this._scale.rangeBands(range, this.options.xAxis.innerRangePadding, this.options.xAxis.outerRangePadding) :
        this._scale[rangeType](range, this.options.xAxis.innerRangePadding, this.options.xAxis.outerRangePadding) : this._scale.rangePoints(range);
    }
};

exports.default = OrdinalScale;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _yAxis = __webpack_require__(3);

var _yAxis2 = _interopRequireDefault(_yAxis);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SmartYAxis(data, options, domain) {
    this.data = data;
    this.options = options;
    this.yMax = domain[0];
    this.yMin = domain[1];
    this.dataMax = _d2.default.max(data.map(function (d) {
        return d.y;
    }));
}

function _extractYTickValues(domain, min, max, yMin, yMax, dataMax) {
    var adjustedDomain = nwt.uniq(nwt.mergeArrays(nwt.mergeArrays(domain, yMax), dataMax));
    // we want to be able to remove parameters with default values
    // so to remove the default yAxis.min: 0, you pass yAxis.min: null
    // and for that we need to to a truly comparison here (to get null or undefined)
    if (min == null && max == null) return adjustedDomain;

    if (min == null) {
        return max > yMin ? nwt.mergeArrays([max], adjustedDomain) : [max];
    }

    if (max == null) {
        if (min >= yMax) return [min];
        adjustedDomain[0] = min;

        return adjustedDomain;
    }

    return nwt.mergeArrays([min, max], yMax);
}

var __super = _yAxis2.default.prototype;
SmartYAxis.prototype = Object.assign({}, __super, {
    axis: function axis() {
        var options = this.options.yAxis;
        this.domain = this._scale.domain();
        var tickValues = _extractYTickValues(this.domain, options.min, options.max, this.yMin, this.yMax, this.dataMax);
        var numTicks = this.numTicks();
        var axis = __super.axis.call(this);
        return axis.ticks(numTicks).tickValues(tickValues);
    },

    numTicks: function numTicks() {
        return 3;
    },

    setDomain: function setDomain(domain) {
        var extent = _d2.default.extent(domain);
        this.yMin = extent[0];
        this.yMax = extent[1];
        this._scale.domain(domain);

        this._niceTheScale();
    },

    _niceTheScale: function _niceTheScale() {
        var perTreshold = 0.05;
        var domain = this._scale.domain();
        var min = this.options.yAxis.min || domain[0];
        var rawMax = this.options.yAxis.max || this.dataMax;
        var nextTick = nwt.roundToNextTick(rawMax);

        var max = Math.abs(nextTick - rawMax) < rawMax * perTreshold ? nwt.roundToNextTick(rawMax + rawMax * perTreshold) : nextTick;
        // var max = nextTick === rawMax ? nwt.roundToNextTick(rawMax + Math.pow(10, -nwt.decDigits(rawMax) - 1)) : nextTick;
        var nice = [min, max];
        this._scale.domain(nice);
    }
});

exports.default = SmartYAxis;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// implements the following interface
/*
{
    scale: returns the d3 scale for the type

    range: returns the d3 range for the type
}
*/

function dateDiff(d1, d2) {
    if (!d1 || !d2) return 0;
    var diff = d1.getTime() - d2.getTime();
    return diff / (24 * 60 * 60 * 1000);
}

function TimeScale(data, options) {
    this.options = options;
    this.data = data;

    this.init();
}

TimeScale.prototype = {
    init: function init() {
        delete this._scale;
    },

    scale: function scale(domain) {

        if (!this._scale) {
            this._scale = new _d2.default.time.scale();
            this.setDomain(domain);
        }

        this.range();

        return this._scale;
    },

    /* jshint eqnull:true */
    axis: function axis() {
        var options = this.options.xAxis;
        var tickFormat = this.getOptimalTickFormat();

        var axis = _d2.default.svg.axis().scale(this._scale).tickFormat(tickFormat).tickSize(options.innerTickSize, options.outerTickSize).tickPadding(options.tickPadding).tickValues(this._domain);

        if (this.options.xAxis.tickValues != null) {
            axis.tickValues(this.options.xAxis.tickValues);
        } else if (this.options.xAxis.maxTicks != null && this.options.xAxis.maxTicks < this._domain.length) {
            // override the tickValues with custom array based on number of ticks
            // we don't use D3 ticks() because you cannot force it to show a specific number of ticks
            axis.tickValues(nwt.maxTickValues(options.maxTicks, this._domain));
        } else if (this.options.xAxis.firstAndLast) {
            // show only first and last tick
            axis.tickValues(nwt.firstAndLast(this._domain));
        }

        return axis;
    },

    update: function update(domain, data, options) {
        this.data = data;
        this.options = options || this.options;
        this.setDomain(domain);
        this.scale();
    },

    setDomain: function setDomain(domain) {
        this._domain = domain;
        var axisDomain = this._getAxisDomain(this._domain);
        this._scale.domain(axisDomain);
    },

    postProcessAxis: function postProcessAxis(axisGroup) {
        if (!this.options.xAxis.firstAndLast) return;
        var labels = axisGroup.selectAll('.tick text')[0];
        _d2.default.select(labels[0]).style({ 'text-anchor': 'start' });
        _d2.default.select(labels[labels.length - 1]).style({ 'text-anchor': 'end' });
    },

    rangeBand: function rangeBand() {
        return 4;
    },

    getOptimalTickFormat: function getOptimalTickFormat() {
        if (this.options.xAxis.labels.formatter) return this.options.xAxis.labels.formatter;
        if (this.options.xAxis.labels.format) return _d2.default.time.format(this.options.xAxis.labels.format);

        var spanDays = Math.abs(dateDiff(this._domain[this._domain.length - 1], this._domain[0]));
        var daysThreshold = this.options.xAxis.maxTicks || 1;
        if (spanDays < daysThreshold) return _d2.default.time.format('%H:%M');
        if (spanDays < 365) return _d2.default.time.format('%d %b');

        return _d2.default.time.format('%Y');
    },

    range: function range() {
        var range = this._getAxisRange(this._domain);
        return this._scale.rangeRound(range, 0.1);
    },

    _getAxisDomain: function _getAxisDomain(domain) {
        if (this.options.xAxis.linearDomain) {
            return domain;
        }

        return _d2.default.extent(domain);
    },

    _getAxisRange: function _getAxisRange(domain) {
        var size = this.options.chart.rotatedFrame ? this.options.chart.plotHeight : this.options.chart.plotWidth;

        if (this.options.xAxis.linearDomain) {
            return nwt.range(0, size, size / (domain.length - 1)).concat([size]);
        }

        return [0, size];
    }
};

exports.default = TimeScale;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

__webpack_require__(17);

__webpack_require__(18);

__webpack_require__(19);

__webpack_require__(3);

__webpack_require__(4);

__webpack_require__(6);

__webpack_require__(7);

__webpack_require__(8);

__webpack_require__(9);

__webpack_require__(10);

__webpack_require__(11);

__webpack_require__(20);

__webpack_require__(21);

__webpack_require__(22);

__webpack_require__(23);

__webpack_require__(24);

__webpack_require__(25);

__webpack_require__(26);

__webpack_require__(27);

__webpack_require__(28);

__webpack_require__(29);

__webpack_require__(30);

__webpack_require__(31);

__webpack_require__(32);

__webpack_require__(33);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _contour2.default;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _extent = function _extent(series, field) {
    var maxs = [],
        mins = [];
    series.forEach(function (d) {
        if (!d.data.length) return;
        var values = d.data.map(function (d) {
            return d[field];
        });
        maxs.push(_d2.default.max(values));
        mins.push(_d2.default.min(values));
    });

    //
    if (!mins.length || !maxs.length) return [];

    return [Math.min.apply(null, mins), Math.max.apply(null, maxs)];
};

var _stackedExtent = function _stackedExtent(data) {
    var stack = nwt.stackLayout();
    var dataSets = stack(data);
    var ext = [];
    dataSets.forEach(function (set) {
        set.data.forEach(function (d, i) {
            var cur = ext[i] || 0;
            ext[i] = cur + d.y;
        });
    });

    return [Math.min.apply(null, ext), Math.max.apply(null, ext)];
};

var _xExtent = nwt.partialRight(_extent, 'x');
var _yExtent = nwt.partialRight(_extent, 'y');

function VisInstanceContainer(data, vizOptions, type, renderer, context) {
    this.type = type;
    this.renderer = renderer;
    this.ctx = context;
    this.options = vizOptions;
    this.init(data);
}

VisInstanceContainer.prototype = {
    init: function init(data) {
        this.rawData = data;
    },

    render: function render(layer, options, ctx) {
        this.renderer.call(ctx, this.data, layer, options);
        return ctx;
    },

    setVisibility: function setVisibility(visible) {
        var node = this.layer.node();

        if (visible) {
            node.style.display = 'block';
        } else {
            node.style.display = 'none';
        }

        return this.ctx;
    },

    setData: function setData(data) {
        this.rawData = data;
        return this.ctx;
    },

    normalizeData: function normalizeData(options) {
        var normal = (this.ctx || {}).dataNormalizer || nwt.normalizeSeries;
        var categories = (options.xAxis || {}).categories;
        this.data = normal(this.rawData, categories);
        this._updateDomain(options);

        return this.ctx;
    },

    _updateDomain: function _updateDomain(options) {
        if (!options[this.type]) throw new Error('Set the options before calling setData or _updateDomain');

        var isSupportedFormat = (this.ctx || {}).isSupportedDataFormat || nwt.isSupportedDataFormat;

        if (isSupportedFormat(this.data)) {
            this.xDomain = nwt.flatten(this.data.map(function (set) {
                return set.data.map(function (d) {
                    return d.x;
                });
            }));
            this.xExtent = _xExtent(this.data, 'x');
            this.yExtent = options[this.type].stacked ? _stackedExtent(this.data) : _yExtent(this.data);
        }
    }
};

exports.default = VisInstanceContainer;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(args) {
  args.push(undefined, assignInDefaults);
  return apply(assignInWith, undefined, args);
});

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

module.exports = defaults;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    asyncTag = '[object AsyncFunction]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    nullTag = '[object Null]',
    objectTag = '[object Object]',
    proxyTag = '[object Proxy]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    undefinedTag = '[object Undefined]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule && freeModule.require && freeModule.require('util').types;

    if (types) {
      return types;
    }

    // Legacy `process.binding('util')` for Node.js < 10.
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectCreate = Object.create,
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice,
    symToStringTag = Symbol ? Symbol.toStringTag : undefined;

var defineProperty = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined,
    nativeMax = Math.max,
    nativeNow = Date.now;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate = (function() {
  function object() {}
  return function(proto) {
    if (!isObject(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    stack || (stack = new Stack);
    if (isObject(srcValue)) {
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(safeGet(object, key), srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || isFunction(objValue)) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString = !defineProperty ? identity : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;

  return !!length &&
    (type == 'number' ||
      (type != 'symbol' && reIsUint.test(value))) &&
        (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * Gets the value at `key`, unless `key` is "__proto__" or "constructor".
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function safeGet(object, key) {
  if (key === 'constructor' && typeof object[key] === 'function') {
    return;
  }

  if (key == '__proto__') {
    return;
  }

  return object[key];
}

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString = shortOut(baseSetToString);

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function() {
    return value;
  };
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = merge;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(16)(module)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

var _axisScaleFactory = __webpack_require__(4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    chart: {
        gridlines: 'none',
        // not clipping the plot area could be a performance gain
        // but by default we clip to be safe
        clipPlotArea: false,
        padding: {
            top: 6,
            right: 5,
            // this get's defined based on the axis & title
            bottom: undefined,
            // this get's defined based on the axis & title
            left: undefined
        }
    },

    xAxis: {
        // type of axis {ordinal|linear|time}
        type: null, // default is linear in line.js (needs to be null here so overrides work)
        categories: undefined,
        max: undefined,
        min: undefined,
        innerTickSize: 6,
        outerTickSize: 0,
        tickPadding: 6,
        maxTicks: undefined,
        ticks: undefined,
        tickValues: undefined,
        title: undefined,
        titlePadding: 4,
        // padding between ranges (ie. columns) expressed in percentage of rangeBand width
        innerRangePadding: 0.1,
        // padding between all ranges (ie. columns) and the axis (left & right) expressed in percentage of rangeBand width
        outerRangePadding: 0.1,
        firstAndLast: false,
        orient: 'bottom',
        labels: {
            format: undefined,
            formatter: undefined
        },
        linearDomain: false, // specify if a time domain should be treated linearly or ....
        // should the xAxis be rendered at y=0 or at the bottom of the chart regardless of where y = 0 is
        zeroPlane: false
    },

    yAxis: {
        // @param: {linear|smart|log}
        // type: 'smart',
        min: undefined,
        max: undefined,
        scaling: {
            type: 'auto', // || 'smart' || 'centered'
            options: {
                zeroAnchor: true
            }
        },
        innerTickSize: 6,
        outerTickSize: 6,
        tickPadding: 4,
        tickValues: undefined,
        ticks: undefined,
        title: undefined,
        titlePadding: 4,
        orient: 'left',
        labels: {
            // top, middle, bottom
            verticalAlign: 'middle',
            format: 's', // d3 formats
            formatter: undefined // a function that formats each value ie. function (datum) { return 'x: ' + datum.x + ', y:' + datum.y }
        }
    }
};

/**
* Provides a Cartesian frame to the Contour instance.
*
* This is required for all visualizations displayed in a Cartesian frame, for example line charts, bar charts, area charts, etc. It is not required otherwise; for instance, pie charts do not use a Cartesian frame.
*
* ###Example:
*
*     new Contour(options)
*           .cartesian();
*
* @name cartesian
*/
var cartesian = function cartesian() {
    var maxTickSize = function maxTickSize(options) {
        return Math.max(options.outerTickSize || 0, options.innerTickSize || 0);
    };
    return {
        dataSrc: [],

        init: function init(options) {

            // readonly properties (ie. user cannot modify)
            var readOnlyProps = {
                chart: {
                    rotatedFrame: false,
                    internalPadding: {
                        bottom: undefined,
                        left: undefined
                    }
                }
            };

            this.options = options || {};

            nwt.merge(this.options, readOnlyProps);

            var extraPadding = {};
            if (!this.options.xAxis || !this.options.xAxis.firstAndLast) {
                extraPadding = { chart: { padding: { right: 15 } } };
            }

            this._extraOptions.push(nwt.merge({}, defaults, extraPadding));

            return this;
        },

        xDomain: [],
        yDomain: [],

        _getYScaledDomain: function _getYScaledDomain(domain, options) {
            var opts = this.options.yAxis;
            var zeroAnchor = opts.zeroAnchor != null ? opts.zeroAnchor : opts.scaling.options.zeroAnchor;
            var absMin = zeroAnchor && domain && domain[0] > 0 ? 0 : undefined;
            var min = opts.min != null ? opts.min : absMin;

            if (opts.tickValues) {
                if (opts.min != null && opts.max != null) {
                    return [opts.min, opts.max];
                } else if (opts.min != null) {
                    return [opts.min, _d2.default.max(zeroAnchor ? [0].concat(opts.tickValues) : opts.tickValues)];
                } else if (opts.max != null) {
                    return [_d2.default.min(zeroAnchor ? [0].concat(opts.tickValues) : opts.tickValues), opts.max];
                } else {
                    return _d2.default.extent(zeroAnchor || opts.min != null ? [min].concat(opts.tickValues) : opts.tickValues);
                }
            } else if (opts.smartAxis || opts.scaling.type === 'smart') {
                return _d2.default.extent(zeroAnchor || opts.min != null ? [min].concat(domain) : domain);
            } else if (opts.scaling.type === 'centered') {
                return _d2.default.extent(domain);
            }

            return nwt.extractScaleDomain(domain, min, opts.max, opts.ticks);
        },

        /*jshint eqnull:true */
        adjustPadding: function adjustPadding() {
            var xOptions = this.options.xAxis;
            var yOptions = this.options.yAxis;
            // bottom padding calculations
            if (this.options.chart.padding.bottom == null) {
                this.options.chart.internalPadding.bottom = this._getAdjustedBottomPadding(xOptions);
            } else {
                this.options.chart.internalPadding.bottom = this.options.chart.padding.bottom || 0;
            }

            this.options.chart.padding.top = this.options.chart.internalPadding.top = this._getAdjustedTopPadding(xOptions);

            // left padding calculations
            if (this.options.chart.padding.left == null) {
                this.options.chart.internalPadding.left = this._getAdjustedLeftPadding(yOptions);
            } else {
                this.options.chart.internalPadding.left = this.options.chart.padding.left;
            }

            this.options.chart.padding.right = this.options.chart.internalPadding.right = this._getAdjustedRightPadding(yOptions);
        },

        _getAdjustedTopPadding: function _getAdjustedTopPadding(options) {
            return this.options.chart.padding.top;
        },

        _getAdjustedBottomPadding: function _getAdjustedBottomPadding(options) {
            if (options.ticks !== 0) {
                var xLabels = this.xDomain;
                var xAxisText = xLabels.join('<br>');
                var xLabelBounds = nwt.textBounds(xAxisText, '.x.axis');
                var regularXBounds = nwt.textBounds('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', '.x.axis');
                var em = regularXBounds.height;
                var ang = options.labels && options.labels.rotation ? options.labels.rotation % 360 : 0;
                var xLabelHeightUsed = ang === 0 ? regularXBounds.height : Math.ceil(Math.abs(xLabelBounds.width * Math.sin(nwt.degToRad(ang))) + em / 5);
                return maxTickSize(options) + (options.tickPadding || 0) + xLabelHeightUsed;
            } else {
                return maxTickSize(options) + (options.tickPadding || 0);
            }
        },

        _getAdjustedLeftPadding: function _getAdjustedLeftPadding(options) {
            var yDomainScaled = this._getYScaledDomain(this.yDomain, this.options);
            var tmpScale = _d2.default.scale.linear().domain(yDomainScaled);
            var yLabels = tmpScale.ticks(options.ticks);

            var format = options.labels.formatter || _d2.default.format(options.labels.format || ',.0f');
            var yAxisText = yLabels.map(format).join('<br>');
            var yLabelBounds = nwt.textBounds(yAxisText, '.y.axis');
            return maxTickSize(this.options.yAxis) + (this.options.yAxis.tickPadding || 0) + yLabelBounds.width;
        },

        _getAdjustedRightPadding: function _getAdjustedRightPadding(options) {
            return this.options.chart.padding.right;
        },

        adjustTitlePadding: function adjustTitlePadding() {
            var titleBounds;
            if (this.options.xAxis.title || this.options.yAxis.title) {
                if (this.options.xAxis.title) {
                    titleBounds = nwt.textBounds(this.options.xAxis.title, '.x.axis-title');
                    this.options.chart.internalPadding.bottom += titleBounds.height + this.options.xAxis.titlePadding;
                }

                if (this.options.yAxis.title) {
                    titleBounds = nwt.textBounds(this.options.yAxis.title, '.y.axis-title');
                    this.options.chart.internalPadding.left += titleBounds.height + this.options.yAxis.titlePadding;
                }
            }
        },

        computeXScale: function computeXScale() {
            if (!this.xDomain) throw new Error('You are trying to render without setting data (xDomain).');

            if (!this.xScale) {
                this.xScaleGenerator = (0, _axisScaleFactory.xScaleFactory)(this.dataSrc, this.options);
                this.xScale = this.xScaleGenerator.scale(this.xDomain);
                this.rangeBand = this.xScaleGenerator.rangeBand();
            } else {
                this.xScaleGenerator.update(this.xDomain, this.dataSrc, this.options);
                this.rangeBand = this.xScaleGenerator.rangeBand();
            }
        },

        computeYScale: function computeYScale() {
            if (!this.yDomain) throw new Error('You are trying to render without setting data (yDomain).');

            var yScaleDomain = this._getYScaledDomain(this.yDomain, this.options);

            if (!this.yScale) {
                this.yScaleGenerator = (0, _axisScaleFactory.yScaleFactory)(this.dataSrc, this.options, this.options.yAxis.type, this.yDomain);
                this.yScale = this.yScaleGenerator.scale(yScaleDomain);
            } else {
                this.yScaleGenerator.update(yScaleDomain, this.dataSrc);
            }
        },

        /**
        * Provides a scaling function based on the xAxis values.
        *
        * ###Example:
        *
        *     var scaledValue = this.xScale(100);
        *
        * @function xScale
        * @param {Number|String} value The value to be scaled.
        * @return {Number} The scaled value according to the current xAxis settings.
        */
        xScale: undefined,

        /**
        * Provides a scaling function based on the yAxis values.
        *
        * ###Example:
        *
        *     var scaledValue = this.yScale(100);
        *
        * @function yScale
        * @param {Number} value The value to be scaled.
        * @return {Number} The scaled value according to the current yAxis settings.
        */
        yScale: undefined,

        /**
        * Modifies the domain for the yAxis.
        *
        * ###Example:
        *
        *     this.setYDomain([100, 200]);
        *
        * @function setYDomain
        * @param {Array} domain The domain array representing the min and max values visible on the yAxis.       */
        setYDomain: function setYDomain(domain) {
            this.yScaleGenerator.setDomain(domain);
        },

        /**
        * Redraws the yAxis with the new settings and domain.
        *
        * ###Example:
        *
        *     this.redrawYAxis();
        *
        * @function redrawYAxis
        */
        redrawYAxis: function redrawYAxis() {
            this.svg.select('.y.axis').call(this.yAxis());
            this.renderGridlines();
        },

        _animationDuration: function _animationDuration() {
            var opt = this.options.chart.animations;
            return opt && opt.enable ? opt.duration != null ? opt.duration : 400 : 0;
        },

        computeScales: function computeScales() {
            this.computeXScale();
            this.computeYScale();

            return this;
        },

        _xAxis: undefined,
        xAxis: function xAxis() {
            if (!this._xAxis) {
                this._xAxis = this.xScaleGenerator.axis().orient(this.options.xAxis.orient);
            }
            return this._xAxis;
        },

        _yAxis: undefined,
        yAxis: function yAxis() {
            if (!this._yAxis) {
                this._yAxis = this.yScaleGenerator.axis().orient(this.options.yAxis.orient);
            }
            return this._yAxis;
        },

        renderXAxis: function renderXAxis() {
            var _this = this;

            var xAxis = this.xAxis();
            var plotHeight = this.options.chart.plotHeight;
            var paddingTop = this.options.chart.internalPadding.top;
            var x = this.options.chart.internalPadding.left;
            var animOpt = this.options.chart.animations;
            var y = this.options.chart.padding.top;
            var t = _d2.default.transition().duration(this._animationDuration());

            var adjustTickLabels = function adjustTickLabels() {
                return function (selection) {
                    if (_this.options.xAxis.zeroPlane) {
                        var adj = plotHeight - y + paddingTop;
                        var textSel = selection.selectAll('.x.axis text');
                        textSel.attr('transform', 'translate(0, ' + adj + ')');
                    }
                };
            };

            if (this.options.xAxis.zeroPlane) {
                y += this.yScale(0);
            } else {
                y += plotHeight;
            }

            this._xAxisGroup = this.svg.selectAll('.x.axis').data([1]);

            if (!this._xAxisGroup.node()) {
                this._xAxisGroup.enter().append('g').attr('transform', 'translate(' + x + ',' + y + ')').attr('class', 'x axis').call(xAxis).call(adjustTickLabels());
            } else {
                var opt = this.options.chart.animations;

                if (opt && opt.enable) {
                    // we can't attached the transition an not configure it so
                    // we need to repeat this both with and without transition
                    this._xAxisGroup.transition(t).attr('transform', 'translate(' + x + ',' + y + ')').call(xAxis).call(adjustTickLabels());
                } else {
                    this._xAxisGroup.attr('transform', 'translate(' + x + ',' + y + ')').call(xAxis).call(adjustTickLabels(true));
                }
            }

            this.xScaleGenerator.postProcessAxis(this._xAxisGroup);

            return this;
        },

        renderYAxis: function renderYAxis() {
            var x = this.options.chart.internalPadding.left;
            var y = this.options.chart.padding.top;

            this._yAxisGroup = this.svg.selectAll('.y.axis').data([1]);

            if (!this._yAxisGroup.node()) {
                this._yAxisGroup.enter().append('g').attr('transform', 'translate(' + x + ',' + y + ')').attr('class', 'y axis');
            } else {
                _d2.default.select(this._yAxisGroup.node()).attr('transform', 'translate(' + x + ',' + y + ')');
            }

            this._renderYAxisElement();

            return this;
        },

        _renderYAxisElement: function _renderYAxisElement() {
            var options = this.options.yAxis;
            var alignmentOffset = { bottom: '.8em', middle: '.35em', top: '0' };
            var animOpt = this.options.chart.animations;

            if (animOpt && animOpt.enable) {
                this._yAxisGroup.transition().duration(this._animationDuration()).call(this.yAxis()).selectAll('.tick text').attr('dy', alignmentOffset[options.labels.verticalAlign]);
            } else {
                this._yAxisGroup.call(this.yAxis()).selectAll('.tick text').attr('dy', alignmentOffset[options.labels.verticalAlign]);
            }
        },

        renderAxisLabels: function renderAxisLabels() {
            var adjustFactor = 40 / 46.609; // this factor is to account for the difference between the actual svg size and what we get from the DOM
            var bounds, x, y;
            var el;

            if (this.options.xAxis.title) {
                bounds = nwt.textBounds(this.options.xAxis.title, '.x.axis-title');
                y = this.options.chart.internalPadding.bottom;
                x = 0;
                el = this._xAxisGroup.selectAll('.x.axis-title').data([1]);
                if (!el.node()) {
                    el.enter().append('text').attr('class', 'x axis-title');
                }

                _d2.default.select(el.node()).attr('x', x).attr('y', y).attr('alignment-baseline', 'after-edge').attr('dx', (this.options.chart.plotWidth - bounds.width) / 2).text(this.options.xAxis.title);
            }

            if (this.options.yAxis.title) {
                bounds = nwt.textBounds(this.options.yAxis.title, '.y.axis-title');
                y = -this.options.chart.internalPadding.left + bounds.height * adjustFactor;
                x = 0;
                el = this._yAxisGroup.selectAll('.y.axis-title').data([1]);
                if (!el.node()) {
                    el.enter().append('text').attr('class', 'y axis-title');
                }

                _d2.default.select(el.node()).attr('class', 'y axis-title').attr('transform', 'rotate(-90)').attr('x', x).attr('y', y).attr('dx', -(this.options.chart.plotHeight + bounds.width) / 2).attr('dy', 0).text(this.options.yAxis.title);
            }

            return this;
        },

        renderGridlines: function renderGridlines() {
            var option = this.options.chart.gridlines;
            var horizontal = option === 'horizontal' || option === 'both';
            var vertical = option === 'vertical' || option === 'both';

            function getYTicks(axis, smart) {
                var tickValues = axis.tickValues();

                if (!tickValues) {
                    var numTicks = axis.ticks()[0];
                    return axis.scale().ticks(numTicks).slice(1);
                }

                if (smart) {
                    tickValues.pop();
                }

                return tickValues.slice(1);
            }

            function getXTicks(axis) {
                return axis.tickValues() || (axis.scale().ticks ? axis.scale().ticks().slice(1) : axis.scale().domain());
            }

            var ticks, gr;
            var x = this.xScale;
            var y = this.yScale;

            if (horizontal) {
                var smartAxis = this.options.yAxis.smartAxis || this.options.yAxis.scaling.type === 'smart';
                ticks = getYTicks(this.yAxis(), smartAxis);
                var w = this.options.chart.plotWidth;

                // remove previous lines (TODO: we need a better way)
                // this._yAxisGroup.select('g.grid-lines').remove();
                gr = this._yAxisGroup.selectAll('.grid-lines').data([ticks]);

                gr.enter().append('svg:g').attr('class', 'grid-lines');

                var lines = gr.selectAll('.grid-line').data(function (d) {
                    return d;
                });

                lines.transition().duration(this._animationDuration()).attr('x1', 0).attr('x2', function () {
                    return w;
                }).attr('y1', y).attr('y2', y);

                lines.enter().append('line').attr('class', 'grid-line').attr('x1', 0).attr('x2', function () {
                    return w;
                }).attr('y1', y).attr('y2', y);

                lines.exit().remove();
            }

            if (vertical) {
                // remove previous lines (TODO: we need a better way)
                this._xAxisGroup.select('g.grid-lines').remove();
                gr = this._xAxisGroup.append('svg:g').attr('class', 'grid-lines');
                ticks = getXTicks(this.xAxis());
                var offset = this.rangeBand / 2;
                var h = this.options.chart.plotHeight;

                gr.selectAll('.grid-line').data(ticks).enter().append('line').attr('class', 'grid-line').attr('x1', function (d) {
                    return x(d) + offset;
                }).attr('x2', function (d) {
                    return x(d) + offset;
                }).attr('y1', -h).attr('y2', 0);
            }

            return this;
        },

        renderBackground: function renderBackground() {
            var options = this.options.chart;
            this.background = this.background || this.createVisualizationLayer('background', 0);
            var g = this.background.selectAll('.plot-area-background').data([null]);

            g.enter().append('rect').attr('class', 'plot-area-background').attr('x', options.internalPadding.left).attr('y', options.internalPadding.top).attr('width', options.plotWidth).attr('height', options.plotHeight);

            g.exit().remove();

            return this;
        },

        renderClipArea: function renderClipArea() {
            var data = this.options.chart.clipPlotArea ? [null] : [];
            var defs = this.svg.selectAll('defs').data(data);
            defs.enter().append('defs');

            var clip = defs.selectAll('clipPath').data(data);
            clip.enter().append('clipPath').attr('id', 'clip');

            var rect = clip.selectAll('rect').data(data);
            rect.enter().append('rect');

            var w = this.options.chart.plotWidth;
            var h = this.options.chart.plotHeight;

            rect.attr('width', w).attr('height', h);

            rect.exit().remove();
            clip.exit().remove();
            defs.exit().remove();

            return this;
        },

        render: function render() {

            this.composeOptions();
            this._normalizeData();
            this.adjustDomain();
            this.calcMetrics();
            this.computeScales();
            this.baseRender();

            this.renderClipArea().renderBackground().renderXAxis().renderYAxis().renderGridlines().renderAxisLabels().renderVisualizations();

            return this;
        },

        datum: function datum(d, index) {
            if (nwt.isObject(d) && Array.isArray(d.data)) return d.data.map(this.datum.bind(this));

            return {
                y: nwt.isObject(d) ? d.y : d,
                x: nwt.isObject(d) ? d.x : this.options.xAxis.categories ? this.options.xAxis.categories[index] : index
            };
        },

        adjustDomain: function adjustDomain() {
            var extents = this.getExtents();
            this._adjustXDomain(extents);
            this._adjustYDomain(extents);

            this._yAxis = null;
            this._xAxis = null;
            this.yScale = null;
        },

        _adjustXDomain: function _adjustXDomain(extents) {
            this.xDomain = this.getXDomain();
            var dataVis = this._visualizations.filter(function (v) {
                return nwt.isSupportedDataFormat(v.data);
            });
            this.dataSrc = nwt.flatten(dataVis.map(function (v) {
                return nwt.flatten(v.data.map(this.datum.bind(this)));
            }.bind(this)));

            // every() on empty array returns true, so we guard against it
            var isCategoricalData = this.dataSrc.length && this.dataSrc.every(function (d) {
                return +d.x !== d.x;
            });
            var dataSrcCategories = nwt.uniq(this.dataSrc.map(function (d) {
                return d.x;
            }));
            var sameCats = this.options.xAxis.categories ? this.options.xAxis.categories.length === dataSrcCategories.length && nwt.intersection(this.options.xAxis.categories, dataSrcCategories).length === dataSrcCategories.length : false;

            if (isCategoricalData && !(this.options.xAxis.categories && sameCats)) {
                this.options.xAxis.categories = dataSrcCategories;
            }
        },

        _adjustYDomain: function _adjustYDomain(extents) {
            this.yDomain = extents.length ? extents : [0, 10];
            this.yMin = this.yDomain[0];
            this.yMax = this.yDomain[this.yDomain.length - 1];
        },

        _normalizeData: function _normalizeData() {
            var opt = this.options;
            this._visualizations.forEach(function (viz) {
                var vizOpt = nwt.merge({}, opt, viz.options);
                viz.normalizeData(vizOpt);
            });
        },

        getExtents: function getExtents(axis) {
            var field = axis && axis === 'x' ? 'xExtent' : 'yExtent';
            var dataVis = this._visualizations.filter(function (v) {
                return nwt.isSupportedDataFormat(v.data);
            });
            var all = nwt.flatten(dataVis.map(function (d) {
                return d[field];
            }));
            return all.length ? _d2.default.extent(all) : [];
        },

        getXDomain: function getXDomain() {
            var dataVis = this._visualizations.filter(function (v) {
                return nwt.isSupportedDataFormat(v.data);
            });
            var all = nwt.uniq(nwt.flatten(dataVis.map(function (d) {
                return d.xDomain;
            })));

            return all;
        }

    };
};

_contour2.default.expose('cartesian', cartesian);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    chart: {
        rotatedFrame: true
    },

    xAxis: {
        orient: 'left'
    },

    yAxis: {
        orient: 'bottom'
    }
};

var frame = {

    init: function init() {
        nwt.merge(this.options, defaults);
    },

    adjustPadding: function adjustPadding() {
        var categoryLabels = this.options.xAxis.categories || this.dataSrc.map(function (d) {
            return d.x;
        });
        var text = categoryLabels.join('<br>');
        var xLabel = nwt.textBounds(text, '.x.axis');
        var yLabel = nwt.textBounds('ABC', '.y.axis');
        var maxTickSize = function maxTickSize(options) {
            return Math.max(options.outerTickSize, options.innerTickSize);
        };

        this.options.chart.internalPadding.left = this.options.chart.padding.left || maxTickSize(this.options.xAxis) + this.options.xAxis.tickPadding + xLabel.width;
        this.options.chart.internalPadding.bottom = this.options.chart.padding.bottom || maxTickSize(this.options.yAxis) + this.options.yAxis.tickPadding + yLabel.height;
    },

    adjustTitlePadding: function adjustTitlePadding() {
        var titleBounds;
        if (this.options.xAxis.title || this.options.yAxis.title) {
            if (this.options.xAxis.title) {
                titleBounds = nwt.textBounds(this.options.xAxis.title, '.x.axis-title');
                this.options.chart.internalPadding.left += titleBounds.height + this.options.xAxis.titlePadding;
            }

            if (this.options.yAxis.title) {
                titleBounds = nwt.textBounds(this.options.yAxis.title, '.y.axis-title');
                this.options.chart.internalPadding.bottom += titleBounds.height + this.options.yAxis.titlePadding;
            }
        }
    },

    renderYAxis: function renderYAxis() {
        var yAxis = this.yAxis();
        var x = this.options.chart.internalPadding.left;
        var y = this.options.chart.padding.top + this.options.chart.plotHeight;

        this._yAxisGroup = this.svg.selectAll('.y.axis').data([1]);

        this._yAxisGroup.enter().append('g').attr('class', 'y axis').attr('transform', 'translate(' + x + ',' + y + ')');

        this._yAxisGroup.exit().remove();

        this._yAxisGroup.transition().duration(this._animationDuration()).attr('transform', 'translate(' + x + ',' + y + ')').call(yAxis);

        return this;
    },

    renderXAxis: function renderXAxis() {
        var x = this.options.chart.internalPadding.left;
        var y = this.options.chart.padding.top;
        var xAxis = this.xAxis();

        this._xAxisGroup = this.svg.selectAll('.x.axis').data([1]);

        this._xAxisGroup.enter().append('g').attr('class', 'x axis').attr('transform', 'translate(' + x + ',' + y + ')');

        this._xAxisGroup.exit().remove();

        this._xAxisGroup.transition().duration(this._animationDuration()).attr('transform', 'translate(' + x + ',' + y + ')').call(xAxis);

        this.xScaleGenerator.postProcessAxis(this._xAxisGroup);

        return this;
    },

    renderAxisLabels: function renderAxisLabels() {
        var lineHeightAdjustment = this.titleOneEm * 0.25; // add 25% of font-size for a complete line-height
        var adjustFactor = 40 / 46.609;
        var el;
        var bounds, anchor, rotation, tickSize, x, y;

        if (this.options.xAxis.title) {
            bounds = nwt.textBounds(this.options.xAxis.title, '.x.axis-title');
            x = this.options.chart.rotatedFrame ? -bounds.height : this.options.chart.plotWidth;
            y = this.options.chart.rotatedFrame ? -this.options.chart.internalPadding.left : this.options.chart.internalPadding.bottom - lineHeightAdjustment;

            rotation = this.options.chart.rotatedFrame ? '-90' : '0';
            el = this._xAxisGroup.selectAll('.x.axis-title').data([null]);

            el.enter().append('text').attr('class', 'x axis-title');

            el.attr('x', 0).attr('y', y).attr('transform', ['rotate(', rotation, ')'].join('')).attr('dy', bounds.height * adjustFactor).attr('dx', -(this.options.chart.plotHeight + bounds.width) / 2).text(this.options.xAxis.title);

            el.exit().remove();
        }

        if (this.options.yAxis.title) {
            bounds = nwt.textBounds(this.options.yAxis.title, '.y.axis-title');
            tickSize = Math.max(this.options.yAxis.innerTickSize, this.options.yAxis.outerTickSize);
            anchor = this.options.chart.rotatedFrame ? 'end' : 'middle';
            x = this.options.chart.rotatedFrame ? this.options.chart.plotWidth : 0;
            y = this.options.chart.rotatedFrame ? this.options.chart.internalPadding.bottom : -this.options.chart.internalPadding.left + this.titleOneEm - lineHeightAdjustment;

            rotation = this.options.chart.rotatedFrame ? '0' : '-90';

            el = this._yAxisGroup.selectAll('.y.axis-title').data([null]);

            el.enter().append('text').attr('class', 'y axis-title');

            el.attr('y', y).attr('x', x).attr('dx', -(this.options.chart.plotWidth + bounds.width) / 2).attr('dy', -4) // just because
            .attr('transform', ['rotate(', rotation, ')'].join('')).text(this.options.yAxis.title);

            el.exit().remove();
        }

        return this;
    }
};

/**
* Sets the visualization frame so that the xAxis is vertical and the yAxis is horizontal.
*
* This visualization requires `.cartesian()`.
*
* This visualization is a prerequiste for rendering bar charts (`.bar()`).
*
* ###Example:
*
*     new Contour({el: '.myChart'})
*        .cartesian()
*        .horizontal()
*        .bar([1, 2, 3, 4, 5, 4, 3, 2, 1])
*        .render()
*
* @function horiztonal
*/

_contour2.default.expose('horizontal', frame);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var root = typeof window === 'undefined' ? undefined : window;

var defaultParams = {
    type: 'image/png', // the mime type of the image; see http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support
    fileName: 'contour.png', // the fileName for the `download()`
    target: undefined, // a selector for the container in which to `place()` the image; for example '#image'
    backgroundColor: '#fff', // the fill color of the image, or `null` for transparent background
    width: undefined, // the width of the exported image; if `height` is falsy then the height will be scaled proportionally
    height: undefined // the height of the exported image; if `width` is falsy then the width will be scaled proportionally
};

// browser capabilities
var browser = {
    checked: false // true after browser capabilities have been checked
};

// queue of operations to perform synchronously
var queue = [];
// true if working on something
var working = false;

/**
* Saves a visualization as an image.
* You can either trigger a download of the image or place the image within a container.
*
* ###Example:
*
*     var chart = new Contour(...)
*         ...
*         .exportable()
*         .render();
*
*     document.getElementById('save').onclick = function () {
*         chart.download({
*             fileName: 'myContourChart.png'
*         });
*
* ###External dependencies:
*
* IE9-11 and Safari won't safely export a canvas to which an SVG has been
* rendered. To get around this limitation in those browsers, we use CanVG
* ("canned veggies"), an implementation of SVG written in JavaScript to
* render the SVG directly to the canvas. During initialization of the
* 'exportable' plugin, CanVG is automatically downloaded from
* http://canvg.googlecode.com/svn/trunk/ if the browser fails the test
* SVG export.
*
* @name exportable
*/
var exportable = function exportable() {
    // CSS properties to ignore for diff
    var cssIgnoreDiff = {
        cssText: 1,
        parentRule: 1
    };
    // CSS properties shared between HTML and SVG
    var cssSharedSvg = {
        font: 1,
        fontFamily: 1,
        fontSize: 1,
        fontSizeAdjust: 1,
        fontStretch: 1,
        fontStyle: 1,
        fontVariant: 1,
        fontWeight: 1,
        direction: 1,
        letterSpacing: 1,
        textDecoration: 1,
        unicodeBidi: 1,
        wordSpacing: 1,
        clip: 1,
        cursor: 1,
        display: 1,
        overflow: 1,
        visibility: 1,
        opacity: 1
    };

    // interface

    return {
        init: function init() {
            // check browser capabilities and set up necessary shims
            // only do this once per page load
            if (!browser.checked) {
                addToQueue(checkBrowser);
            }

            return this;
        },

        /**
        * Saves a visualization as an image, triggering a download.
        *
        * ###Browser variations:
        *
        * - Chrome saves the image.
        * - Firefox and IE10-11 display a prompt, then save the image.
        * - IE9 and Safari open the image in a new tab, enabling the user to manually save the image.
        *
        * ###Example:
        *
        *     var chart = new Contour(...)
        *         ...
        *         .exportable()
        *         .render();
        *
        *     document.getElementById('save').onclick = function () {
        *         chart.download({
        *             fileName: 'contour.png',
        *             width: 640
        *         });
        *
        * @name download
        * @param {object} options Configuration options specific to downloading the image.
        * @param {string} options.type Specifies the mime type of the image. See http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support. Default: 'image/png'.
        * @param {string} options.fileName Specifies the file name for the download. Default: 'contour.png'.
        * @param {string} options.backgroundColor Specifies the fill color of the image. Use `null` for transparent background. Default: '#fff'.
        * @param {int} options.width Specifies the width of the exported image. If `height` is falsy then the height is scaled proportionally. Default: `undefined`, which means don't do any scaling.
        * @param {int} options.height Specifies the height of the exported image. If `width` is falsy then the width is scaled proportionally. Default: `undefined`, which means don't do any scaling.
        */
        download: function download(options) {
            var container = this.container;

            addToQueue(function () {
                exportImage(container, options, 'download');
            });

            return this;
        },

        /**
        * Saves a visualization as an image, placing it within a container.
        *
        * ###Example:
        *
        *     var chart = new Contour(...)
        *         ...
        *         .exportable()
        *         .render();
        *     document.getElementById('save').onclick = function () {
        *         chart.place({
        *             target: '#image'
        *         });
        *
        * @name place
        * @param {object} options Configuration options specific to placing the image in a container.
        * @param {string} options.type Specifies the mime type of the image. See http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support. Default: 'image/png'.
        * @param {string} options.target Specifies a selector for the container. For example: '#image' will append the image into `<div id="image"></div>`.
        * @param {string} options.backgroundColor Specifies the fill color of the image. Use `null` for transparent background. Default: '#fff'.
        * @param {int} options.width Specifies the width of the exported image. If `height` is falsy then the height is scaled proportionally. Default: `undefined`, which means don't do any scaling.
        * @param {int} options.height specifies the height of the exported image. If `width` is falsy then the width is scaled proportionally. Default: `undefined`, which means don't do any scaling.
        */
        place: function place(options) {
            var container = this.container;

            addToQueue(function () {
                exportImage(container, options, 'place');
            });

            return this;
        }
    };

    // SVG to canvas export function
    // adapted from https://github.com/sampumon/SVG.toDataURL
    // which based on http://svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/#svg_to_canvas
    function getSvgDataUrl(svg, options, dataUrlCreated) {
        switch (options.type) {
            case 'image/svg+xml':
                return makeSvgUrl();

            default:
                // 'image/png' or 'image/jpeg'
                return makeImageUrl();
        }

        function encodeBase64DataUrl(svgXml) {
            // https://developer.mozilla.org/en/DOM/window.btoa
            return 'data:image/svg+xml;base64,' + btoa(svgXml);
        }

        // convert base64/URLEncoded data component to raw binary data held in a string
        function dataUrlToBlob(dataUrl) {
            /*jshint nonstandard:true*/
            var byteString;
            if (dataUrl.split(',')[0].indexOf('base64') >= 0) {
                byteString = atob(dataUrl.split(',')[1]);
            } else {
                byteString = unescape(dataUrl.split(',')[1]);
            }

            // separate out the mime component
            var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var byteArray = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                byteArray[i] = byteString.charCodeAt(i);
            }

            return new Blob([byteArray], {
                type: mimeString
            });
        }

        function makeSvgUrl() {
            var svgXml = new XMLSerializer().serializeToString(svg);
            var svgDataUrl = encodeBase64DataUrl(svgXml);

            dataUrlCreated(svgDataUrl, null, function () {});
        }

        function makeImageUrl() {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            var svgXml = new XMLSerializer().serializeToString(svg);

            if (root.canvg) {
                // use Canvg renderer for image export
                renderImageCanvg();
            } else {
                // use native renderer for image export (this might fail)
                renderImageNative();
            }

            function imageRendered() {
                var imageDataUrl = canvas.toDataURL(options.type);

                if (browser.createsObjectUrls) {
                    var imageBlob = dataUrlToBlob(imageDataUrl);

                    var domUrl = root.URL || root.webkitURL;
                    var objectUrl = domUrl.createObjectURL(imageBlob);

                    dataUrlCreated(objectUrl, imageBlob, function () {
                        domUrl.revokeObjectURL(objectUrl);
                    });
                } else {
                    dataUrlCreated(imageDataUrl, null, function () {});
                }
            }

            function renderImageNative() {
                var svgImg = new Image();
                svgImg.src = encodeBase64DataUrl(svgXml);

                svgImg.onload = function () {
                    canvas.width = svgImg.width;
                    canvas.height = svgImg.height;

                    if (options.backgroundColor) {
                        context.fillStyle = options.backgroundColor;
                        context.fillRect(0, 0, svgImg.width, svgImg.height);
                    }

                    context.drawImage(svgImg, 0, 0);

                    imageRendered();
                };

                svgImg.onerror = function () {
                    throw new Error('Cannot export image');
                };
            }

            function renderImageCanvg() {
                // note that Canvg gets the SVG element dimensions incorrectly if not specified as attributes
                // also this Canvg call is synchronous and blocks
                canvg(canvas, svgXml, {
                    ignoreMouse: true,
                    ignoreAnimation: true,
                    offsetX: undefined,
                    offsetY: undefined,
                    scaleWidth: undefined,
                    scaleHeight: undefined,
                    renderCallback: imageRendered
                });
            }
        }
    }

    // clone SVG in isolation with styles directly applied
    function createSvgClone(svgNode, svgCloned) {
        createIsolatedNode(function (nodeClone, destroyIsolatedNode) {
            // clone nodes and apply styles directly to each node
            cloneNodes(svgNode, nodeClone);

            // clone legend DIV as SVG
            cloneLegendDiv(svgNode, nodeClone);

            svgCloned(d3.select(nodeClone).select('svg').node(), destroyIsolatedNode);
        });

        // compare computed styles at this node and apply the differences directly
        function applyStyles(sourceNode, targetNode) {
            var sourceStyle = root.getComputedStyle(sourceNode);
            var targetStyle = root.getComputedStyle(targetNode);

            for (var prop in sourceStyle) {
                if (!cssIgnoreDiff[prop] && !isFinite(prop)) {
                    // note that checking for sourceStyle.hasOwnProperty(prop) eliminates all valid style properties in Firefox
                    if (targetStyle[prop] !== sourceStyle[prop]) {
                        targetNode.style[prop] = sourceStyle[prop];
                    }
                }
            }
        }

        // clone nodes and apply styles directly to each node
        function cloneNodes(sourceNode, targetNode) {
            var newNode = sourceNode.cloneNode(false);
            targetNode.appendChild(newNode);

            if (!sourceNode.tagName) return; // skip inner text

            // compare computed styles at this node and apply the differences directly
            applyStyles(sourceNode, newNode);

            [].forEach.call(sourceNode.childNodes, function (childNode) {
                // clone each child node and apply styles
                cloneNodes(childNode, newNode);
            });
        }

        function createIsolatedNode(nodeLoaded) {
            var iframe = document.body.appendChild(document.createElement('iframe'));
            iframe.style.visibility = 'hidden';
            var iframeWindow = iframe.contentWindow;
            var iframeDocument = iframeWindow.document;

            iframe.onload = function () {
                var nodeClone = iframeDocument.createElement('div');
                iframeDocument.body.appendChild(nodeClone);

                var destroyIframe = function destroyIframe() {
                    // destroy clone
                    iframeDocument.body.removeChild(nodeClone);
                    document.body.removeChild(iframe);
                };

                nodeLoaded(nodeClone, destroyIframe);
            };

            iframeDocument.open();
            iframeDocument.write('<!DOCTYPE html>');
            iframeDocument.write('<html><head></head><body></body></html>');
            iframeDocument.close();
        }

        function applyDivStylesToSvg(sourceNode, target) {
            var targetNode = target.node();
            var sourceStyle = root.getComputedStyle(sourceNode);
            var targetStyle = root.getComputedStyle(targetNode);

            for (var prop in sourceStyle) {
                if (cssSharedSvg[prop]) {
                    // note that checking for sourceStyle.hasOwnProperty(prop) eliminates all valid style properties in Firefox
                    if (targetStyle[prop] !== sourceStyle[prop]) {
                        targetNode.style[prop] = sourceStyle[prop];
                    }
                }
            }

            // translate DIV styles to SVG attributes and styles
            switch (targetNode.nodeName) {
                case 'rect':
                    target.attr({
                        'rx': sourceStyle.borderTopLeftRadius,
                        'ry': sourceStyle.borderTopLeftRadius
                    });
                    target.style({
                        'fill': sourceStyle.backgroundColor,
                        'stroke': sourceStyle.borderLeftColor,
                        'stroke-width': sourceStyle.borderLeftWidth
                    });
                    break;
                case 'text':
                    target.style({
                        'fill': sourceStyle.color
                    });
                    break;
            }
        }

        function cloneLegendDiv(sourceNode, targetNode) {
            var containerDiv = d3.select(sourceNode.parentNode).select('div.contour-legend');
            if (containerDiv.empty()) return;

            var containerDivNode = containerDiv.node();

            var containerSvg = d3.select(targetNode).select('svg').append('g').attr('transform', 'translate(' + (containerDivNode.offsetLeft + containerDivNode.clientLeft) + ',' + (containerDivNode.offsetTop + containerDivNode.clientTop) + ')');
            applyDivStylesToSvg(containerDivNode, containerSvg);

            var rect = containerSvg.append('rect').attr('width', containerDivNode.clientWidth).attr('height', containerDivNode.clientHeight);
            applyDivStylesToSvg(containerDivNode, rect);

            var entriesDivs = containerDiv.selectAll('.contour-legend-entry');

            entriesDivs[0].forEach(function (entryDivNode) {
                var entryDiv = d3.select(entryDivNode);

                var enter = containerSvg.append('g');
                applyDivStylesToSvg(entryDivNode, enter);

                var entryDivKeyNode = getEntryDivSubNode('.contour-legend-key');
                var swatch = enter.append('rect').attr('x', entryDivKeyNode.offsetLeft).attr('y', entryDivKeyNode.offsetTop).attr('width', entryDivKeyNode.offsetWidth - 2).attr('height', entryDivKeyNode.offsetHeight - 2);
                applyDivStylesToSvg(entryDivKeyNode, swatch);

                var entryDivSeriesNode = getEntryDivSubNode('.series-name');
                var text = enter.append('text').attr('x', entryDivSeriesNode.offsetLeft + 1).attr('y', entryDivSeriesNode.offsetTop + entryDivSeriesNode.offsetHeight - entryDivSeriesNode.offsetParent.clientTop - 2).text(entryDivSeriesNode.textContent);
                applyDivStylesToSvg(entryDivSeriesNode, text);

                function getEntryDivSubNode(selector) {
                    return entryDiv.select(selector).node();
                }
            });
        }
    }

    function getProportionedBounds(original, specified) {
        if (specified.width && specified.height) {
            return specified;
        } else if (specified.width) {
            return {
                width: specified.width,
                height: specified.width * original.height / original.width
            };
        } else if (specified.height) {
            return {
                width: specified.height * original.width / original.height,
                height: specified.height
            };
        } else {
            return original;
        }
    }

    function exportImage(container, options, exporter) {
        startWork();

        // merge configuration options with defaults
        options = options || {};
        nwt.defaults(options, defaultParams);

        var svgNode = container.select('svg').node();
        // get bounds from original SVG, and proportion them based on specified options
        var bounds = svgNode.getBoundingClientRect();
        var boundsClone = getProportionedBounds(bounds, options);

        // clone SVG in isolation with styles directly applied
        createSvgClone(svgNode, performExport);

        function performExport(svgNodeClone, destroySvgClone) {
            svgNodeClone.setAttribute('width', boundsClone.width);
            svgNodeClone.setAttribute('height', boundsClone.height);

            // Safari can only open a new tab with the image
            // the tab must be opened before `getSvgDataUrl()` to avoid getting blocked due to asynchronous callbacks
            var win;
            if (exporter === 'download' && !(browser.aDownloads || browser.savesMsBlobs)) {
                win = root.open();
            }

            getSvgDataUrl(svgNodeClone, options, function (url, blob, revokeUrl) {
                destroySvgClone();

                // exporter functions
                var exporters = {
                    'download': function download() {
                        if (browser.aDownloads) {
                            // make a link to download and click it
                            var a = document.createElement('a');
                            a.download = options.fileName;
                            a.href = url;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        } else if (browser.savesMsBlobs && blob) {
                            // IE10-11 support a method to save/open a blob
                            navigator.msSaveOrOpenBlob(blob, options.fileName);
                        } else {
                            // Safari and IE9 can only open a new tab with the image
                            if (!win) {
                                // in case `blob` was falsy or the `open()` above returned undefined, `win` will be undefined, so attempt here (and this might return undefined as well)
                                win = root.open();
                            }
                            if (win) {
                                if (browser.createsObjectUrls) {
                                    // Safari can set the url of the newly-opened tab to the object URL of the blob
                                    win.location = url;
                                } else {
                                    // for IE9, create a document with the image
                                    var doc = win.document;
                                    doc.write('<!DOCTYPE html>');
                                    doc.write('<html><head></head><body>');
                                    doc.write('<img src="' + url + '">');
                                    doc.write('</body></html>');
                                }
                            }
                        }
                        // wait for download to start
                        setTimeout(function () {
                            revokeUrl();
                            finishWork();
                        }, 1);
                    },
                    'place': function place() {
                        var img = document.createElement('img');
                        img.onload = function () {
                            revokeUrl();
                            finishWork();
                        };
                        img.src = url;
                        d3.select(options.target).node().appendChild(img);
                    }
                };
                // call exporter function
                exporters[exporter]();
            });
        }
    }
};

// queue functions

// queue will wait until any asynchronous tasks are complete prior to calling the next fn()
function addToQueue(fn) {
    if (working) {
        queue.push(fn);
    } else {
        fn();
    }
}

// call before starting an asynchronous task
function startWork() {
    working = true;
}

// call after finishing an asynchronous task
function finishWork() {
    working = false;

    var fn = queue.shift();
    if (fn) {
        fn();
    }
}

// check browser capabilities and set up necessary shims
function checkBrowser() {
    startWork();
    browser.checked = true;

    checkEncodesBase64();
    checkADownloads();
    checkSavesMsBlobs();
    checkCreatesObjectUrls();
    checkExportsSvg(finishWork);

    function checkEncodesBase64() {
        browser.encodesBase64 = !!root.btoa;

        // setup shim for IE9
        if (!browser.encodesBase64) {
            setupBase64Shim();
        }
    }

    function checkADownloads() {
        browser.aDownloads = document.createElement('a').download !== undefined;
    }

    function checkSavesMsBlobs() {
        browser.savesMsBlobs = !!navigator.msSaveOrOpenBlob;
    }

    function checkCreatesObjectUrls() {
        var domUrl = root.URL || root.webkitURL;
        browser.createsObjectUrls = domUrl && domUrl.createObjectURL;
    }

    function checkExportsSvg() {
        startWork();

        browser.exportsSvg = false;

        var iframe = document.body.appendChild(document.createElement('iframe'));
        iframe.style.visibility = 'hidden';
        var doc = iframe.contentWindow.document;

        iframe.onload = function () {
            try {
                var svg = doc.querySelector('svg');
                var img = doc.querySelector('img');
                var canvas = doc.querySelector('canvas');
                var context = canvas.getContext('2d');
                canvas.width = img.getAttribute('width') * 1;
                canvas.height = img.getAttribute('height') * 1;
                var sourceImg = new Image();
                sourceImg.width = canvas.width;
                sourceImg.height = canvas.height;
                sourceImg.onload = function () {
                    try {
                        context.drawImage(sourceImg, 0, 0, img.width, img.height);
                        img.src = canvas.toDataURL();

                        browser.exportsSvg = true; // yay
                    } catch (e) {}

                    svgExportChecked();
                };
                var xml = new XMLSerializer().serializeToString(svg);
                sourceImg.src = 'data:image/svg+xml,' + encodeURIComponent(xml);
            } catch (e) {
                svgExportChecked();
            }
        };

        doc.open();
        doc.write('<!DOCTYPE html>');
        doc.write('<html><head></head><body>');
        doc.write('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 1 1"><circle r="1" fill="red"/></svg>');
        doc.write('<img width="2" height="2">');
        doc.write('<canvas></canvas>');
        doc.write('</body></html>');
        doc.close();

        function svgExportChecked() {
            document.body.removeChild(iframe);

            // load Canvg SVG renderer for browsers that can't safely export SVG
            if (browser.exportsSvg) {
                finishWork();
            } else {
                setupCanvgShim(finishWork);
            }
        }
    }

    // base64 shim, for IE9
    function setupBase64Shim() {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        function InvalidCharacterError(message) {
            this.message = message;
        }
        InvalidCharacterError.prototype = new Error();
        InvalidCharacterError.prototype.name = 'InvalidCharacterError';

        // base64 encoder
        // from https://gist.github.com/999166
        root.btoa = function (input) {
            var str = String(input);
            for (
            // initialize result and counter
            var block, charCode, idx = 0, map = chars, output = '';
            // if the next str index does not exist:
            //   change the mapping table to "="
            //   check if d has no fractional digits
            str.charAt(idx | 0) || (map = '=', idx % 1);
            // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
            output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
                charCode = str.charCodeAt(idx += 3 / 4);
                if (charCode > 0xFF) {
                    throw new InvalidCharacterError('"btoa" failed: The string to be encoded contains characters outside of the Latin1 range.');
                }
                block = block << 8 | charCode;
            }
            return output;
        };
    }

    // Canvg shim, for IE9-11 and Safari
    function setupCanvgShim(done) {
        var scripts = ['https://cdnjs.cloudflare.com/ajax/libs/canvg/1.4/rgbcolor.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/stackblur-canvas/1.4.1/stackblur.min.js', 'https://cdn.jsdelivr.net/npm/canvg/dist/browser/canvg.min.js'];
        var remaining = scripts.length;
        scripts.forEach(function (srcURL) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.onload = function () {
                remaining--;
                if (remaining === 0) done();
            };
            script.src = srcURL;
            document.head.appendChild(script);
        });
    }
}

_contour2.default.expose('exportable', exportable);

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    xAxis: {
        type: 'linear'
    },
    area: {
        stacked: true,
        areaBase: undefined
    }
};

defaults.area.preprocess = nwt.minMaxFilter(1000);

function renderer(data, layer, options) {
    this.checkDependencies('cartesian');
    var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    var x = function (val) {
        return this.xScale(val) + this.rangeBand / 2 + 0.5;
    }.bind(this);
    var y = function (val) {
        return this.yScale(val) + 0.5;
    }.bind(this);
    var h = options.chart.plotHeight;
    var classFn = function classFn(d, i) {
        return 'series s-' + (i + 1) + ' ' + d.name;
    };
    var stack = _d2.default.layout.stack().values(function (d) {
        return d.data;
    });

    var startArea = _d2.default.svg.area().x(function (d) {
        return x(d.x);
    }).y0(function (d) {
        return h;
    }).y1(function (d) {
        return h;
    });

    var areaBase = options.area.areaBase != null ? options.area.areaBase : options.yAxis.min;
    var area = _d2.default.svg.area().x(function (d) {
        return x(d.x);
    }).y0(function (d) {
        return options.area.stacked ? y(d.y0 || areaBase || 0) : y(0);
    }).y1(function (d) {
        return y((options.area.stacked ? d.y0 : 0) + d.y);
    });

    if (options.area.smooth) {
        area.interpolate('cardinal');
        startArea.interpolate('cardinal');
    }

    renderSeries();

    if (options.tooltip && options.tooltip.enable) renderTooltipTrackers();

    function renderSeries() {
        data = options.area.preprocess(data);

        var series = layer.selectAll('g.series').data(stack(data));

        series.enter().append('svg:g').append('path').datum(function (d) {
            return d.data;
        }).attr('class', 'area').attr('d', startArea);

        series.attr('class', classFn);
        series.exit().remove();

        if (options.chart.animations && options.chart.animations.enable) {
            series.select('.area').datum(function (d) {
                return d.data;
            }).transition().duration(options.chart.animations.duration || duration).attr('d', area);
        } else {
            series.select('.area').datum(function (d) {
                return d.data;
            }).attr('d', area);
        }
    }

    function renderTooltipTrackers() {
        var trackerSize = 10;
        // add the tooltip trackers regardless
        var markers = layer.selectAll('.tooltip-trackers').data(data, function (d) {
            return d.name;
        });

        markers.enter().append('g').attr('class', 'tooltip-trackers');

        markers.exit().remove();

        var blocks = markers.selectAll('.tooltip-tracker').data(function (d) {
            return d.data;
        }, function (d, i) {
            return [d.x, d.y, d.y0].join('&');
        });

        blocks.enter().append('rect').attr('class', 'tooltip-tracker').attr('opacity', 0).attr('width', trackerSize * 2);

        blocks.attr('x', function (d) {
            return x(d.x) - trackerSize;
        }).attr('y', function (d) {
            return y((options.area.stacked ? d.y0 : 0) + d.y);
        }).attr('height', function (d) {
            return y(0) - y(d.y);
        });

        blocks.exit().remove();
    }
}

renderer.defaults = defaults;

/**
* Adds an area chart to the Contour instance.
*
* Area charts are stacked by default when the _data_ includes multiple series.
*
* This visualization requires `.cartesian()`.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*           .cartesian()
*           .area([1,2,3,4])
*           .render();
*
* @name area(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
_contour2.default.export('area', renderer);

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    bar: {
        barClass: null,
        style: null,
        stacked: false,
        groupPadding: 2, // two px between same group bars
        barWidth: null,
        offset: function offset() {
            return 0;
        },
        preprocess: function preprocess(data) {
            return data;
        }
    }
};

function barRender(data, layer, options) {
    this.checkDependencies(['cartesian', 'horizontal']);
    var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    var _this = this;
    var opt = options.bar;
    var rectClass = opt.barClass;
    var style = opt.style;
    var x = function x(d) {
        return _this.xScale(d) - 0.5;
    };
    var y = function y(d) {
        var yScale = _this.yScale(d) + 0.5;
        return yScale;
    };
    var chartOffset = nwt.getValue(opt.offset, 0, this);
    var rangeBand = nwt.getValue(opt.barWidth, this.rangeBand, this);
    var stack = nwt.stackLayout();
    var update = options.bar.stacked ? stacked : grouped;
    var enter = nwt.partialRight(update, true);
    var classFn = function classFn(d, i) {
        return 'series s-' + (i + 1) + ' ' + d.name;
    };

    data = options.bar.preprocess(data);
    var series = layer.selectAll('g.series').data(stack(data));

    series.enter().append('svg:g');
    series.attr('class', classFn);
    series.exit().remove();

    var bars = series.selectAll('.bar').data(function (d) {
        return d.data;
    });

    var cssClass = 'bar' + (options.tooltip.enable ? ' tooltip-tracker' : '');
    bars.enter().append('rect').attr('class', function (d, i, j) {
        if (!rectClass) return cssClass;

        return cssClass + ' ' + (typeof rectClass === 'function' ? rectClass.call(this, d, i, j) : rectClass);
    }).call(enter);

    if (options.chart.animations && options.chart.animations.enable) {
        bars.attr('style', style).transition().duration(duration).call(update);
        bars.exit().transition().duration(duration).attr('width', y(0)).remove();
    } else {
        bars.attr('style', style).call(update);
        bars.exit().remove();
    }

    function stacked(bar, enter) {
        bar.attr('y', function (d) {
            return x(d.x) + chartOffset;
        }).attr('height', rangeBand);

        if (enter) {
            return bar.attr('x', function (d) {
                return y(0);
            }).attr('width', function (d) {
                return 0;
            });
        } else {
            return bar.attr('x', function (d) {
                return d.y >= 0 ? y(d.y0 || 0) : y(d.y + d.y0);
            }).attr('width', function (d) {
                return d.y >= 0 ? y(d.y) - y(0) : y(0) - y(d.y);
            });
        }
    }

    function grouped(bar, enter) {
        var numSeries = data.length;
        var height = function height() {
            var h = rangeBand / numSeries - options.bar.groupPadding + 0.5;
            return h;
        };
        var offset = function offset(d, i) {
            return rangeBand / numSeries * i + 0.5;
        };

        bar.attr('y', function (d, i, j) {
            return x(d.x) + offset(d, j) + chartOffset;
        }).attr('height', height);

        if (enter) {
            return bar.attr('x', y(0)).attr('width', function (d) {
                return 0.5;
            });
        } else {
            return bar.attr('width', function (d) {
                return d.y >= 0 ? y(d.y) - y(0) : y(0) - y(d.y);
            }).attr('x', function (d) {
                return d.y < 0 ? y(d.y) : y(0);
            });
        }
    }
}

barRender.defaults = defaults;
/**
* Adds a bar chart (horizontal columns) to the Contour instance.
*
* You can use this visualization to render both stacked and grouped charts (controlled through the _options_).
*
* This visualization requires `.cartesian()` and `.horizontal()`.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*       .cartesian()
*       .horizontal()
*       .bar([1,2,3,4])
*       .render();
*
* @name bar(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
_contour2.default.export('bar', barRender);

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    column: {
        // specifies a class string or function that will be added to each column
        columnClass: null,
        style: null,
        stacked: false,
        groupPadding: 1,
        columnWidth: null,
        offset: function offset() {
            return 0;
        }
    }
};

function render(data, layer, options) {
    this.checkDependencies('cartesian');
    var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    var opt = options.column;
    var h = options.chart.plotHeight;
    var rectClass = options.column.columnClass;
    var rectStyle = options.column.style;
    var _this = this;
    var x = function x(v) {
        return Math.round(_this.xScale(v)) + 0.5;
    };
    var y = function y(v) {
        return Math.round(_this.yScale(v)) - 0.5;
    };
    var dataKey = function dataKey(d) {
        return d.data;
    };
    var chartOffset = nwt.getValue(opt.offset, 0, this);
    var rangeBand = nwt.getValue(opt.columnWidth, this.rangeBand, this);
    var enter = nwt.partialRight(options.column.stacked ? stacked : grouped, true);
    var update = options.column.stacked ? stacked : grouped;
    var filteredData = data.map(function (series, j) {
        return {
            name: series.name,
            data: series.data.filter(function (d, i) {
                return i === 0 ? true : x(d.x) !== x(series.data[i - 1].x);
            })
        };
    });
    var classFn = function classFn(d, i) {
        return d.name + " series s-" + (i + 1) + ' ' + d.name;
    };

    var stack = nwt.stackLayout();
    var series = layer.selectAll('g.series').data(stack(filteredData));

    series.enter().append('g');
    series.attr("class", classFn);
    series.exit().remove();

    var cols = series.selectAll('.column').data(dataKey, function (d) {
        return d.x || d;
    });

    var cssClass = 'column' + (options.tooltip.enable ? ' tooltip-tracker' : '');

    cols.enter().append('rect').attr('class', function (d, i, j) {
        if (!rectClass) return cssClass;

        return cssClass + ' ' + (typeof rectClass === 'function' ? rectClass.call(this, d, i, j) : rectClass);
    }).call(enter);

    if (options.chart.animations && options.chart.animations.enable) {
        cols.exit().transition().duration(duration).attr('y', h).attr('height', function () {
            return 0.5;
        }).remove();
        cols.transition().duration(duration).call(update);
    } else {
        cols.exit().remove();
        cols.call(update);
    }

    // for every update
    cols.attr('style', rectStyle);

    function stacked(col, enter) {
        var base = y(0);

        col.attr('x', function (d) {
            return x(d.x) + chartOffset;
        }).attr('width', function () {
            return rangeBand;
        });

        if (enter) {
            col.attr('y', function (d) {
                return d.y >= 0 ? base : base;
            }).attr('height', function (d) {
                return 0.5;
            });
        } else {
            col.attr('y', function (d) {
                return d.y >= 0 ? y(d.y) + y(d.y0) - base : y(d.y0);
            }).attr('height', function (d) {
                return d.y >= 0 ? base - y(d.y) : y(d.y) - base;
            });
        }
    }

    function grouped(col, enter) {
        var width = rangeBand / data.length - opt.groupPadding + 0.5;
        var offset = function offset(d, i) {
            return rangeBand / data.length * i + 0.5;
        };
        var base = y(0);

        col.attr('x', function (d, i, j) {
            return x(d.x) + offset(d, j) + chartOffset;
        }).attr('width', width);

        if (enter) {
            col.attr('y', base).attr('height', 0);
        } else {
            col.attr('y', function (d) {
                return d.y >= 0 ? y(d.y) : base;
            }).attr('height', function (d) {
                return d.y >= 0 ? base - y(d.y) : y(d.y) - base;
            });
        }
    }
}

render.defaults = defaults;

/**
* Adds a column chart (vertical columns) to the Contour instance.
*
* This visualization requires `.cartesian()`.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*           .cartesian()
*           .column([1,2,3,4])
*           .render();
*
* @name column(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
_contour2.default.export('column', render);

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_contour2.default.export('coolNarwhal', function (data, layer) {
    layer.append('path').attr('class', 'cool').attr('opacity', 0).attr('transform', 'scale(.5) translate(500 150)').attr('d', 'M-220.02,76.509l-0.78,8.927c-0.956,10.949,1.389,20.422,6.188,30.383c10.203,21.173,63.095,84.05,93.72,115.075c20.145,20.406,19.487,23.018,21.549,40.122c2.487,20.621,24.897,66.462,40.838,71.269 c15.086,4.549,12.91-12.398,13.319-37.83c5.746,2.457,10.917,5.638,20.206,12.697c61.697,46.892,139.734,69.97,206.5,71.733c46.209,1.221,81.432-7.081,142.957-33.694c40.484-17.512,54.271-22.098,65.639-21.504c4.432,0.232,22.678,11.204,41.746,21.563c35.398,19.229,69.457,34.595,75.896,34.239c12.609-1.457-0.701-11.783-8.072-24.217c-7.049-11.892-15.414-29.572-18.844-42.134s-4.723-22.272-8.91-27.091c-2.143-2.463-12.812-6.786-21.189-8.146c-18.045-2.933-22.191-2.922-13.531-8.957c13.076-9.115,17.377-11.039,1.826-29.068c-6.383-7.402-11.336-20.003-13.709-39.542c-1.607-13.237,1.057-23.679-3.869-27.451s-17.271,12.341-20.846,19.334c-2.01,3.937-7.102,19.005-11.312,33.485c-13.795,47.427-29.865,65.742-62.693,71.447c-34.361,5.971-71.623-9.506-116.543-48.404c-13.164-11.399-29.533-25.26-39.254-36.913c-13.428-16.101-15.48-18.138-19.785-20.66c-16.166-9.472-54.98-31.694-103.525-63.815c-24.393-16.141-57.72-36.928-71.453-43.693c-27.236-13.417-68.416-28.952-90.731-46.771c-24.665-19.697-38.108-19.793-67.804-5.479c-21.429,10.328-23.941,15.298-26.52,15.726c-8.216-10.129-22.917-11.198-31.647-20.682c-9.529-10.35-28.027-14.098-37.824-24.957c-10.668-11.826-31.25-16.752-40.886-26.94c-11.339-11.989-29.387-16.096-40.838-26.637c-11.617-10.694-27.159-14.843-37.68-24.045c-10.383-9.082-23.187-12.538-31.408-19.163c-8.193-6.601-16.593-9.444-22.026-11.993c-5.433-2.549-7.398-2.522-7.658-1.927c-0.26,0.594,1.355,2.955,6.054,6.447c4.699,3.491,22.193,18.451,31.645,22.77c10.921,5.104,17.502,15.01,29.671,21.375c13.224,6.918,22.212,18.731,36.229,25.924c15.53,7.971,24.754,21.184,39.657,28.253c16.462,7.808,25.503,21.598,39.958,28.36c14.499,6.78,20.647,20.252,34.429,23.428C-238.033,58.207-227.932,70.443-220.02,76.509L-220.02,76.509z').transition().delay(300).duration(2000).attr('opacity', 1);
});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    legend: {
        vAlign: 'middle',
        hAlign: 'right',
        direction: 'vertical',
        enabled: true,
        formatter: function formatter(d) {
            return d.name;
        },
        el: undefined
    }
};

function validAlignmentClasses(options) {
    var classes = [];
    if (['top', 'middle', 'bottom'].indexOf(options.legend.vAlign) !== -1) {
        classes.push(options.legend.vAlign);
    } else {
        classes.push('top');
    }

    if (['left', 'center', 'right'].indexOf(options.legend.hAlign) !== -1) {
        classes.push(options.legend.hAlign);
    } else {
        classes.push('right');
    }

    if (options.legend.direction === 'vertical') {
        classes.push('vertical');
    }

    return classes;
}

function Legend(data, layer, options) {
    if (options.legend.enabled === false) {
        return;
    }
    var container;
    if (options.legend.el) {
        container = _d2.default.select(options.legend.el).node();
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    } else {
        this.container.selectAll('.contour-legend').remove();
    }
    var em = nwt.textBounds('series', '.contour-legend.contour-legend-entry');
    var count = data.length;
    var legendHeight = (em.height + 4) * count + 12; // legend has 1px border and 5px margin (12px) and each entry has ~2px margin
    var mid = (options.chart.plotHeight - legendHeight) / 2;
    var positioner = function positioner(selection) {
        // adjust position of legend only when is horizontally centered
        // since we need to have all elements in the legend to calculate its width
        if (options.legend.hAlign !== 'center' || !selection.length) {
            return;
        }

        // adjust the left
        var legendWidth = selection[0].parentNode.clientWidth;
        var left = (options.chart.plotWidth - legendWidth) / 2 + options.chart.internalPadding.left;

        _d2.default.select(selection[0].parentNode).style('left', left + 'px');
    };

    if (options.legend.el) {
        container = _d2.default.select(options.legend.el);
    } else {
        var legend = this.container.selectAll('.contour-legend').data([null]);
        container = legend.enter().append('div');
    }

    container.attr('class', function () {
        return ['contour-legend'].concat(validAlignmentClasses(options)).join(' ');
    });

    container.attr('style', function () {
        var styles = [];

        if (options.legend.vAlign === 'top') {
            styles.push('top: 0');
        } else if (options.legend.vAlign === 'middle') {
            styles.push('top: ' + mid + 'px');
        } else {
            styles.push('bottom: ' + (options.chart.internalPadding.bottom + 5) + 'px');
        }

        if (options.legend.hAlign === 'left') {
            styles.push('left: ' + options.chart.plotLeft + 'px');
        } else if (options.legend.hAlign === 'center') {
            var bounds = nwt.textBounds(this, '.contour-legend');

            styles.push('left: ' + ((options.chart.plotWidth - bounds.width) / 2 + options.chart.internalPadding.left) + 'px');
        } else {
            styles.push('right: 10px');
        }

        return styles.join(';');
    });

    var entries = container.selectAll('.contour-legend-entry').data(data);

    entries.enter().append('div').attr('class', function () {
        return 'contour-legend-entry';
    });

    entries.append('span').attr('class', function (d, i) {
        return 'contour-legend-key series s-' + (i + 1) + ' ' + nwt.seriesNameToClass(d.name);
    });

    entries.append('span').attr('class', 'series-name').text(options.legend.formatter).call(positioner);

    entries.exit().remove();
}

Legend.defaults = defaults;

/**
* Adds a legend to the Contour instance. One entry is added to the legend for each series in the data.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*           .cartesian()
*           .column(data)
*           .legend(data)
*           .render();
*
* @name legend(data, options)
* @param {object|array} data The _data series_ for which to create a legend. This can be in any of the supported formats.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
* @see {core_config/config.legend} legend options
*
*/

_contour2.default.export('legend', Legend);

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    xAxis: {
        type: 'linear'
    },
    line: {
        stacked: false,
        smooth: false,
        animationDirection: 'left-to-right',
        // animationDirection: 'bottom-to-top',
        marker: {
            enable: true,
            size: 3,
            animationDelay: null
        }
    }
};

defaults.line.preprocess = nwt.minMaxFilter(1000);
var duration;
var animationDirection;
var animationsMap = {
    'left-to-right': {
        enter: function enter(line) {
            var path = this;
            path.each(function () {
                var totalLength = this.getTotalLength();
                _d2.default.select(this).attr('stroke-dasharray', totalLength + ' ' + totalLength).attr('stroke-dashoffset', totalLength).transition().duration(duration).ease('linear').attr('stroke-dashoffset', 0).transition().duration(0).attr('stroke-dasharray', undefined);
            });
        },

        update: function update(line) {
            this.attr('d', function (d) {
                return line(d.data);
            });
            this.each(function () {
                var totalLength = this.getTotalLength();
                _d2.default.select(this).attr('stroke-dasharray', totalLength + ' ' + totalLength).attr('stroke-dashoffset', totalLength).transition().duration(duration).ease('linear').attr('stroke-dashoffset', 0).transition().duration(0).attr('stroke-dasharray', undefined);
            });
        }
    },

    'bottom-to-top': {
        enter: function enter(line) {
            this.transition().duration(duration).attr('d', function (d) {
                return line(d.data);
            });
        },

        update: function update(line) {
            this.transition().duration(duration).attr('d', function (d) {
                return line(d.data);
            });
        }
    }
};

function render(rawData, layer, options, id) {
    this.checkDependencies('cartesian');

    var x = function (d) {
        return this.xScale(d.x) + this.rangeBand / 2 + 0.5;
    }.bind(this);
    var y = function (d) {
        return this.yScale(d.y + (d.y0 || 0)) + 0.5;
    }.bind(this);
    var shouldAnimate = options.chart.animations && options.chart.animations.enable;
    animationDirection = options.line.animationDirection || 'left-to-right';
    duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    // jshint eqnull:true
    var data = options.line.preprocess(nwt.cleanNullValues()(rawData));

    data = options.line.stacked ? _d2.default.layout.stack().values(function (d) {
        return d.data;
    })(data) : data;

    renderPaths();

    renderMarkers(options.line.marker.enable);

    renderTooltipTrackers(options.tooltip && options.tooltip.enable);

    function seriesClassName(extras) {
        return function (d, i) {
            return (extras || '') + ' s-' + (i + 1) + ' ' + nwt.seriesNameToClass(d.name);
        };
    }

    function renderPaths() {
        var startLine = _d2.default.svg.line().x(function (d) {
            return x(d);
        }).y(function () {
            return y({ x: 0, y: options.yAxis.min || 0 });
        });

        var line = _d2.default.svg.line().x(function (d) {
            return x(d);
        }).y(function (d) {
            return y(d);
        });

        if (options.line.smooth) line.interpolate('cardinal');

        var animFn = animationsMap[animationDirection];
        var series = layer.selectAll('g.series').data(data, function (d) {
            return d.name;
        });

        // enter
        var el = series.enter().append('svg:g').attr('class', seriesClassName('series')).attr('clip-path', 'url(#clip)').append('path').attr('class', 'line');

        if (shouldAnimate) {
            var startLineFn = animationDirection === 'left-to-right' ? line : startLine;
            el.attr('d', function (d) {
                return startLineFn(d.data);
            }).call(nwt.partial(animFn.enter, line));
        } else {
            el.attr('d', function (d) {
                return line(d.data);
            });
        }

        // update
        el = series.attr('class', seriesClassName('series')).select('.line');

        if (shouldAnimate) {
            el.call(nwt.partial(animFn.update, line));
        } else {
            el.attr('d', function (d) {
                return line(d.data);
            });
        }

        series.exit().remove();
    }

    function renderMarkers(enabled) {
        var animationDelay = options.line.marker.animationDelay == null ? duration : options.line.marker.animationDelay;
        var markers = layer.selectAll('.line-chart-markers').data(enabled ? data : [], function (d) {
            return d.name;
        });

        markers.enter().append('g');
        markers.attr('class', seriesClassName('line-chart-markers markers'));
        markers.exit().remove();

        var dots = markers.selectAll('.dot').data(function (d) {
            return d.data;
        }, function (d) {
            return d.x;
        });

        if (shouldAnimate) {
            dots.transition().delay(animationDelay).duration(duration).attr('cx', x).attr('cy', y).attr('opacity', 1);
        } else {
            dots.attr('cx', x).attr('cy', y).attr('opacity', 1);
        }

        dots.enter().append('circle').attr('class', 'dot').attr('r', options.line.marker.size).attr('opacity', 0).attr('cx', x).attr('cy', y).transition().delay(animationDelay).attr('opacity', 1);

        dots.exit().remove();
    }

    function renderTooltipTrackers(enabled) {
        var trackerSize = 10;
        var markers = layer.selectAll('.tooltip-trackers').data(enabled ? data : [], function (d) {
            return d.name;
        });

        markers.enter().append('g');
        markers.attr('class', seriesClassName('tooltip-trackers'));
        markers.exit().remove();

        var dots = markers.selectAll('.tooltip-tracker').data(function (d) {
            return d.data;
        }, function (d) {
            return d.x;
        });

        dots.enter().append('circle').attr({
            'class': 'tooltip-tracker',
            'r': trackerSize,
            'opacity': 0
        });

        dots.attr({
            'cx': x,
            'cy': y
        });

        dots.exit().remove();
    }

    return this;
}

render.defaults = defaults;

/**
* Adds a line chart to the Contour instance.
*
* This visualization requires `.cartesian()`.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*           .cartesian()
*           .line([1,2,3,4])
*           .render();
*
* @name line(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
_contour2.default.export('line', render);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _contourUtils = __webpack_require__(0);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_contour2.default.export('nullVis', _contourUtils.noop);

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    pie: {
        sliceClass: null,

        style: null,

        piePadding: {
            left: null,
            top: null,
            right: null,
            bottom: null
        },

        // inner and outer radius can be numbers of pixels if >= 1, percentage if > 0 && < 1 or functions

        // inner radius as function will recive the outerRadius as parameter
        // passing a value between 0 and 1 (non-inclusing), this value is interpreted as % of radius
        // ie. outerRadius: 100, innerRadius: .8 would give a inner radius or 80 pixles
        innerRadius: null,

        // outer radius as function will recieve the proposed maximum radius for a pie
        // passing a value between 0 and 1 (non-inclusing), this value is interpreted as % of width
        // the default behavior is 50% of the mininum between with and height of the container (adjusted for padding)
        outerRadius: null
    }
};

function normalizePadding(options) {
    if (nwt.isNumber(options.pie.piePadding)) {
        return {
            top: options.pie.piePadding,
            left: options.pie.piePadding,
            right: options.pie.piePadding,
            bottom: options.pie.piePadding
        };
    }

    return options.pie.piePadding;
}

function clampBounds(bounds, maxWidth, maxHeight) {
    return {
        top: nwt.clamp(bounds.top, 0, maxHeight),
        bottom: nwt.clamp(bounds.bottom, 0, maxHeight),
        left: nwt.clamp(bounds.left, 0, maxWidth),
        right: nwt.clamp(bounds.right, 0, maxWidth)
    };
}

function calcPadding(options) {
    var padding = normalizePadding(options);
    var w = options.chart.plotWidth;
    var h = options.chart.plotHeight;

    return clampBounds(padding, w, h);
}

function resolveValueUnits(value, ref) {
    // resolve (0,1) interval to a percentage of the reference value
    // otherwise as a pixel valie
    return value > 0 && value < 1 ? ref * value : value;
}

function resolvePaddingUnits(padding, w, h) {
    // if the value of padding is betweem 0 and 1 (non inclusing),
    // interpret it as a percentage, otherwise as a pixel value
    return {
        top: resolveValueUnits(padding.top, h) || 5,
        bottom: resolveValueUnits(padding.bottom, h) || 5,
        left: resolveValueUnits(padding.left, w) || 5,
        right: resolveValueUnits(padding.right, w) || 5
    };
}

function renderer(data, layer, options) {
    /*jshint eqnull:true */
    var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    var shouldAnimate = options.chart.animations && options.chart.animations.enable;
    var w = options.chart.plotWidth,
        h = options.chart.plotHeight;
    var padding = calcPadding.call(this, options);
    var numSeries = data.length;
    var style = options.pie.style;
    var _this = this;
    var shouldCenterX = [options.pie.piePadding.left, options.pie.piePadding.right].every(function (d) {
        return d == null;
    });
    var shouldCenterY = [options.pie.piePadding.top, options.pie.piePadding.bottom].every(function (d) {
        return d == null;
    });
    var pixelPadding = resolvePaddingUnits(padding, w, h);
    // the reference size is the min between with and height of the container
    var referenceSize = Math.min(w, h);

    // for auto radius we need to take the min between the available with or height adjusted by padding and num series
    var totalPadding = pixelPadding.left + (pixelPadding.right + pixelPadding.left) * (numSeries - 1) + pixelPadding.right;
    var proposedRadius = Math.min((w - totalPadding) / numSeries / 2, (h - pixelPadding.top - pixelPadding.bottom) / 2);
    var radius = resolveValueUnits(nwt.getValue(options.pie.outerRadius, proposedRadius, this, proposedRadius, referenceSize), referenceSize);
    // inner radius is a pixel value or % of the radius
    var innerRadius = resolveValueUnits(nwt.getValue(options.pie.innerRadius, 0, this, radius), radius);
    var pieData = _d2.default.layout.pie().value(function (d) {
        return d.y;
    }).sort(null);
    var totalWidth = totalPadding + radius * numSeries * 2;
    var outerPaddingLeft = shouldCenterX ? (w - totalWidth) / 2 : pixelPadding.left;
    var centerY = h / 2;

    var classFn = function classFn(d, i, j) {
        var baseClass = 'series arc' + (options.tooltip.enable ? ' tooltip-tracker' : '') + ' s-' + (i + 1) + ' ' + d.data.x;

        if (!options.pie.sliceClass) {
            return baseClass;
        }

        return baseClass + ' ' + (typeof options.pie.sliceClass === 'function' ? options.pie.sliceClass.call(_this, d, i, j) : options.pie.sliceClass);
    };

    var translatePie = function translatePie(d, i) {
        // calc the left side coord of the pie, including padding for the prevousous pies
        var offsetX = outerPaddingLeft + (radius * 2 * i + (pixelPadding.right + pixelPadding.left) * i);
        // calc the center of the pie starting from offsetX
        var posY = shouldCenterY ? centerY : radius + pixelPadding.top;

        return 'translate(' + (radius + offsetX) + ',' + posY + ')';
    };

    var pieGroup = layer.selectAll('g.pie-group').data(data);

    pieGroup.enter().append('svg:g').attr('class', 'pie-group').attr('transform', translatePie).call(renderSeries);

    pieGroup.exit().remove();

    if (shouldAnimate) {
        pieGroup.call(renderSeries).transition().duration(duration / 2).attr('transform', translatePie);
    } else {
        pieGroup.call(renderSeries).attr('transform', translatePie);
    }

    function renderSeries(group) {
        var arc = _d2.default.svg.arc().outerRadius(radius).innerRadius(innerRadius);

        var startArc = _d2.default.svg.arc().outerRadius(radius).innerRadius(innerRadius).startAngle(0).endAngle(0);

        var pie = group.selectAll('path').data(function (d) {
            return pieData(d.data);
        }, function (d) {
            return d.data.x;
        });

        pie.enter().append('path').attr('d', function (d) {
            return startArc(d);
        }).attr('style', style).each(function (d) {
            this._current = { startAngle: d.startAngle, endAngle: d.startAngle };
        });

        pie.attr('class', classFn);

        if (shouldAnimate) {
            pie.exit().remove();

            pie.transition().duration(duration).ease('cubic-in').attrTween('d', arcTween);
        } else {
            pie.exit().remove();
            pie.attr('d', arc);
        }

        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
        // from http://bl.ocks.org/mbostock/1346410
        function arcTween(a) {
            var i = _d2.default.interpolate(this._current, a);
            this._current = i(0);
            return function (t) {
                return arc(i(t));
            };
        }
    }
}

renderer.defaults = defaults;

/**
* Adds a pie chart to the Contour instance.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*           .pie([1,2,3,4])
*           .render();
*
* @name pie(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats. The data elements are summed and then divided. In the example, `.pie([1,2,3,4])` makes four pie slices: 1/10, 2/10, 3/10, and 4/10.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
_contour2.default.export('pie', renderer);

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    xAxis: {
        type: 'linear'
    },
    scatter: {
        radius: 4,
        preprocess: function preprocess(data) {
            return data;
        }
    }
};

function ScatterPlot(data, layer, options) {
    this.checkDependencies('cartesian');
    var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    var shouldAnimate = options.chart.animations && options.chart.animations.enable;
    var opt = options.scatter;
    var halfRangeBand = this.rangeBand / 2;
    var x = function (d) {
        return this.xScale(d.x) + halfRangeBand;
    }.bind(this);
    var y = function (d) {
        return this.yScale(d.y);
    }.bind(this);
    var h = options.chart.plotHeight;
    var classFn = function classFn(d, i) {
        return d.name + ' series s-' + (i + 1);
    };

    data = options.scatter.preprocess(data);

    var series = layer.selectAll('.series').data(data);

    series.enter().append('svg:g').attr('class', classFn);

    series.attr('class', classFn);
    series.exit().remove();

    var dots = series.selectAll('.dot').data(function (d) {
        return d.data;
    }, function (d) {
        return options.scatter.dataKey ? d[options.scatter.dataKey] : d.x;
    });

    dots.enter().append('circle').attr('class', 'dot tooltip-tracker').attr('r', opt.radius).attr('cx', x).attr('cy', h);

    if (shouldAnimate) {
        dots.transition().duration(duration).attr('r', opt.radius).attr('cx', x).attr('cy', y);
    } else {
        dots.attr('r', opt.radius).attr('cx', x).attr('cy', y);
    }

    dots.exit().remove();
}

ScatterPlot.defaults = defaults;

/**
* Adds a scatter plot to the Contour instance.
*
* This visualization requires `.cartesian()`.
*
* ### Example:
*
*     new Contour({el: '.chart'})
*           .cartesian()
*           .scatter([1,2,3,4])
*           .render();
*
* @name scatter(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
_contour2.default.export('scatter', ScatterPlot);

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    tooltip: {
        enable: true
    }
};

/**
* Adds a tooltip and legend combination for stacked (multiple) series visualizations in the Contour instance.
* Requires a second display element (`<div>`) for the legend in the html.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*           .cartesian()
*           .column(stackedColData)
*           .stackTooltip(stackedColData, {el: '.myChartLegend'})
*           .render();
*
* @name stackTooltip(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
* @param {object} options Configuration options particular to this visualization that override the defaults. Requires an `el` option with the selector of the container in which to render the tooltip.
* @api public
*
* ### Notes:
*
* Each Contour instance can only include one `stackTooltip` visualization.
*/
function stackTooltip(data, layer, options) {

    var valueFormatter = this.yAxis().tickFormat();
    var tooltip = _d2.default.select(options.stackTooltip.el);

    tooltip.classed('stack-tooltip', true);

    // jshint eqnull:true
    var onMouseOver = function onMouseOver(d) {
        var isNull = function isNull(p) {
            return !(p && p.y != null);
        };
        var mapFn = function mapFn(p, i) {
            var index = nwt.isNumber(d.x) ? d.x : options.xAxis.categories.indexOf(d.x);
            return !isNull(p.data[index]) ? { seriesName: p.name, value: p.data[index].y, cssClass: 's-' + (i + 1) } : null;
        };
        var filtered = data.map(mapFn).filter(function (x) {
            return x;
        });
        var text = filtered.map(function (t) {
            return '<span class="' + t.cssClass + '"">' + t.seriesName + ': ' + valueFormatter(t.value) + '</span>';
        }).join(' / ');
        tooltip.html(text).style({ display: 'block' });
    };

    var onMouseOut = function onMouseOut() // datum
    {
        tooltip.html('');
    };

    this.svg.selectAll('.tooltip-tracker').on('mouseover.tooltip', onMouseOver.bind(this)).on('mouseout.tooltip', onMouseOut.bind(this));
}

stackTooltip.defaults = defaults;

_contour2.default.export('stackTooltip', stackTooltip);

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function pxToNumber(pixels) {
    // removes 'px' from end of padding -- padding is always translated into px
    return Number(pixels.slice(0, -2));
}

function title(data, layer, options) {
    var svg = _d2.default.select(this.container[0][0].firstChild);
    var height = pxToNumber(svg.style('height'));
    var width = pxToNumber(svg.style('width'));
    var paddingTop = svg.style('padding-top');

    if (paddingTop === '0px') {
        svg.style('padding-top', '2rem');
        paddingTop = '32px';
    }

    paddingTop = pxToNumber(paddingTop);

    var textAnchor;
    var xVal;
    var yVal = -paddingTop / 2;

    switch (options.title.position) {
        case 'center':
            xVal = width / 2;
            textAnchor = "middle";
            break;
        case 'right':
            xVal = width;
            textAnchor = "end";
            break;
        default:
            xVal = 0;
            textAnchor = "start";
            break;
    }

    // Because the title isn't dependent on data, this takes the place of the d3 exit
    if (_d2.default.select('.title-text')[0][0]) {
        svg.remove('.title-text');
    }
    svg.append('text').attr('x', xVal).attr('y', yVal).classed('chart-title', true).style('text-anchor', textAnchor).text(options.title.text);
}

title.defaults = {
    title: {
        text: '',
        position: 'left'
    }
};

/**
* Adds a title to the Contour chart. By default, this will also add some padding to the top of the chart to make room for the title.
* If the chart already has padding, or if the user wants to style the text with CSS, they may have to style this themselves.
* The title can be accessed with the CSS class `chart-title`.
*
*
* **Note:** This chart will appear in images generated by `exportable`.
*
* ### Example:
*
*        new Contour({el: '.myChart', title: { text: 'First Seven Fibonacci Numbers', position: 'left' }})
*           .cartesian()
*           .trendLine([1, 1, 2, 3, 5, 7, 12])
*           .title()
*           .render();
*
* @name title(text, position, styles)
* @param {object|array} data Ignored!
* @param {object} options Configuration options particular to this visualization that override the defaults.
* @api public
*
*/

_contour2.default.export('title', title);

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaults = {
    tooltip: {
        enable: true,
        animate: true,
        opacity: 0.85,
        showTime: 300,
        hideTime: 500,
        distance: {
            x: 5,
            y: 5
        },
        formatter: undefined //defined in formatters array in getTooltipText()
    }
};

function render(data, layer, options) {

    var clearHideTimer = function clearHideTimer() {
        clearTimeout(this.tooltip.hideTimer);
    };

    var changeOpacity = function changeOpacity(opacity, delay) {
        if (this.options.tooltip.animate) {
            this.tooltipElement.transition().duration(delay).style('opacity', opacity);
        } else {
            this.tooltipElement.style('opacity', opacity);
        }
    };

    var positionTooltip = function positionTooltip(d) {
        var pointOrCentroid = function pointOrCentroid() {
            return _d2.default.event.target.tagName === 'path' ? nwt.getCentroid(_d2.default.event.target) : _d2.default.mouse(this.container.node());
        };
        var xScale = this.xScale;
        var yScale = this.yScale;
        var plotLeft = this.options.chart.plotLeft;
        var plotWidth = this.options.chart.plotWidth;
        var plotTop = this.options.chart.plotTop;
        var plotHeight = this.options.chart.plotHeight;
        var distanceX = this.options.tooltip.distance.x !== undefined ? this.options.tooltip.distance.x : this.options.tooltip.distance;
        var distanceY = this.options.tooltip.distance.y !== undefined ? this.options.tooltip.distance.y : this.options.tooltip.distance;
        var width = parseFloat(this.tooltipElement.node().offsetWidth);
        var height = parseFloat(this.tooltipElement.node().offsetHeight);
        var pointX = xScale ? xScale(d.x) : pointOrCentroid.call(this)[0];
        var pointY = yScale ? yScale(d.y) : pointOrCentroid.call(this)[1];
        var alignedRight;

        var clampPosition = function clampPosition(pos) {
            // Check outside plot area (left)
            if (pos.x < plotLeft) {
                pos.x = plotLeft;
            }

            // Check outside plot area (right)
            if (pos.x + width > plotLeft + plotWidth) {
                pos.x -= pos.x + width - (plotLeft + plotWidth);
                // Don't overlap point

                alignedRight = true;
            }

            // Check outside the plot area (top)
            if (pos.y < plotTop) {
                pos.y = plotTop;

                // Don't overlap point
                if (alignedRight && pointY >= pos.y && pointY <= pos.y + height) {
                    pos.y = pointY + plotTop + distanceY;
                }
            }

            // Check outside the plot area (bottom)
            if (pos.y + height > plotTop + plotHeight) {
                pos.y = plotTop + plotHeight - height;
            }

            return pos;
        };

        var positioner = {
            'vertical': function verticalPositioner() {
                var pos = {
                    x: plotLeft + pointX + (distanceX - width),
                    y: plotTop + pointY - (distanceY + height)
                };

                return clampPosition(pos);
            },

            'horizontal': function horizontalPositioner() {
                var pos = {
                    x: plotLeft + pointY + (distanceX - width),
                    y: plotTop + pointX - (distanceY + height)
                };

                return clampPosition(pos);
            }
        };

        return options.chart.rotatedFrame ? positioner.horizontal() : positioner.vertical();
    };

    var onMouseOver = function onMouseOver(d) {
        show.call(this, d);
    };

    var onMouseOut = function onMouseOut() {
        changeOpacity.call(this, 0, this.options.tooltip.hideTime);
    };

    var getTooltipText = function getTooltipText(d, allPoints) {
        function match() {
            var params = Array.prototype.slice.call(arguments);
            var list = params[0];
            var rest = params.slice(1);

            var response = list.map(function (fn) {
                return fn.apply(this, rest);
            }).concat([nwt.noop]);

            return response.filter(function (a) {
                return a;
            })[0];
        }

        var options = this.options.tooltip;
        var formatters = [function (d) {
            return options.formatter ? nwt.partial(options.formatter, d, allPoints) : null;
        }, function (d) {
            return d.hasOwnProperty('x') ? nwt.partial(function (d) {
                return d.series + '<br>' + d.x + '<br>' + d.y;
            }, d) : null;
        }, function (d) {
            return d.data && d.data.hasOwnProperty('x') ? nwt.partial(function (d) {
                return d.series + '<br>' + d.x + '<br>' + d.y;
            }, d.data) : null;
        }, function (d) {
            return d.hasOwnProperty('value') ? nwt.partial(function (d) {
                return d.value;
            }, d) : null;
        }, function () {
            return function () {
                return 'NA';
            };
        }];

        return match(formatters, d)();
    };

    var show = function show(d) {
        clearHideTimer.call(this);

        var dataPoints = findOriginalDataPoint(d);

        this.tooltipElement.select('.text').html(getTooltipText.call(this, d || dataPoints[0], dataPoints));

        var pos = positionTooltip.call(this, d);

        this.tooltipElement.style('top', pos.y + 'px').style('left', pos.x + 'px');

        changeOpacity.call(this, this.options.tooltip.opacity, this.options.tooltip.showTime);
    };

    function findOriginalDataPoint(d) {
        var res = [];
        data.forEach(function (series, seriesIndex) {
            var name = series.name;
            series.data.forEach(function (point) {
                if (point.x === d.x && d.y === point.y) {
                    res.push(Object.assign(point, { series: name, seriesIndex: seriesIndex }));
                }
            });
        });

        return res;
    }

    this.tooltipElement = this.container.style('position', 'relative').selectAll('.nw-tooltip').data([1]);

    this.tooltipElement.enter().append('div').attr('class', 'nw-tooltip').style('opacity', 0).append('div').attr('class', 'text');

    this.svg.selectAll('.tooltip-tracker').on('mouseover.tooltip', onMouseOver.bind(this)).on('mouseout.tooltip', onMouseOut.bind(this));
}

render.defaults = defaults;

/**
* Adds a tooltip on hover to all other visualizations in the Contour instance.
*
* Although not strictly required, this visualization does not appear unless there are already one or more visualizations in this Contour instance for which to show the tooltips.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*           .cartesian()
*           .line([2, 4, 3, 5, 7])
*           .tooltip()
*           .render();
*
* @name tooltip(data, options)
* @param {object|array} data Ignored!
* @param {object} options Configuration options particular to this visualization that override the defaults.
* @api public
*
* ### Notes:
*
* Each Contour instance can only include one `tooltip` visualization.
*/
_contour2.default.export('tooltip', render);

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _d = __webpack_require__(1);

var _d2 = _interopRequireDefault(_d);

var _contourUtils = __webpack_require__(0);

var nwt = _interopRequireWildcard(_contourUtils);

var _contour = __webpack_require__(2);

var _contour2 = _interopRequireDefault(_contour);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function normalizeDataSet(dataSet) {
    var all = nwt.flatten(dataSet.map(function (set) {
        return set.data;
    }));
    var isLinear = all.length && nwt.isNumber(all[0].x);
    var normalizer = function normalizer(d, i) {
        return { x: i, y: d.y };
    };

    return isLinear ? all : all.map(normalizer);
}

function ctor(raw, layer, options) {
    this.checkDependencies('cartesian');
    var data = normalizeDataSet(raw);
    var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    var shouldAnimate = options.chart.animations && options.chart.animations.enable;
    var x = function (d) {
        return this.xScale(d) + this.rangeBand / 2;
    }.bind(this);
    var y = function (d) {
        return this.yScale(d);
    }.bind(this);
    var regression = nwt.linearRegression(data);
    var domain = _d2.default.extent(this.xScale.domain());
    var numericDomain = _d2.default.extent(data, function (p) {
        return p.x;
    });
    var lineY = function lineY(x) {
        return regression.intercept + regression.slope * x;
    };

    var line = layer.selectAll('.trend-line').data([1]);

    if (isNaN(lineY(numericDomain[0])) || isNaN(lineY(numericDomain[1])) || isNaN(x(domain[0])) || isNaN(x(domain[1]))) {
        line.remove();
    } else {
        line.enter().append('line').attr('class', 'trend-line').attr('x1', x(domain[0])).attr('y1', y(lineY(numericDomain[0]))).attr('x2', x(domain[0])).attr('y2', y(lineY(numericDomain[0])));

        line.exit().remove();

        if (shouldAnimate) {
            line = line.transition().duration(duration);
        }

        line.attr('x1', x(domain[0])).attr('y1', y(lineY(numericDomain[0]))).attr('x2', x(domain[1])).attr('y2', y(lineY(numericDomain[1])));
    }
}

ctor.defaults = {};

/**
* Adds a trend line to the Contour instance, based on linear regression.
*
* This visualization requires `.cartesian()`.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*           .cartesian()
*           .trendLine([2,4,3,5,7])
*           .render();
*
* @name trendLine(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats. A linear regression is performed on the _data series_ and the resulting trend line is displayed.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
_contour2.default.export('trendLine', ctor);

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
});
//# sourceMappingURL=contour.js.map