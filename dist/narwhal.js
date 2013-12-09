(function (ns, d3, _, $, undefined) {

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
            }
        },

        xAxis: {
        },

        yAxis: {
        },

        tooltip: {
        }
    };

    /**
    * Narwhal visualization constructor
    * @class Narwhal visualizations object
    * @param {object} options The global options object
    * @see {@link Options}
    *
    */
    function Narwhal (options) {
        this.init(options);
        return this;
    }

    /**
    * Exposes functionality to the core Narwhal object.
    * This is used to add base functionality to be used by viasualizations
    * for example the `cartesian` frame is implemented exposing functionality.
    *
    * Example:
    *
    *
    *     Narwhal.expose("example", {
    *          // when included in the instance, this will expose `.transformData` to the visualizations
    *         transformData: function(data) { .... }
    *     });
    *
    *     // To include the functionality into a specific instance
    *     new Narwhal(options)
    *           .example()
    *           .visualizationsThatUsesTransformDataFunction()
    *           .render()
    */
    Narwhal.expose = function (ctorName, functionality) {
        var ctor = function () {
            // extend the --instance-- we don't want all charts to be overriden...
            _.extend(this, _.omit(functionality, 'init'));

            if(functionality.init) functionality.init.call(this, this.options);

            return this;
        };

        Narwhal.prototype[ctorName] = ctor;

        return this;
    },

    /**
    * Adds a visualization to be rendered in the instance of Narwhal
    * This is the main way to expose visualizations to be used
    *
    * @param {String} ctorName Name of the visualization to be used as a contructor name
    * @param {Function} renderer Function that will be called to render the visualization. The function will recieve the data that was passed in to the constructor function
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
            data = data || [];
            sortSeries(data);
            renderer.defaults = renderer.defaults || {};
            var categories = this.options ? this.options.xAxis ? this.options.xAxis.categories : undefined : undefined;
            var opt = {};
            // merge the options passed ito Narwhal's constructor and this vis constructor
            // into a set of options to be merged with the defaults and back into narwhal global options object
            opt[ctorName] = $.extend(true, {}, this.options[ctorName], options);
            $.extend(true, this.options, renderer.defaults, opt);

            var renderFunc;
            if (_.isArray(data)) {
                var datums = _.nw.normalizeSeries(data, categories);
                this.data(datums);
                renderFunc = _.partial(renderer, datums);
            } else {
                renderFunc = _.partial(renderer, data);
            }

            this.visualizations.push(renderFunc);

            return this;
        };
    };



    Narwhal.prototype = _.extend(Narwhal.prototype, {

        // Initializes the instance of Narwhal
        init: function (options) {
            // for now, just  store this options here...
            // the final set of options will be composed before rendering
            // after all components/visualizations have been added
            this.options = options;

            this.visualizations = [];

            return this;
        },

        calculateWidth: function () {
            return parseInt($(this.options.el).width(), 10) || this.options.chart.defaultWidth;
        },

        calculateHeight: function () {
            var containerHeight = parseInt($(this.options.el).height(), 10);
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

            this.options = $.extend(true, options, {
                chart: {
                    plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.padding.left - options.chart.padding.right,
                    plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.padding.bottom
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
            // compose the final list of options right before start rendering
            this.options = $.extend(true, {}, defaults, this.options);
        },

        baseRender: function () {
            this.plotArea();

            return this;
        },

        render: function () {
            this.composeOptions();

            this.calcMetrics();

            this.baseRender();

            this.renderVisualizations();

            return this;
        },

        plotArea: function () {

            var chartOpt = this.options.chart;

            this.container = d3.select(this.options.el);

            this.svg = this.container
                .append('svg')
                    .attr('viewBox', '0 0 ' + chartOpt.width + ' ' + chartOpt.height)
                    .attr('preserveAspectRatio', 'xMinYMin')
                    .attr('class', 'narwhal-chart')
                    .attr('height', chartOpt.height)
                .append('g')
                    .attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');

            return this;
        },

        createVisualizationLayer: function (id) {
            return this.svg.append('g')
                .attr('vis-id', id)
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')');
        },

        renderVisualizations: function () {
            _.each(this.visualizations, function (visualization, index) {
                var id = index + 1;
                var layer = this.createVisualizationLayer(id);
                visualization.call(this, layer, this.options, id);
            }, this);

            return this;
        },

        compose: function(ctorName, funcArray) {
            // compose differnt functional objects into this instance...
            // this way we can do something like new Narwhal().BarChart(...) and it includes
            // cartesia, xAxis, yAxis, tooltip, highliter, etc...
        },

        // place holder function for now
        data: function () {

        }
    });

    window[ns] = Narwhal;

})('Narwhal', window.d3, window._, window.jQuery);

(function (ns, d3, _, $, undefined) {

    var defaults = {
        chart: {
            padding: {
                top: 6,
                bottom: 25,
                left: 0,
                right: 5
            }
        },

        xAxis: {
            rangePadding: 0,
            innerTickSize: 0,
            outerTickSize: 0,
            tickPadding: 6,
            titlePadding: 4,
            firstAndLast: true,
            orient: 'bottom',
            labels: {
                // format: 'd'
            },
            // linearDomain: false,     // specify if a time domain should be treated linearly or ....
        },

        yAxis: {
            min: 0,
            max: undefined,
            smartAxis: true,
            innerTickSize: 6,
            outerTickSize: 6,
            tickPadding: 4,
            titlePadding: 4,
            orient: 'left',
            labels: {
                align: 'middle',
                format: 's' // d3 formats

            }
        }
    };

    /*
    * Provides a cartesian frame to the Narwhal instance
    *
    * Example:
    *
    *     new Narwhal(options)
    *           .cartesian();
    *
    * Now new visualizations have accecss to the cartesian frame functionality
    * @name .cartesian()
    */
    var cartesian = {
        dataSrc: [],

        init: function (options) {

            this.options = $.extend(true, {}, defaults, options);

            if (!this.options.xAxis.firstAndLast) {
                this.options.chart.padding.right += 15;
            }

            return this;
        },

        adjustPadding: function () {
            var options = this.options.yAxis;
            var yScaleDomain = _.nw.extractScaleDomain(this.yDomain, options.min, options.max);
            var yLabels = this._extractYTickValues(yScaleDomain, options.min, options.max) || [10000];
            var format = d3.format(options.labels.format);
            var yAxisText = _.map(yLabels, format).join('<br>');
            var yLabelBounds = _.nw.textBounds(yAxisText, '.y.axis');
            var xLabelBounds = _.nw.textBounds('ABC', '.x.axis');
            var maxTickSize = function (options) { return Math.max(options.outerTickSize || 0, options.innerTickSize || 0); };

            this.options.chart.padding.left = maxTickSize(this.options.yAxis) + (this.options.yAxis.tickPadding || 0) + yLabelBounds.width;
            this.options.chart.padding.bottom = maxTickSize(this.options.xAxis) + (this.options.xAxis.tickPadding || 0) + xLabelBounds.height - 4;
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

            this.scaleGenerator = _.nw.xScaleFactory(this.dataSrc, this.options);
            this.xScale = this.scaleGenerator.scale(this.xDomain);
            this.rangeBand = this.scaleGenerator.rangeBand();
        },

        computeYScale: function () {
            if (!this.yDomain) throw new Error('You are trying to render without setting data (yDomain).');
            var yScaleDomain = _.nw.extractScaleDomain(this.yDomain, this.options.yAxis.min, this.options.yAxis.max);
            var rangeSize = this.options.chart.rotatedFrame ? this.options.chart.plotWidth : this.options.chart.plotHeight;
            var range = this.options.chart.rotatedFrame ? [0, rangeSize] : [rangeSize, 0];

            this.yScale = d3.scale.linear()
                .range(range);

            this.setYDomain(yScaleDomain);
        },

        /*
        * Provides a scaling function based on the xAxis values.
        *
        * Example:
        *
        *     var scaledValue = this.xScale(100);
        *
        * @function xScale
        * @param {Number|String} value The value to be scaled
        * @return {Number} The scaled value according to the current xAxis settings
        */
        xScale: function(val) { return val; },

        yScale: function(val) { return val; },

        setYDomain: function (domain) {
            this.yScale.domain(domain);

            // if we are not using smartAxis we use d3's nice() domain
            if (!this.options.yAxis.smartAxis)
                this.yScale.nice();
        },

        redrawYAxis: function () {
            // var t = this.svg.transition().duration(750);
            this.svg.select(".y.axis").call(this.yAxis());
        },

        computeScales: function () {
            this.computeXScale();
            this.computeYScale();

            return this;
        },

        xAxis: function () {
            return this.scaleGenerator.axis().orient(this.options.xAxis.orient);
        },

        yAxis: function () {
            var options = this.options.yAxis;
            var tickValues = this._extractYTickValues(this.yDomain, options.min, options.max);
            var numTicks = this._numYTicks(this.yDomain, options.min, options.max);
            var format = d3.format(options.labels.format);
            var orient = options.orient;

            return d3.svg.axis()
                .scale(this.yScale)
                .tickFormat(format)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .orient(orient)
                .ticks(numTicks)
                .tickValues(tickValues);
        },

        renderXAxis: function () {
            var xAxis = this.xAxis();
            var y = this.options.chart.plotHeight + this.options.chart.padding.top;
            this._xAxisGroup = this.svg
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + y + ')')
                .call(xAxis);

            this.scaleGenerator.postProcessAxis(this._xAxisGroup);

            return this;
        },

        renderYAxis: function () {
            var options = this.options.yAxis;
            var alignmentOffset = { top: '.8em', middle: '.35em', bottom: '0' };
            var x = this.options.chart.padding.left;
            var y = this.options.chart.padding.top;
            var yAxis = this.yAxis();

            this._yAxisGroup = this.svg
                .append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + x + ',' + y + ')')
                .call(yAxis);

            this._yAxisGroup
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
        },

        render: function () {
            this.composeOptions();

            this.adjustDomain();

            this.calcMetrics();

            this.computeScales();

            this.baseRender();

            this.renderXAxis()
                .renderYAxis()
                .renderAxisLabels();

            this.renderVisualizations();

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

        data: function (series) {

            if (series instanceof Array && !series.length) {
                return this;
            } else if (series instanceof Array && !series[0].data) {
                this.dataSrc = _.map(series, _.bind(this.datum, this));
                this.xDomain = this.extractXDomain(this.dataSrc);
                this.yDomain = this.extractYDomain(this.dataSrc);
                this.yMax = this.getYAxisDataMax(this.dataSrc);
                this.yMin = this.getYAxisDataMin(this.dataSrc);
            } else if (series instanceof Array && series[0].data) {
                // we have an array of series
                _.each(series, function (set) { this.data(set.data); }, this);
            }

            return this;
        },

        getYAxisDataMax: function (data) {
            return Math.max(this.yMax || 0, _.max(_.pluck(data, 'y')));
        },

        getYAxisDataMin: function (data) {
            return Math.min(this.yMin || 0, _.min(_.pluck(data, 'y')));
        },

        extractXDomain: function(data) {
            return  this.options.xAxis.categories ? this.options.xAxis.categories : _.pluck(data, 'x');
        },

        extractYDomain: function (data) {
            var max = this.yDomain ? Math.max(this.yDomain[1], _.max(_.pluck(data, 'y'))) : _.max(_.pluck(data, 'y'));
            var min = this.yDomain ? Math.min(this.yDomain[0], _.min(_.pluck(data, 'y'))) : _.min(_.pluck(data, 'y'));

            return [min, max];
        },

        extractYStackedDomain: function (data) {
            var dataSets = _.pluck(data, 'data');
            var maxLength = _.max(dataSets, function (d) { return d.length; });
            var stackY = [];

            for (var j=0; j<maxLength; j++) {
                _.each(dataSets, function (datum) {
                    stackY[j] = datum && datum.y ? (stackY[j] || 0) + datum.y : (stackY[j] || 0);
                });
            }

            return [_.min(stackY), _.max(stackY)];
        },

        adjustDomain: function () {
            this.yDomain = this.yDomain ? this.options.yAxis.smartAxis ? [this.yDomain[0], _.nw.niceRound(this.yDomain[1])] : this.yDomain : [0, 10];
            this.xDomain = this.xDomain ? this.xDomain : [];
        },

        _extractYTickValues: function (domain, min, max) {

            function smartAxisValues() {
                var adjustedDomain = _.nw.merge(domain, this.yMax);
                // we want to be able to remove parameters with default values
                // so to remove the default yAxis.min: 0, you pass yAxis.min: null
                // and for that we need to to a truely comparison here (to get null or undefined)
                if (min == null && max == null)
                    return adjustedDomain;

                if (min == null) {
                    return max > this.yMin ? _.nw.merge([max], adjustedDomain) : [max];
                }

                if (max == null) {
                    if (min >= this.yMax) return [min];
                    adjustedDomain[0] = min;

                    return adjustedDomain;
                }

                return _.nw.merge([min, max], this.yMax);
            }

            return this.options.yAxis.smartAxis ? smartAxisValues.call(this) : undefined;
        },

        _numYTicks: function (domain, min, max) {
            function regularAxisYTicks() {
                return this.options.yAxis.ticks != null ? this.options.yAxis.ticks : undefined;
            }

            function smartAxisYTicks() {
                return 3; // 0, dataMax and niceMax
            }

            return this.options.yAxis.smartAxis ? smartAxisYTicks.call(this) : regularAxisYTicks.call(this);
        }

    };

    Narwhal.expose('cartesian', cartesian);

})('Narwhal', window.d3, window._, window.jQuery);

Narwhal.version = '0.0.25';
(function (ns, d3, _, $, undefined) {

    var helpers = {
        xScaleFactory: function (data, options) {
            // if we have dates in the x field of the data points
            // we need a time scale, otherwise is an oridinal
            // two ways to shape the data for time scale:
            //  [{ x: date, y: 1}, {x: date, y: 2}]
            //  [{ data: [ x: date, y: 1]}, {data: [x: date, y: 100]}]
            // if we get no data, we return an ordinal scale
            var isTimeData = _.isArray(data) && data.length > 0 && data[0].data ?
                data[0].data[0].x && _.isDate(data[0].data[0].x) :
                _.isArray(data) && data.length > 0 && data[0].x && _.isDate(data[0].x);


            if (isTimeData && options.xAxis.type !== 'ordinal') {
                return new _.nw.TimeScale(data, options);
            }

            if (options.xAxis.type === 'linear') {
                return new _.nw.LinearScale(data, options);
            }

            return new _.nw.OrdinalScale(data, options);
        }

    };

    _.nw = _.extend({}, _.nw, helpers);

})('Narwhal', window.d3, window._, window.jQuery);

(function (window, undefined) {

    function LinearScale(data, options) {
        this.options = options;
        this.data = data;

        this.init();
    }

    LinearScale.prototype = {
        init: function () {
            delete this._scale;
        },

        scale: function (domain) {
            this._domain = domain ? this._getAxisDomain(domain) : this._getAxisDomain(this.data);
            if(!this._scale) {
                this._scale = d3.scale.linear().domain(this._domain);
                if(this.options.xAxis.min == null && this.options.xAxis.max == null)
                    this._scale.nice();
                this._setRange();
            }

            return this._scale;
        },

        axis: function () {
            var options = this.options.xAxis;
            var formatLabel = d3.format(options.labels.format || 'd');
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

})(window);

(function (ns, d3, _, $, undefined) {

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
            this.isCategorized = true;// _.isArray(this.options.xAxis.categories);
            delete this._scale;
        },

        scale: function (domain) {
            this._domain = domain;
            if(!this._scale) {
                this._scale = new d3.scale.ordinal().domain(domain);

                this._range();
            }

            return this._scale;
        },

        axis: function () {
            var options = this.options.xAxis;
            var axis = d3.svg.axis()
                .scale(this._scale)
                .innerTickSize(options.innerTickSize)
                .outerTickSize(options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickValues(this.options.xAxis.categories)
                .tickFormat(function (d ,i) {
                    return _.isDate(d) ? d.getDate() : d;
                });

            if (this.options.xAxis.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            }

            return axis;
        },

        postProcessAxis: function (axisGroup) {
        },

        rangeBand: function () {
            return this._scale.rangeBand();
        },

        _range: function () {
            var range = this.options.chart.rotatedFrame ? [this.options.chart.plotHeight, 0] : [0, this.options.chart.plotWidth];
            return this.isCategorized ?
                this._scale.rangeRoundBands(range, 0.1) :
                this._scale.rangePoints(range);
        }
    };

    _.nw = _.extend({}, _.nw, { OrdinalScale: OrdinalScale });

})('Narwhal', window.d3, window._, window.jQuery);

(function (ns, d3, _, $, undefined) {

    // implements the following interface
    /*
    {
        scale: returns the d3 scale for the type

        range: returns the d3 range for the type
    }
    */

    function dateDiff(d1, d2) {
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
            this._domain = domain;
            var axisDomain = this._getAxisDomain(domain);
            if(!this._scale) {
                this._scale = new d3.time.scale()
                    .domain(axisDomain);

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

        postProcessAxis: function (axisGroup) {
            if (!this.options.xAxis.firstAndLast) return;
            var labels = axisGroup.selectAll('.tick text')[0];
            $(labels[0]).attr('style', 'text-anchor: start');
            $(labels[labels.length - 1]).attr('style', 'text-anchor: end');
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

})('Narwhal', window.d3, window._, window.jQuery);

(function (window, undefined) {
    var _ = window._;
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
            $.extend(true, this.options, defaults);
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

            this._yAxisGroup = this.svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + x+ ',' + y + ')')
                .call(yAxis);

            return this;
        },

        renderXAxis: function () {
            var x = this.options.chart.padding.left;
            var y = this.options.chart.padding.top;
            var xAxis = this.xAxis();

            this._xAxisGroup = this.svg
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + x + ',' + y + ')')
                .call(xAxis);

            this.scaleGenerator.postProcessAxis(this._xAxisGroup);

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
        }
    };

    window.Narwhal.expose('horizontal', frame);

})(window);

(function (ns, d3, _, $, undefined) {

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
                        return hasX ? { x: d.x, y: val(d.y) } : { x: hasCategories ? categories[i] + '' : i, y: val(d) };
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

    var axisHelpers = {
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

    var debuggingHelpers = {
        warning: function (msg) {
            if(console && console.log) {
                console.log('WARNING: ' + msg);
            }
        }
    };

    _.nw = _.extend({}, _.nw, numberHelpers, arrayHelpers, stringHelpers, dateHelpers, axisHelpers, debuggingHelpers);

})('Narwhal', window.d3, window._, window.jQuery);

(function (window, undefined) {

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
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });
        var stackedData = stack(data);
        var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });

        adjustDomain.call(this);
        renderSeries.call(this);

        function adjustDomain() {
            /* jshint eqnull:true */
            if(this.options.area.stacked && this.options.yAxis.max == null) {
                var flat = _.flatten(_.map(stackedData, function (d) { return d.data; }));
                var max = _.max(flat, function (d) { return d.y0 + d.y; });
                this.setYDomain([0, max.y + max.y0]);
                this.redrawYAxis();
            }
        }

        function renderSeries() {
            var series = layer.selectAll('g.series')
                    .data(stackedData)
                    .enter().append('g')
                        .attr('class', classFn);

            series.append('path')
                .datum(function(d) { return d.data; })
                .attr('class', 'area')
                .attr('d', area);
        }
    }

    renderer.defaults = defaults;

    /*
    * Renders an area chart onto the narwhal frame
    *
    * ### Example
    *     new Narwha({el: '.chart'}).area([1,2,3,4]);
    *
    * @name area
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('area', renderer);

})(window);

(function (window, undefined) {


    function barRender(data, layer, options) {
        var opt = options.bar;
        var xScale = this.xScale;
        var yScale = this.yScale;
        var rangeBand = this.rangeBand;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });
        var enter = options.bar.stacked ? stacked : grouped;
        var numSeries = data.length;

        var series = layer.selectAll('g.series')
                .data(stack(data))
                .enter().append('svg:g')
                    .attr('class', classFn);

        var bar = series.selectAll('.bar')
                .data(function (d) { return d.data; })
                .enter().append('rect')
                    .attr('class', 'bar tooltip-tracker');

        enter.call(this, bar);

        function stacked(bar) {
            if(this.options.yAxis.max == null) {
                var flat = _.flatten(_.map(data, function (d) { return d.data; }));
                var max = _.max(flat, function (d) { return d.y0 + d.y; });
                this.setYDomain([0, max.y + max.y0]);
                this.redrawYAxis();
            }

            return bar
                .attr('y', function (d) { return xScale(d.x); })
                .attr('height', rangeBand)
                .attr('x', function (d) { return yScale(d.y0 || 0); })
                .attr('width', function (d) { return yScale(d.y); });
        }

        function grouped() {
            var height = function () { return rangeBand / numSeries - opt.padding; };
            var offset = function (d, i) { return rangeBand / numSeries * i; };

            return bar
                .attr('y', function (d, i, j) { return xScale(d.x) + offset(d, j); })
                .attr('height', height)
                .attr('x', function () { return yScale(0); })
                .attr('width', function (d) { return yScale(d.y); });
        }
    }

    var defaults = {
        bar: {
            stacked: false,
            padding: 2      // two px between same group bars
        }
    };

    barRender.defaults = defaults;

    Narwhal.export('bar', barRender);

})(window);

(function (ns, d3, _, $, undefined) {

    var defaults = {
        column : {
            stacked: false,
            padding: 1
        }
    };

    function render(data, layer, options) {
        var opt = options.column;
        var h = this.options.chart.plotHeight;
        var x = this.xScale;
        var y = this.yScale;
        var rangeBand = this.rangeBand;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });
        var enter = this.options.column.stacked ? stacked : grouped;

        var series = layer.selectAll('g.series')
                .data(stack(data))
                .enter().append('g')
                    .attr('class', classFn);

        var col = series.selectAll('.column')
            .data(function(d) { return d.data; });
        col.enter().append('rect')
            .attr('class', 'column tooltip-tracker');

        enter.call(this, col);

        function stacked(col) {
            /*jshint eqnull:true */
            if(this.options.yAxis.max == null) {
                var flat = _.flatten(_.map(data, function (d) { return d.data; }));
                var max = _.max(flat, function (d) { return d.y0 + d.y; });
                this.setYDomain([0, max.y + max.y0]);
                this.redrawYAxis();
            }

            col.attr('x', function (d) { return x(d.x); })
                .attr('width', function () { return rangeBand; })
                .attr('y', function (d) { return y(d.y) + y(d.y0) - h; })
                .attr('height', function (d) { return h - y(d.y); });
        }

        function grouped(col) {
            var width = rangeBand / data.length - opt.padding;
            var offset = function (d, i) { return rangeBand / data.length * i; };

            col.attr('x', function (d, i, j) { return x(d.x) + offset(d, j); })
                .attr('width', width)
                .attr('y', function (d) { return y(d.y); })
                .attr('height', function (d) { return h - y(d.y); });
        }
    }

    render.defaults = defaults;
    Narwhal.export('column', render);

})('Narwhal', window.d3, window._, window.jQuery);

(function (ns, d3, _, $, undefined) {

    var defaults = {
        line: {
            smooth: false,
            marker: {
                enable: true,
                size: 2.5
            }
        }
    };


    function render(data, layer, options, id) {

        var x = _.bind(function (d) { return this.xScale(d.x) + this.rangeBand / 2; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);
        var normalizeData = data;

        var line = d3.svg.line()
            .x(function (d) { return x(d); })
            .y(function (d) { return y(d); });

        if(this.options.line.smooth) line.interpolate('cardinal');

        _.each(data, function (d, i) {
            appendPath.call(this, d.data, d.name, i+1);
        }, this);

        function appendPath(data, seriesName, seriesIndex) {
            seriesName = seriesName ? seriesName.replace(/\s/, '_') : '';

            /*jshint eqnull:true */
            var nonNullData = _.filter(data, function (d) { return d.y != null; });
            var markerSize = this.options.line.marker.size;
            var className = ['v-' + id, 's-' + seriesIndex, seriesName].join(' ');
            var renderPath = this.options.chart.animations ? renderAnimatedPath : renderSimplePath;
            var renderMakers = this.options.line.marker.enable ? renderLineMarkers : $.noop;

            var path = layer.append('path')
                    .datum(nonNullData)
                    .attr('class', 'line ' + className);

            renderPath();
            renderMakers();
            renderTooltipTrackers();


            function renderAnimatedPath() {
                if(!nonNullData[0]) return ;
                path.attr('d', line(nonNullData[0]))
                    .transition().duration(600)
                        .attrTween('d', pathTween);
            }

            function renderSimplePath() {
                path.attr('d', line);

            }

            function renderLineMarkers() {
                layer.append('g').attr('class', 'line-chart-markers')
                    .selectAll('dot')
                        .data(nonNullData)
                    .enter().append('circle')
                        .attr('class', 'dot ' + className)
                        .attr('r', markerSize)
                        .attr('cx', x)
                        .attr('cy', y);

            }

            function renderTooltipTrackers(){
                var trackerSize = 10;
                // add the tooltip trackers regardless
                layer.append('g').attr('class', 'tooltip-trackers')
                    .selectAll('tooltip-tracker')
                        .data(nonNullData)
                    .enter().append('circle')
                        .attr('class', 'tooltip-tracker')
                        .attr('opacity', 0)
                        .attr('r', trackerSize)
                        .attr('cx', x)
                        .attr('cy', y);
            }

            function pathTween() {
                var _data = nonNullData;
                var interpolate = d3.scale.quantile().domain([0,1])
                        .range(d3.range(1, _data.length + 1));
                return function(t) {
                    return line(_data.slice(0, interpolate(t)));
                };
            }
        }

        return this;
    }

    render.defaults = defaults;

    Narwhal.export('line', render);

})('Narwhal', window.d3, window._, window.jQuery);

(function (window, undefined) {

    var defaults = {
        pie: {
            piePadding: 10,
            innerRadius: null,
            outerRadius: null
        }
    };

    function renderer(data, layer) {
        var w = this.options.chart.plotWidth, h = this.options.chart.plotHeight;
        var padding = this.options.pie.piePadding;
        var radius = this.options.pie.outerRadius || Math.min(w, h) / 2 - padding;
        var classFn = function (d, i) { return 'series arc tooltip-tracker s-' + (i+1) + ' ' + d.name; };
        var pieData = d3.layout.pie().value(function (d) { return d.y; });
        var arc = d3.svg.arc()
                    .outerRadius(radius)
                    .innerRadius(this.options.pie.innerRadius);

        if(data.length > 1) _.nw.warning('pie chart only supports 1 series at a time');
        _.each(data, renderSeries, this);

        function renderSeries(series) {
            var g = layer
                .append('svg:g')
                    .attr("transform", "translate(" + (radius + padding) + "," + (radius + padding) + ")");

            g.selectAll('.series')
                .data(pieData(series.data))
                .enter().append('path')
                    .attr('class', classFn)
                    .attr('d', arc);
        }
    }

    renderer.defaults = defaults;

    Narwhal.export('pie', renderer);

})(window);

(function (window, undefined) {

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
        var x = _.bind(function (d) { return this.xScale(d.x) + halfRangeBand; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);

        _.each(data, renderSeries);

        function renderSeries(series, index) {
            var seriesName = function () { return series.name + ' s-' + (index+1); };
            var g = layer.append('g')
                .attr('class', seriesName);

            g.selectAll('dot')
                .data(series.data)
                .enter().append('circle')
                    .attr('class', 'dot tooltip-tracker')
                    .attr('r', opt.radius)
                    .attr('cx', x)
                    .attr('cy', y);
        }
    }

    ScatterPlot.defaults = defaults;
    Narwhal.export('scatter', ScatterPlot);


})(window);

Narwhal.export('stackTooltip', function (data, layer, options) {

    var valueFormatter = this.yAxis().tickFormat();
    var tooltip = $(options.stackTooltip.el);

    tooltip.addClass('stack-tooltip');

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
        tooltip.html(text).show();
    };

    var onMouseOut = function (/* datum */) {
        tooltip.html('');
    };

    this.svg.selectAll('.tooltip-tracker')
        .on('mouseover.tooltip', onMouseOver.bind(this))
        .on('mouseout.tooltip',  onMouseOut.bind(this));
});

(function () {
    var defaults = {
        tooltip: {
            animate: true,
            visibleOpacity: 0.75,
            showTime: 300,
            hideTime: 500
        }
    };

    function render(data, layer) {

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

        var positionTooltip = function (ev) {
            return { x: ev.pageX + 10, y: ev.pageY - 10 };
        };

        var onMouseOver = function (d) {
            var ev = d3.event;
            var pos = positionTooltip(ev);

            show.call(this, d, pos);
        };

        var onMouseOut = function () {
            changeOpacity.call(this, 0, this.options.tooltip.hideTime);
        };

        var getTooltipText = function (d) {
            if(this.options.tooltip.formatter) return this.options.tooltip.formatter.call(this, d);

            return  'x: ' + d.x + '<br>' + 'y: ' + d.y;
        };

        var show = function (d, pos) {
            clearHideTimer.call(this);
            var text = getTooltipText.call(this, d);

            this.tooltipElement.select('.text').html(text);

            this.tooltipElement
                .style('top', pos.y + 'px')
                .style('left', pos.x + 'px');

            changeOpacity.call(this, this.options.tooltip.visibleOpacity, this.options.tooltip.showTime);
        };

        this.tooltipElement = this.container
            .append('div');

        this.tooltipElement
            .attr('class', 'nw-tooltip')
            .style('opacity', 0)
            .append('div')
                .attr('class', 'text');

        this.svg.selectAll('.tooltip-tracker')
            .on('mouseover.tooltip', onMouseOver.bind(this))
            .on('mouseout.tooltip',  onMouseOut.bind(this));
    }

    render.defaults = defaults;

    Narwhal.export('tooltip', render);


})();



(function (ns, d3, _, $, undefined) {

    function Csv(raw, headerRow) {
        headerRow = typeof headerRow === 'undefined' ? true : headerRow;
        this.parse(raw, headerRow);

        this._dimension = 0;

        return this;
    }

    Csv.prototype = {
        parse: function (raw, headerRow) {
            this._data = [];
            this._headers = [];
            if (!raw || !raw.length) return ;
            var rows = raw.split(/\n\r?/);
            this._headers = headerRow ? _.each(rows.shift().split(','), function(d) { return d.toLowerCase(); }) : _.range(0, rows[0].length);
            _.each(rows, function (r) {
                this._data.push(r.split(','));
            }, this);
        },

        dimension: function (_) {
            if(!arguments.length) return this._headers[this._dimension];
            this._dimension = this._headers.indexOf(_.toLowerCase());
            return this;
        },

        measure: function (_) {
            return this.data(_.toLowerCase());
        },

        data: function (measure) {
            var dimIndex = this._dimension;
            var measureIndex = this._headers.indexOf(measure);
            var result = _.map(this._data, function (d) {
                return {
                    x: d[dimIndex],
                    y: _.isNaN(+d[measureIndex]) ? d[measureIndex] : +d[measureIndex]
                };
            });

            return result;
        }
    };

    Narwhal.connectors = Narwhal.connectors || {};
    Narwhal.connectors.Csv = Csv;

})('Narwhal', window.d3, window._, window.jQuery);
