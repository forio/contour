(function (ns, d3, _, $, undefined) {

    var defaults = {
        chart: {
            padding: {
                top: 3,
                bottom: 20,
                left: 25,
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
            min: undefined,
            max: undefined,
            innerTickSize: 0,
            outerTickSize: 6,
            tickPadding: 8,
            titlePadding: 0,
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
            return d3.extent(domain);

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
            return {
                y: _.isObject(d) ? d.y : d,
                x: _.isObject(d) ? d.x : this.options.xAxis.categories ? this.options.xAxis.categories[index] : index
            };
        },

        data: function (series) {

            if (series instanceof Array && !series[0].data) {
                var datums = _.map(series, _.bind(this.datum, this));
                this.dataSrc = datums;

                // this has to be the same for all series?
                this.xDomain = this.options.xAxis.categories ? this.options.xAxis.categories : _.pluck(datums, 'x');

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
