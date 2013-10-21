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
