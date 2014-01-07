(function () {

    var defaults = {
        chart: {
            gridlines: 'none',
            padding: {
                top: 6,

                // bottom: 25,
                // left: 0,
                right: 5
            }
        },

        xAxis: {
            /* type of axis {ordinal|linear|time} */
            // type: 'ordinal',
            rangePadding: 0,
            innerTickSize: 0,
            outerTickSize: 0,
            tickPadding: 6,
            titlePadding: 4,
            /* padding between ranges (ie. columns) expressed in percentage of rangeBand width */
            innerRangePadding: 0.1,
            /* padding between all ranges (ie. columns) and the axis (left & right) expressed in percentage of rangeBand width */
            outerRangePadding: 0.1,
            firstAndLast: true,
            orient: 'bottom',
            labels: {
                // format: 'd'
            },
            linearDomain: false,     // specify if a time domain should be treated linearly or ....
        },

        yAxis: {
            /* @param: {linear|smart|log} */
            // type: 'smart',
            min: 0,
            max: undefined,
            smartAxis: true,
            innerTickSize: 6,
            outerTickSize: 6,
            tickPadding: 4,
            titlePadding: 4,
            nicing: true,
            orient: 'left',
            labels: {
                align: 'middle',
                format: 's' // d3 formats
                // formatter

            }
        }
    };

    /**
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

            this.options = _.merge({}, defaults, options);

            if (!this.options.xAxis.firstAndLast) {
                this.options.chart.padding.right += 15;
            }

            return this;
        },

        adjustPadding: function () {
            var options = this.options.yAxis;
            var yLabels = _.nw.extractScaleDomain(this.yDomain.slice().concat([_.nw.niceRound(this.yDomain[1])]), options.min, options.max);
            var format = options.labels.formatter || d3.format(options.labels.format || ',.0f');
            var yAxisText = _.map(yLabels, format).join('<br>');
            var yLabelBounds = _.nw.textBounds(yAxisText, '.y.axis');
            var xLabelBounds = _.nw.textBounds('jgitlhHJKQWE', '.x.axis');
            var maxTickSize = function (options) { return Math.max(options.outerTickSize || 0, options.innerTickSize || 0); };

            this.options.chart.padding.left = this.options.chart.padding.left ||  maxTickSize(this.options.yAxis) + (this.options.yAxis.tickPadding || 0) + yLabelBounds.width;
            this.options.chart.padding.bottom = this.options.chart.padding.bottom ||maxTickSize(this.options.xAxis) + (this.options.xAxis.tickPadding || 0) + xLabelBounds.height;
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

            this.xScaleGenerator = _.nw.xScaleFactory(this.dataSrc, this.options);
            this.xScale = this.xScaleGenerator.scale(this.xDomain);
            this.rangeBand = this.xScaleGenerator.rangeBand();
        },

        computeYScale: function () {
            if (!this.yDomain) throw new Error('You are trying to render without setting data (yDomain).');

            var yScaleDomain = _.nw.extractScaleDomain(this.yDomain, this.options.yAxis.min, this.options.yAxis.max);
            this.yScaleGenerator = _.nw.yScaleFactory(this.dataSrc, this.options, this.yMin, this.yMax);
            this.yScale = this.yScaleGenerator.scale(yScaleDomain);
        },

        /**
        * Provides a scaling function based on the xAxis values.
        *
        * Example:
        *
        *     var scaledValue = this.xScale(100);
        *
        * @function this.xScale()
        * @param {Number|String} value The value to be scaled
        * @return {Number} The scaled value according to the current xAxis settings
        */
        xScale: function(val) { return val; },

        /**
        * Provides a scaling function based on the xAxis values.
        *
        * Example:
        *
        *     var scaledValue = this.xScale(100);
        *
        * @function this.yScale()
        * @param {Number} value The value to be scaled
        * @return {Number} The scaled value according to the current yAxis settings
        */
        yScale: function(val) { return val; },

        /**
        * Modifies the domain for the y axis.
        *
        * Example:
        *
        *     this.setYDomain([100, 200]);
        *
        * @param {Array} domain The domain array represeting the min and max values of to be visible in the y Axis
        */
        setYDomain: function (domain) {
            this.yScaleGenerator.setDomain(domain);
        },

        /**
        * Redraws the yAxis with the new settings and domain
        *
        * Example:
        *
        *     this.redrawYAxis(;
        *
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

        xAxis: function () {
            return this.xScaleGenerator.axis().orient(this.options.xAxis.orient);
        },

        yAxis: function () {
            return this.yScaleGenerator.axis().orient(this.options.yAxis.orient);
        },

        renderXAxis: function () {
            var xAxis = this.xAxis();
            var y = this.options.chart.plotHeight + this.options.chart.padding.top;
            this._xAxisGroup = this.svg
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + y + ')')
                .call(xAxis);

            this.xScaleGenerator.postProcessAxis(this._xAxisGroup);

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

                // remove previous lines (TODO: we need a better way)
                this._yAxisGroup.select('g.grid-lines').remove();
                gr = this._yAxisGroup
                    .append('svg:g')
                    .attr('class', 'grid-lines');

                ticks = getYTicks(this.yAxis(), this.options.yAxis.smartAxis);
                var w = this.options.chart.plotWidth;

                gr.selectAll('.grid-line')
                    .data(ticks)
                    .enter().append('line')
                        .attr('class', 'grid-line')
                        .attr('x1', 0)
                        .attr('x2', w)
                        .attr('y1', y)
                        .attr('y2', y);
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
                this.yDomain = this.options.chart.stacked ? this.extractYStackedDomain(this.dataSrc) : this.extractYDomain(this.dataSrc);
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
            this.yDomain = this.yDomain ? this.yDomain : [0, 10];
            this.xDomain = this.xDomain ? this.xDomain : [];
        }
    };

    Narwhal.expose('cartesian', cartesian);

})();
