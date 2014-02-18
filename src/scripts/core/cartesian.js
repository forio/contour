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
            type: null, // defaults is ordinal (needs to be null here so overrides work)
            innerTickSize: 6,
            outerTickSize: 0,
            tickPadding: 6,
            maxTicks: undefined,
            title: undefined,
            titlePadding: 4,
            /* padding between ranges (ie. columns) expressed in percentage of rangeBand width */
            innerRangePadding: 0.1,
            /* padding between all ranges (ie. columns) and the axis (left & right) expressed in percentage of rangeBand width */
            outerRangePadding: 0.1,
            firstAndLast: false,
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
                var yScaleDomain = _.nw.extractScaleDomain(this.yDomain, this.options.yAxis.min || absMin, this.options.yAxis.max);

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
