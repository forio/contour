(function () {
    /*jshint eqnull:true */
    var defaults = {
        chart: {
            gridlines: 'none',
            padding: {
                top: 6,
                right: undefined,
                // this get's defined based on the axis & title
                bottom: undefined,
                // this get's defined based on the axis & title
                left: undefined
            }
        },

        xAxis: {
            // type of axis {ordinal|linear|time}
            type: null, // default is linear in line.js (needs to be null here so overrides work)
            categories: undefined,
            max: undefined,
            min: undefined,
            innerTickSize: 6,
            outerTickSize: 0,
            tickPadding: 6,
            maxTicks: undefined,
            ticks: undefined,
            tickValues: undefined,
            title: undefined,
            titlePadding: 4,
            // padding between ranges (ie. columns) expressed in percentage of rangeBand width
            innerRangePadding: 0.1,
            // padding between all ranges (ie. columns) and the axis (left & right) expressed in percentage of rangeBand width
            outerRangePadding: 0.1,
            firstAndLast: false,
            orient: 'bottom',
            labels: {
                format: undefined,
                formatter: undefined
            },
            linearDomain: false,     // specify if a time domain should be treated linearly or ....
        },

        yAxis: {
            // @param: {linear|smart|log}
            // type: 'smart',
            min: undefined,
            max: undefined,
            zeroAnchor: true,
            smartAxis: false,
            innerTickSize: 6,
            outerTickSize: 6,
            tickPadding: 4,
            tickValues: undefined,
            ticks: undefined,
            title: undefined,
            titlePadding: 4,
            orient: 'left',
            series: 'all', //valid values are 'all' or an array of strings
            labels: {
                // top, middle, bottom
                verticalAlign: 'middle',
                format: 's', // d3 formats
                formatter: undefined // a function that formats each value ie. function (datum) { return 'x: ' + datum.x + ', y:' + datum.y }
            }
        },

        rightYAxis: {
             // @param: {linear|smart|log}
            // type: 'smart',
            min: undefined,
            max: undefined,
            zeroAnchor: true,
            smartAxis: false,
            innerTickSize: 6,
            outerTickSize: 6,
            tickPadding: 4,
            tickValues: undefined,
            ticks: undefined,
            title: undefined,
            titlePadding: 4,
            orient: 'right',
            series: [], //valid values are 'all' or an array of strings
            labels: {
                // top, middle, bottom
                verticalAlign: 'middle',
                format: 's', // d3 formats
                formatter: undefined // a function that formats each value ie. function (datum) { return 'x: ' + datum.x + ', y:' + datum.y }
            }
        }
    };


    /**
    * Provides a Cartesian frame to the Contour instance.
    *
    * This is required for all visualizations displayed in a Cartesian frame, for example line charts, bar charts, area charts, etc. It is not required otherwise; for instance, pie charts do not use a Cartesian frame.
    *
    * ###Example:
    *
    *     new Contour(options)
    *           .cartesian();
    *
    * @name cartesian
    */
    var cartesian = function () {
        return {
            dataSrc: [],

            init: function (options) {

                // readonly properties (ie. user cannot modify)
                var readOnlyProps = {
                    chart: {
                        rotatedFrame: false,
                        internalPadding: {
                            bottom: undefined,
                            left: undefined
                        }
                    }
                };

                this.options = options || {};

                _.merge(this.options, readOnlyProps);

                var extraPadding = {};

                if ((!this.options.xAxis || !this.options.xAxis.firstAndLast) && !this._axisVisible(this.options.rightYAxis)) {
                    extraPadding = { chart : { padding: { right: 15 }}};
                }

                this._extraOptions.push(_.merge({}, defaults, extraPadding));

                return this;
            },

            xDomain: [],
            yDomain: [],
            rightYDomain: [],

            _getYScaledDomainForAxis: function (axis, domain) {
                var absMin = axis.zeroAnchor && domain && domain[0] > 0 ? 0 : undefined;
                var min = axis.min != null ? axis.min : absMin;

                if (axis.tickValues) {
                    if (axis.min != null && axis.max != null) {
                        return [axis.min, axis.max];
                    } else if (axis.min != null) {
                        return [axis.min, d3.max(axis.zeroAnchor ? [0].concat(axis.tickValues) : axis.tickValues)];
                    } else if (axis.max != null) {
                        return [d3.min(axis.zeroAnchor ? [0].concat(axis.tickValues) : axis.tickValues), axis.max];
                    } else {
                        return d3.extent(axis.zeroAnchor || axis.min != null ? [min].concat(axis.tickValues) : axis.tickValues);
                    }
                } else if (axis.smartAxis) {
                    return d3.extent(axis.zeroAnchor || axis.min != null ? [min].concat(domain) : domain);
                }

                return _.nw.extractScaleDomain(domain, min, axis.max, axis.ticks);
            },

            _getYScaledDomain: function() {
                return this._getYScaledDomainForAxis(this.options.yAxis, this.yDomain);
            },

            _getRightYScaledDomain: function() {
                return this._getYScaledDomainForAxis(this.options.rightYAxis, this.rightYDomain);
            },

             _axisVisible: function(axisConfig) {
                return axisConfig && (axisConfig.series == 'all' || axisConfig.series.length > 0);
            },

            _seriesEq: function(seriesA, seriesB) {
                if (seriesA.name != seriesB.name || seriesA.data.length != seriesB.data.length)
                    return false;

                for (var i=0; i < seriesA.data.length; ++i) {
                    if (seriesA.data[i].x != seriesB.data[i].x ||
                        seriesA.data[i].y != seriesB.data[i].y) {
                       return false;
                    }
                }

               return true;
            },

            _pruneData: function(seriesWhiteList) {
                var dataVis = _.filter(this._visualizations, function (v) { return _.nw.isSupportedDataFormat(v.data); });

                var dataSrc = _.flatten(
                    _.map(dataVis, function (v) {
                        return _.map(v.data, function(series, index) {
                            if (_.isObject(series) && _.isArray(series.data)) {
                                series.data = _.map(series.data, function(point) {
                                    return {
                                        y: _.isObject(point) ? point.y : point,
                                        x: _.isObject(point) ? point.x : this.options.xAxis.categories ? this.options.xAxis.categories[index] : index
                                    };
                                });
                                return series;
                            }

                            return {
                                y: _.isObject(series) ? series.y : series,
                                x: _.isObject(series) ? series.x : this.options.xAxis.categories ? this.options.xAxis.categories[index] : index
                            };

                        });
                    }, this)
                );

                if (seriesWhiteList == 'all')
                    return dataSrc;

                dataSrc = _.filter(dataSrc, function(series) {
                    var found = false;
                    seriesWhiteList.forEach(function(whiteSeries) {
                        if ((typeof whiteSeries == "string" && whiteSeries == series.name) || (whiteSeries.name == series.name))
                            found = true;
                    });
                    return found;
                });

                dataSrc = _.filter(dataSrc, function(series, index) {
                    for (var i=index + 1; i < dataSrc.length; ++i) {
                        var series2 = dataSrc[i];
                        if (this._seriesEq(series, series2))
                            return false;
                    }
                    return true;

                }.bind(this));

                return dataSrc;
            },

            axisFor: function(series) {
                if (this.options.rightYAxis.series == 'all') {            
                    return 'rightY';
                } else {
                    var found = false;

                    this.options.rightYAxis.series.forEach(function(item) {
                        if ((typeof item == "string" && item == series.name) || (item.name == series.name)) {
                            found = true;
                        }
                    });

                    return found ? 'rightY' : 'y';
                }
            },

            /*jshint eqnull:true */
            adjustPadding: function () {
                var xOptions = this.options.xAxis;
                var yOptions = this.options.yAxis;
                var rightYOptions = this.options.rightYAxis;

                var maxTickSize = function (options) { return Math.max(options.outerTickSize || 0, options.innerTickSize || 0); };
                
                this.options.chart.internalPadding.top = (this.options.chart.padding.top || 0);

                // bottom padding calculations
                if (this.options.chart.padding.bottom == null) {
                    if (xOptions.ticks !== 0) {
                        var xLabels = this.xDomain;
                        var xAxisText = xLabels.join('<br>');
                        var xLabelBounds = _.nw.textBounds(xAxisText, '.x.axis');
                        var regularXBounds = _.nw.textBounds('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', '.x.axis');
                        var em = regularXBounds.height;
                        var ang = xOptions.labels && xOptions.labels.rotation ? xOptions.labels.rotation % 360 : 0;
                        var xLabelHeightUsed = ang === 0 ? regularXBounds.height : Math.ceil(Math.abs(xLabelBounds.width * Math.sin(_.nw.degToRad(ang))) + em / 5) ;
                        this.options.chart.internalPadding.bottom = this.options.chart.padding.bottom ||
                            maxTickSize(this.options.xAxis) + (this.options.xAxis.tickPadding || 0) +
                            xLabelHeightUsed;
                    } else {
                        this.options.chart.internalPadding.bottom = maxTickSize(this.options.xAxis) + (this.options.xAxis.tickPadding || 0);
                    }
                } else {
                    this.options.chart.internalPadding.bottom = this.options.chart.padding.bottom || 0;
                }

                // left padding calculations
                if (this.options.chart.padding.left == null && this._axisVisible(this.options.yAxis)) {
                    if (this._axisVisible(yOptions)) {
                        var yDomainScaled = this._getYScaledDomain();
                        // var yDomainScaled = _.nw.extractScaleDomain(this.yDomain.slice().concat([_.nw.niceRound(this.yDomain[1])]), yOptions.min, yOptions.max);
                        var tmpScale = d3.scale.linear().domain(yDomainScaled);
                        var yLabels = tmpScale.ticks(yOptions.ticks);

                        var format = yOptions.labels.formatter || d3.format(yOptions.labels.format || ',.0f');
                        var yAxisText = _.map(yLabels, format).join('<br>');
                        var yLabelBounds = _.nw.textBounds(yAxisText, '.y.axis');
                        this.options.chart.internalPadding.left = maxTickSize(this.options.yAxis) + 
                            (this.options.yAxis.tickPadding || 0) +
                            yLabelBounds.width;
                        } else {
                            this.options.chart.internalPadding.left = 0;
                        }
                } else {
                    this.options.chart.internalPadding.left = this.options.chart.padding.left || 0;
                }

                // right padding calculations
                if (this.options.chart.padding.right == null && this._axisVisible(this.options.rightYAxis)) {
                    if (this._axisVisible(rightYOptions)) {
                        var rightYDomainScaled = this._getRightYScaledDomain();
                        // var rightYDomainScaled = _.nw.extractScaleDomain(this.rightYDomain.slice().concat([_.nw.niceRound(this.rightYDomain[1])]), rightYOptions.min, rightYOptions.max);
                        var tmpScale = d3.scale.linear().domain(rightYDomainScaled);
                        var rightYLabels = tmpScale.ticks(rightYOptions.ticks);

                        var format = rightYOptions.labels.formatter || d3.format(rightYOptions.labels.format || ',.0f');
                        var rightYAxisText = _.map(rightYLabels, format).join('<br>');
                        var rightYLabelBounds = _.nw.textBounds(rightYAxisText, '.y.right.axis');
                        this.options.chart.internalPadding.right = maxTickSize(this.options.rightYAxis) + 
                            (this.options.rightYAxis.tickPadding || 0) +
                            rightYLabelBounds.width;
                        } else {
                            this.options.chart.internalPadding.right = 5; //match old value... idk why 5???
                        }
                } else {
                    this.options.chart.internalPadding.right = this.options.chart.padding.right || 0;
                }
            },

            adjustTitlePadding: function () {
                var titleBounds;
                
                if(this.options.xAxis.title) {
                    titleBounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                    this.options.chart.internalPadding.bottom += titleBounds.height + this.options.xAxis.titlePadding;
                }

                if(this.options.yAxis.title && this._axisVisible(this.options.yAxis)) {
                    titleBounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                    this.options.chart.internalPadding.left += titleBounds.height + this.options.yAxis.titlePadding;
                }

                if(this.options.rightYAxis.title && this._axisVisible(this.options.rightYAxis)) {
                    titleBounds = _.nw.textBounds(this.options.rightYAxis.title, '.y.right.axis-title');
                    this.options.chart.internalPadding.right += titleBounds.height + this.options.rightYAxis.titlePadding;
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

                var yScaleDomain = this._getYScaledDomain();
                var dataSrc = this._pruneData(this.options.yAxis.series);

                if(!this.yScale) {
                    this.yScaleGenerator = _.nw.yScaleFactory(dataSrc, this.options, this.yDomain, 'yAxis');
                    this.yScale = this.yScaleGenerator.scale(yScaleDomain);
                } else {
                    this.yScaleGenerator.update(yScaleDomain, dataSrc);
                }
            },

            computeRightYScale: function () {
                if (!this.rightYDomain) throw new Error('You are trying to render without setting data (rightYDomain).');

                var yScaleDomain = this._getRightYScaledDomain();
                var dataSrc = this._pruneData(this.options.rightYAxis.series);

                if(!this.rightYScale) {
                    this.rightYScaleGenerator = _.nw.yScaleFactory(dataSrc, this.options, this.rightYDomain, 'rightYAxis');
                    this.rightYScale = this.rightYScaleGenerator.scale(yScaleDomain);
                } else {
                    this.rightYScaleGenerator.update(yScaleDomain, dataSrc);
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
            * Provides a scaling function based on the rightYAxis values.
            *
            * ###Example:
            *
            *     var scaledValue = this.rightYScale(100);
            *
            * @function rightYScale
            * @param {Number} value The value to be scaled.
            * @return {Number} The scaled value according to the current rightYAxis settings.
            */
            rightYScale: undefined,

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
            * Modifies the domain for the rightYAxis.
            *
            * ###Example:
            *
            *     this.setRightYDomain([100, 200]);
            *
            * @function setRightYDomain
            * @param {Array} domain The domain array representing the min and max values visible on the rightYAxis.       */
            setRightYDomain: function (domain) {
                this.rightYScaleGenerator.setDomain(domain);
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
                if (this.yScaleGenerator.postProcessAxis)
                    this.yScaleGenerator.postProcessAxis(this._yAxisGroup);

                this.renderGridlines();
            },

            /**
            * Redraws the rightYAxis with the new settings and domain.
            *
            * ###Example:
            *
            *     this.redrawRightYAxis();
            *
            * @function redrawRightYAxis
            */
            redrawRightYAxis: function () {
                this.svg.select(".y.right.axis").call(this.rightYAxis());
                if (this.rightYScaleGenerator.postProcessAxis)
                    this.rightYScaleGenerator.postProcessAxis(this._rightYAxisGroup);

                this.renderGridlines();
            },

            _animationDuration: function () {
                var opt = this.options.chart.animations;
                return opt && opt.enable ?
                    opt.duration != null ? opt.duration : 400 :
                    0;
            },

            computeScales: function () {
                this.computeXScale();
                this.computeYScale();
                this.computeRightYScale();

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

            _rightYAxis: undefined,
            rightYAxis: function () {
                if(!this._rightYAxis) {
                    this._rightYAxis = this.rightYScaleGenerator.axis().orient(this.options.rightYAxis.orient);
                }
                return this._rightYAxis;
            },

            renderXAxis: function () {
                var xAxis = this.xAxis();
                var y = this.options.chart.plotHeight + this.options.chart.padding.top;
                var x = this.options.chart.internalPadding.left;

                this._xAxisGroup = this.svg.selectAll('.x.axis')
                    .data([1]);

                if (!this._xAxisGroup.node()) {
                    this._xAxisGroup.enter()
                        .append('g')
                        .attr('transform', 'translate(' + x + ',' + y + ')')
                        .attr('class', 'x axis');
                } else {
                    d3.select(this._xAxisGroup.node())
                        .attr('transform', 'translate(' + x + ',' + y + ')');
                }


                this._xAxisGroup
                    .transition().duration(this._animationDuration())
                    .call(xAxis);

                this.xScaleGenerator.postProcessAxis(this._xAxisGroup);

                return this;
            },

            renderYAxis: function () {
                if (!this._axisVisible(this.options.yAxis))
                    return this;

                var options = this.options.yAxis;
                var alignmentOffset = { bottom: '.8em', middle: '.35em', top: '0' };
                var x = this.options.chart.internalPadding.left;
                var y = this.options.chart.padding.top;

                this._yAxisGroup = this.svg.selectAll('.y.axis')
                    .data([1]);

                if (!this._yAxisGroup.node()) {
                    this._yAxisGroup
                        .enter().append('g')
                        .attr('transform', 'translate(' + x + ',' + y + ')')
                        .attr('class', 'y axis');
                } else {
                    d3.select(this._yAxisGroup.node())
                        .attr('transform', 'translate(' + x + ',' + y + ')');
                }

                this._yAxisGroup
                    .transition().duration(this._animationDuration())
                    .call(this.yAxis())
                    .selectAll('.tick text')
                        .attr('dy', alignmentOffset[options.labels.verticalAlign]);

                if (this.yScaleGenerator.postProcessAxis)
                    this.yScaleGenerator.postProcessAxis(this._yAxisGroup);

                return this;
            },

            renderRightYAxis: function () {
                if (!this._axisVisible(this.options.rightYAxis))
                    return this;

                var options = this.options.rightYAxis;
                var alignmentOffset = { bottom: '.8em', middle: '.35em', top: '0' };
                var x = this.options.chart.internalPadding.left + 
                        this.options.chart.plotWidth;
                var y = this.options.chart.padding.top;

                this._rightYAxisGroup = this.svg.selectAll('.y.right.axis')
                    .data([1]);

                if (!this._rightYAxisGroup.node()) {
                    this._rightYAxisGroup
                        .enter().append('g')
                        .attr('transform', 'translate(' + x + ',' + y + ')')
                        .attr('class', 'y right axis');
                } else {
                    d3.select(this._rightYAxisGroup.node())
                        .attr('transform', 'translate(' + x + ',' + y + ')');
                }

                this._rightYAxisGroup
                    .transition().duration(this._animationDuration())
                    .call(this.rightYAxis())
                    .selectAll('.tick text')
                        .attr('dy', alignmentOffset[options.labels.verticalAlign]);

                if (this.rightYScaleGenerator.postProcessAxis)
                    this.rightYScaleGenerator.postProcessAxis(this._rightYAxisGroup);

                return this;
            },

            renderAxisLabels: function () {
                var lineHeightAdjustment = this.titleOneEm * 0.25; // add 25% of font-size for a complete line-height
                var adjustFactor = 40/46.609; // this factor is to account for the difference between the actual svg size and what we get from the DOM
                var bounds, x, y;

                if (this.options.xAxis.title) {
                    bounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                    y = this.options.chart.internalPadding.bottom;
                    x = 0;
                    el = this._xAxisGroup.selectAll('.x.axis-title').data([1]);
                    if (!el.node()) {
                        el.enter().append('text')
                            .attr('class', 'x axis-title');
                    }

                    d3.select(el.node())
                        .attr('x', x)
                        .attr('y', y)
                        .attr('alignment-baseline', 'after-edge')
                        .attr('dx', (this.options.chart.plotWidth - bounds.width) / 2)
                        .text(this.options.xAxis.title);
                }

                if (this.options.yAxis.title && this._axisVisible(this.options.yAxis)) {
                    bounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                    y = -this.options.chart.internalPadding.left + bounds.height * adjustFactor;
                    x = 0;
                    el = this._yAxisGroup.selectAll('.y.axis-title').data([1]);
                    if (!el.node()) {
                        el.enter().append('text')
                            .attr('class', 'y axis-title');
                    }

                    d3.select(el.node())
                        .attr('class', 'y axis-title')
                        .attr('transform', 'rotate(-90)')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dx', -(this.options.chart.plotHeight + bounds.width) / 2)
                        .attr('dy', 0)
                        .text(this.options.yAxis.title);
                }

                if (this.options.rightYAxis.title && this._axisVisible(this.options.rightYAxis)) {
                    bounds = _.nw.textBounds(this.options.rightYAxis.title, '.y.right.axis-title');
                    y = -this.options.chart.internalPadding.right + bounds.height * adjustFactor;
                    x = -bounds.width;
                    el = this._rightYAxisGroup.selectAll('.y.right.axis-title').data([1]);
                    if (!el.node()) {
                        el.enter().append('text')
                            .attr('class', 'y right axis-title');
                    }
                    
                    d3.select(el.node()) 
                        .attr('class', 'y right axis-title')
                        .attr('transform', 'rotate(90)')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dx', (this.options.chart.plotHeight + bounds.width) / 2)
                        .attr('dy', 0)
                        .text(this.options.rightYAxis.title);
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

                    if (smart) {
                        tickValues.pop();
                    }

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

                    lines.transition().duration(this._animationDuration())
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

            renderBackground: function () {
                var options = this.options.chart;
                this.background = this.background || this.createVisualizationLayer('background', 0);
                var g = this.background.selectAll('.plot-area-background').data([null]);

                g.enter().append('rect')
                    .attr('class', 'plot-area-background')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', options.plotWidth)
                    .attr('height', options.plotHeight);

                g.exit().remove();

                return this;
            },

            render: function () {

                this.composeOptions();
                this.adjustDomain();
                this.calcMetrics();
                this.computeScales();
                this.baseRender();

                this
                    .renderBackground()
                    .renderXAxis()
                    .renderYAxis()
                    .renderRightYAxis()
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
                var yAxisExtents = this.getExtents('y');
                var rightYAxisExtents = this.getExtents('rightY');
                this.yDomain = yAxisExtents.length ? yAxisExtents : [0, 10];
                this.rightYDomain = rightYAxisExtents.length ? rightYAxisExtents : [0, 10];
                this.xDomain = this.getXDomain();
                this.yMin = this.yDomain[0];
                this.yMax = this.yDomain[this.yDomain.length - 1];
                this.rightYMin = this.rightYDomain[0];
                this.rightYMax = this.rightYDomain[this.rightYDomain.length - 1];

                var dataVis = _.filter(this._visualizations, function (v) { return _.nw.isSupportedDataFormat(v.data); });
                this.dataSrc = _.flatten(
                    _.map(dataVis, function (v) {
                        return _.flatten(_.map(v.data, _.bind(this.datum, this)));
                    }, this)
                );

                // _.all() on empty array returns true, so we guard against it
                var isCategoricalData = this.dataSrc.length && _.all(this.dataSrc, function (d) { return +d.x !== d.x; });
                var dataSrcCategories = _.uniq(_.pluck(this.dataSrc, 'x'));
                var sameCats = this.options.xAxis.categories ?
                    this.options.xAxis.categories.length === dataSrcCategories.length && _.intersection(this.options.xAxis.categories, dataSrcCategories).length === dataSrcCategories.length :
                    false;

                if (isCategoricalData && !(this.options.xAxis.categories && sameCats)) {
                    this.options.xAxis.categories = dataSrcCategories;
                }

                this._yAxis = null;
                this._xAxis = null;
                this._rightYAxis = null;

                this.yScale = null;
                this.rightYScale = null;
            },

            getExtents: function (axis) {
                axis = axis || 'y';

                var field = axis + 'Extent';
                var dataVis = _.filter(this._visualizations, function (v) { return _.nw.isSupportedDataFormat(v.data); });
                var all = _.flatten(_.pluck(dataVis, field));
                return all.length ? d3.extent(all) : [];
            },

            getXDomain: function () {
                var dataVis = _.filter(this._visualizations, function (v) { return _.nw.isSupportedDataFormat(v.data); });
                var all = _.nw.uniq(_.flatten(_.pluck(dataVis, 'xDomain')));

                return all;
            }

        };
    };

    Contour.expose('cartesian', cartesian);

})();
