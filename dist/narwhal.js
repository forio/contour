(function (undefined) {

    var root = this;

    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        if(typeof require === 'function') {
            root.d3 = require('d3');
            root._ = require('lodash');
        }
    }

    if(!d3) throw new Error('You need to include d3.js before Narwhal. Go to http://d3js.org/');
    if(!_ || !_.merge) throw new Error('You need to include lodash.js before Narwhal. Go to http://lodash.com/');



(function () {

    var generalHelpers = {
        // the src is a function returns the function evaluated
        // otherwise returns src
        getValue: function (src, deafult, ctx, args) {
            args = Array.prototype.slice.call(arguments, 3);
            return !src ? deafult : typeof src === 'function' ? src.apply(ctx, args) : src;
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

            // nothing to do to the data if it's not in a supported format
            return data;
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
            animations: true,
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
                top: 0,
                right: 0,
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


    /**
    * Create a set of related visualizations by calling the Narwhal visualization constructor. This creates a Narwhal instance, based on the core Narwhal object.
    *
    *   * Pass the constructor any configuration options in the *options* parameter. Make sure the `el` option contains the selector of the container in which the Narwhal instance will be rendered.
    *   * Set the frame for this Narwhal instance (e.g. `.cartesian()`).
    *   * Add one or more specific visualizations to this Narwhal instance (e.g. `.scatter()`, `.trend-line()`). Pass each visualization constructor the data it displays.
    *   * Invoke an action for this Narwhal instance (e.g. `.render()`).
    *
    * ### Example:
    *
    *     new Narwhal({el: 'myChart'})
    *       .cartesian()
    *       .line([1,3,2,5])
    *       .render()
    *
    *
    * @class Narwhal() visualizations object
    * @param {object} options The global options object
    * @see {@link config}
    *
    */
    function Narwhal (options) {
        this.init(options);

        return this;
    }

    /**
    * Adds a new kind of visualization to the core Narwhal object.
    * The *renderer* function is called when you add this visualization to instances of Narwhal.
    *
    * ### Example:
    *
    *     Narwhal.export("exampleVisualization", function(data, layer) {
    *           //function body to create exampleVisualization
    *           //for example using SVG and/or D3
    *     });
    *
    *     //to include the visualization into a specific Narwhal instance
    *     new Narwhal(options)
    *           .exampleVisualization(data)
    *           .render()
    *
    * @param {String} ctorName Name of the visualization, used as a constructor name.
    * @param {Function} renderer Function called when this visualization is added to a Narwhal instance. This function receives the data that is passed in to the constructor.
    * @see options
    */
    Narwhal.export = function (ctorName, renderer) {

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


        Narwhal.prototype[ctorName] = function (data, options) {
            var categories = this.options ? this.options.xAxis ? this.options.xAxis.categories : undefined : undefined;
            var opt =  _.extend({}, this.options[ctorName], options);
            var vis;

            data = data || [];
            sortSeries(data);
            vis = new Narwhal.VisualizationContainer(_.nw.normalizeSeries(data, categories), opt, ctorName, renderer, this);
            this._visualizations.push(vis);

            return this;
        };
    };


    /**
    * Exposes functionality to the core Narwhal object.
    * Use this to add *functionality* that will be available for any visualizations.
    *
    * ###Example:
    *
    *     Narwhal.expose("example", {
    *          // when included in the instance, the function `.myFunction` is available in the visualizations
    *         myFunction: function(data) { .... }
    *     });
    *
    *     Narwhal.export("visualizationThatUsesMyFunction", function(data, layer) {
    *           //function body including call to this.myFunction(data)
    *     });
    *
    *     // to include the functionality into a specific instance
    *     new Narwhal(options)
    *           .example()
    *           .visualizationThatUsesMyFunction()
    *           .render()
    */
    Narwhal.expose = function (ctorName, functionalityConstructor) {
        var ctor = function () {
            var functionality = typeof functionalityConstructor === 'function' ? new functionalityConstructor() : functionalityConstructor;
            // extend the --instance-- we don't want all charts to be overriden...
            _.extend(this, _.omit(functionality, 'init'));

            if(functionality.init) functionality.init.call(this, this.options);

            return this;
        };

        Narwhal.prototype[ctorName] = ctor;

        return this;
    };

    Narwhal.prototype = _.extend(Narwhal.prototype, {
        _visualizations: undefined,

        // Initializes the instance of Narwhal
        init: function (options) {
            // for now, just  store this options here...
            // the final set of options will be composed before rendering
            // after all components/visualizations have been added
            this.options = options || {};

            this._visualizations = [];

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

            return !!containerHeight ?  containerHeight : Math.round(calcWidth * ratio);
        },

        calcMetrics: function () {
            var options = this.options;

            this.adjustPadding();

            this.adjustTitlePadding();

            options.chart.width = options.chart.width || this.calculateWidth();
            options.chart.height = options.chart.height || this.calculateHeight();

            this.options = _.merge(options, {
                chart: {
                    plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.padding.left - options.chart.padding.right,
                    plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.padding.bottom,
                    plotLeft: options.chart.margin.left + options.chart.padding.left,
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
            var mergeDefaults = function (vis) { _.merge(allDefaults, vis.renderer.defaults); };

            _.each(this._visualizations, mergeDefaults);

            // compose the final list of options right before start rendering
            this.options = _.merge({}, allDefaults, this.options);
        },

        baseRender: function () {
            this.plotArea();

            return this;
        },

        /**
        * Renders this Narwhal instance and all its visualizations into the DOM.
        *
        * Example:
        *
        *     new Narwhal({ el:'.myChart' })
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

            if(!this.svg) {
                this.svg = this.container
                    .append('svg')
                    .attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height)
                    .attr('preserveAspectRatio', 'xMinYMin')
                    .attr('class', 'narwhal-chart')
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
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')');
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
        * Set's the same data set into all visualizations for an instance
        *
        * Example:
        *
        *     var data = [1,2,3,4,5];
        *     var chart = new Narwhal({ el:'.myChart' })
        *           .scatter(data)
        *           .trendLine(data);
        *
        *     data.push(10);
        *     chart.setData(data)
        *           .render();
        *
        * @function .setData
        *
        */
        setData: function (data) {
            _.invoke(this._visualizations, 'setData', data);

            return this;
        },

        /**
        * Returns a VisualizationContainer object for the visualization at a given index (0-based)
        *
        * Example:
        *
        *     var chart = new Narwhal({ el:'.myChart' })
        *           .pie([1,2,3])
        *           .render()
        *
        *     var myPie = chart.select(0)
        *
        *     // do something with the visualization like updateing its data set
        *     myPie.setData([6,7,8,9]).render()
        *
        * @function .select
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
    root.Narwhal = Narwhal;

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
            /* type of axis {ordinal|linear|time} */
            type: undefined, // defaults is ordinal (needs to be undefined here so overrides work)
            innerTickSize: 0,
            outerTickSize: 0,
            tickPadding: 6,
            maxTicks: undefined,
            title: undefined,
            titlePadding: 4,
            /* padding between ranges (ie. columns) expressed in percentage of rangeBand width */
            innerRangePadding: 0.1,
            /* padding between all ranges (ie. columns) and the axis (left & right) expressed in percentage of rangeBand width */
            outerRangePadding: 0.1,
            firstAndLast: true,
            orient: 'bottom',
            labels: {
                format: 'd'
            },
            linearDomain: false,     // specify if a time domain should be treated linearly or ....
        },

        yAxis: {
            /* @param: {linear|smart|log} */
            // type: 'smart',
            min: undefined,
            max: undefined,
            smartAxis: true,
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
                align: 'middle',
                format: 's', // d3 formats
                formatter: undefined // a function that formats each value ie. function (datum) { return 'x: ' + datum.x + ', y:' + datum.y }
            }
        }
    };


    /**
    * Provides a Cartesian frame to the Narwhal instance.
    *
    * ###Example:
    *
    *     new Narwhal(options)
    *           .cartesian();
    *
    * @name cartesian()
    */
    var cartesian = function () {
        return {
            dataSrc: [],

            init: function (options) {

                // readonly properties (ie. user cannot modify)
                var readOnlyProps = {
                    chart: {
                        rotatedFrame: false
                    }
                };

                this.options = _.merge({}, defaults, options, readOnlyProps);

                if (!this.options.xAxis.firstAndLast) {
                    this.options.chart.padding.right += 15;
                }

                return this;
            },

            xDomain: [],
            yDomain: [],


            adjustPadding: function () {
                var xOptions = this.options.xAxis;
                var yOptions = this.options.yAxis;
                var maxTickSize = function (options) { return Math.max(options.outerTickSize || 0, options.innerTickSize || 0); };
                if (!this.options.chart.padding.bottom) {
                    var xLabels = this.xDomain;
                    var xAxisText = xLabels.join('<br>');
                    var xLabelBounds = _.nw.textBounds(xAxisText, '.x.axis');
                    var regularXBounds = _.nw.textBounds('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', '.x.axis');
                    var em = regularXBounds.height;
                    var ang = xOptions.labels && xOptions.labels.rotation ? xOptions.labels.rotation % 360 : 0;
                    var xLabelHeightUsed = ang === 0 ? regularXBounds.height : Math.ceil(Math.abs(xLabelBounds.width * Math.sin(_.nw.degToRad(ang))));
                    this.options.chart.padding.bottom = this.options.chart.padding.bottom || maxTickSize(this.options.xAxis) + (this.options.xAxis.tickPadding || 0) + xLabelHeightUsed + Math.ceil(em * Math.cos(_.nw.degToRad(ang)));
                }

                if (!this.options.chart.padding.left) {
                    var yLabels = _.nw.extractScaleDomain(this.yDomain.slice().concat([_.nw.niceRound(this.yDomain[1])]), yOptions.min, yOptions.max);

                    var format = yOptions.labels.formatter || d3.format(yOptions.labels.format || ',.0f');
                    var yAxisText = _.map(yLabels, format).join('<br>');
                    var yLabelBounds = _.nw.textBounds(yAxisText, '.y.axis');
                    this.options.chart.padding.left = this.options.chart.padding.left ||  maxTickSize(this.options.yAxis) + (this.options.yAxis.tickPadding || 0) + yLabelBounds.width;
                }
            },

            adjustTitlePadding: function () {
                var titleBounds;
                if (this.options.xAxis.title || this.options.yAxis.title) {
                    if(this.options.xAxis.title) {
                        titleBounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                        this.options.chart.padding.bottom += titleBounds.height + this.options.xAxis.titlePadding;
                    }

                    if(this.options.yAxis.title) {
                        titleBounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                        this.options.chart.padding.left += titleBounds.height + this.options.yAxis.titlePadding;
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

                var absMin = this.yDomain[0] > 0 ? 0 : undefined;
                var yScaleDomain = _.nw.extractScaleDomain(this.yDomain, absMin, this.options.yAxis.max);

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
                    .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + y + ')')
                    .attr('class', 'x axis');

                this._xAxisGroup
                    .transition().duration(400 * this.options.chart.animations)
                    .call(xAxis);

                this.xScaleGenerator.postProcessAxis(this._xAxisGroup);

                return this;
            },

            renderYAxis: function () {
                var options = this.options.yAxis;
                var alignmentOffset = { top: '.8em', middle: '.35em', bottom: '0' };
                var x = this.options.chart.padding.left;
                var y = this.options.chart.padding.top;

                this._yAxisGroup = this.svg.selectAll('.y.axis')
                    .data([1]);

                this._yAxisGroup
                    .enter().append('g')
                    .attr('transform', 'translate(' + x + ',' + y + ')')
                        .attr('class', 'y axis');

                this._yAxisGroup
                    .transition().duration(400 * this.options.chart.animations)
                    .call(this.yAxis())
                    .selectAll('text')
                        .attr('dy', alignmentOffset[options.labels.align]);

                return this;
            },

            renderAxisLabels: function () {
                var lineHeightAdjustment = this.titleOneEm * 0.25; // add 25% of font-size for a complete line-height
                var adjustFactor = 40/46.609; // this factor is to account for the difference between the actual svg size and what we get from the DOM
                var bounds, x, y;

                if (this.options.xAxis.title) {
                    bounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                    y = this.options.chart.padding.bottom;
                    x = 0;
                    this._xAxisGroup.append('text')
                        .attr('class', 'x axis-title')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dx', (this.options.chart.plotWidth - bounds.width) / 2)
                        .attr('dy', -2) // just because
                        .text(this.options.xAxis.title);
                }

                if (this.options.yAxis.title) {
                    bounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                    y = -this.options.chart.padding.left + bounds.height * adjustFactor;
                    x = 0;
                    this._yAxisGroup.append('text')
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

                    lines.transition().duration(400 * this.options.chart.animations)
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

            render: function () {

                this.composeOptions();
                this.adjustDomain();
                this.calcMetrics();
                this.computeScales();
                this.baseRender();

                this.renderXAxis()
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
                this.dataSrc = _.flatten(
                    _.map(this._visualizations, function (v) {
                        return _.flatten(_.map(v.data, _.bind(this.datum, this)));
                    }, this)
                );

                this._yAxis = null;
                this._xAxis = null;
            },

            getExtents: function (axis) {
                var field = axis && axis === 'x' ? 'xExtent' : 'yExtent';
                var all = _.flatten(_.pluck(this._visualizations, field));
                return all.length ? d3.extent(all) : [];
            },

            getXDomain: function () {
                var all = _.flatten(_.pluck(this._visualizations, 'xDomain'));
                return all;
            }

        };
    };

    Narwhal.expose('cartesian', cartesian);

})();

Narwhal.version = '0.0.46';
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

            if (this.options.xAxis.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
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

                this._scale = d3.scale.log().domain(domain).clamp(true);

                setRange(this._scale, this.options);
            }

            return this._scale;

        }
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

        axis: function () {
            var options = this.options.xAxis;
            var tickFormat = options.labels.formatter || function (d) { return _.isDate(d) ? d.getDate() : d; };
            var axis = d3.svg.axis()
                .scale(this._scale)
                .innerTickSize(options.innerTickSize)
                .outerTickSize(options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickValues(this.options.xAxis.categories)
                .tickFormat(tickFormat);

            if (this.options.xAxis.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            }

            return axis;
        },

        /* jshint eqnull:true */
        postProcessAxis: function (axisGroup) {
            var options = this.options.xAxis;
            if (!options.labels || options.labels.rotation == null) return;

            var deg = options.labels.rotation;
            var rad = _.nw.degToRad(deg);
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
                    return (cos * lineCenter + (0.31)).toFixed(4) + 'em';
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
                var customValues = [];
                var len = this._domain.length;
                var step = (len + 1) / this.options.xAxis.maxTicks;

                for (var j=0, index = 0; j<len; j += step, index += step) {
                    customValues.push(this._domain[Math.min(Math.ceil(index), len-1)]);
                }

                axis.tickValues(customValues);

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

            var spanDays = dateDiff(this._domain[this._domain.length-1], this._domain[0]);
            var daysThreshold = this.options.xAxis.maxTicks || 5;
            if (spanDays < daysThreshold) return d3.time.format('%H:%M');

            return d3.time.format('%d %b');
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

            this.options.chart.padding.left = maxTickSize(this.options.xAxis) + this.options.xAxis.tickPadding + xLabel.width;
            this.options.chart.padding.bottom = maxTickSize(this.options.yAxis) + this.options.yAxis.tickPadding + yLabel.height;
        },

        adjustTitlePadding: function () {
            var titleBounds;
            if (this.options.xAxis.title || this.options.yAxis.title) {
                if(this.options.xAxis.title) {
                    titleBounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                    this.options.chart.padding.left += titleBounds.height + this.options.xAxis.titlePadding;
                }

                if(this.options.yAxis.title) {
                    titleBounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                    this.options.chart.padding.bottom += titleBounds.height + this.options.yAxis.titlePadding;
                }
            }
        },

        renderYAxis: function () {
            var yAxis = this.yAxis();
            var x = this.options.chart.padding.left;
            var y = this.options.chart.padding.top + this.options.chart.plotHeight;

            this._yAxisGroup = this.svg.selectAll('.y.axis')
                .data([1]);

            this._yAxisGroup.enter().append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + x+ ',' + y + ')')
                .call(yAxis);

            this._yAxisGroup.exit().remove();

            this._yAxisGroup
                    .transition().duration(400 * this.options.chart.animations)
                    .attr('transform', 'translate(' + x+ ',' + y + ')')
                    .call(yAxis);

            return this;
        },

        renderXAxis: function () {
            var x = this.options.chart.padding.left;
            var y = this.options.chart.padding.top;
            var xAxis = this.xAxis();

            this._xAxisGroup = this.svg.selectAll('.x.axis')
                .data([1]);

            this._xAxisGroup.enter().append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + x + ',' + y + ')')
                .call(xAxis);

            this._xAxisGroup.exit().remove();

           this._xAxisGroup
                .transition().duration(400 * this.options.chart.animations)
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
                y = this.options.chart.rotatedFrame ? -this.options.chart.padding.left : this.options.chart.padding.bottom - lineHeightAdjustment;

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
                    this.options.chart.padding.bottom:
                    -this.options.chart.padding.left + this.titleOneEm - lineHeightAdjustment;

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
    * Sets the visualization frame to be "horizontal".
    * The xAxis is set vertical and the yAxis is set horizontal.
    *
    * This visualization requires *.cartesian()*.
    *
    * This visualization is a prerequiste for rendering bar charts (*.bar()*).
    *
    * ###Example:
    *
    *     new Narwhal({el: '.myChart'})
    *        .cartesian()
    *        .horizontal()
    *        .bar([1, 2, 3, 4, 5, 4, 3, 2, 1])
    *        .render()
    *
    * @function .horiztonal
    * @param {TBW} frame TBW
    */
    Narwhal.expose('horizontal', frame);

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

    Narwhal.VisualizationContainer = VisInstanceContainer;

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

    function renderer(data, layer, options) {
        var x = _.bind(function (val) { return this.xScale(val) + this.rangeBand / 2; }, this);
        var y = _.bind(function (val) { return this.yScale(val); }, this);
        var h = options.chart.plotHeight;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });

        var startArea = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return h; })
            .y1(function(d) { return h; });

        var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });

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

            series.select('.area')
                .datum(function (d) { return d.data; })
                .transition().duration(400)
                .attr('d', area);

            renderTooltipTrackers.call(this, series);
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
                    .attr('cy', function(d) { return y(d.y0 + d.y); });
        }
    }

    renderer.defaults = defaults;

    /*
    * Adds an area chart to the Narwhal instance.
    *
    * Area charts are stacked by default when the _data_ includes multiple series.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .area([1,2,3,4])
    *           .render();
    *
    * @name area(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('area', renderer);

})();

(function () {

    var defaults = {
        bar: {
            stacked: false,
            padding: 2      // two px between same group bars
        }
    };

    function barRender(data, layer, options) {
        var duration = 400;
        var x = this.xScale;
        var y = this.yScale;
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

        bars.enter().append('rect')
            .attr('class', 'bar tooltip-tracker')
            .call(enter);

        if(options.chart.animations) {
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
                    .attr('width', function (d) { return y(0); });

            } else {
                return bar
                    .attr('x', function (d) { return y(d.y0 || 0); })
                    .attr('width', function (d) { return y(d.y); });
            }
        }

        function grouped(bar, enter) {
            var numSeries = data.length;
            var height = function () { return rangeBand / numSeries - options.bar.padding; };
            var offset = function (d, i) { return rangeBand / numSeries * i; };

            bar.attr('y', function (d, i, j) { return x(d.x) + offset(d, j); })
                .attr('x', 0)
                .attr('height', height);

            if (enter) {
                return bar
                    .attr('width', function (d) { return y(0); });
            } else {
                return bar
                    .attr('width', function (d) { return y(d.y); });
            }
        }
    }

    barRender.defaults = defaults;
    /*
    * Adds a bar chart (horizontal columns) to the Narwhal instance.
    *
    * You can use this visualization to render both stacked and grouped charts (controlled through the _options_).
    *
    * This visualization requires `.cartesian()` and `.horizontal()`.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .horizontal()
    *           .bar([1,2,3,4])
    *           .render();
    *
    * @name bar(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('bar', barRender);

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
        var duration = 400;
        var opt = options.column;
        var w = options.chart.plotWidth;
        var h = options.chart.plotHeight;
        var _this = this;
        var x = function (v) { return Math.round(_this.xScale(v)); };
        var y = function (v) { return Math.round(_this.yScale(v)); };
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
        var width = rangeBand / data.length - opt.groupPadding;

        cols.enter()
            .append('rect')
            .attr('class', 'column tooltip-tracker')
            .call(enter);

        if (options.chart.animations) {
            cols.exit()
                .transition().duration(duration)
                .attr('y', h)
                .attr('height', function () { return 0; })
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
                    .attr('height', function (d) { return 0; });
            } else {
                col.attr('y', function (d) { return d.y >= 0 ? y(d.y) + y(d.y0) - base : y(d.y0) ; })
                    .attr('height', function (d) { return d.y >=0 ? base - y(d.y) : y(d.y) - base; });
            }
        }

        function grouped(col, enter) {
            var width = rangeBand / data.length - opt.groupPadding;
            var offset = function (d, i) { return rangeBand / data.length * i; };
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

    /*
    * Adds a column chart (vertical columns) to the Narwhal instance.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .column([1,2,3,4])
    *           .render();
    *
    * @name column(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('column', render);

})();

(function () {

    Narwhal.export('coolNarwhal', function (data, layer) {
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
        line: {
            smooth: false,
            marker: {
                enable: true,
                size: 3
            }
        }
    };


    function render(rawData, layer, options, id) {

        var x = _.bind(function (d) { return this.xScale(d.x) + this.rangeBand / 2; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);
        var h = options.chart.plotHeight;
        var duration = 400;
        /*jshint eqnull:true */
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
        renderTooltipTrackers();


        function renderPaths() {
            var startLine = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function () { return y({x: 0, y: 0}); });

            var line = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function (d) { return y(d); });

            if(options.line.smooth) line.interpolate('cardinal');

            var series = layer.selectAll('g.series')
                    .data(data);

            // enter
            var el = series.enter().append('svg:g')
                .attr('class', function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; })
                .append('path')
                    .attr('class', 'line');

            if (options.chart.animations) {
                el.attr('d', function(d) { return startLine(d.data); })
                    .transition().duration(duration)
                    .attr('d', function (d) { return line(d.data); });
            } else {
                el.attr('d', function (d) { return line(d.data); });
            }

            // update
            el = series.select('.line');

            if (options.chart.animations) {
                el.transition().duration(duration)
                    .attr('d', function (d) { return line(d.data); });
            } else  {
                el.attr('d', function (d) { return line(d.data); });
            }

            // remove
            if (options.chart.animations) {
                series.exit()
                    .remove();
            } else  {
                series.exit().remove();
            }
        }

        function renderMarkers() {
            var markers = layer.selectAll('.line-chart-markers')
                .data(data);

            markers.enter().append('g')
                .attr('class', function (d, i) { return 'line-chart-markers markers s-' + (i+1); });

            markers.exit().remove();

            var dots = markers.selectAll('.dot')
                .data(function (d) { return d.data; }, function (d) { return d.x; });

            dots.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', options.line.marker.size)
                .attr('cx', x)
                .attr('cy', h);

            dots.exit().remove();

            if (options.chart.animations) {
                dots.transition().delay(100).duration(duration)
                    .attr('cx', x)
                    .attr('cy', y);
            } else {
                dots.attr('cx', x)
                    .attr('cy', y);
            }
        }

        function renderTooltipTrackers() {
            var trackerSize = 10;
            var markers = layer.selectAll('.tooltip-trackers')
                .data(data);

            markers.enter().append('g')
                .attr('class', function (d, i) { return 'tooltip-trackers s-' + (i+1); });

            markers.exit().remove();

            var dots = markers.selectAll('.tooltip-tracker')
                .data(function (d) { return d.data; }, function (d) { return d.x; });

            dots.enter().append('circle')
                .attr('class', 'tooltip-tracker')
                .attr('r', trackerSize)
                .attr('opacity', 0)
                .attr('cx', x)
                .attr('cy', h);

            dots.exit().remove();

            dots.attr('cx', x)
                .attr('cy', y);
        }

        return this;
    }

    render.defaults = defaults;


    /*
    * Adds a line chart to the Narwhal instance.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .line([1,2,3,4])
    *           .render();
    *
    * @name line(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('line', render);

})();

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
        var duration = 400;
        var w = options.chart.plotWidth, h = options.chart.plotHeight;
        var padding = _.nw.clamp(_.nw.getValue(options.pie.piePadding, 0, this), 0, h/2 - 2);
        var numSeries = data.length;
        var proposedRadius = (Math.min(w / numSeries, h) / 2) - padding;
        var radius = _.nw.getValue(options.pie.outerRadius, proposedRadius, this, proposedRadius) ;
        var innerRadius = _.nw.getValue(options.pie.innerRadius, 0, this, radius);
        var classFn = function (d, i) { return 'series arc tooltip-tracker s-' + (i+1) + ' ' + d.name; };
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

        if (options.chart.animations) {
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

            if (options.chart.animations) {
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


    /*
    * Adds a pie chart to the Narwhal instance.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .pie([1,2,3,4])
    *           .render();
    *
    * @name pie(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats. The data elements are summed and then divided. In the example, `.pie([1,2,3,4])` makes four pie slices: 1/10, 2/10, 3/10, and 4/10.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('pie', renderer);

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
        var opt = options.scatter;
        var halfRangeBand = this.rangeBand / 2;
        var duration = 400;
        var x = _.bind(function (d) { return this.xScale(d.x) + halfRangeBand; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);
        var h = options.chart.plotHeight;
        var classFn = function (d, i) { return d.name + ' series s-' + (i+1); };

        var series = layer.selectAll('.series')
            .data(data);

        series.enter().append('svg:g')
            .attr('class', classFn);

        series.exit().remove();

        var dots = series.selectAll('.dot')
            .data(function (d) { return d.data; });

        dots
            .enter().append('circle')
                .attr('class', 'dot tooltip-tracker')
                .attr('r', opt.radius)
                .attr('cx', x)
                .attr('cy', h);

        if (options.chart.animations) {
            dots.transition().duration(duration);
        }

        dots.attr('r', opt.radius)
            .attr('cx', x)
            .attr('cy', y);

        dots.exit().remove();
    }

    ScatterPlot.defaults = defaults;

    /*
    * Adds a scatter plot to the Narwhal instance.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.chart'})
    *           .cartesian()
    *           .scatter([1,2,3,4])
    *           .render();
    *
    * @name scatter(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('scatter', ScatterPlot);


})();

(function () {
    /*
    * Adds a tooltip and legend combination for stacked (multiple) series visualizations in the Narwhal instance. 
    * Requires a second display element (`<div>`) for the legend in the html.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .column(stackedColData)
    *           .stackedTooltip(stackedColData, {el: '.myChartLegend'})
    *           .render();
    *
    * @name stackTooltip(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} options Options particular to this visualization that override the defaults. The `el` option must contain the selector of the container in which the tooltip should be rendered.
    * @api public
    *
    */
    Narwhal.export('stackTooltip', function (data, layer, options) {

        var valueFormatter = this.yAxis().tickFormat();
        var tooltip = d3.select(options.stackTooltip.el);

        tooltip.classed('stack-tooltip', true);

        /*jshint eqnull:true*/
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

        var onMouseOut = function (/* datum */) {
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
            animate: true,
            opacity: 0.85,
            showTime: 300,
            hideTime: 500,
            distance: 5
        }
    };

    function render() {

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

        var positionTooltip = function (d) {
            var plotLeft = this.options.chart.plotLeft;
            var plotWidth = this.options.chart.plotWidth;
            var plotTop = this.options.chart.plotTop;
            var plotHeight = this.options.chart.plotHeight;
            var distance = this.options.tooltip.distance;
            var width = parseFloat(this.tooltipElement.style('width'));
            var height = parseFloat(this.tooltipElement.style('height'));
            var pointX = this.xScale ? this.xScale(d.x) : d3.event.x;
            var pointY = this.yScale ? this.yScale(d.y) : d3.event.y;
            var alignedRight;

            var pos = {
                x: plotLeft + pointX - (distance + width),
                y: plotTop + pointY - (distance + height)
            };

            // Check outside plot area (left)
            if (pos.x < plotLeft) {
                pos.x = plotLeft + Math.max(pos.x, 0) + distance;
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

        var onMouseOver = function (d) {
            show.call(this, d);
        };

        var onMouseOut = function () {
            changeOpacity.call(this, 0, this.options.tooltip.hideTime);
        };

        var getTooltipText = function (d) {
            function match() {
                var params = Array.prototype.slice.call(arguments);
                var list = params[0];
                var rest = params.slice(1);

                var response = _.map(list, function(fn) { return fn.apply(this, rest); }).concat([_.noop]);

                return _.first(_.select(response));
            }
            var options = this.options.tooltip;
            var formatters = [
                function (d) { return options.formatter ? _.partial(options.formatter, d) : null; },
                function (d) { return d.hasOwnProperty('x') ? _.partial(function (d) { return 'x: ' + d.x + '<br>' + 'y: ' + d.y; }, d) : null; },
                function (d) { return d.data && d.data.hasOwnProperty('x') ? _.partial(function (d) { return d.x + '<br>' + d.y; }, d.data) : null; },
                function (d) { return d.hasOwnProperty('value') ? _.partial(function (d) { return d.value; }, d) : null;  },
                function () { return function () { return 'NA'; }; }
            ];


            return match(formatters, d)();
        };

        var show = function (d) {
            clearHideTimer.call(this);

            this.tooltipElement.select('.text').html(getTooltipText.call(this, d));

            var pos = positionTooltip.call(this, d);

            this.tooltipElement
                .style('top', pos.y + 'px')
                .style('left', pos.x + 'px');

            changeOpacity.call(this, this.options.tooltip.opacity, this.options.tooltip.showTime);
        };

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


    /*
    * Adds a tooltip on hover to all other visualizations in the Narwhal instance.
    *
    * Although not strictly required, this visualization does not appear unless there are one or more additional visualizations in this Narwhal instance for which to show the tooltips.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .line([2, 4, 3, 5, 7])
    *           .tooltip()
    *           .render();
    *
    * @name tooltip(data, options)
    * @param {object|array} data Ignored!
    * @param {object} options Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('tooltip', render);


})();



(function () {


    function ctor(data, layer, options) {
        var duration = 400;
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

        if (options.chart.animations) {
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

    /*
    * Adds a trend line to the Narwhal instance, based on linear regression.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .trendLine([2,4,3,5,7])
    *           .render();
    *
    * @name trendLine(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats. A linear regression is performed on the _data series_ and the resulting trend line is displayed.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('trendLine', ctor);

})();

// exports for commonJS and requireJS styles
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    module.exports = Narwhal;
} else {
    root.Narwhal = Narwhal;
    if ( typeof define === "function" && define.amd ) {
        define( "narwhal", [], function () { return Narwhal; } );
    }
}
})();
