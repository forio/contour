(function (ns, d3, _, $, undefined) {

    var defaults = {
        chart: {
            defaultWidth: 400,      // by default take the size of the parent container
            defaultAspect: 1 / 1.61803398875,       // height = width * ratio
            width: undefined, // calculated at render time based on the options & container
            height: undefined,  // if defined, height takes precedence over aspect
            /* margin between the container and the chart (ie labels or axis title) */
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            /* padding between the chart area and the inner plot area */
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },
        visualizations: []
    };

    function Narwhal(options) {
        this.init(options);
        return this;
    }

    Narwhal.export = function (ctorName, ctor) {

        if (typeof ctor !== 'function') throw new Error('Invalid constructor for ' + ctorName + ' visualization');

        Narwhal.prototype[ctorName] = ctor;
    };

    Narwhal.prototype = _.extend(Narwhal.prototype, {

        init: function (options) {
            this.options = $.extend(true, {}, defaults, options);

            this.calcMetrics();

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

            options.chart.width = options.chart.width || this.calculateWidth();
            options.chart.height = options.chart.height || this.calculateHeight();

            this.options = $.extend(true, options, {
                chart: {
                    plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.padding.left - options.chart.padding.right,
                    plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.padding.bottom
                }
            });
        },

        baseRender: function () {
            this.plotArea();

            return this;
        },

        render: function () {
            this.baseRender();

            this.renderVisualizations();

            return this;
        },

        plotArea: function () {

            var chartOpt = this.options.chart;

            this.container = d3.select(this.options.el);

            this.svg = this.container
                .append('svg')
                    .attr('width', chartOpt.width)
                    .attr('height', chartOpt.height)
                    .attr('class', 'narwhal-chart')
                .append('g')
                    .attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');

            return this;
        },

        renderVisualizations: function () {
            _.each(this.options.visualizations, function (visualization, index) {
                visualization.id = index + 1;
                visualization.call(this, this.svg);
            }, this);

            return this;
        },

        expose: function (ctorName, functionality) {
            var ctorObj = {};
            var ctor = function () {
                // extend the --instance-- we don't want all charts to be overriten...
                _.extend(this, _.omit(functionality, 'init'));

                if(functionality.init) functionality.init.call(this);

                return this;
            };

            ctorObj[ctorName] = ctor;

            _.extend(this, ctorObj);

            return this;
        },

        compose: function(ctorName, funcArray) {
            // compose differnt functional objects into this instance...
            // this way we can do something like new Narwhal().BarChart(...) and it includes
            // cartesia, xAxis, yAxis, tooltip, highliter, etc...
        }

    });

    window[ns] = Narwhal;

})('Narwhal', window.d3, window._, window.jQuery);

(function (ns, d3, _, $, undefined) {

    var defaults = {
        xAxis: {
            rangePadding: 0,

            max: undefined
        }
    };

    function merge(array1, array2) {
        if(!array1 || !array1.length) return array2;
        if(!array2 || !array2.length) return array1;

        return [].concat(array1, array2).sort(function (a,b) { return a-b; });
    }


    var cartesian = {

        init: function (options) {
            _.extend(this.options, defaults, options);

            // adjust padding to fit the axis
            this.options.chart.padding.bottom = 25;
            this.options.chart.padding.left = 50;
            this.options.chart.padding.top = 10;
            this.options.chart.padding.right = 10;

            this.calcMetrics();

            return this;
        },

        computeXScale: function () {
            if (!this.xDomain) throw new Error('You are trying to render without setting data (xDomain).');

            this.xScale = d3.scale.ordinal()
                .domain(this.xDomain)
                .rangePoints([0, this.options.chart.plotWidth]);

            this.rangeBand = this.xScale.rangeBand();
        },

        computeYScale: function () {
            if (!this.yDomain) throw new Error('You are trying to render without setting data (yDomain).');

            var yScaleDomain = this.options.xAxis.max ? [0, this.options.xAxis.max] : this.yDomain;

            this.yScale = d3.scale.linear()
                .domain(yScaleDomain)
                .range([this.options.chart.plotHeight, 0]);
        },

        computeScales: function () {
            this.computeXScale();
            this.computeYScale();

            return this;
        },

        xAxis: function () {
            var y = this.options.chart.plotHeight + this.options.chart.padding.top;
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .orient('bottom');

            this.svg
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + y + ')')
                .call(xAxis);

            return this;
        },

        yAxis: function () {
            var tickValues = this.options.xAxis.max ? merge([this.options.xAxis.max], this.yDomain) : this.yDomain;
            var format = d3.format('.3s');
            var yAxis = d3.svg.axis()
                .scale(this.yScale)
                .tickValues(tickValues)
                .tickFormat(format)
                .orient('left');

            this.svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')')
                .call(yAxis);

            return this;
        },

        render: function () {
            this.computeScales();

            this.baseRender();

            this.renderVisualizations();

            this.xAxis()
                .yAxis();

            return this;
        },

        datum: function (d, index) {
            return {
                y: _.isObject(d) ? d.y : d,
                x: _.isObject(d) ? d.x : index
            };
        },

        data: function (series) {

            if (series instanceof Array && !series[0].data) {
                var datums = _.map(series, this.datum);
                this.dataSrc = datums;

                // this has to be the same for all series?
                this.xDomain = _.pluck(datums, 'x');

                var max = this.yDomain ? Math.max(this.yDomain[1], _.max(_.pluck(datums, 'y'))) : _.max(_.pluck(datums, 'y'));
                this.yDomain = [0, max];
            } else if (series instanceof Array && series[0].data) {
                // we have an array of series
                _.each(series, function (set) { this.data(set.data); }, this);
            }

            return this;
        }
    };

    window[ns].prototype.expose('cartesian', cartesian);

})('Narwhal', window.d3, window._, window.jQuery);

(function (ns, d3, _, $, undefined) {

    var defaults = {
        line: {
            marker: {
                enable: true,
            }
        }
    };

    function ctor(data, options) {

        $.extend(true, this.options, defaults, { line: options });

        this.data(data);

        var renderer = function (svg, series) {
            var x = _.bind(function (d) { return this.xScale(d.x) + this.rangeBand / 2; }, this);
            var y = _.bind(function (d) { return this.yScale(d.y); }, this);

            var line = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function (d) { return y(d); });

            var g = svg.append('g')
                .attr('vis-id', renderer.id)
                .attr('type', 'line-chart')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')');

            if(data[0].data) {
                _.each(data, function (d) {
                    var set = _.map(d.data, this.datum, this);
                    appendPath.call(this, set, this);
                }, this);
            } else {
                appendPath.call(this, this.datum(data));
            }

            function appendPath(data) {
                g.append('path')
                    .datum(data)
                    .attr('class', 'line')
                    .attr('d', line);

                if (this.options.line.marker.enable) {
                    g.append('g').attr('class', 'line-chart-markers')
                        .selectAll('dot')
                            .data(data)
                        .enter().append('circle')
                            .attr('class', 'dot tooltip-tracker')
                            .attr('r', 3)
                            .attr('cx', x)
                            .attr('cy', y);
                }
            }

            return this;
        };

        this.options.visualizations.push(renderer);

        return this;
    }

    Narwhal.export('line', ctor);

})('Narwhal', window.d3, window._, window.jQuery);
