(function (ns, d3, _, $, undefined) {

    var defaults = {
        chart: {
            padding: {
                top: 3,
                bottom: 25,
                left: 40,
                right: 3
            }
        },

        xAxis: {
            rangePadding: 0,
            innerTickSize: 0,
            outerTickSize: 0,
            tickPadding: 6,
            titlePadding: 0,
            firstAndLast: true
        },

        yAxis: {
            min: 0,
            max: undefined,
            smartAxis: true,
            innerTickSize: 6,
            outerTickSize: 6,
            tickPadding: 4,
            titlePadding: 0,
            labels: {
                format: 's' // d3 formats
            }
        }
    };




    function niceRound(val) {
        return Math.ceil(val * 1.10);
        var digits = Math.floor(Math.log(val) / Math.LN10) + 1;
        var fac = Math.pow(10, digits);

        if(val < 1) return _.nw.roundToNearest(val, 1);

        if(val < fac / 2) return _.nw.roundToNearest(val, fac / 2);

        return _.nw.roundToNearest(val, fac);
    }

    function extractScaleDomain(domain, min, max) {
        var dataMax = _.max(domain);
        var dataMin = _.min(domain);

        if (min === undefined && max === undefined) {
            return [dataMin, dataMax];
        }

        if (min === undefined) {
            return [Math.min(dataMin, max), max];
        }

        if (max === undefined) {
            return [min, Math.max(min, dataMax)];
        }

        return [min, max];
    }

    var cartesian = {
        dataSrc: [],

        init: function (options) {

            this.options = $.extend(true, {}, defaults, options);

            if(this.options.xAxis.title || this.options.yAxis.title) {
                this.titleOneEm = Narwhal.utils.textBounds('ABCD', 'axis-title').height;
                if(this.options.xAxis.title) {
                    this.options.chart.padding.bottom += this.titleOneEm; // should be 1em
                }

                if(this.options.yAxis.title) {
                    this.options.chart.padding.left += this.titleOneEm; // should be 1em
                }
            }


            return this;
        },

        computeXScale: function () {
            if (!this.xDomain) throw new Error('You are trying to render without setting data (xDomain).');

            this.scaleGenerator = _.nw.xScaleFactory(this.dataSrc, this.options);
            this.xScale = this.scaleGenerator.scale(this.xDomain);
            this.rangeBand = this.scaleGenerator.rangeBand();
        },

        computeYScale: function () {
            if (!this.yDomain) throw new Error('You are trying to render without setting data (yDomain).');
            var yScaleDomain = extractScaleDomain(this.yDomain, this.options.yAxis.min, this.options.yAxis.max);

            this.yScale = d3.scale.linear()
                .domain(yScaleDomain)
                .range([this.options.chart.plotHeight, 0]);
        },

        computeScales: function () {
            this.adjustDomain();
            this.computeXScale();
            this.computeYScale();

            return this;
        },

        xAxis: function () {
            var y = this.options.chart.plotHeight + this.options.chart.padding.top;
            var xAxis = this.scaleGenerator.axis().orient('bottom');

            this._xAxisGroup = this.svg
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + y + ')')
                .call(xAxis);

            this.scaleGenerator.postProcessAxis(this._xAxisGroup);

            return this;
        },

        yAxis: function () {
            var options = this.options.yAxis;
            var tickValues = this._extractYTickValues(this.yDomain, options.min, options.max);
            var numTicks = this._numYTicks(this.yDomain, options.min, options.max);
            var format = d3.format(options.labels.format);
            var yAxis = d3.svg.axis()
                .scale(this.yScale)
                .ticks(numTicks)
                .tickValues(tickValues)
                .tickFormat(format)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .orient('left');

            this._yAxisGroup = this.svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')');

            this._yAxisGroup.call(yAxis)
                .selectAll('text')
                    .attr('dy', '.9em');

            return this;
        },

        axisLabels: function () {
            var lineHeightAdjustment = this.titleOneEm * 0.25; // add 25% of font-size for a complete line-height

            if (this.options.xAxis.title) {
                this._xAxisGroup.append('text')
                    .attr('class', 'x axis-title')
                    .attr('text-anchor', 'end')
                    .attr('y', this.options.chart.padding.bottom - lineHeightAdjustment)
                    .attr('dx', this.options.chart.plotWidth)
                    .attr('dy', -this.options.xAxis.titlePadding)
                    .text(this.options.xAxis.title);
            }

            if (this.options.yAxis.title) {
                this._yAxisGroup.append('text')
                    .attr('class', 'y axis-title')
                    .attr('text-anchor', 'end')
                    .attr('transform', 'rotate(-90)')
                    .attr('y', -this.options.chart.padding.left + this.titleOneEm - lineHeightAdjustment)
                    .attr('dx', 0)
                    .attr('dy', this.options.yAxis.titlePadding)
                    .text(this.options.yAxis.title);
            }

        },

        render: function () {
            this.composeOptions();

            this.calcMetrics();

            this.computeScales();

            this.baseRender();

            this.xAxis()
                .yAxis()
                .axisLabels();

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

        getYAxisDataMax: function (datums) {
            return Math.max(this.yMax || 0, _.max(_.pluck(datums, 'y')));
        },

        getYAxisDataMin: function (datums) {
            return Math.min(this.yMin || 0, _.min(_.pluck(datums, 'y')));
        },

        extractXDomain: function(datums) {
            return  this.options.xAxis.categories ? this.options.xAxis.categories : _.pluck(datums, 'x');
        },

        extractYDomain: function (datums) {
            var max = this.yDomain ? Math.max(this.yDomain[1], _.max(_.pluck(datums, 'y'))) : _.max(_.pluck(datums, 'y'));
            var min = this.yDomain ? Math.min(this.yDomain[0], _.min(_.pluck(datums, 'y'))) : _.min(_.pluck(datums, 'y'));

            return [min, max];
        },

        adjustDomain: function () {
            this.yDomain = this.yDomain ? [this.yDomain[0], niceRound(this.yDomain[1])] : [0, 10];
            this.xDomain = this.xDomain ? this.xDomain : [];
        },

        _extractYTickValues: function (domain, min, max) {

            function smartAxisValues() {
                var adjustedDomain = _.nw.merge(domain, this.yMax);

                if (min === undefined && max === undefined)
                    return adjustedDomain;

                if (min === undefined) {
                    return max > this.yMin ? _.nw.merge([max], adjustedDomain) : [max];
                }

                if (max === undefined) {
                    if (min >= this.yMax) return [min];
                    adjustedDomain[0] = min;

                    return adjustedDomain;
                }

                return _.nw.merge([min, max], this.yMax);
            }

            return this.options.yAxis.smartAxis ? smartAxisValues.call(this) : undefined;
        },

        _numYTicks: function (domain, min, max) {
            function regularAxisisValues() {
                var dmin = typeof min !== 'undefined' ? min : d3.min(domain);
                var dmax = typeof max !== 'undefined' ? max : d3.max(domain);
                var span = dmax - dmin;
                if (span < 10) return span;

                return Math.ceil(span / 10);
            }

            return this.options.yAxis.smartAxis ? 3 : regularAxisisValues.call();
        }

    };

    window[ns].prototype.expose('cartesian', cartesian);

})('Narwhal', window.d3, window._, window.jQuery);
