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
            }
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

            // if we are not using smartAxis we use d3's nice() domain
            if (!this.options.yAxis.smartAxis)
                this.yScale.nice();
        },

        setYDomain: function (domain) {
            this.yScale.domain(domain).nice();
        },

        redrawYAxis: function () {
            // var t = this.svg.transition().duration(750);
            d3.select(".y.axis").call(this.yAxis());
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
