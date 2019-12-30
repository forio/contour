import d3 from 'd3';
export { default as defaults } from 'lodash.defaults';
export { default as merge } from 'lodash.merge';

// cheap trick to add decimals without hitting javascript issues
// note that this fails for very large numbers
var multiplier = function (x) { var dig = decDigits(x); return dig === 0 ? 1 : Math.pow(10, dig); };
var maxMultiplier = function (a,b) { return Math.max(multiplier(a), multiplier(b)); };
var addFloat = function (a,b) { var factor = maxMultiplier(a,b), aa = Math.round(a * factor), bb = Math.round(b * factor); return (aa + bb) / factor; };
var subFloat = function (a,b) { var factor = maxMultiplier(a,b), aa = Math.round(a * factor), bb = Math.round(b * factor); return (aa - bb) / factor; };
var mulFloat = function (a,b) { var factor = maxMultiplier(a,b), aa = Math.round(a * factor), bb = Math.round(b * factor); return (aa * bb) / (factor*factor); };
var divFloat = function (a,b) { var factor = maxMultiplier(a,b), aa = Math.round(a * factor), bb = Math.round(b * factor); return aa / bb; };

var root = typeof window === 'object' ? window : global;

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

export const noop = function () {};

export const partial = function (fn /*args*/) {
    // prevent leaking arguments object outside of the current scope
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    var args = new Array (arguments.length -1);
    for (var i = 1; i < arguments.length; ++i) {
        args[i-1] = arguments[i];
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

export const partialRight = function (fn /*, args */) {
    // prevent leaking arguments object outside of the current scope
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments
    var args = new Array (arguments.length -1);
    for (var i = 1; i < arguments.length; ++i) {
        args[i-1] = arguments[i];
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

export const isObject = function  (value) {
    var type = typeof value;
    return value != null && (type === 'object' || type === 'function');
};

export const isObjectLike = function (value) {
    return typeof value === 'object' && value !== null;
};

export const isDate = function (value) {
    return isObjectLike(value) && baseGetTag(value) === '[object Date]';
};

export const isNumber = function (value) {
    return typeof value === 'number' ||
        (isObjectLike(value) && baseGetTag(value) === '[object Number]');
};

export const isString = function (value) {
    return typeof value === 'string' || value instanceof String;
};

export const range = function (start, end, step) {
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
export const uniq = function (array) {
    if (array == null || !array.length) return [];
    var cache = {}, result = [];
    var len = array.length;

    for (var j=0; j<len; j++) {
        var el = array[j], key = el + '';

        if (!cache.hasOwnProperty(key)) {
            cache[key] = true;
            result.push(el);
        }
    }

    return result;
};

export const flatten = function (array) {
    if (!array || !array.length) {
        return [];
    }

    return array.reduce(function (acc, cur) {
        return acc.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
};

export const compact = function (array) {
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

export const intersection = function (a, b) {
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

export const omit = function (src, props) {
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
export const getValue = function (src, deafult, ctx, args) {
    args = Array.prototype.slice.call(arguments, 3);
    return !src ? deafult : typeof src === 'function' ? src.apply(ctx, args) : src;
};

export const seriesNameToClass = function (name) {
    return name || '';
};

export const materialize = function (object, ctx, options, curPath) {

    var isDom = function (obj) { return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.style === 'object' && typeof obj.ownerDocument === 'object'; };
    var skipList = (options || {}).skip || [];

    var shouldSkip = function (path) {
        return skipList.some(function (e) {
            if (!e) return false;
            if (typeof e === 'object' && e instanceof RegExp) {
                return e.test(path);
            }

            return e.toString() === path;
        });
    };

    if (object == null) {
        return object;
    } else if (Array.isArray(object)) {
        return object;
    } if (isDom(object)) {
        return object;
    } else if (typeof object === 'function') {
        return getValue(object, null, ctx);
    } else if (typeof object === 'object') {
        return Object.keys(object).reduce(function (prev, key) {
            var curKeyPath = curPath ? curPath + '.' + key : key;
            var expectsParam = (typeof object[key] === 'function' && !!object[key].length);
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

export const cleanNullValues = function () {
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

export const minMaxFilter = function (desiredLen) {
    return function(data) {
        if (data.length <= desiredLen)
            return data;

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
                    if (!hasValidPt || intermediatePt.y > maxPt.y)
                        maxPt = intermediatePt;

                    if (!hasValidPt || intermediatePt.y < minPt.y)
                        minPt = intermediatePt;

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

export const warn = function (msg) {
    if (console && console.log)
        console.log(msg);
};


export const firstAndLast = function (ar) {
    return [ar[0], ar[ar.length-1]];
};

export const roundToNearest = function (number, multiple) {
    return mulFloat(Math.ceil(divFloat(number, multiple)), multiple);
};

export const roundTo = function (value, digits) {
    return divFloat(Math.ceil(mulFloat(value, Math.pow(10, digits))), Math.pow(10, digits));
};

export const trunc = function (value) {
    return value - value % 1;
};

// only works for integers
export const digits = function (value) {
    var str = Math.abs(value).toString();
    var parts = str.split('e');
    if (parts.length === 2) {
        return Math.max(0, parts[1]) + 1;
    }
    parts = str.split('.');
    return parts[0].length;
};

export const decDigits = function (value) {
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

export const log10 = function (value) {
    return Math.log(value) / Math.LN10;
};

export const clamp = function (val, l, h) {
    return val > h ? h : val < l ? l : val;
};

export const clampLeft = function (val, low) {
    return val < low ? low : val;
};

export const clampRight = function (val, high) {
    return val > high ? high : val;
};

export const degToRad = function (deg) {
    return deg * Math.PI / 180;
};

export const radToDeg = function (rad) {
    return rad * 180 / Math.PI;
};

export const rotatePoint = function (point, rad) {
    return {
        x: point.x * Math.cos(rad) - point.y * Math.sin(rad),
        y: point.x * Math.sin(rad) + point.y * Math.cos(rad)
    };
};

export const translatePoint = function (point, delta) {
    return {
        x: point.x + delta.x,
        y: point.y + delta.y
    };
};

export const linearRegression = function (dataSrc) {
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
        sum_xy += (dataSrc[i].x*dataSrc[i].y);
        sum_xx += (dataSrc[i].x*dataSrc[i].x);
        sum_yy += (dataSrc[i].y*dataSrc[i].y);
    }

    lr.slope = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
    lr.intercept = (sum_y - lr.slope * sum_x)/n;
    lr.r2 = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

    return lr;
};

export const niceRound = function (val) {
    // for now just round(10% above the value)
    return Math.ceil(val + val * 0.10);

    // var digits = Math.floor(Math.log(val) / Math.LN10) + 1;
    // var fac = Math.pow(10, digits);

    // if(val < 1) return roundToNearest(val, 1);

    // if(val < fac / 2) return roundToNearest(val, fac / 2);

    // return roundToNearest(val, fac);
};

export const roundToNextTick = function (num) {
    var abs = Math.abs(num);
    var sign = abs === num ? 1 : -1;
    var mag, step;
    if (abs >= 1) {
        mag = Math.floor(log10(abs));
        step = mag <= 1 ? 2 : Math.pow(10, mag - 1);
    } else {

        var exp = abs.toExponential().replace(/\.|e-\d+$/g, '');
        mag = exp.length;
        step = mulFloat((mag === 1 ? 2 : 10), Math.pow(10, -mag));
    }

    var raw = roundToNearest(abs, step);
    return sign * raw;
};

export const niceMinMax = function (min, max, ticks, startAtZero) {
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
        ticks = range(ticks, ticks * 1.28)
            .concat(range(ticks - 1, (ticks - 1) * 0.72, -1));
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
        if(startAtZero) {
            exponent = log10(Math.abs(max)) - 0.5;
        } else {
            exponent = log10(max-min) - 0.5;
        }
    }

    var defaultRounding = -(exponent >= 0 ? trunc(exponent) : Math.floor(exponent));

    // var defaultRounding = -trunc((min === max ?
    //     max === 0 ? -1.0 : log10(Math.abs(max)) :
    //     startAtZero ? log10(Math.abs(max)) : log10(max-min)
    // ) - 0.5);

    var excelRoundUp = function (value, up) {
        up = up != null ? up : 0;
        var roundFn = function (v) { return v >= 0 ? Math.ceil(v) : Math.floor(v); };
        return divFloat(roundFn(value * Math.pow(10, up)), Math.pow(10, up));
    };

    var nice = function (ticks) {
        var negativeMinAmount = excelRoundUp(Math.max(0, -min) / ticks, defaultRounding - 1);

        var intermediateMax = min === max ? max === 0 ? 1 : excelRoundUp(max + negativeMinAmount, defaultRounding)
            : excelRoundUp(max + negativeMinAmount,defaultRounding);

        var iMin = 0;
        if (!startAtZero && min !== max) {
            var inter = min + negativeMinAmount;
            var dig = digits(inter);
            var roundToDigits;
            if (inter > 0) {
                roundToDigits =  -Math.floor(log10(inter));
            } else {
                roundToDigits = (Math.max(1, Math.abs(dig-2)));
            }

            iMin = -roundTo(-inter, roundToDigits);
            iMin = iMin === 0 ? 0 : iMin;
            // old version:
            // iMin = excelRound(min + negativeMinAmount, defaultRounding + (min < 0 ? 1 : 0))
        }

        var intermediateMin = iMin;

        var interval = excelRoundUp(divFloat(subFloat(intermediateMax, intermediateMin),ticks), defaultRounding);
        var finalMin = subFloat(intermediateMin, negativeMinAmount);
        var finalMax = addFloat(finalMin, mulFloat(ticks, interval));
        var ticksValues = [finalMin];
        var prevTick = finalMin;

        for (var j=1; j < ticks; j++) {
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
            tickValues: ticksValues.map(function (a) { return swap ? -a : a; })
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

export const extractScaleDomain = function (domain, min, max, ticks, zeroAnchor) {
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

export const niceTicks = function (min, max, ticks, zeroAnchor, domain) {
    ticks = ticks == null ? 5 : ticks;
    min = min != null ? min : zeroAnchor ? Math.min(0, domain[0]) : domain[0];
    max = max != null ? max : domain[1];

    var niced = niceMinMax(min, max, ticks, zeroAnchor);
    var tickValues = niced.tickValues;

    // ensure that y-axis endpoints are labelled
    if (min !== domain[0]) {
        tickValues.push(min);
        tickValues = tickValues.filter(function(tick) {
            return tick >= min;
        });
    }

    if (max !== domain[1]) {
        tickValues.push(max);
        tickValues = tickValues.filter(function(tick) {
            return tick <= max;
        });
    }

    tickValues.sort(function (a, b) { return a - b; });

    return uniq(tickValues);
};

export const calcXLabelsWidths = function (ticks) {
    var padding = 8;
    var compact = function (e) { return !!e; };
    return ticks.filter(compact).map(String).map(function (d) {
        if (!d) {
            return padding * 2;
        }
        return textBounds(d, '.x.axis text').width + (padding * 2);
    });
};

export const doXLabelsFit = function (ticks, labelFormatter, options) {
    var tickWidths = calcXLabelsWidths(ticks.map(labelFormatter));
    var availableWidthForLabels = (options.chart.plotWidth + tickWidths[0] / 2 + tickWidths[ticks.length - 1] / 2);
    var axisLabelsWidth = sum(tickWidths);
    return axisLabelsWidth <= availableWidthForLabels;
};

export const getTicksThatFit = function (ticks, labelFormatter, options) {
    // reduce the number of ticks incrementally by taking every 2nd, then every 3th, and so on
    // until we find a set of ticks that fits the available space
    function reduceTicksByMod() {
        var tickWidths = calcXLabelsWidths(ticks.map(labelFormatter));
        var axisLabelsWidth = sum(tickWidths);
        var availableWidthForLabels = (options.chart.plotWidth + tickWidths[0] / 2 + tickWidths[ticks.length - 1] / 2);
        var iter = 1;
        var filterMod = function (d, i) { return (i % iter) === 0; };
        var finalTicks = ticks;
        while(axisLabelsWidth > availableWidthForLabels && finalTicks.length !== 0) {
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
export const textBounds = function (text, css) {
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

export const dateDiff = function(d1, d2) {
    var diff = d1.getTime() - d2.getTime();
    return diff / (24*60*60*1000);
};

// concatenate and sort two arrays to the resulting array
// is sorted ie. merge [2,4,6] and [1,3,5] = [1,2,3,4,5,6]
export const mergeArrays = function (array1, array2) {
    if(typeof(array1) === 'number') array1 = [array1];
    if(typeof(array2) === 'number') array2 = [array2];
    if(!array1 || !array1.length) return array2;
    if(!array2 || !array2.length) return array1;

    return [].concat(array1, array2).sort(function (a,b) { return a-b; });
};

export const isCorrectDataFormat = function (dataArray) {
    return Array.isArray(dataArray) && dataArray.every(function (p) { return p.hasOwnProperty('x') && p.hasOwnProperty('y'); });
};

export const isCorrectSeriesFormat = function (data) {
    var isArrayOfObjects = Array.isArray(data) && isObject(data[0]);
    if (!isArrayOfObjects) {
        return false;
    }

    var hasDataArrayPerSeries = data.every(function (d) { return d.hasOwnProperty('data'); });
    var hasSeriesNamePerSeries = data.every(function (d) { return d.hasOwnProperty('name'); });
    var datumInCorrectFormat = isArrayOfObjects && hasDataArrayPerSeries && isCorrectDataFormat(data[0].data);

    return isArrayOfObjects && hasDataArrayPerSeries && hasSeriesNamePerSeries && datumInCorrectFormat;
};

export const normalizeSeries = function (data, categories) {
    var hasCategories = !!(categories && Array.isArray(categories));
    function sortFn(a, b) { return a.x - b.x; }
    function normal(set, name) {
        var d = {
            name: name,
            data: set.map(function (d, i) {
                var hasX = d != null && d.hasOwnProperty('x');
                var val = function (v) { return v != null ? v : null; };
                // make sure we return a valid category and not cast nulls as string
                var categoryAt = function (i) { return !hasCategories ? i : categories[i] == null ? null : categories[i] + ''; };
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
        if ((isObject(data[0]) && data[0].hasOwnProperty('data')) || Array.isArray(data[0])) {
            // this would be the shape for multiple series
            return data.map(function (d, i) { return normal(d.data ? d.data : d, d.name ? d.name : 'series ' + (i+1)); });
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
export const stackLayout = function () {
    var stack = d3.layout
        .stack()
        .values(function (d) { return d.data; });
    // prepare satck to handle different x values with different lengths
    var outFn = function() {
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

export const sum = function (array) {
    return array.reduce(function (acc, cur) { return acc += cur; }, 0);
};

export const maxTickValues = function (max, domain) {
    var len = domain.length;
    var values = [];

    if (max >= len) return domain.slice();

    // return d3.scale.linear().domain(domain).ticks(max);

    var tickInteval = Math.ceil((len) / (max));
    var cur = 0;
    while (cur < len) {
        values.push(domain[cur]);
        cur += tickInteval;
    }

    return values;
};

export const isSupportedDataFormat = function (data) {
    // this covers all supported formats so far:
    // [ {data: [...] }, ... ]
    // [ [...], [...] ]
    return Array.isArray(data) &&
        (isObject(data[0]) && data[0].hasOwnProperty('data') && Array.isArray(data[0].data)) ||
        Array.isArray(data[0]);
};

export const selectDom = function (selector) {
    return d3.select(selector)[0][0];
};

export const getStyle = function (el, style) {
    if(!el) return undefined;
    var elem = typeof el === 'string' ? this.selectDom(el) : el;
    // we need a good way to check if the element is detached or not
    var styles = elem.offsetParent ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.style;

    return style ? styles[style] : styles;
};

export const getCentroid = function (element) {
    var getOffsetParent = function () {
        if (element.offsetParent) {
            return element.offsetParent;
        }

        // we we don't have an offsetParent, we may be in firefox
        // let's just assume that the offset parent is the svg element
        var t = element;
        while(t && t.tagName !== 'svg') {
            t = t.parentNode;
        }

        return t;
    };

    var parentBox = getOffsetParent().getBoundingClientRect();
    var bbox = element.getBoundingClientRect();

    return [bbox.left - parentBox.left + bbox.width/2, bbox.top - parentBox.top + bbox.height/2];
};

export const warning = function (msg) {
    if(console && console.log) {
        console.log('WARNING: ' + msg);
    }
};
