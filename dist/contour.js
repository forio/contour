(function (undefined) {

    var root = this;

    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        if(typeof require === 'function') {
            root.d3 = require('d3');
            root._ = require('lodash');
        }
    }

    if(!d3) throw new Error('You need to include d3.js before Contour. Go to http://d3js.org/');
    if(!_ || !_.merge) throw new Error('You need to include lodash.js before Contour. Go to http://lodash.com/');



(function () {

    var generalHelpers = {
        // the src is a function returns the function evaluated
        // otherwise returns src
        getValue: function (src, deafult, ctx, args) {
            args = Array.prototype.slice.call(arguments, 3);
            return !src ? deafult : typeof src === 'function' ? src.apply(ctx, args) : src;
        },

        seriesNameToClass: function (name) {
            return name || '';
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
            return Math.ceil(number / multiple) * multiple;
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

            // if(val < 1) return _.nw.roundToNearest(val, 1);

            // if(val < fac / 2) return _.nw.roundToNearest(val, fac / 2);

            // return _.nw.roundToNearest(val, fac);
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
            var hasCategories = !!(categories && _.isArray(categories));
            function sortFn(a, b) { return a.x - b.x; }
            function normal(set, name) {
                var d = {
                    name: name,
                    data: _.map(set, function (d, i) {
                        var hasX = d != null && d.hasOwnProperty('x');
                        var val = function (v) { return v != null ? v : null; };
                        return hasX ? _.extend(d, { x: d.x, y: val(d.y) }) : { x: hasCategories ? categories[i] + '' : i, y: val(d) };
                    })
                };

                if (!hasCategories) {
                    d.data.sort(sortFn);
                }

                return d;
            }

            var correctDataFormat = _.isArray(data) && _.all(data, function (p) { return p.hasOwnProperty('x') && p.hasOwnProperty('y'); });
            var correctSeriesFormat = _.isArray(data) && _.isObject(data[0]) && data[0].hasOwnProperty('data') &&
                    data[0].hasOwnProperty('name') && _.all(data[0].data, function (p) { return p.hasOwnProperty('x') && p.hasOwnProperty('y'); });

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
            if (_.isArray(data)) {
                if ((_.isObject(data[0]) && data[0].hasOwnProperty('data')) || _.isArray(data[0])) {
                    // this would be the shape for multiple series
                    return _.map(data, function (d, i) { return normal(d.data ? d.data : d, d.name ? d.name : 'series ' + (i+1)); });
                } else {
                    // this is just the shape [1,2,3,4] or [{x:0, y:1}, { x: 1, y:2}...]
                    return [normal(data, 'series 1')];
                }
            }

            // nothing to do to the data if it's not in a supported format
            return data;
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
            return _.isArray(data) && (_.isObject(data[0]) && data[0].hasOwnProperty('data')) || _.isArray(data[0]);
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

    _.nw = _.extend({}, _.nw, numberHelpers, arrayHelpers, stringHelpers, dateHelpers,
        ajaxHelpers, debuggingHelpers, domHelpers, generalHelpers, logging);

})();

(function () {

    var root = this;

    var defaults = {
        chart: {
            animations: {
                enable: true,
                // duration of the animation in ms
                duration: 400,
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
            plotLeft: undefined,
        },

        xAxis: {
        },

        yAxis: {
        },

        tooltip: {
        }
    };

    // used to pass the last specified dataset
    // to the next visualiaztion in the chain wihtout
    // the need to specify it again.... this allows you to do
    // new Contour().cartesian().line(dataset).lengend().tooltip().render()
    // and legend and tooltip will recieve dataset
    var lastData;

    /**
    * Creates a Contour instance, based on the core Contour object. This instance can contain a set of related visualizations.
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
    * @class Contour() visualizations object
    * @param {object} options The global configuration options object
    *
    */
    function Contour (options) {
        this.init(options);

        return this;
    }

    /**
    * Adds a new kind of visualization to the core Contour object.
    * The *renderer* function is called when you add this visualization to instances of Contour.
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
            if(!data || !data.length) return [];

            if(data[0].data) {
                _.each(data, sortSeries);
            }

            var shouldSort = _.isObject(data[0]) && _.isDate(data[0].x);
            var sortFunc = function (a, b) { return a.x - b.x; };
            if(shouldSort) {
                data.sort(sortFunc);
            }

            return data;
        }

        Contour.prototype[ctorName] = function (data, options) {
            var categories = this.options ? this.options.xAxis ? this.options.xAxis.categories : undefined : undefined;
            var opt =  _.extend({}, this.options[ctorName], options);
            var vis;

            data = data || lastData || [];
            sortSeries(data);
            vis = new Contour.VisualizationContainer(_.nw.normalizeSeries(data, categories), opt, ctorName, renderer, this);
            this._visualizations.push(vis);
            lastData = data;
            return this;
        };
    };


    /**
    * Exposes functionality to the core Contour object.
    * Use this to add *functionality* that will be available for any visualizations.
    *
    * ###Example:
    *
    *     Contour.expose("example", {
    *          // when included in the instance, the function `.myFunction` is available in the visualizations
    *         myFunction: function(data) { .... }
    *     });
    *
    *     Contour.export("visualizationThatUsesMyFunction", function(data, layer) {
    *           //function body including call to this.myFunction(data)
    *     });
    *
    *     // to include the functionality into a specific instance
    *     new Contour(options)
    *           .example()
    *           .visualizationThatUsesMyFunction()
    *           .render()
    */
    Contour.expose = function (ctorName, functionalityConstructor) {
        var ctor = function () {

            var functionality = typeof functionalityConstructor === 'function' ? new functionalityConstructor() : functionalityConstructor;
            // extend the --instance-- we don't want all charts to be overriden...
            _.extend(this, _.omit(functionality, 'init'));

            if(functionality.init) functionality.init.call(this, this.options);

            // keep a list of the included functionality into this instance
            // so we can match and check dependencies
            this._exposed.push(ctorName);

            return this;
        };

        Contour.prototype[ctorName] = ctor;

        return this;
    };

    Contour.prototype = _.extend(Contour.prototype, {
        _visualizations: undefined,

        _extraOptions: undefined,

        _exposed: undefined,

        // Initializes the instance of Narwhal
        init: function (options) {
            // for now, just  store this options here...
            // the final set of options will be composed before rendering
            // after all components/visualizations have been added
            this.options = options || {};

            this._extraOptions = [];
            this._visualizations = [];
            this._exposed = [];

            return this;
        },

        calculateWidth: function () {
            var width = _.nw.getStyle(this.options.el, 'width');
            return this.options.el ? (parseInt(width, 10) || this.options.chart.defaultWidth) : this.options.chart.defaultWidth;
        },

        calculateHeight: function () {
            var height = _.nw.getStyle(this.options.el, 'height');
            var containerHeight = this.options.el ? parseInt(height, 10) : undefined;
            var calcWidth = this.options.chart.width;
            var ratio = this.options.chart.aspect || this.options.chart.defaultAspect;

            return !!containerHeight && containerHeight > 1 ?  containerHeight : Math.round(calcWidth * ratio);
        },

        calcMetrics: function () {
            var options = this.options;

            this.adjustPadding();

            this.adjustTitlePadding();

            options.chart.width = options.chart.width || this.calculateWidth();
            options.chart.height = options.chart.height || this.calculateHeight();

            this.options = _.merge(options, {
                chart: {
                    plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.internalPadding.left - options.chart.padding.right,
                    plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.internalPadding.bottom,
                    plotLeft: options.chart.margin.left + options.chart.internalPadding.left,
                    plotTop: options.chart.margin.top + options.chart.padding.top
                }
            });
        },

        adjustPadding: function () {
            // overriden by components that need to adjust padding
            return this;
        },

        adjustTitlePadding: function () {
            // overriden by components that need to adjust padding
            return this;
        },

        composeOptions: function () {
            var allDefaults = _.merge({}, defaults);
            var mergeExtraOptions = function (opt) { _.merge(allDefaults, opt); };
            var mergeDefaults = function (vis) { _.merge(allDefaults, vis.renderer.defaults); };

            _.each(this._extraOptions, mergeExtraOptions);
            _.each(this._visualizations, mergeDefaults);

            // compose the final list of options right before start rendering
            this.options = _.merge({}, allDefaults, this.options);
        },

        baseRender: function () {
            this.plotArea();

            return this;
        },

        /**
        * Renders this Contour instance and all its visualizations into the DOM.
        *
        * Example:
        *
        *     new Contour({ el:'.myChart' })
        *           .pie([1,2,3])
        *           .render()
        *
        * @function render
        *
        */
        render: function () {
            this.composeOptions();

            this.calcMetrics();

            this.baseRender();

            this.renderVisualizations();

            return this;
        },

        update: function () {
            this.calcMetrics();
            return this;
        },

        plotArea: function () {

            var chartOpt = this.options.chart;

            this.container = d3.select(this.options.el);
            // fix a flicker im web-kit when animating opacity and the chart is in an iframe
            this.container.attr('style', '-webkit-backface-visibility: hidden;');

            if(!this.svg) {
                this.svg = this.container
                    .append('svg')
                    .attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height)
                    .attr('preserveAspectRatio', 'xMinYMin')
                    .attr('class', 'contour-chart')
                    .attr('height', chartOpt.height)
                    .append('g')
                        .attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');
            }

            return this;
        },

        createVisualizationLayer: function (vis, id) {
            return this.svg.append('g')
                .attr('vis-id', id)
                .attr('vis-type', vis.type)
                .attr('transform', 'translate(' + this.options.chart.internalPadding.left + ',' + this.options.chart.padding.top + ')');
        },

        renderVisualizations: function () {

            _.each(this._visualizations, function (visualization, index) {
                var id = index + 1;
                var layer = visualization.layer || this.createVisualizationLayer(visualization, id);
                var opt = _.merge({}, this.options, visualization.options);
                visualization.layer = layer;
                visualization.parent = this;
                visualization.render(layer, opt, this);
            }, this);

            return this;
        },

        /**
        * Assert that all the dependencies are into the Contour instance
        * for example if a visualization requires Cartisian to be included in the instance
        * it would call this.checkDependencies('Cartesian'), and the framework would
        * give a helpful error message if it was not included
        *
        * @function checkDependencies
        * @param {string|array} list of dependencies (as specified in the instance constructor)
        *
        */
        checkDependencies: function (listOfDependencies) {
            listOfDependencies = _.isArray(listOfDependencies) ? listOfDependencies : [listOfDependencies];
            var _this = this;
            var missing = [];

            _.each(listOfDependencies, function (dep) {
                if (_this._exposed.indexOf(dep) === -1) {
                    missing.push(dep);
                }
            });

            if (missing.length) {
                throw new Error('ERROR: Missing depeendencies in the Contour instance (ej. new Contour({}).cartesian())\n The missing dependencies are: [' + missing.join(', ') + ']\nGo to http://forio.com/contour/documentation.html#key_concepts for more information');
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
        setData: function (data) {
            _.invoke(this._visualizations, 'setData', data);

            return this;
        },

        /**
        * Returns a VisualizationContainer object for the visualization at a given index (0-based).
        *
        * ###Example:
        *
        *     var chart = new Contour({ el:'.myChart' })
        *           .pie([1,2,3])
        *           .render()
        *
        *     var myPie = chart.select(0)
        *
        *     // do something with the visualization, for example updating its data set
        *     myPie.setData([6,7,8,9]).render()
        *
        * @function select
        *
        */
        select: function (index) {
            return this._visualizations[index];
        },

        // place holder function for now
        data: function () {

        }
    });


    // export to our context
    root.Contour = Contour;

})();

(function () {

    var YAxis = function (data, options) {
        this.data = data;
        this.options = options;
    };

    function setRange(scale, options) {
        var rangeSize = options.chart.rotatedFrame ? options.chart.plotWidth : options.chart.plotHeight;
        var range = options.chart.rotatedFrame ? [0, rangeSize] : [rangeSize, 0];
        return scale.range(range);
    }

    YAxis.prototype = {
        axis: function () {
            var options = this.options.yAxis;
            var domain = this._scale.domain();
            var tickValues = options.tickValues;
            var numTicks = this.numTicks(domain, options.min, options.max);
            var format = options.labels.formatter || d3.format(options.labels.format);

            return d3.svg.axis()
                .scale(this._scale)
                .tickFormat(format)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .ticks(numTicks)
                .tickValues(tickValues);
        },

        scale: function (domain) {
            if(!this._scale) {
                this._scale = d3.scale.linear();
                this.setDomain(domain);
                setRange(this._scale, this.options);
            }

            return this._scale;
        },

        setDomain: function (domain) {
            this._scale.domain(domain);
            this._niceTheScale();
            return this._scale;
        },

        update: function (domain, dataSrc) {
            this.data = dataSrc;
            this.setDomain(domain);
        },

        /*jshint eqnull:true*/
        numTicks: function () {
            return this.options.yAxis.ticks != null ? this.options.yAxis.ticks : undefined;
        },

        _niceTheScale: function () {
            if (this.options.yAxis.nicing)
                this._scale.nice();
        }
    };

    _.extend(_.nw, { YAxis: YAxis });

})();

(function () {

    var defaults = {
        chart: {
            gridlines: 'none',
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
            type: null, // defaults is ordinal (needs to be null here so overrides work)
            categories: undefined,
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
            linearDomain: false,     // specify if a time domain should be treated linearly or ....
        },

        yAxis: {
            // @param: {linear|smart|log}
            // type: 'smart',
            min: undefined,
            max: undefined,
            smartAxis: false,
            innerTickSize: 6,
            outerTickSize: 6,
            tickPadding: 4,
            tickValues: undefined,
            ticks: undefined,
            title: undefined,
            titlePadding: 4,
            nicing: true,
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
    var cartesian = function () {
        return {
            dataSrc: [],

            init: function (options) {

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

                _.merge(this.options, readOnlyProps);

                var extraPadding = {};
                if (!this.options.xAxis || !this.options.xAxis.firstAndLast) {
                    extraPadding = { chart : { padding: { right: 15 }}};
                }

                this._extraOptions.push(_.merge({}, defaults, extraPadding));

                return this;
            },

            xDomain: [],
            yDomain: [],

            _getYScaledDomain: function () {
                var absMin = this.yDomain && this.yDomain[0] > 0 ? 0 : undefined;
                return _.nw.extractScaleDomain(this.yDomain, this.options.yAxis.min || absMin, this.options.yAxis.max);
            },

            /*jshint eqnull:true */
            adjustPadding: function () {
                var xOptions = this.options.xAxis;
                var yOptions = this.options.yAxis;
                var maxTickSize = function (options) { return Math.max(options.outerTickSize || 0, options.innerTickSize || 0); };
                // bottom padding calculations
                if (this.options.chart.padding.bottom == null) {
                    if (xOptions.ticks !== 0) {
                        var xLabels = this.xDomain;
                        var xAxisText = xLabels.join('<br>');
                        var xLabelBounds = _.nw.textBounds(xAxisText, '.x.axis');
                        var regularXBounds = _.nw.textBounds('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', '.x.axis');
                        var em = regularXBounds.height;
                        var ang = xOptions.labels && xOptions.labels.rotation ? xOptions.labels.rotation % 360 : 0;
                        var xLabelHeightUsed = ang === 0 ? regularXBounds.height : Math.ceil(Math.abs(xLabelBounds.width * Math.sin(_.nw.degToRad(ang))) + em / 5) ;
                        this.options.chart.internalPadding.bottom = this.options.chart.padding.bottom ||
                            maxTickSize(this.options.xAxis) + (this.options.xAxis.tickPadding || 0) +
                            xLabelHeightUsed;
                    } else {
                        this.options.chart.internalPadding.bottom = maxTickSize(this.options.xAxis) + (this.options.xAxis.tickPadding || 0);
                    }
                } else {
                    this.options.chart.internalPadding.bottom = this.options.chart.padding.bottom || 0;
                }

                // left padding calculations
                if (this.options.chart.padding.left == null) {
                    var yDomainScaled = this._getYScaledDomain();
                    // var yDomainScaled = _.nw.extractScaleDomain(this.yDomain.slice().concat([_.nw.niceRound(this.yDomain[1])]), yOptions.min, yOptions.max);
                    var tmpScale = d3.scale.linear().domain(yDomainScaled);
                    var yLabels = tmpScale.ticks(yOptions.ticks);

                    var format = yOptions.labels.formatter || d3.format(yOptions.labels.format || ',.0f');
                    var yAxisText = _.map(yLabels, format).join('<br>');
                    var yLabelBounds = _.nw.textBounds(yAxisText, '.y.axis');
                    this.options.chart.internalPadding.left = this.options.chart.padding.left ||
                        maxTickSize(this.options.yAxis) + (this.options.yAxis.tickPadding || 0) +
                        yLabelBounds.width;
                } else {
                    this.options.chart.internalPadding.left = this.options.chart.padding.left;
                }
            },

            adjustTitlePadding: function () {
                var titleBounds;
                if (this.options.xAxis.title || this.options.yAxis.title) {
                    if(this.options.xAxis.title) {
                        titleBounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                        this.options.chart.internalPadding.bottom += titleBounds.height + this.options.xAxis.titlePadding;
                    }

                    if(this.options.yAxis.title) {
                        titleBounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                        this.options.chart.internalPadding.left += titleBounds.height + this.options.yAxis.titlePadding;
                    }
                }
            },

            computeXScale: function () {
                if (!this.xDomain) throw new Error('You are trying to render without setting data (xDomain).');

                if(!this.xScale) {
                    this.xScaleGenerator = _.nw.xScaleFactory(this.dataSrc, this.options);
                    this.xScale = this.xScaleGenerator.scale(this.xDomain);
                    this.rangeBand = this.xScaleGenerator.rangeBand();
                } else {
                    this.xScaleGenerator.update(this.xDomain, this.dataSrc);
                    this.rangeBand = this.xScaleGenerator.rangeBand();
                }
            },

            computeYScale: function () {
                if (!this.yDomain) throw new Error('You are trying to render without setting data (yDomain).');

                var yScaleDomain = this._getYScaledDomain();

                if(!this.yScale) {
                    this.yScaleGenerator = _.nw.yScaleFactory(this.dataSrc, this.options, this.yMin, this.yMax);
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
            setYDomain: function (domain) {
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
            redrawYAxis: function () {
                this.svg.select(".y.axis").call(this.yAxis());
                this.renderGridlines();
            },

            _animationDuration: function () {
                var opt = this.options.chart.animations;
                return opt && opt.enable ?
                    opt.duration != null ? opt.duration : 400 :
                    0;
            },

            computeScales: function () {
                this.computeXScale();
                this.computeYScale();

                return this;
            },

            _xAxis: undefined,
            xAxis: function () {
                if (!this._xAxis) {
                    this._xAxis = this.xScaleGenerator.axis().orient(this.options.xAxis.orient);
                }

                return this._xAxis;
            },

            _yAxis: undefined,
            yAxis: function () {
                if(!this._yAxis) {
                    this._yAxis = this.yScaleGenerator.axis().orient(this.options.yAxis.orient);
                }
                return this._yAxis;
            },

            renderXAxis: function () {
                var xAxis = this.xAxis();
                var y = this.options.chart.plotHeight + this.options.chart.padding.top;

                this._xAxisGroup = this.svg.selectAll('.x.axis')
                    .data([1]);

                this._xAxisGroup.enter()
                    .append('g')
                    .attr('transform', 'translate(' + this.options.chart.internalPadding.left + ',' + y + ')')
                    .attr('class', 'x axis');

                this._xAxisGroup
                    .transition().duration(this._animationDuration())
                    .call(xAxis);

                this.xScaleGenerator.postProcessAxis(this._xAxisGroup);

                return this;
            },

            renderYAxis: function () {
                var options = this.options.yAxis;
                var alignmentOffset = { bottom: '.8em', middle: '.35em', top: '0' };
                var x = this.options.chart.internalPadding.left;
                var y = this.options.chart.padding.top;

                this._yAxisGroup = this.svg.selectAll('.y.axis')
                    .data([1]);

                this._yAxisGroup
                    .enter().append('g')
                    .attr('transform', 'translate(' + x + ',' + y + ')')
                        .attr('class', 'y axis');

                this._yAxisGroup
                    .transition().duration(this._animationDuration())
                    .call(this.yAxis())
                    .selectAll('.tick text')
                        .attr('dy', alignmentOffset[options.labels.verticalAlign]);

                return this;
            },

            renderAxisLabels: function () {
                var lineHeightAdjustment = this.titleOneEm * 0.25; // add 25% of font-size for a complete line-height
                var adjustFactor = 40/46.609; // this factor is to account for the difference between the actual svg size and what we get from the DOM
                var bounds, x, y;

                if (this.options.xAxis.title) {
                    bounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                    y = this.options.chart.internalPadding.bottom;
                    x = 0;
                    el = this._xAxisGroup.selectAll('.x.axis-title').data([1]);
                    el.enter().append('text')
                        .attr('class', 'x axis-title')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dx', (this.options.chart.plotWidth - bounds.width) / 2)
                        .attr('dy', -2) // just because
                        .text(this.options.xAxis.title);
                }

                if (this.options.yAxis.title) {
                    bounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                    y = -this.options.chart.internalPadding.left + bounds.height * adjustFactor;
                    x = 0;
                    el = this._yAxisGroup.selectAll('.y.axis-title').data([1]);
                    el.enter().append('text')
                        .attr('class', 'y axis-title')
                        .attr('transform', 'rotate(-90)')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dx', -(this.options.chart.plotHeight + bounds.width) / 2)
                        .attr('dy', 0)
                        .text(this.options.yAxis.title);
                }

                return this;
            },

            renderGridlines: function () {
                var option = this.options.chart.gridlines;
                var horizontal = option === 'horizontal' || option === 'both';
                var vertical = option === 'vertical' || option === 'both';

                function getYTicks(axis, smart) {
                    var tickValues = axis.tickValues();

                    if(!tickValues) {
                        var numTicks = axis.ticks()[0];
                        return axis.scale().ticks(numTicks).slice(1);
                    }

                    smart && tickValues.pop();

                    return tickValues.slice(1);
                }

                function getXTicks(axis) {
                    return axis.tickValues() || (axis.scale().ticks ? axis.scale().ticks().slice(1) : axis.scale().domain());
                }

                var ticks, gr;
                var x = this.xScale;
                var y = this.yScale;

                if(horizontal) {
                    ticks = getYTicks(this.yAxis(), this.options.yAxis.smartAxis);
                    var w = this.options.chart.plotWidth;

                    // remove previous lines (TODO: we need a better way)
                    // this._yAxisGroup.select('g.grid-lines').remove();
                    gr = this._yAxisGroup
                        .selectAll('.grid-lines')
                        .data([ticks]);

                    gr.enter().append('svg:g')
                        .attr('class', 'grid-lines');

                    var lines = gr.selectAll('.grid-line')
                        .data(function (d) { return d; });

                    lines.transition().duration(this._animationDuration())
                        .attr('x1', 0)
                        .attr('x2', function () {
                            return w;
                        })
                        .attr('y1', y)
                        .attr('y2', y);

                    lines.enter().append('line')
                            .attr('class', 'grid-line')
                            .attr('x1', 0)
                            .attr('x2', function () {
                                return w;
                            })
                            .attr('y1', y)
                            .attr('y2', y);

                    lines.exit().remove();
                }

                if(vertical) {
                    // remove previous lines (TODO: we need a better way)
                    this._xAxisGroup.select('g.grid-lines').remove();
                    gr = this._xAxisGroup.append('svg:g').attr('class', 'grid-lines');
                    ticks = getXTicks(this.xAxis());
                    var offset = this.rangeBand / 2;
                    var h = this.options.chart.plotHeight;

                    gr.selectAll('.grid-line')
                        .data(ticks)
                        .enter().append('line')
                            .attr('class', 'grid-line')
                            .attr('x1', function (d) { return x(d) + offset; })
                            .attr('x2', function (d) { return x(d) + offset; })
                            .attr('y1', -h)
                            .attr('y2', 0);
                }

                return this;
            },

            renderBackground: function () {
                var options = this.options.chart;
                var layer = this.createVisualizationLayer('background', 0);
                var g = layer.selectAll('.plot-area-background').data([null]);

                g.enter().append('rect')
                    .attr('class', 'plot-area-background')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', options.plotWidth)
                    .attr('height', options.plotHeight);

                g.exit().remove();

                return this;
            },

            render: function () {

                this.composeOptions();
                this.adjustDomain();
                this.calcMetrics();
                this.computeScales();
                this.baseRender();

                this
                    .renderBackground()
                    .renderXAxis()
                    .renderYAxis()
                    .renderGridlines()
                    .renderAxisLabels()
                    .renderVisualizations();

                return this;
            },

            datum: function (d, index) {
                if(_.isObject(d) && _.isArray(d.data))
                    return _.map(d.data, _.bind(this.datum, this));

                return {
                    y: _.isObject(d) ? d.y : d,
                    x: _.isObject(d) ? d.x : this.options.xAxis.categories ? this.options.xAxis.categories[index] : index
                };
            },

            adjustDomain: function () {
                var extents = this.getExtents();
                this.yDomain = extents.length ? extents : [0, 10];
                this.xDomain = this.getXDomain();
                this.yMin = this.yDomain[0];
                this.yMax = this.yDomain[this.yDomain.length - 1];
                var dataVis = _.filter(this._visualizations, function (v) { return _.nw.isSupportedDataFormat(v.data); });
                this.dataSrc = _.flatten(
                    _.map(dataVis, function (v) {
                        return _.flatten(_.map(v.data, _.bind(this.datum, this)));
                    }, this)
                );

                this._yAxis = null;
                this._xAxis = null;
            },

            getExtents: function (axis) {
                var field = axis && axis === 'x' ? 'xExtent' : 'yExtent';
                var dataVis = _.filter(this._visualizations, function (v) { return _.nw.isSupportedDataFormat(v.data); });
                var all = _.flatten(_.pluck(dataVis, field));
                return all.length ? d3.extent(all) : [];
            },

            getXDomain: function () {
                var dataVis = _.filter(this._visualizations, function (v) { return _.nw.isSupportedDataFormat(v.data); });
                var all = _.nw.uniq(_.flatten(_.pluck(dataVis, 'xDomain')));

                return all;
            }

        };
    };

    Contour.expose('cartesian', cartesian);

})();

Contour.version = '0.9.84';
(function () {

    var helpers = {
        xScaleFactory: function (data, options) {
            // if we have dates in the x field of the data points
            // we need a time scale, otherwise is an oridinal
            // two ways to shape the data for time scale:
            //  [{ x: date, y: 1}, {x: date, y: 2}]
            //  [{ data: [ x: date, y: 1]}, {data: [x: date, y: 100]}]
            // if we get no data, we return an ordinal scale
            var isTimeData = options.xAxis.type === 'time' || (_.isArray(data) && data.length > 0 && data[0].data ?
                data[0].data[0].x && _.isDate(data[0].data[0].x) :
                _.isArray(data) && data.length > 0 && data[0].x && _.isDate(data[0].x));


            if (isTimeData && options.xAxis.type !== 'ordinal') {
                return new _.nw.TimeScale(data, options);
            }

            if (!options.xAxis.categories && options.xAxis.type === 'linear') {
                return new _.nw.LinearScale(data, options);
            }

            return new _.nw.OrdinalScale(data, options);
        },

        yScaleFactory: function (data, options, yMin, yMax) {
            var map = {
                'log': _.nw.LogYAxis,
                'smart': _.nw.SmartYAxis,
                'linear': _.nw.YAxis
            };

            if(!options.yAxis.type) options.yAxis.type = 'linear';
            if(options.yAxis.type === 'linear' && options.yAxis.smartAxis) options.yAxis.type = 'smart';

            if(!map[options.yAxis.type]) throw new Error('Unknown axis type: "' + options.yAxis.type + '"');

            return new map[options.yAxis.type](data, options, yMin, yMax);
        }

    };

    _.nw = _.extend({}, _.nw, helpers);

})();

(function () {

    function LinearScale(data, options) {
        this.options = options;
        this.data = data;

        this.init();
    }

    LinearScale.prototype = {
        init: function () {
            delete this._scale;
        },

        /*jshint eqnull:true*/
        scale: function (domain) {
            this._domain = domain ? this._getAxisDomain(domain) : this._getAxisDomain(this.data);
            if(!this._scale) {
                this._scale = d3.scale.linear().domain(this._domain);
                if(this.options.xAxis.min == null && this.options.xAxis.max == null)
                    this._scale.nice();
                this._setRange();
            } else {
                this._scale.domain(this._domain);
            }

            return this._scale;
        },

        axis: function () {
            var options = this.options.xAxis;
            var formatLabel = options.labels.formatter || d3.format(options.labels.format || 'd');
            var axis = d3.svg.axis()
                .scale(this._scale)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickFormat(function (d) {
                    return _.isDate(d) ? d.getDate() : formatLabel(d);
                });

            if (options.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            } else if (options.tickValues) {
                axis.tickValues(options.tickValues);
            } else if (options.ticks != null) {
                axis.ticks(options.ticks);
            }

            return axis;
        },

        update: function (domain, dataSrc) {
            this.data = dataSrc;
            this.scale(domain);
        },

        rangeBand: function () {
            return 1;
        },

        postProcessAxis: function () {
            return this;
        },

        _setRange: function () {
            var rangeSize = !!this.options.chart.rotatedFrame ? this.options.chart.plotHeight : this.options.chart.plotWidth;
            var range = !!this.options.chart.rotatedFrame ? [rangeSize, 0]  : [0, rangeSize];
            return this._scale.range(range);
        },

        _getAxisDomain: function (domain) {
            /*jshint eqnull: true*/
            var optMin = this.options.xAxis.min;
            var optMax = this.options.xAxis.max;
            var min = optMin != null ? this.options.xAxis.min : d3.min(domain);
            var max = optMax != null ? this.options.xAxis.max : d3.max(domain);

            if(optMin != null && optMax != null && optMin > optMax) {
                return d3.extent(domain);
            }

            return [min, max];
        },
    };

    _.nw = _.extend({}, _.nw, { LinearScale: LinearScale });

})();

(function () {

    var LogYAxis = function (data, options) {
        this.data = data;
        this.options = options;
    };

    function setRange(scale, options) {
        var rangeSize = options.chart.rotatedFrame ? options.chart.plotWidth : options.chart.plotHeight;
        var range = options.chart.rotatedFrame ? [0, rangeSize] : [rangeSize, 0];
        return scale.range(range);
    }

    LogYAxis.prototype = _.extend({}, _.nw.YAxis.prototype, {
        axis: function () {
            var options = this.options.yAxis;
            var domain = this._scale.domain();
            var ticksHint = Math.ceil(Math.log(domain[1]) / Math.log(10));
            var format = options.labels.formatter || d3.format(options.labels.format || ',.0f');

            var axis = d3.svg.axis()
                .scale(this._scale)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding);
            if(options.labels.formatter) {
                axis.tickFormat(options.labels.formatter);
            } else {
                axis.ticks(options.ticks || ticksHint, format);
            }


            return axis;
        },

        scale: function (domain) {
            if(!this._scale) {
                if(domain[0] <= 0.1) domain[0] = 0.1; //throw new Error('Log scales don\'t support 0 or negative values');

                this._scale = d3.scale.log();
                this.setDomain(domain).clamp(true);

                setRange(this._scale, this.options);
            }

            return this._scale;
        },

        update: function (domain, dataSrc) {
            this.data = dataSrc;
            if(domain[0] <= 0.1) domain[0] = 0.1; //throw new Error('Log scales don\'t support 0 or negative values');
            this.setDomain(domain).clamp(true);
        },
    });

    _.extend(_.nw, { LogYAxis: LogYAxis });

})();

(function () {

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
        init: function () {
            this.isCategorized = true;
            delete this._scale;
        },

        scale: function (domain) {
            if(!this._scale) {
                this._scale = new d3.scale.ordinal();
                this._range();
            }

            this.setDomain(domain);

            return this._scale;
        },

        /* jshint eqnull:true */
        axis: function () {
            var options = this.options.xAxis;
            var optFormat = (options.labels.format ? d3.format(options.labels.format) : 0);

            var tickFormat = options.labels.formatter || (!this.isCategorized ? optFormat : 0) || function (d) { return _.isDate(d) ? d.getDate() : d; };
            var axis = d3.svg.axis()
                .scale(this._scale)
                .innerTickSize(options.innerTickSize)
                .outerTickSize(options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickFormat(tickFormat);

            if (options.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            } else if (options.maxTicks) {
                axis.tickValues(_.nw.maxTickValues(options.maxTicks, this._domain));
            } else if (options.tickValues) {
                axis.tickValues(options.tickValues);
            } else if (options.ticks != null) {
                axis.ticks(options.ticks);
                if (options.ticks === 0) {
                    axis.tickValues([]);
                }
            } else {
                axis.tickValues(options.categories);
            }

            return axis;
        },

        /* jshint eqnull:true */
        postProcessAxis: function (axisGroup) {
            var options = this.options.xAxis;
            if (!options.labels || options.labels.rotation == null) return;

            var deg = options.labels.rotation;
            var rad = _.nw.degToRad(deg);
            var sign = deg > 0 ? 1 : deg < 0 ? -1 : 0;
            var lineCenter = 0.71; // center of text line is at .31em
            var cos = Math.cos(rad);
            var sin = Math.sin(rad);
            var positive = options.labels.rotation > 0;
            var anchor = options.labels.rotation < 0 ? 'end' : options.labels.rotation > 0 ? 'start' : 'middle';
            var labels = axisGroup.selectAll('.tick text')
                .style({'text-anchor': anchor})
                .attr('transform', function (d, i, j) {
                    var x = d3.select(this).attr('x') || 0;
                    var y = d3.select(this).attr('y') || 0;
                    return 'rotate(' + options.labels.rotation + ' ' + x + ',' + y + ')';
                })
                .attr('dy', function (d, i, j) {
                    return (cos * lineCenter).toFixed(4) + 'em';
                })
                .attr('dx', function (d, i, j) {
                    return -(sin * lineCenter - 0.31 * sign).toFixed(4) + 'em';
                });
        },

        update: function (domain, data) {
            this.data = data;
            this.setDomain(domain);
        },

        setDomain: function (domain) {
            this._domain = domain;
            this._scale.domain(domain);
        },

        rangeBand: function () {
            var band = this._scale.rangeBand();
            if (!band) _.nw.warn('rangeBand is 0, you may have too many points in in the domain for the size of the chart (ie. chartWidth = ' + this.options.chart.plotWidth + 'px and ' + (this._domain.length) + ' X-axis points (plus paddings) means less than 1 pixel per band and there\'re no half pixels');

            return this._scale.rangeBand();
        },

        _range: function () {
            var range = this.options.chart.rotatedFrame ? [this.options.chart.plotHeight, 0] : [0, this.options.chart.plotWidth];
            return this.isCategorized ?
                this._scale.rangeRoundBands(range, this.options.xAxis.innerRangePadding, this.options.xAxis.outerRangePadding) :
                this._scale.rangePoints(range);
        }
    };

    _.nw = _.extend({}, _.nw, { OrdinalScale: OrdinalScale });

})();

(function () {

    var SmartYAxis = function (data, options, yMin, yMax) {
        this.data = data;
        this.options = options;
        this.yMax = yMax;
        this.yMin = yMin;
    };

    function _extractYTickValues(domain, min, max, yMin, yMax) {
        var adjustedDomain = _.nw.merge(domain, yMax);
        // we want to be able to remove parameters with default values
        // so to remove the default yAxis.min: 0, you pass yAxis.min: null
        // and for that we need to to a truely comparison here (to get null or undefined)
        if (min == null && max == null)
            return adjustedDomain;

        if (min == null) {
            return max > yMin ? _.nw.merge([max], adjustedDomain) : [max];
        }

        if (max == null) {
            if (min >= yMax) return [min];
            adjustedDomain[0] = min;

            return adjustedDomain;
        }

        return _.nw.merge([min, max], yMax);
    }

    SmartYAxis.prototype = _.extend({}, _.nw.YAxis.prototype, {
        axis: function () {
            var options = this.options.yAxis;
            var domain = this._scale.domain();
            var tickValues = _extractYTickValues(domain, options.min, options.max, this.yMin, this.yMax);
            var numTicks = this.numTicks();
            var axis = _.nw.YAxis.prototype.axis.call(this);
            return axis.ticks(numTicks)
                .tickValues(tickValues);
        },

        numTicks: function () {
            return 3;
        },

        setDomain: function (domain) {
            var extent = d3.extent(domain);
            this.yMin = extent[0];
            this.yMax = extent[1];
            this._scale.domain(domain);

            this._niceTheScale();
        },

        _niceTheScale: function () {
            var domain = this._scale.domain();
            var nice = [this.options.yAxis.min || domain[0], this.options.yAxis.max || _.nw.niceRound(domain[1])];
            this._scale.domain(nice);
        }
    });

    _.extend(_.nw, { SmartYAxis: SmartYAxis });

})();

(function () {

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
        return diff / (24*60*60*1000);
    }


    function TimeScale(data, options) {
        this.options = options;
        this.data = data;

        this.init();
    }

    TimeScale.prototype = {
        init: function () {
            delete this._scale;
        },

        scale: function (domain) {

            if(!this._scale) {
                this._scale = new d3.time.scale();
                this.setDomain(domain);
                this.range();
            }


            return this._scale;
        },


        /* jshint eqnull:true */
        axis: function () {
            var options = this.options.xAxis;
            var tickFormat = this.getOptimalTickFormat();

            var axis = d3.svg.axis()
                .scale(this._scale)
                .tickFormat(tickFormat)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickValues(this._domain);

            if (this.options.xAxis.maxTicks != null && this.options.xAxis.maxTicks < this._domain.length) {
                // override the tickValues with custom array based on number of ticks
                // we don't use D3 ticks() because you cannot force it to show a specific number of ticks
                axis.tickValues(_.nw.maxTickValues(options.maxTicks, this._domain));

            } else if (this.options.xAxis.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            }

            return axis;
        },

        update: function (domain, data) {
            this.data = data;
            this.setDomain(domain);
        },

        setDomain: function (domain) {
            this._domain = domain;
            var axisDomain = this._getAxisDomain(this._domain);
            this._scale.domain(axisDomain);
        },

        postProcessAxis: function (axisGroup) {
            if (!this.options.xAxis.firstAndLast) return;
            var labels = axisGroup.selectAll('.tick text')[0];
            d3.select(labels[0]).style({'text-anchor': 'start'});
            d3.select(labels[labels.length - 1]).style({'text-anchor': 'end'});
        },

        rangeBand: function () {
            return 4;
        },

        getOptimalTickFormat: function () {
            if (this.options.xAxis.labels.formatter) return this.options.xAxis.labels.formatter;
            if (this.options.xAxis.labels.format) return d3.time.format(this.options.xAxis.labels.format);

            var spanDays = Math.abs(dateDiff(this._domain[this._domain.length-1], this._domain[0]));
            var daysThreshold = this.options.xAxis.maxTicks || 1;
            if (spanDays < daysThreshold) return d3.time.format('%H:%M');
            if (spanDays < 365) return d3.time.format('%d %b');

            return d3.time.format('%Y');
        },

        range: function () {
            var range = this._getAxisRange(this._domain);
            return this._scale.rangeRound(range, 0.1);
        },


        _getAxisDomain: function (domain) {
            if(this.options.xAxis.linearDomain) {
                return domain;
            }

            return d3.extent(domain);
        },

        _getAxisRange: function (domain) {
            var size = this.options.chart.rotatedFrame ? this.options.chart.plotHeight : this.options.chart.plotWidth;

            if(this.options.xAxis.linearDomain) {
                return _.range(0, size, size / (domain.length - 1)).concat([size]);
            }

            return [0, size];
        }
    };

    _.nw = _.extend({}, _.nw, { TimeScale: TimeScale });

})();

(function () {

    var defaults = {
        chart: {
            rotatedFrame: true,
        },

        xAxis: {
            orient: 'left'
        },

        yAxis: {
            orient: 'bottom'
        }
    };

    var frame = {

        init: function () {
            _.merge(this.options, defaults);
        },

        adjustPadding: function () {
            var categoryLabels = this.options.xAxis.categories || _.pluck(this.dataSrc, 'x');
            var text = categoryLabels.join('<br>');
            var xLabel = _.nw.textBounds(text, '.x.axis');
            var yLabel = _.nw.textBounds('ABC', '.y.axis');
            var maxTickSize = function (options) { return Math.max(options.outerTickSize, options.innerTickSize); };

            this.options.chart.internalPadding.left = this.options.chart.padding.left || maxTickSize(this.options.xAxis) + this.options.xAxis.tickPadding + xLabel.width;
            this.options.chart.internalPadding.bottom = this.options.chart.padding.bottom || maxTickSize(this.options.yAxis) + this.options.yAxis.tickPadding + yLabel.height;
        },

        adjustTitlePadding: function () {
            var titleBounds;
            if (this.options.xAxis.title || this.options.yAxis.title) {
                if(this.options.xAxis.title) {
                    titleBounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                    this.options.chart.internalPadding.left += titleBounds.height + this.options.xAxis.titlePadding;
                }

                if(this.options.yAxis.title) {
                    titleBounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                    this.options.chart.internalPadding.bottom += titleBounds.height + this.options.yAxis.titlePadding;
                }
            }
        },

        renderYAxis: function () {
            var yAxis = this.yAxis();
            var x = this.options.chart.internalPadding.left;
            var y = this.options.chart.padding.top + this.options.chart.plotHeight;

            this._yAxisGroup = this.svg.selectAll('.y.axis')
                .data([1]);

            this._yAxisGroup.enter().append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + x+ ',' + y + ')');

            this._yAxisGroup.exit().remove();

            this._yAxisGroup
                    .transition().duration(this._animationDuration())
                    .attr('transform', 'translate(' + x+ ',' + y + ')')
                    .call(yAxis);

            return this;
        },

        renderXAxis: function () {
            var x = this.options.chart.internalPadding.left;
            var y = this.options.chart.padding.top;
            var xAxis = this.xAxis();

            this._xAxisGroup = this.svg.selectAll('.x.axis')
                .data([1]);

            this._xAxisGroup.enter().append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + x + ',' + y + ')');

            this._xAxisGroup.exit().remove();

           this._xAxisGroup
                .transition().duration(this._animationDuration())
                .attr('transform', 'translate(' + x + ',' + y + ')')
                .call(xAxis);

            this.xScaleGenerator.postProcessAxis(this._xAxisGroup);

            return this;
        },

        renderAxisLabels: function () {
            var lineHeightAdjustment = this.titleOneEm * 0.25; // add 25% of font-size for a complete line-height
            var adjustFactor = 40/46.609;

            var bounds, anchor, rotation, tickSize, x, y;

            if (this.options.xAxis.title) {
                bounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                x = this.options.chart.rotatedFrame ? -bounds.height : this.options.chart.plotWidth;
                y = this.options.chart.rotatedFrame ? -this.options.chart.internalPadding.left : this.options.chart.internalPadding.bottom - lineHeightAdjustment;

                rotation = this.options.chart.rotatedFrame ? '-90' : '0';
                this._xAxisGroup.append('text')
                    .attr('class', 'x axis-title')
                    .attr('x', 0)
                    .attr('y', y)
                    .attr('transform', ['rotate(', rotation, ')'].join(''))
                    .attr('dy', bounds.height * adjustFactor)
                    .attr('dx', -(this.options.chart.plotHeight + bounds.width) / 2)
                    .text(this.options.xAxis.title);
            }

            if (this.options.yAxis.title) {
                bounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                tickSize = Math.max(this.options.yAxis.innerTickSize, this.options.yAxis.outerTickSize);
                anchor = this.options.chart.rotatedFrame ? 'end' : 'middle';
                x = this.options.chart.rotatedFrame ? this.options.chart.plotWidth : 0;
                y = this.options.chart.rotatedFrame ?
                    this.options.chart.internalPadding.bottom:
                    -this.options.chart.internalPadding.left + this.titleOneEm - lineHeightAdjustment;

                rotation = this.options.chart.rotatedFrame ? '0' : '-90';

                this._yAxisGroup.append('text')
                    .attr('class', 'y axis-title')
                    .attr('y', y)
                    .attr('x', x)
                    .attr('dx', -(this.options.chart.plotWidth + bounds.width) / 2)
                    .attr('dy', -4) // just because
                    .attr('transform', ['rotate(', rotation, ')'].join(''))
                    .text(this.options.yAxis.title);
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

    Contour.expose('horizontal', frame);

})();

(function () {

    var _extent = function (series, field) {
        var maxs = [], mins = [];
        _.each(series, function (d) {
            if(!d.data.length) return;
            var values = _.pluck(d.data, field);
            maxs.push(d3.max(values));
            mins.push(d3.min(values));
        });

        //
        if(!mins.length || !maxs.length) return [];

        return [_.min(mins), _.max(maxs)];
    };


    var _stackedExtent = function (data) {
        var dataSets = _.pluck(data, 'data');
        var maxLength = _.max(_.map(dataSets, function (d) { return d.length; }));
        var stackY = [];

        for (var j=0; j<maxLength; j++) {
            _.each(dataSets, function (set) {
                stackY[j] = set[j] ? (stackY[j] || 0) + set[j].y : (stackY[j] || 0);
            });
        }

        return [_.min(stackY), _.max(stackY)];
    };

    var _xExtent = _.partialRight(_extent, 'x');
    var _yExtent = _.partialRight(_extent, 'y');

    function VisInstanceContainer(data, options, type, renderer, context) {
        this.type = type;
        this.renderer = renderer;
        this.ctx = context;

        this.init(data, options);
    }

    VisInstanceContainer.prototype = {

        init: function (data, options) {
            // set the options first and then the data
            this.setOptions(options);
            this.setData(data);
        },

        render: function (layer, options) {
            this.renderer.call(this.ctx, this.data, layer, options);

            return this.ctx;
        },

        setData: function (data) {
            this.data = _.nw.normalizeSeries(data);
            this._updateDomain();

            return this.ctx;
        },

        setOptions: function (options) {
            var opt = {};
            opt[this.type] = options || {};
            this.options = {};
            this.options = _.merge({}, this.renderer.defaults || {}, opt);

            return this.ctx;
        },

        _updateDomain: function () {
            if(!this.options[this.type]) throw new Error('Set the options before calling setData or _updateDomain');

            if (_.nw.isSupportedDataFormat(this.data)) {
                this.xDomain = _.flatten(_.map(this.data, function (set) { return _.pluck(set.data, 'x'); }));
                this.xExtent = _xExtent(this.data, 'x');
                this.yExtent = this.options[this.type].stacked ? _stackedExtent(this.data) : _yExtent(this.data);
            }
        }

    };

    Contour.VisualizationContainer = VisInstanceContainer;

})();

(function () {

    var defaults = {
        xAxis: {
            type: 'linear'
        },
        area: {
            stacked: true,
        }
    };

    /* jshint eqnull:true */
    function renderer(data, layer, options) {
        this.checkDependencies('cartesian');
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var x = _.bind(function (val) { return this.xScale(val) + this.rangeBand / 2 + 0.5; }, this);
        var y = _.bind(function (val) { return this.yScale(val) + 0.5; }, this);
        var h = options.chart.plotHeight;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });

        var startArea = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return h; })
            .y1(function(d) { return h; });

        var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return options.area.stacked ? y(d.y0 || options.yAxis.min || 0) : y(0); })
            .y1(function(d) { return y((options.area.stacked ? d.y0 : 0) + d.y); });

        renderSeries();


        function renderSeries() {
            var series = layer.selectAll('g.series')
                    .data(stack(data));

            series.enter()
                .append('svg:g')
                .attr('class', classFn)
                .append('path').datum(function (d) { return d.data; })
                    .attr('class', 'area')
                    .attr('d', startArea);

            series.exit().remove();

            if (options.chart.animations && options.chart.animations.enable) {
                series.select('.area')
                    .datum(function (d) { return d.data; })
                    .transition().duration(options.chart.animations.duration || duration)
                    .attr('d', area);
            } else {
                series.select('.area')
                    .datum(function (d) { return d.data; })
                    .attr('d', area);
            }

            if (options.tooltip.enable) {
                renderTooltipTrackers.call(this, series);
            }
        }

        function renderTooltipTrackers(series){
            var trackerSize = 10;
            // add the tooltip trackers regardless
            series.append('g').attr('class', 'tooltip-trackers')
                .selectAll('tooltip-tracker')
                    .data(function (d) { return d.data; })
                .enter().append('circle')
                    .attr('class', 'tooltip-tracker')
                    .attr('opacity', 0)
                    .attr('r', trackerSize)
                    .attr('cx', function(d) { return x(d.x); })
                    .attr('cy', function(d) { return y((options.area.stacked ? d.y0 : 0) + d.y); });
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
    Contour.export('area', renderer);

})();

(function () {

    var defaults = {
        bar: {
            stacked: false,
            groupPadding: 2      // two px between same group bars
        }
    };

    function barRender(data, layer, options) {
        this.checkDependencies(['cartesian', 'horizontal']);
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var _this = this;
        var x = function (d) { return _this.xScale(d) - 0.5; };
        var y = function (d) { return _this.yScale(d) + 0.5; };
        var rangeBand = this.rangeBand;
        var stack = d3.layout.stack().values(function (d) { return d.data; });
        var update = options.bar.stacked ? stacked : grouped;
        var enter = _.partialRight(update, true);
        var classFn = function (d, i) { return 'series s-' + (i+1); };

        var series = layer.selectAll('g.series')
            .data(stack(data));

        series.enter().append('svg:g')
            .attr('class', classFn);

        series.exit().remove();

        var bars = series.selectAll('.bar')
            .data(function (d) { return d.data; });

        var cssClass = 'bar' + (options.tooltip.enable ? ' tooltip-tracker' : '');
        bars.enter().append('rect')
            .attr('class', cssClass)
            .call(enter);

        if(options.chart.animations && options.chart.animations.enable) {
            bars.transition().duration(duration).call(update);
            bars.exit()
                .transition().duration(duration)
                .attr('width', y(0))
                .remove();
        } else {
            bars.call(update);
            bars.exit().remove();
        }

        function stacked(bar, enter) {
            bar
                .attr('y', function (d) { return x(d.x); })
                .attr('height', rangeBand);

            if (enter) {
                return bar
                    .attr('x', function (d) { return y(0); })
                    .attr('width', function (d) { return 0; });

            } else {
                return bar
                    .attr('x', function (d) { return d.y >= 0 ? y(d.y0 || 0) : y(d.y + d.y0); })
                    .attr('width', function (d) { return d.y >=0 ? y(d.y) - y(0) : y(0) - y(d.y); });
            }
        }

        function grouped(bar, enter) {
            var numSeries = data.length;
            var height = function () { return rangeBand / numSeries - options.bar.groupPadding + 0.5; };
            var offset = function (d, i) { return rangeBand / numSeries * i + 0.5; };

            bar.attr('y', function (d, i, j) { return x(d.x) + offset(d, j); })
                .attr('x', y(0))
                .attr('height', height);

            if (enter) {
                return bar
                    .attr('width', function (d) { return 0.5; });
            } else {
                return bar
                    .attr('width', function (d) { return d.y >= 0 ? y(d.y) - y(0) : y(0) - y(d.y); })
                    .attr('x', function (d) { return d.y < 0 ? y(d.y) : y(0); });
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
    *           .cartesian()
    *           .horizontal()
    *           .bar([1,2,3,4])
    *           .render();
    *
    * @name bar(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Configuration options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Contour.export('bar', barRender);

})();

(function () {

    var defaults = {
        column : {
            stacked: false,
            groupPadding: 1,
            columnWidth: function() { return this.rangeBand; },
            offset: function() { return 0; }
        }
    };

    function render(data, layer, options) {
        this.checkDependencies('cartesian');
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var opt = options.column;
        var w = options.chart.plotWidth;
        var h = options.chart.plotHeight;
        var _this = this;
        var x = function (v) { return Math.round(_this.xScale(v)) + 0.5; };
        var y = function (v) { return Math.round(_this.yScale(v)) - 0.5; };
        var dataKey = function (d) { return d.data; };
        var chartOffset = _.nw.getValue(opt.offset, 0, this);
        var rangeBand = _.nw.getValue(opt.columnWidth, this.rangeBand, this);
        var enter = _.partialRight((options.column.stacked ? stacked : grouped), true);
        var update = options.column.stacked ? stacked : grouped;
        var filteredData = _.map(data, function (series, j) {
            return {
                name: series.name,
                data: _.filter(series.data, function (d, i) {
                    return i === 0 ? true : x(d.x) !== x(series.data[i-1].x);
                })
            };
        });

        var stack = d3.layout.stack().values(function (d) {
            return d.data;
        });

        var series = layer.selectAll('g.series')
                .data(stack(filteredData));

        series.enter()
            .append('g')
            .attr('class', function (d, i) { return 'series s-' + (i+1); });

        series.exit()
            .remove();

        var cols = series.selectAll('.column')
                .data(dataKey);

        var offset = function (d, i) { return rangeBand / data.length * i; };
        var width = rangeBand / data.length - opt.groupPadding - 0.5;
        var cssClass = 'column' + (options.tooltip.enable ? ' tooltip-tracker' : '');

        cols.enter()
            .append('rect')
            .attr('class', cssClass)
            .call(enter);

        if (options.chart.animations && options.chart.animations.enable) {
            cols.exit()
                .transition().duration(duration)
                .attr('y', h)
                .attr('height', function () { return 0.5; })
                .remove();
            cols.transition().duration(duration)
                .call(update);
        } else {
            cols.exit().remove();
            cols.call(update);
        }

        function stacked(col, enter) {
            var base = y(0);

            col.attr('x', function (d) { return x(d.x) + chartOffset; })
                .attr('width', function () { return rangeBand; });

            if (enter) {
                col.attr('y', function (d) { return d.y >= 0 ? base : base; })
                    .attr('height', function (d) { return 0.5; });
            } else {
                col.attr('y', function (d) { return d.y >= 0 ? y(d.y) + y(d.y0) - base : y(d.y0) ; })
                    .attr('height', function (d) { return d.y >=0 ? base - y(d.y) : y(d.y) - base; });
            }
        }

        function grouped(col, enter) {
            var width = rangeBand / data.length - opt.groupPadding + 0.5;
            var offset = function (d, i) { return rangeBand / data.length * i + 0.5; };
            var base = y(0);

            col.attr('x', function (d, i, j) { return x(d.x) + offset(d, j) + chartOffset; })
                .attr('width', width);

            if (enter) {
                col.attr('y', base)
                    .attr('height', 0);
            } else {
                col.attr('y', function (d) { return d.y >= 0 ? y(d.y) : base; })
                    .attr('height', function (d) { return d.y >= 0 ? base - y(d.y) : y(d.y) - base; });
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
    Contour.export('column', render);

})();

(function () {

    Contour.export('coolNarwhal', function (data, layer) {
        layer.append('path')
            .attr('class', 'cool')
            .attr('opacity', 0)
            .attr('transform', 'scale(.5) translate(500 150)')
            .attr('d', 'M-220.02,76.509l-0.78,8.927c-0.956,10.949,1.389,20.422,6.188,30.383c10.203,21.173,63.095,84.05,93.72,115.075c20.145,20.406,19.487,23.018,21.549,40.122c2.487,20.621,24.897,66.462,40.838,71.269 c15.086,4.549,12.91-12.398,13.319-37.83c5.746,2.457,10.917,5.638,20.206,12.697c61.697,46.892,139.734,69.97,206.5,71.733c46.209,1.221,81.432-7.081,142.957-33.694c40.484-17.512,54.271-22.098,65.639-21.504c4.432,0.232,22.678,11.204,41.746,21.563c35.398,19.229,69.457,34.595,75.896,34.239c12.609-1.457-0.701-11.783-8.072-24.217c-7.049-11.892-15.414-29.572-18.844-42.134s-4.723-22.272-8.91-27.091c-2.143-2.463-12.812-6.786-21.189-8.146c-18.045-2.933-22.191-2.922-13.531-8.957c13.076-9.115,17.377-11.039,1.826-29.068c-6.383-7.402-11.336-20.003-13.709-39.542c-1.607-13.237,1.057-23.679-3.869-27.451s-17.271,12.341-20.846,19.334c-2.01,3.937-7.102,19.005-11.312,33.485c-13.795,47.427-29.865,65.742-62.693,71.447c-34.361,5.971-71.623-9.506-116.543-48.404c-13.164-11.399-29.533-25.26-39.254-36.913c-13.428-16.101-15.48-18.138-19.785-20.66c-16.166-9.472-54.98-31.694-103.525-63.815c-24.393-16.141-57.72-36.928-71.453-43.693c-27.236-13.417-68.416-28.952-90.731-46.771c-24.665-19.697-38.108-19.793-67.804-5.479c-21.429,10.328-23.941,15.298-26.52,15.726c-8.216-10.129-22.917-11.198-31.647-20.682c-9.529-10.35-28.027-14.098-37.824-24.957c-10.668-11.826-31.25-16.752-40.886-26.94c-11.339-11.989-29.387-16.096-40.838-26.637c-11.617-10.694-27.159-14.843-37.68-24.045c-10.383-9.082-23.187-12.538-31.408-19.163c-8.193-6.601-16.593-9.444-22.026-11.993c-5.433-2.549-7.398-2.522-7.658-1.927c-0.26,0.594,1.355,2.955,6.054,6.447c4.699,3.491,22.193,18.451,31.645,22.77c10.921,5.104,17.502,15.01,29.671,21.375c13.224,6.918,22.212,18.731,36.229,25.924c15.53,7.971,24.754,21.184,39.657,28.253c16.462,7.808,25.503,21.598,39.958,28.36c14.499,6.78,20.647,20.252,34.429,23.428C-238.033,58.207-227.932,70.443-220.02,76.509L-220.02,76.509z')
            .transition()
                .delay(300)
                .duration(2000)
                .attr('opacity', 1);
    });

})();

(function () {

    var defaults = {
        legend: {
            vAlign: 'middle',
            hAlign: 'right',
            direction: 'vertical',
            formatter: function (d) {
                return d.name;
            }
        }
    };

    function validAlignmentClasses(options) {
        var classes = [];
        if (['top', 'middle', 'bottom'].indexOf(options.legend.vAlign) != -1) {
            classes.push(options.legend.vAlign);
        } else {
            classes.push('top');
        }

        if (['left', 'center', 'right'].indexOf(options.legend.hAlign) != -1) {
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
        var legend = this.container.selectAll('.contour-legend').data([null]);
        var em = _.nw.textBounds('series', '.contour-legend.contour-legend-entry');
        var count = data.length;
        var legendHeight = (em.height + 4) * count + 12; // legend has 1px border and 5px margin (12px) and each entry has ~2px margin
        var mid = (options.chart.plotHeight - legendHeight) / 2;
        var positioner = function (selection) {
            // adjust position of legend only when is horizontally centered
            // since we need to have all elements in the legend to calculate its width
            if (options.legend.hAlign !== 'center' || !selection.length) {
                return ;
            }

            // adjust the left
            var legendWidth = selection[0].parentNode.clientWidth;
            var left = (options.chart.plotWidth - legendWidth) / 2 + options.chart.internalPadding.left;

            d3.select(selection[0].parentNode)
                .style('left', left + 'px');
        };

        var container = legend.enter()
            .append('div')
            .attr('class', function () {
                return ['contour-legend'].concat(validAlignmentClasses(options)).join(' ');
            })
            .attr('style', function () {
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
                    var bounds = _.nw.textBounds(this, '.contour-legend');

                    styles.push('left: ' + ((options.chart.plotWidth - bounds.width) / 2 + options.chart.internalPadding.left) + 'px' );
                } else {
                    styles.push('right: 10px');
                }

                return styles.join(';');
            });

        var entries = container.selectAll('.contour-legend-entry')
            .data(data, function (d) { return d.name; });

        var enter = entries.enter()
            .append('div')
            .attr('class', function () {
                return 'contour-legend-entry';
            });

        entries.append('span')
            .attr('class', function (d, i) { return 'contour-legend-key series s-' + (i+1) + ' ' + _.nw.seriesNameToClass(d.name); });

        entries.append('span')
            .attr('class', 'series-name')
            .text(options.legend.formatter)
            .call(positioner);

        entries.exit()
            .remove();
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
    *
    */

    Contour.export('legend', Legend);

})();

(function () {

    var defaults = {
        line: {
            smooth: false,
            animationDirection: 'left-to-right',
            // animationDirection: 'bottom-to-top',
            marker: {
                enable: true,
                size: 3
            }
        }
    };

    var duration;
    var animationDirection;
    var animationsMap = {
        'left-to-right': {
            enter: function (line) {
                var path = this;
                path.each(function () {
                    var totalLength = this.getTotalLength();
                    d3.select(this)
                        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                        .attr('stroke-dashoffset', totalLength)
                        .transition().duration(duration).ease('linear')
                            .attr('stroke-dashoffset', 0);
                });
            },

            update: function (line) {
                this.attr('d', function (d) { return line(d.data); });
                this.each(function () {
                    var totalLength = this.getTotalLength();
                    d3.select(this)
                        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                        .attr('stroke-dashoffset', totalLength)
                        .transition().duration(duration).ease('linear')
                            .attr('stroke-dashoffset', 0);
                });
            }
        },

        'bottom-to-top': {
            enter: function (line) {
                this.transition().duration(duration)
                    .attr('d', function (d) { return line(d.data); });
            },

            update: function (line) {
                this.transition().duration(duration)
                    .attr('d', function (d) { return line(d.data); });
            }
        }
    };

    /* jshint eqnull: true */
    function render(rawData, layer, options, id) {
        this.checkDependencies('cartesian');

        var x = _.bind(function (d) { return this.xScale(d.x) + this.rangeBand / 2 + 0.5; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y) + 0.5; }, this);
        var h = options.chart.plotHeight;
        var shouldAnimate = options.chart.animations && options.chart.animations.enable;
        animationDirection = options.line.animationDirection || 'left-to-right';
        duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        // jshint eqnull:true
        var data = _.map(rawData, function (s) {
            return _.extend(s, {
                data: _.filter(s.data, function (d, i) {
                    if (i === 0 && d.y != null) return true;
                    var differentX = x(s.data[i-1]) !== x(d); // && y(s.data[i-1]) !== y(d);
                    return d.y != null && differentX;
                })
            });
        });

        renderPaths();

        if (options.line.marker.enable)
            renderMarkers();

        if (options.tooltip && options.tooltip.enable)
            renderTooltipTrackers();

        function seriesClassName(extras) { return function (d, i) { return (extras||'') + ' s-' +(i+1) + ' ' + _.nw.seriesNameToClass(d.name); }; }

        function renderPaths() {
            var startLine = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function () { return y({x: 0, y: options.yAxis.min || 0}); });

            var line = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function (d) { return y(d); });

            if(options.line.smooth) line.interpolate('cardinal');

            var animFn = animationsMap[animationDirection];
            var series = layer.selectAll('g.series')
                    .data(data, function (d) { return d.name; });

            // enter
            var el = series.enter().append('svg:g')
                .attr('class',seriesClassName('series'))
                .append('path')
                    .attr('class', 'line');

            if (shouldAnimate) {
                var startLineFn = animationDirection === 'left-to-right' ? line : startLine;
                var path = el.attr('d', function(d) { return startLineFn(d.data); })
                    .call(_.partial(animFn.enter, line));
            } else {
                el.attr('d', function (d) { return line(d.data); });
            }

            // update
            el = series
                .attr('class', seriesClassName('series'))
                .select('.line');

            if (shouldAnimate) {
                el.call(_.partial(animFn.update, line));
            } else  {
                el.attr('d', function (d) { return line(d.data); });
            }

            // remove
            if (shouldAnimate) {
                series.exit()
                    .remove();
            } else  {
                series.exit().remove();
            }
        }

        function renderMarkers() {
            var markers = layer.selectAll('.line-chart-markers')
                .data(data, function (d) { return d.name; });

            markers.enter().append('g')
                .attr('class', seriesClassName('line-chart-markers markers'));

            markers.exit().remove();

            var dots = markers.selectAll('.dot')
                .data(function (d) { return d.data; }, function (d) { return d.x; });

            dots.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', options.line.marker.size)
                .attr('opacity', 0);
                // .attr('cx', x)
                // .attr('cy', y);

            dots.exit().remove();

            if (shouldAnimate) {
                dots.transition().delay(duration)
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('opacity', 1);
            } else {
                dots.attr('cx', x)
                    .attr('cy', y)
                    .attr('opacity', 1);
            }
        }

        function renderTooltipTrackers() {
            var trackerSize = 10;
            var markers = layer.selectAll('.tooltip-trackers')
                .data(data, function (d) { return d.name; });

            markers.enter().append('g')
                .attr('class', function (d, i) { return 'tooltip-trackers s-' + (i+1); });

            markers.exit().remove();

            var dots = markers.selectAll('.tooltip-tracker')
                .data(function (d) { return d.data; }, function (d) { return d.x; });

            dots.enter().append('circle')
                .attr({
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
    Contour.export('line', render);

})();

Contour.export('nullVis', _.noop);

(function () {

    var defaults = {
        pie: {
            piePadding: 1,
            // inner and outer radius can be numbers (pixels) or functions
            // inner radius as function will recive the outerRadius as parameter
            innerRadius: null,
            // outer radius as function will recieve the proposed maximum radius for a pie
            outerRadius: null
        }
    };

    function renderer(data, layer, options) {
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var shouldAnimate = options.chart.animations && options.chart.animations.enable;
        var w = options.chart.plotWidth, h = options.chart.plotHeight;
        var padding = _.nw.clamp(_.nw.getValue(options.pie.piePadding, 0, this), 0, h/2 - 2);
        var numSeries = data.length;
        var proposedRadius = (Math.min(w / numSeries, h) / 2) - padding;
        var radius = _.nw.getValue(options.pie.outerRadius, proposedRadius, this, proposedRadius) ;
        var innerRadius = _.nw.getValue(options.pie.innerRadius, 0, this, radius);
        var classFn = function (d, i) { return 'series arc' + (options.tooltip.enable ? ' tooltip-tracker' : '') + ' s-' + (i+1) + ' ' + d.name; };
        // shape the data into angles and don't sort (ie preserve order of input array)
        var pieData = d3.layout.pie().value(function (d) { return d.y; }).sort(null);
        var translatePie = function (d,i) {
            var offsetX = radius * 2 + padding;
            return "translate(" + (radius + padding + (offsetX * i)) + "," + (radius + padding) + ")";
        };

        var pieGroup = layer.selectAll('g.pie-group')
            .data(data);

        pieGroup.enter().append('svg:g')
            .attr('class', 'pie-group')
            .attr("transform", translatePie)
            .call(renderSeries);

        pieGroup.exit().remove();

        if (shouldAnimate) {
            pieGroup
                .call(renderSeries)
                .transition().duration(duration/2)
                .attr("transform", translatePie);
        } else {
            pieGroup.call(renderSeries)
                .attr("transform", translatePie);
        }

        function renderSeries(group) {
            var arc = d3.svg.arc()
                .outerRadius(radius).innerRadius(innerRadius);

            var startArc = d3.svg.arc()
                .outerRadius(radius).innerRadius(innerRadius)
                .startAngle(0).endAngle(0);

            var pie = group.selectAll('path')
                .data(function (d) { return pieData(d.data); }, function (d) { return d.data.x; });

            pie.enter()
                .append('path')
                .attr('class', classFn)
                .attr('d', function (d) { return startArc(d); })
                .each(function (d) { this._current = { startAngle: d.startAngle, endAngle: d.startAngle }; });

            if (shouldAnimate) {
                pie.exit()
                    .remove();

                pie.transition().duration(duration)
                    .ease('cubic-in')
                    .attrTween('d', arcTween);
            } else {
                pie.exit().remove();
                pie.attr('d', arc);
            }

            // Store the displayed angles in _current.
            // Then, interpolate from _current to the new angles.
            // During the transition, _current is updated in-place by d3.interpolate.
            // from http://bl.ocks.org/mbostock/1346410
            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
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
    Contour.export('pie', renderer);

})();

(function () {

    var defaults = {
        xAxis: {
            type: 'linear'
        },
        scatter: {
            radius: 4
        }
    };

    function ScatterPlot(data, layer, options) {
        this.checkDependencies('cartesian');
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var shouldAnimate = options.chart.animations && options.chart.animations.enable;
        var opt = options.scatter;
        var halfRangeBand = this.rangeBand / 2;
        var duration = 400;
        var x = _.bind(function (d) { return this.xScale(d.x) + halfRangeBand; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);
        var h = options.chart.plotHeight;
        var classFn = function (d, i) { return d.name + ' series s-' + (i+1); };

        var series = layer.selectAll('.series')
            .data(data);

        series.attr('class', classFn);

        series.enter().append('svg:g')
            .attr('class', classFn);

        series.exit().remove();

        var dots = series.selectAll('.dot')
            .data(function (d) { return d.data; }, function (d) {
                return options.scatter.dataKey ? d[options.scatter.dataKey] : d.x;
            });

        dots.enter().append('circle')
                .attr('class', 'dot tooltip-tracker')
                .attr('r', opt.radius)
                .attr('cx', x)
                .attr('cy', h);

        if (shouldAnimate) {
            dots.transition().duration(duration)
                .attr('r', opt.radius)
                .attr('cx', x)
                .attr('cy', y);
        } else {
            dots.attr('r', opt.radius)
                .attr('cx', x)
                .attr('cy', y);
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
    Contour.export('scatter', ScatterPlot);


})();

(function () {
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
    Contour.export('stackTooltip', function (data, layer, options) {

        var valueFormatter = this.yAxis().tickFormat();
        var tooltip = d3.select(options.stackTooltip.el);

        tooltip.classed('stack-tooltip', true);

        // jshint eqnull:true
        var onMouseOver = function (d) {
            var isNull = function (p) {
                return !(p && p.y != null);
            };
            var mapFn = function (p, i) {
                var index = _.isNumber(d.x) ? d.x : options.xAxis.categories.indexOf(d.x);
                return !isNull(p.data[index]) ?
                    { seriesName: p.name, value: p.data[index].y, cssClass: 's-' + (i+1) } :
                    null;
            };
            var filtered = _.filter(_.map(data, mapFn), function (x) { return x; });
            var text = _.map(filtered, function (t) { return '<span class="' + t.cssClass + '"">' + t.seriesName + ': ' + valueFormatter(t.value) + '</span>'; }).join(' / ');
            tooltip.html(text).style({display: 'block'});
        };

        var onMouseOut = function (// datum 
                                    ) {
            tooltip.html('');
        };

        this.svg.selectAll('.tooltip-tracker')
            .on('mouseover.tooltip', onMouseOver.bind(this))
            .on('mouseout.tooltip',  onMouseOut.bind(this));
    });
})();

(function () {
    var defaults = {
        tooltip: {
            enable: true,
            animate: true,
            opacity: 0.85,
            showTime: 300,
            hideTime: 500,
            distance: 5
        }
    };

    function render(data, layer, options) {

        var clearHideTimer = function () {
            clearTimeout(this.tooltip.hideTimer);
        };

        var changeOpacity = function (opacity, delay) {
            if(this.options.tooltip.animate) {
                this.tooltipElement
                    .transition().duration(delay)
                        .style('opacity', opacity);
            } else {
                this.tooltipElement.style('opacity', opacity);
            }
        };

        // return the centroid x, y coordinates relative to the svg container
        var getCentroid = function (element) {
            var bbox = element.getBoundingClientRect();
            var clientRect = element.getBoundingClientRect();

            return [bbox.left + bbox.width/2, bbox.top + bbox.height/2];
        };

        function getPosition(options) {

        }


        var positionTooltip = function (d) {
            var pointOrCentroid = function () {
                return d3.event.target.tagName === 'path' ? getCentroid(d3.event.target) : d3.mouse(this.container.node());
            };
            var xScale = this.xScale;
            var yScale = this.yScale;
            var plotLeft = this.options.chart.plotLeft;
            var plotWidth = this.options.chart.plotWidth;
            var plotTop = this.options.chart.plotTop;
            var plotHeight = this.options.chart.plotHeight;
            var distance = this.options.tooltip.distance;
            var width = parseFloat(this.tooltipElement.style('width'));
            var height = parseFloat(this.tooltipElement.style('height'));
            var pointX = xScale ? xScale(d.x) : pointOrCentroid()[0];
            var pointY = yScale ? yScale(d.y) : pointOrCentroid()[1];
            var alignedRight;

            var clampPosition = function (pos) {
                // Check outside plot area (left)
                if (pos.x < plotLeft) {
                    pos.x = plotLeft + distance;
                }

                // Check outside plot area (right)
                if (pos.x + width > plotLeft + plotWidth) {
                    pos.x -= (pos.x + width) - (plotLeft + plotWidth);
                    // Don't overlap point
                    pos.y = plotTop + pointY - (height + distance);
                    alignedRight = true;
                }

                // Check outside the plot area (top)
                if (pos.y < plotTop) {
                    pos.y = plotTop + distance;

                    // Don't overlap point
                    if (alignedRight && pointY >= pos.y && pointY <= pos.y + height) {
                        pos.y = pointY + plotTop + distance;
                    }
                }

                // Check outside the plot area (bottom)
                if (pos.y + height > plotTop + plotHeight) {
                    pos.y = Math.max(plotTop, plotTop + plotHeight - (height + distance));
                }

                return pos;
            };

            var positioner = {
                'vertical': function verticalPositioner() {
                    var pos = {
                        x: plotLeft + pointX - (distance + width),
                        y: plotTop + pointY - (distance + height)
                    };

                    return clampPosition(pos);
                },

                'horizontal': function horizontalPositioner() {
                    var pos = {
                        x: plotLeft + pointY - (distance + width),
                        y: plotTop + pointX - (distance + height)
                    };

                    return clampPosition(pos);
                }
            };

            return options.chart.rotatedFrame ? positioner.horizontal() : positioner.vertical();

        };

        var onMouseOver = function (d) {
            show.call(this, d);
        };

        var onMouseOut = function () {
            changeOpacity.call(this, 0, this.options.tooltip.hideTime);
        };

        var getTooltipText = function (d, allPoints) {
            function match() {
                var params = Array.prototype.slice.call(arguments);
                var list = params[0];
                var rest = params.slice(1);

                var response = _.map(list, function(fn) { return fn.apply(this, rest); }).concat([_.noop]);

                return _.first(_.select(response));
            }

            var options = this.options.tooltip;
            var formatters = [
                function (d) { return options.formatter ? _.partial(options.formatter, d, allPoints) : null; },
                function (d) { return d.hasOwnProperty('x') ? _.partial(function (d) { return d.series + '<br>' + d.x + '<br>' + d.y; }, d) : null; },
                function (d) { return d.data && d.data.hasOwnProperty('x') ? _.partial(function (d) { return d.series + '<br>' +  d.x + '<br>' + d.y; }, d.data) : null; },
                function (d) { return d.hasOwnProperty('value') ? _.partial(function (d) { return d.value; }, d) : null;  },
                function () { return function () { return 'NA'; }; }
            ];


            return match(formatters, d)();
        };

        var show = function (d) {
            clearHideTimer.call(this);

            dataPoints = findOriginalDataPoint(d);

            this.tooltipElement.select('.text').html(getTooltipText.call(this, dataPoints[0], dataPoints));

            var pos = positionTooltip.call(this, d);

            this.tooltipElement
                .style('top', pos.y + 'px')
                .style('left', pos.x + 'px');

            changeOpacity.call(this, this.options.tooltip.opacity, this.options.tooltip.showTime);
        };

        function findOriginalDataPoint(d) {
            var res = [];
            _.each(data, function (series) {
                var name = series.name;
                _.each(series.data, function (point) {
                    if (point.x === d.x && d.y === point.y) {
                        res.push({
                            x: point.x,
                            y: point.y,
                            series: name
                        });
                    }
                });
            });

            return res;
        }

        this.tooltipElement = this.container
            .style('position', 'relative')
            .selectAll('.nw-tooltip').data([1]);

        this.tooltipElement
            .enter().append('div')
            .attr('class', 'nw-tooltip')
            .style('opacity', 0)
            .append('div')
                .attr('class', 'text');

        this.svg.selectAll('.tooltip-tracker')
            .on('mouseover.tooltip', onMouseOver.bind(this))
            .on('mouseout.tooltip',  onMouseOut.bind(this));
    }

    render.defaults = defaults;


    /**
    * Adds a tooltip on hover to all other visualizations in the Contour instance.
    *
    * Although not strictly required, this visualization does not appear unless there are one or more additional visualizations in this Contour instance for which to show the tooltips.
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
    Contour.export('tooltip', render);


})();



(function () {


    function ctor(data, layer, options) {
        this.checkDependencies('cartesian');
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var shouldAnimate = options.chart.animations && options.chart.animations.enable;
        var x = _.bind(function(d) { return this.xScale(d) + this.rangeBand / 2; }, this);
        var y = _.bind(function(d) { return this.yScale(d); }, this);
        var regression = _.nw.linearRegression(_.flatten(_.pluck(data, 'data')));
        var domain = d3.extent(this.xScale.domain());
        var lineY = function (x) { return regression.intercept + regression.slope * x; };

        var line = layer.selectAll('.trend-line')
            .data([1]);

        line.enter().append('line')
            .attr('class', 'trend-line')
            .attr('x1', x(domain[0]))
            .attr('y1', y(lineY(domain[0])))
            .attr('x2', x(domain[0]))
            .attr('y2', y(lineY(domain[0])));

        line.exit().remove();

        if (shouldAnimate) {
            line.transition().duration(duration)
                .attr('x1', x(domain[0]))
                .attr('y1', y(lineY(domain[0])))
                .attr('x2', x(domain[1]))
                .attr('y2', y(lineY(domain[1])));
        } else {
            line
                .attr('x1', x(domain[0]))
                .attr('y1', y(lineY(domain[0])))
                .attr('x2', x(domain[1]))
                .attr('y2', y(lineY(domain[1])));
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
    Contour.export('trendLine', ctor);

})();

// exports for commonJS and requireJS styles
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    module.exports = Contour;
} else {
    root.Contour = Contour;
    if ( typeof define === "function" && define.amd ) {
        define( "contour", [], function () { return Contour; } );
    }
}
})();
