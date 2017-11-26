// jshint eqnull:true
(function () {
    // cheap trick to add decimals without hitting javascript issues
    // note that this fails for very large numbers
    var multiplier = function (x) { var dig = nwt.decDigits(x); return dig === 0 ? 1 : Math.pow(10, dig); };
    var maxMultiplier = function (a,b) { return Math.max(multiplier(a), multiplier(b)); };
    var addFloat = function (a,b) { var factor = maxMultiplier(a,b), aa = Math.round(a * factor), bb = Math.round(b * factor); return (aa + bb) / factor; };
    var subFloat = function (a,b) { var factor = maxMultiplier(a,b), aa = Math.round(a * factor), bb = Math.round(b * factor); return (aa - bb) / factor; };
    var mulFloat = function (a,b) { var factor = maxMultiplier(a,b), aa = Math.round(a * factor), bb = Math.round(b * factor); return (aa * bb) / (factor*factor); };
    var divFloat = function (a,b) { var factor = maxMultiplier(a,b), aa = Math.round(a * factor), bb = Math.round(b * factor); return aa / bb; };

    var root = this;

    var noop = function () {};

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

    var lodashFns = {
        partial: function (fn /*args*/) {
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
        },

        partialRight: function (fn /*, args */) {
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
        },

        isObject: function  (value) {
            var type = typeof value;
            return value != null && (type === 'object' || type === 'function');
        },

        isObjectLike: function (value) {
            return typeof value === 'object' && value !== null;
        },

        isDate: function (value) {
            return lodashFns.isObjectLike(value) && baseGetTag(value) === '[object Date]';
        },

        isNumber: function (value) {
            return typeof value === 'number' ||
                (lodashFns.isObjectLike(value) && baseGetTag(value) === '[object Number]');
        },

        isString: function (value) {
            return typeof value === 'string' || value instanceof String;
        },

        range: function (start, end, step) {
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
        },

        uniq: function (value) {
            if (value == null || !value.length) return [];
            var set = {};
            for (var j=0; j<value.length; j++) set[value[j]] = true;

            var res = [];
            for (j=0; j<value.length; j++) {
                if (set[value[j]]) {
                    res.push(value[j]);
                    delete set[value[j]];
                }
            }

            return res;
        },

        flatten: function (array) {
            if (!array || !array.length) {
                return [];
            }

            return array.reduce(function (acc, cur) {
                return acc.concat(Array.isArray(cur) ? lodashFns.flatten(cur) : cur);
            }, []);
        },

        compact: function (array) {
            if (!array || !array.length) {
                return [];
            }

            return array.reduce(function (acc, cur) {
                if (cur) {
                    acc.push(cur);
                }
                return acc;
            }, []);
        },

        intersection: function (a, b) {
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
        },

        merge: function (a, b) {
            var args = new Array(arguments.length);
            for (var i = 0; i < arguments.length; ++i) {
              args[i] = arguments[i];
            }

            var isMergable = function (prop) { return prop && Object.prototype.toString.call(prop) === '[object Object]'; };
            var cloneIfNeeded = function (val) { return val && Object.prototype.toString.call(val) === '[object Object]' ? lodashFns.merge({}, val) : val; };

            if (!isMergable(a)) {
                return b;
            }

            if (!b) {
                return a;
            }

            var target = a;
            /*jshint loopfunc: true */
            for (var j=1, src = args[1]; j<args.length; j++, src=args[j]) {
                Object.keys(src).forEach(function (key) {
                    if (target[key]) {
                        if (Array.isArray(target[key]) && Array.isArray(src[key])) {
                            target[key] = target[key].map(function (el, i) {
                                return lodashFns.merge(el, src[key][i]);
                            });
                        } else if (isMergable(target[key]) && isMergable(src[key])) {
                            target[key] = lodashFns.merge(target[key], src[key]);
                        } else if (src[key] != null) {
                            target[key] = src[key];
                        }
                    } else {
                        target[key] = cloneIfNeeded(src[key]);
                    }
                });
            }

            return target;
        },

        defaults: function (target /* ...sources */) {
            var sources = new Array(arguments.length-1);
            for (var i = 1; i < arguments.length; ++i) {
              sources[i-1] = arguments[i];
            }

            if (!target) return null;

            /*jshint loopfunc: true */
            for (var j=0; j<sources.length; j++) {
                var src = sources[j];
                Object.keys(src).forEach(function (key) {
                    var val = target[key];
                    if (val === undefined) {
                        target[key] = src[key];
                    }
                });
            }

            return target;
        },

        omit: function (src, props) {
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
        }
    };

    var generalHelpers = {
        // the src is a function returns the function evaluated
        // otherwise returns src
        getValue: function (src, deafult, ctx, args) {
            args = Array.prototype.slice.call(arguments, 3);
            return !src ? deafult : typeof src === 'function' ? src.apply(ctx, args) : src;
        },

        seriesNameToClass: function (name) {
            return name || '';
        },

        materialize: function (object, ctx, options, curPath) {
            var isDom = function (obj) { return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.style === 'object' && typeof obj.ownerDocument === 'object'; };
            var skipList = (options || {}).skip || [];
            var skipMatch = (options || {}).skipMatch;
            if ( object == null ) {
                return object;
            } else if (Array.isArray(object)) {
                return object;
            } if (isDom(object)) {
                return object;
            } else if (typeof object === 'function') {
                return generalHelpers.getValue(object, null, ctx);
            } else if (typeof object === 'object') {
                return Object.keys(object).reduce(function (prev, key) {
                    var curKeyPath = curPath ? curPath + '.' + key : key;
                    var notInSkipList =  skipList.indexOf(curKeyPath) === -1;
                    var notSkipMatch = (skipMatch && skipMatch.test ? !skipMatch.test(curKeyPath) : true);
                    var expectsParam = /(function)?\s?\(.+\)\s*({|=>)/.test((object[key] || '').toString());
                    var shouldMaterialize = notInSkipList && notSkipMatch && !expectsParam;
                    if (shouldMaterialize) {
                        prev[key] = generalHelpers.materialize(object[key], ctx, options, curKeyPath);
                    } else {
                        prev[key] = object[key];
                    }
                    return prev;
                }, {});
            } else {
                return object;
            }
        }
    };

    var dataFilters = {

        cleanNullValues: function () {
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
        },

        minMaxFilter: function (desiredLen) {
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
        }
    };

    var logging = {
        warn: function (msg) {
            if (console && console.log)
                console.log(msg);
        }
    };

    var numberHelpers = {
        firstAndLast: function (ar) {
            return [ar[0], ar[ar.length-1]];
        },

        roundToNearest: function (number, multiple) {
            return mulFloat(Math.ceil(divFloat(number, multiple)), multiple);
        },

        roundTo: function (value, digits) {
            return divFloat(Math.ceil(mulFloat(value, Math.pow(10, digits))), Math.pow(10, digits));
        },

        trunc: function (value) {
            return value - value % 1;
        },

        // only works for integers
        digits: function (value) {
            var str = Math.abs(value).toString();
            var parts = str.split('e');
            if (parts.length === 2) {
                return Math.max(0, parts[1]) + 1;
            }
            parts = str.split('.');
            return parts[0].length;
        },

        decDigits: function (value) {
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
        },

        log10: function (value) {
            return Math.log(value) / Math.LN10;
        },

        clamp: function (val, l, h) {
            return val > h ? h : val < l ? l : val;
        },

        clampLeft: function (val, low) {
            return val < low ? low : val;
        },

        clampRight: function (val, high) {
            return val > high ? high : val;
        },

        degToRad: function (deg) {
            return deg * Math.PI / 180;
        },

        radToDeg: function (rad) {
            return rad * 180 / Math.PI;
        },

        rotatePoint: function (point, rad) {
            return {
                x: point.x * Math.cos(rad) - point.y * Math.sin(rad),
                y: point.x * Math.sin(rad) + point.y * Math.cos(rad)
            };
        },

        translatePoint: function (point, delta) {
            return {
                x: point.x + delta.x,
                y: point.y + delta.y
            };
        },

        linearRegression: function (dataSrc) {
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
        },

        niceRound: function (val) {
            // for now just round(10% above the value)
            return Math.ceil(val + val * 0.10);

            // var digits = Math.floor(Math.log(val) / Math.LN10) + 1;
            // var fac = Math.pow(10, digits);

            // if(val < 1) return nwt.roundToNearest(val, 1);

            // if(val < fac / 2) return nwt.roundToNearest(val, fac / 2);

            // return nwt.roundToNearest(val, fac);
        }
    };

    var axisHelpers = {
        addAxis: function (name, axisCtor) {
            nwt.axes = nwt.axes || {};
            nwt.axes[name] = axisCtor;
        },

        roundToNextTick: function (num) {
            var abs = Math.abs(num);
            var sign = abs === num ? 1 : -1;
            var mag, step;
            if (abs >= 1) {
                mag = Math.floor(nwt.log10(abs));
                step = mag <= 1 ? 2 : Math.pow(10, mag - 1);
            } else {

                var exp = abs.toExponential().replace(/\.|e-\d+$/g, '');
                mag = exp.length;
                step = mulFloat((mag === 1 ? 2 : 10), Math.pow(10, -mag));
            }

            var raw = nwt.roundToNearest(abs, step);
            return sign * raw;
        },

        niceMinMax: function (min, max, ticks, startAtZero) {
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
            if (lodashFns.isNumber(ticks)) {
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
                ticks = lodashFns.range(ticks, ticks * 1.28)
                    .concat(lodashFns.range(ticks - 1, (ticks - 1) * 0.72, -1));
            }

            if (startAtZero == null) {
                startAtZero = min === 0 || origMax < 0;
            }

            var exponent;
            if (min === max) {
                if (max === 0) {
                    exponent = -1.0;
                } else {
                    exponent = numberHelpers.log10(Math.abs(max));
                }
            } else {
                if(startAtZero) {
                    exponent = numberHelpers.log10(Math.abs(max)) - 0.5;
                } else {
                    exponent = numberHelpers.log10(max-min) - 0.5;
                }
            }

            var defaultRounding = -(exponent >= 0 ? numberHelpers.trunc(exponent) : Math.floor(exponent));

            // var defaultRounding = -numberHelpers.trunc((min === max ?
            //     max === 0 ? -1.0 : numberHelpers.log10(Math.abs(max)) :
            //     startAtZero ? numberHelpers.log10(Math.abs(max)) : numberHelpers.log10(max-min)
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
                    var dig = numberHelpers.digits(inter);
                    var roundToDigits;
                    if (inter > 0) {
                        roundToDigits =  -Math.floor(nwt.log10(inter));
                    } else {
                        roundToDigits = (Math.max(1, Math.abs(dig-2)));
                    }

                    iMin = -numberHelpers.roundTo(-inter, roundToDigits);
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
        },

        /*jshint eqnull:true */
        extractScaleDomain: function (domain, min, max, ticks, zeroAnchor) {
            var dataMin = min != null ? min : Math.min.apply(null, domain);
            var dataMax = max != null ? max : Math.max.apply(null, domain);
            ticks = ticks == null ? 5 : ticks;

            var niceMinMax = axisHelpers.niceMinMax(dataMin, dataMax, ticks, zeroAnchor);

            // return [niceMinMax.min, niceMinMax.max];

            // // we want null || undefined for all this comparasons
            // // that == null gives us
            if (min == null && max == null) {
                return [niceMinMax.min, niceMinMax.max];
            }

            if (min == null) {
                return [Math.min(niceMinMax.min, max), max];
            }

            if (max == null) {
                return [min, Math.max(min, niceMinMax.max)];
            }

            return [min, max];
        },

        niceTicks: function (min, max, ticks, zeroAnchor, domain) {
            ticks = ticks == null ? 5 : ticks;
            min = min != null ? min : zeroAnchor ? Math.min(0, domain[0]) : domain[0];
            max = max != null ? max : domain[1];

            var niceMinMax = axisHelpers.niceMinMax(min, max, ticks, zeroAnchor);
            var tickValues = niceMinMax.tickValues;

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

            return lodashFns.uniq(tickValues);
        },

        calcXLabelsWidths: function (ticks) {
            var padding = 8;
            var compact = function (e) { return !!e; };
            return ticks.filter(compact).map(String).map(function (d) {
                if (!d) {
                    return padding * 2;
                }
                return nwt.textBounds(d, '.x.axis text').width + (padding * 2);
            });
        },

        doXLabelsFit: function (ticks, labelFormatter, options) {
            var tickWidths = nwt.calcXLabelsWidths(ticks.map(labelFormatter));
            var availableWidthForLabels = (options.chart.plotWidth + tickWidths[0] / 2 + tickWidths[ticks.length - 1] / 2);
            var axisLabelsWidth = nwt.sum(tickWidths);
            return axisLabelsWidth <= availableWidthForLabels;
        },

        getTicksThatFit: function (ticks, labelFormatter, options) {
            // reduce the number of ticks incrementally by taking every 2nd, then every 3th, and so on
            // until we find a set of ticks that fits the available space
            function reduceTicksByMod() {
                var tickWidths = nwt.calcXLabelsWidths(ticks.map(labelFormatter));
                var axisLabelsWidth = nwt.sum(tickWidths);
                var availableWidthForLabels = (options.chart.plotWidth + tickWidths[0] / 2 + tickWidths[ticks.length - 1] / 2);
                var iter = 1;
                var filterMod = function (d, i) { return (i % iter) === 0; };
                var finalTicks = ticks;
                while(axisLabelsWidth > availableWidthForLabels && finalTicks.length !== 0) {
                    iter++;
                    finalTicks = ticks.filter(filterMod);
                    axisLabelsWidth = nwt.sum(nwt.calcXLabelsWidths(finalTicks.map(labelFormatter)));
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
        }
    };


    var stringHelpers = {
        // measure text inside a Contour chart container
        textBounds: function (text, css) {
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
        }
    };

    var dateHelpers = {
        dateDiff: function(d1, d2) {
            var diff = d1.getTime() - d2.getTime();
            return diff / (24*60*60*1000);
        }
    };

    var arrayHelpers = {
        // concatenate and sort two arrays to the resulting array
        // is sorted ie. merge [2,4,6] and [1,3,5] = [1,2,3,4,5,6]
        mergeArrays: function (array1, array2) {
            if(typeof(array1) === 'number') array1 = [array1];
            if(typeof(array2) === 'number') array2 = [array2];
            if(!array1 || !array1.length) return array2;
            if(!array2 || !array2.length) return array1;

            return [].concat(array1, array2).sort(function (a,b) { return a-b; });
        },

        isCorrectDataFormat: function (dataArray) {
            return Array.isArray(dataArray) && dataArray.every(function (p) { return p.hasOwnProperty('x') && p.hasOwnProperty('y'); });
        },

        isCorrectSeriesFormat: function (data) {
            var isArrayOfObjects = Array.isArray(data) && lodashFns.isObject(data[0]);
            if (!isArrayOfObjects) {
                return false;
            }

            var hasDataArrayPerSeries = data.every(function (d) { return d.hasOwnProperty('data'); });
            var hasSeriesNamePerSeries = data.every(function (d) { return d.hasOwnProperty('name'); });
            var datumInCorrectFormat = isArrayOfObjects && hasDataArrayPerSeries && arrayHelpers.isCorrectDataFormat(data[0].data);

            return isArrayOfObjects && hasDataArrayPerSeries && hasSeriesNamePerSeries && datumInCorrectFormat;
        },

        /*jshint eqnull:true */
        // we are using != null to get null & undefined but not 0
        normalizeSeries: function (data, categories) {
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

            var correctDataFormat = arrayHelpers.isCorrectDataFormat(data);
            var correctSeriesFormat = arrayHelpers.isCorrectSeriesFormat(data);

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
                if ((lodashFns.isObject(data[0]) && data[0].hasOwnProperty('data')) || Array.isArray(data[0])) {
                    // this would be the shape for multiple series
                    return data.map(function (d, i) { return normal(d.data ? d.data : d, d.name ? d.name : 'series ' + (i+1)); });
                } else {
                    // this is just the shape [1,2,3,4] or [{x:0, y:1}, { x: 1, y:2}...]
                    return [normal(data, 'series 1')];
                }
            }

            // nothing to do to the data if it's not in a supported format
            return data;
        },

        // returns a function to format the data into a 'stacked' d3 layout
        // passing in a series data will add a y0 to each data point
        // where the point should start relative to the reset of the series points
        // at that x value
        stackLayout: function () {
            var stack = d3.layout
                .stack()
                .values(function (d) { return d.data; });
            // prepare satck to handle different x values with different lengths
            var outFn = function() {
                var y0s = {};
                return function (d, y0, y) {
                    d.y0 = y0s[d.x] != null ? y0s[d.x] : 0;
                    d.y = y;
                    y0s[d.x] = (y0s[d.x] || 0) + y;
                };
            };

            stack.out(outFn());

            return stack;
        },

        // return the uniq elements in the array
        // we are implementing our own version since this algorithm seems
        // to be a lot faster than what lodash uses
        uniq: function (array) {
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
        },

        sum: function (array) {
            return array.reduce(function (acc, cur) { return acc += cur; }, 0);
        },

        maxTickValues: function (max, domain) {
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
        },

        isSupportedDataFormat: function (data) {
            // this covers all supported formats so far:
            // [ {data: [...] }, ... ]
            // [ [...], [...] ]
            return Array.isArray(data) &&
                (lodashFns.isObject(data[0]) && data[0].hasOwnProperty('data') && Array.isArray(data[0].data)) ||
                Array.isArray(data[0]);
        }

    };

    var domHelpers = {
        selectDom: function (selector) {
            return d3.select(selector)[0][0];
        },

        getStyle: function (el, style) {
            if(!el) return undefined;
            var elem = typeof el === 'string' ? this.selectDom(el) : el;
            // we need a good way to check if the element is detached or not
            var styles = elem.offsetParent ? elem.ownerDocument.defaultView.getComputedStyle(elem, null) : elem.style;

            return style ? styles[style] : styles;
        },

        getCentroid: function (element) {
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
        }
    };

    var debuggingHelpers = {
        warning: function (msg) {
            if(console && console.log) {
                console.log('WARNING: ' + msg);
            }
        }
    };

    root.nwt = Object.assign({}, root.nwt, numberHelpers, arrayHelpers, stringHelpers, dateHelpers,
        axisHelpers, debuggingHelpers, domHelpers, generalHelpers, logging, dataFilters, lodashFns);

    root.nwt.noop = noop;
})();
