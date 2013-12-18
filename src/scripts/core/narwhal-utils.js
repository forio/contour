(function () {

    var numberHelpers = {
        firstAndLast: function (ar) {
            return [ar[0], ar[ar.length-1]];
        },

        roundToNearest: function (number, multiple){
            return Math.ceil(number / multiple) * multiple;
        },

        niceRound: function (val) {
            // for now just round(10% above the value)
            return Math.ceil(val * 1.10);

            // var digits = Math.floor(Math.log(val) / Math.LN10) + 1;
            // var fac = Math.pow(10, digits);

            // if(val < 1) return _.nw.roundToNearest(val, 1);

            // if(val < fac / 2) return _.nw.roundToNearest(val, fac / 2);

            // return _.nw.roundToNearest(val, fac);
        }
    };

    var stringHelpers = {
        // measure text inside a narwhal chart container
        textBounds: function (text, css) {
            var body = document.getElementsByTagName('body')[0];
            var wrapper = document.createElement('span');
            var dummy = document.createElement('span');
            wrapper.className = 'narwhal-chart';
            dummy.style.position = 'absolute';
            dummy.style.width = 'auto';
            dummy.style.height = 'auto';
            dummy.style.visibility = 'hidden';
            dummy.style.lineHeight = '100%';

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
        merge: function (array1, array2) {
            if(typeof(array1) === 'number') array1 = [array1];
            if(typeof(array2) === 'number') array2 = [array2];
            if(!array1 || !array1.length) return array2;
            if(!array2 || !array2.length) return array1;

            return [].concat(array1, array2).sort(function (a,b) { return a-b; });
        },

        /*jshint eqnull:true */
        // we are using != null to get null & undefined but not 0
        normalizeSeries: function (data, categories) {
            function normal(set, name) {
                return {
                    name: name,
                    data: _.map(set, function (d, i) {
                        var hasX = d != null && d.hasOwnProperty('x');
                        var hasCategories = categories && _.isArray(categories);
                        var val = function (v) { return v != null ? v : null; };
                        return hasX ? _.extend(d, { x: d.x, y: val(d.y) }) : { x: hasCategories ? categories[i] + '' : i, y: val(d) };
                    })
                };
            }

            if (_.isArray(data)) {
                if ((_.isObject(data[0]) && data[0].hasOwnProperty('data')) || _.isArray(data[0])) {
                    // this would be the shape for multiple series
                    return _.map(data, function (d, i) { return normal(d.data ? d.data : d, d.name ? d.name : 'series ' + (i+1)); });
                } else {
                    // this is just the shape [1,2,3,4] or [{x:0, y:1}, { x: 1, y:2}...]
                    return [normal(data, 'series 1')];
                }
            }
        }

    };

    var ajaxHelpers = {
        /*jshint eqnull:true */
        extractScaleDomain: function (domain, min, max) {
            var dataMax = _.max(domain);
            var dataMin = _.min(domain);

            // we want null || undefined for all this comparasons
            // that == null gives us
            if (min == null && max == null) {
                return [dataMin, dataMax];
            }

            if (min == null) {
                return [Math.min(dataMin, max), max];
            }

            if (max == null) {
                return [min, Math.max(min, dataMax)];
            }

            return [min, max];
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
        }
    };

    var debuggingHelpers = {
        warning: function (msg) {
            if(console && console.log) {
                console.log('WARNING: ' + msg);
            }
        }
    };

    _.nw = _.extend({}, _.nw, numberHelpers, arrayHelpers, stringHelpers, dateHelpers, ajaxHelpers, debuggingHelpers, domHelpers);

})();
