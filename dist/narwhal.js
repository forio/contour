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
        }
    };

    function Narwhal(options) {
        this.init(options);
        return this;
    }

    Narwhal.export = function (ctorName, ctor) {

        if (typeof ctor !== 'function') throw new Error('Invalid constructor for ' + ctorName + ' visualization');

        Narwhal.prototype[ctorName] = ctor;
        // Narwhal.prototype[ctorName] = function () {
        //     // this.visualizations.add(renderer);
        //     return ctor.apply(this, arguments);
        // };
    };

    Narwhal.utils = {
        // measure text inside a narwhal chart container
        textBounds: function (text, css) {
            var body = document.getElementsByTagName('body')[0];
            var wrapper = document.createElement('span');
            var dummy = document.createElement('span');
            wrapper.className = 'narwhal-chart';
            dummy.style.position = 'absolute';
            dummy.style.left =  -9999;
            dummy.innerHTML = text;
            dummy.className = css;
            wrapper.appendChild(dummy);
            body.appendChild(wrapper);
            var res = { width: dummy.clientWidth, height: dummy.clientHeight };
            dummy.remove();
            wrapper.remove();
            return res;
        }
    };

    Narwhal.prototype = _.extend(Narwhal.prototype, {

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

            options.chart.width = options.chart.width || this.calculateWidth();
            options.chart.height = options.chart.height || this.calculateHeight();

            this.options = $.extend(true, options, {
                chart: {
                    plotWidth: options.chart.width - options.chart.margin.left - options.chart.margin.right - options.chart.padding.left - options.chart.padding.right,
                    plotHeight: options.chart.height - options.chart.margin.top - options.chart.margin.bottom - options.chart.padding.top - options.chart.padding.bottom
                }
            });
        },

        composeOptions: function () {
            // compise the final list of options right before start rendering
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
                    .attr('width', chartOpt.width)
                    .attr('height', chartOpt.height)
                    .attr('class', 'narwhal-chart')
                .append('g')
                    .attr('transform', 'translate(' + chartOpt.margin.left + ',' + chartOpt.margin.top + ')');

            return this;
        },

        renderVisualizations: function () {
            _.each(this.visualizations, function (visualization, index) {
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

                if(functionality.init) functionality.init.call(this, this.options);

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
        chart: {
            padding: {
                top: 10,
                bottom: 20,
                left: 20,
                right: 2
            }
        },

        xAxis: {
            rangePadding: 0,
            innerTickSize: 0,
            outerTickSize: 0,
            tickPadding: 8,
            titlePadding: 6
        },

        yAxis: {
            min: undefined,
            max: undefined,
            innerTickSize: 0,
            outerTickSize: 6,
            tickPadding: 8,
            titlePadding: 10,
            labels: {
                format: '.0f' // d3 formats
            }
        }
    };

    function merge(array1, array2) {
        if(!array1 || !array1.length) return array2;
        if(!array2 || !array2.length) return array1;

        return [].concat(array1, array2).sort(function (a,b) { return a-b; });
    }

    function extractTickValues(domain, min, max) {
        if (min === undefined && max === undefined)
            return domain;

        if (min === undefined) {
            return max > domain[0] ? merge([max], domain) : [max];
        }

        if (max === undefined) {
            return min < domain[domain.length-1] ? merge([min], domain) : [min];
        }

        return merge([min, max], domain);
    }

    function extractScaleDomain(domain, min, max) {
        if (min === undefined && max === undefined)
            return domain;

        if (min === undefined) {
            return [Math.min(domain[0], max), max];
        }

        if (max === undefined) {
            return [min, Math.max(min, domain[domain.length-1])];
        }

        return [min, max];
    }

    var cartesian = {

        init: function (options) {

            this.options = $.extend(true, {}, defaults, options);

            if(this.options.xAxis.title || this.options.yAxis.title) {
                var oneEm = Narwhal.utils.textBounds('ABCD', 'axis-title').height;
                if(this.options.xAxis.title) {
                    this.options.chart.padding.bottom += oneEm; // should be 1em
                }

                if(this.options.yAxis.title) {
                    this.options.chart.padding.left += oneEm; // should be 1em
                }
            }
            // // adjust padding to fit the axis
            // this.options.chart.padding.bottom = 25;
            // this.options.chart.padding.left = 50;
            // this.options.chart.padding.top = 10;
            // this.options.chart.padding.right = 10;


            return this;
        },

        computeXScale: function () {
            if (!this.xDomain) throw new Error('You are trying to render without setting data (xDomain).');

            var xScaleDomain = extractScaleDomain(this.xDomain, this.options.xAxis.min, this.options.xAxis.max);

            this.xScale = d3.scale.ordinal()
                .domain(xScaleDomain)
                .rangePoints([0, this.options.chart.plotWidth]);

            this.rangeBand = this.xScale.rangeBand();
        },

        computeYScale: function () {
            if (!this.yDomain) throw new Error('You are trying to render without setting data (yDomain).');
            var yScaleDomain = extractScaleDomain(this.yDomain, this.options.yAxis.min, this.options.yAxis.max);

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
            var options = this.options.xAxis;
            var xAxis = d3.svg.axis()
                .scale(this.xScale)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .orient('bottom');

            this.svg
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + y + ')')
                .call(xAxis)
                .select('text')
                    .attr('text-anchor', 'start')
                .select('text:last-child')
                    .attr('text-anchor', 'end')
                    ;

            return this;
        },

        yAxis: function () {
            var options = this.options.yAxis;
            var tickValues = extractTickValues(this.yDomain, options.min, options.max);
            var format = d3.format(options.labels.format);
            var yAxis = d3.svg.axis()
                .scale(this.yScale)
                .tickValues(tickValues)
                .tickFormat(format)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .orient('left');

            this.svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')')
                .call(yAxis)
                .selectAll('text')
                    .attr('dy', '.9em');

            return this;
        },

        axisLabels: function () {
            if (this.options.xAxis.title) {
                this.svg.append('text')
                    .attr('class', 'x axis-title')
                    .attr('text-anchor', 'end')
                    .attr('x', this.options.chart.width)
                    .attr('y', this.options.chart.height)
                    .attr('dx', -this.options.chart.padding.right)
                    .attr('dy', -this.options.xAxis.titlePadding)
                    .text(this.options.xAxis.title);
            }

            if (this.options.yAxis.title) {
                this.svg.append('text')
                    .attr('class', 'y axis-title')
                    .attr('text-anchor', 'end')
                    .attr('transform', 'rotate(-90)')
                    .attr('x', 0)
                    .attr('y', '1em')
                    .attr('dx', -this.options.yAxis.titlePadding)
                    .attr('dy', 0)
                    .text(this.options.yAxis.title);
            }

        },

        render: function () {
            this.composeOptions();

            this.calcMetrics();

            this.computeScales();

            this.baseRender();

            this.renderVisualizations();

            this.xAxis()
                .yAxis()
                .axisLabels();

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
                var min = this.yDomain ? Math.max(this.yDomain[0], _.min(_.pluck(datums, 'y'))) : _.min(_.pluck(datums, 'y'));
                this.yDomain = [min, max];
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
                    appendPath.call(this, set, d.name);
                }, this);
            } else {
                appendPath.call(this, _.map(data, this.datum));
            }

            function appendPath(data, seriesName) {
                seriesName = seriesName || 'not-specified';
                className = seriesName.replace(' ', '_');
                g.append('path')
                    .datum(data)
                    .attr('class', 'line series-' + className)
                    .attr('d', line);

                if (this.options.line.marker.enable) {
                    g.append('g').attr('class', 'line-chart-markers')
                        .selectAll('dot')
                            .data(data)
                        .enter().append('circle')
                            .attr('class', 'dot tooltip-tracker series-' + className)
                            .attr('r', 3)
                            .attr('cx', x)
                            .attr('cy', y);
                }
            }

            return this;
        };

        this.visualizations.push(renderer);

        return this;
    }

    Narwhal.export('line', ctor);

})('Narwhal', window.d3, window._, window.jQuery);
