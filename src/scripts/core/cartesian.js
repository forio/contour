import d3 from 'd3';
import * as nwt from '../utils/contour-utils';
import Contour from './contour';
import { xScaleFactory, yScaleFactory } from './axis/axis-scale-factory';

var defaults = {
    chart: {
        gridlines: 'none',
        // not clipping the plot area could be a performance gain
        // but by default we clip to be safe
        clipPlotArea: false,
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
        // should the xAxis be rendered at y=0 or at the bottom of the chart regardless of where y = 0 is
        zeroPlane: false,
    },

    yAxis: {
        // @param: {linear|smart|log}
        // type: 'smart',
        min: undefined,
        max: undefined,
        scaling: {
            type: 'auto', // || 'smart' || 'centered'
            options: {
                zeroAnchor: true
            }
        },
        innerTickSize: 6,
        outerTickSize: 6,
        tickPadding: 4,
        tickValues: undefined,
        ticks: undefined,
        title: undefined,
        titlePadding: 4,
        orient: 'left',
        labels: {
            // top, middle, bottom
            verticalAlign: 'middle',
            format: 'n', // d3 formats
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
    var maxTickSize = function (options) { return Math.max(options.outerTickSize || 0, options.innerTickSize || 0); };
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

            nwt.merge(this.options, readOnlyProps);

            var extraPadding = {};
            if (!this.options.xAxis || !this.options.xAxis.firstAndLast) {
                extraPadding = { chart : { padding: { right: 15 }}};
            }

            this._extraOptions.push(nwt.merge({}, defaults, extraPadding));

            return this;
        },

        xDomain: [],
        yDomain: [],

        _getYScaledDomain: function (domain, options) {
            var opts = this.options.yAxis;
            var zeroAnchor = (opts.zeroAnchor != null) ? opts.zeroAnchor : opts.scaling.options.zeroAnchor;
            var absMin = zeroAnchor && domain && domain[0] > 0 ? 0 : undefined;
            var min = opts.min != null ? opts.min : absMin;

            if (opts.tickValues) {
                if (opts.min != null && opts.max != null) {
                    return [opts.min, opts.max];
                } else if (opts.min != null) {
                    return [opts.min, d3.max(zeroAnchor ? [0].concat(opts.tickValues) : opts.tickValues)];
                } else if (opts.max != null) {
                    return [d3.min(zeroAnchor ? [0].concat(opts.tickValues) : opts.tickValues), opts.max];
                } else {
                    return d3.extent(zeroAnchor || opts.min != null ? [min].concat(opts.tickValues) : opts.tickValues);
                }
            } else if (opts.smartAxis || opts.scaling.type === 'smart') {
                return d3.extent(zeroAnchor || opts.min != null ? [min].concat(domain) : domain);
            } else if (opts.scaling.type === 'centered') {
                return d3.extent(domain);
            }

            return nwt.extractScaleDomain(domain, min, opts.max, opts.ticks);
        },

        /*jshint eqnull:true */
        adjustPadding: function () {
            var xOptions = this.options.xAxis;
            var yOptions = this.options.yAxis;
            // bottom padding calculations
            if (this.options.chart.padding.bottom == null) {
                this.options.chart.internalPadding.bottom = this._getAdjustedBottomPadding(xOptions);
            } else {
                this.options.chart.internalPadding.bottom = this.options.chart.padding.bottom || 0;
            }

            this.options.chart.padding.top = this.options.chart.internalPadding.top = this._getAdjustedTopPadding(xOptions);

            // left padding calculations
            if (this.options.chart.padding.left == null) {
                this.options.chart.internalPadding.left = this._getAdjustedLeftPadding(yOptions);
            } else {
                this.options.chart.internalPadding.left = this.options.chart.padding.left;
            }

            this.options.chart.padding.right = this.options.chart.internalPadding.right = this._getAdjustedRightPadding(yOptions);
        },

        _getAdjustedTopPadding: function (options) {
            return this.options.chart.padding.top;
        },

        _getAdjustedBottomPadding: function (options) {
            if (options.ticks !== 0) {
                var xLabels = this.xDomain;
                var xAxisText = xLabels.join('<br>');
                var xLabelBounds = nwt.textBounds(xAxisText, '.x.axis');
                var regularXBounds = nwt.textBounds('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', '.x.axis');
                var em = regularXBounds.height;
                var ang = options.labels && options.labels.rotation ? options.labels.rotation % 360 : 0;
                var xLabelHeightUsed = ang === 0 ? regularXBounds.height : Math.ceil(Math.abs(xLabelBounds.width * Math.sin(nwt.degToRad(ang))) + em / 5) ;
                return maxTickSize(options) + (options.tickPadding || 0) +
                    xLabelHeightUsed;
            } else {
                return maxTickSize(options) + (options.tickPadding || 0);
            }
        },

        _getAdjustedLeftPadding: function (options) {
            var yDomainScaled = this._getYScaledDomain(this.yDomain, this.options);
            var tmpScale = d3.scale.linear().domain(yDomainScaled);
            var yLabels = tmpScale.ticks(options.ticks);

            var format = options.labels.formatter || d3.format(options.labels.format || ',.0f');
            var yAxisText = yLabels.map(format).join('<br>');
            var yLabelBounds = nwt.textBounds(yAxisText, '.y.axis');
            return maxTickSize(this.options.yAxis) + (this.options.yAxis.tickPadding || 0) +
                yLabelBounds.width;
        },

        _getAdjustedRightPadding: function (options) {
            return this.options.chart.padding.right;
        },

        adjustTitlePadding: function () {
            var titleBounds;
            if (this.options.xAxis.title || this.options.yAxis.title) {
                if(this.options.xAxis.title) {
                    titleBounds = nwt.textBounds(this.options.xAxis.title, '.x.axis-title');
                    this.options.chart.internalPadding.bottom += titleBounds.height + this.options.xAxis.titlePadding;
                }

                if(this.options.yAxis.title) {
                    titleBounds = nwt.textBounds(this.options.yAxis.title, '.y.axis-title');
                    this.options.chart.internalPadding.left += titleBounds.height + this.options.yAxis.titlePadding;
                }
            }
        },

        computeXScale: function () {
            if (!this.xDomain) throw new Error('You are trying to render without setting data (xDomain).');

            if(!this.xScale) {
                this.xScaleGenerator = xScaleFactory(this.dataSrc, this.options);
                this.xScale = this.xScaleGenerator.scale(this.xDomain);
                this.rangeBand = this.xScaleGenerator.rangeBand();
            } else {
                this.xScaleGenerator.update(this.xDomain, this.dataSrc, this.options);
                this.rangeBand = this.xScaleGenerator.rangeBand();
            }
        },

        computeYScale: function () {
            if (!this.yDomain) throw new Error('You are trying to render without setting data (yDomain).');

            var yScaleDomain = this._getYScaledDomain(this.yDomain, this.options);

            if(!this.yScale) {
                this.yScaleGenerator = yScaleFactory(this.dataSrc, this.options, this.options.yAxis.type, this.yDomain);
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
            this.svg.select('.y.axis').call(this.yAxis());
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
            const xAxis = this.xAxis();
            const plotHeight = this.options.chart.plotHeight;
            const paddingTop = this.options.chart.internalPadding.top;
            const x = this.options.chart.internalPadding.left;
            const animOpt = this.options.chart.animations;
            let y = this.options.chart.padding.top;
            const t = d3.transition().duration(this._animationDuration());

            const adjustTickLabels = () => (selection) => {
                if (this.options.xAxis.zeroPlane) {
                    const adj = plotHeight - y + paddingTop;
                    const textSel = selection.selectAll('.x.axis text');
                    textSel.attr('transform', 'translate(0, ' + (adj) + ')');
                }
            };

            if (this.options.xAxis.zeroPlane) {
                y += this.yScale(0);
            } else {
                y += plotHeight;
            }

            this._xAxisGroup = this.svg.selectAll('.x.axis')
                .data([1]);

            if (!this._xAxisGroup.node()) {
                this._xAxisGroup.enter()
                    .append('g')
                    .attr('transform', 'translate(' + x + ',' + y + ')')
                    .attr('class', 'x axis')
                    .call(xAxis)
                    .call(adjustTickLabels());
            } else {
                const opt = this.options.chart.animations;

                if (opt && opt.enable) {
                    // we can't attached the transition an not configure it so
                    // we need to repeat this both with and without transition
                    this._xAxisGroup
                        .transition(t)
                        .attr('transform', 'translate(' + x + ',' + y + ')')
                        .call(xAxis)
                        .call(adjustTickLabels());
                } else {
            this._xAxisGroup
                        .attr('transform', 'translate(' + x + ',' + y + ')')
                .call(xAxis)
                        .call(adjustTickLabels(true));
                }
            }

            this.xScaleGenerator.postProcessAxis(this._xAxisGroup);

            return this;
        },

        renderYAxis: function () {
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

            this._renderYAxisElement();

            return this;
        },

        _renderYAxisElement: function () {
            const options = this.options.yAxis;
            const alignmentOffset = { bottom: '.8em', middle: '.35em', top: '0' };
            const animOpt = this.options.chart.animations;

            if (animOpt && animOpt.enable) {
                this._yAxisGroup
                    .transition().duration(this._animationDuration())
                    .call(this.yAxis())
                    .selectAll('.tick text')
                        .attr('dy', alignmentOffset[options.labels.verticalAlign]);
            } else {
                this._yAxisGroup
                    .call(this.yAxis())
                    .selectAll('.tick text')
                        .attr('dy', alignmentOffset[options.labels.verticalAlign]);
            }
        },

        renderAxisLabels: function () {
            var adjustFactor = 40/46.609; // this factor is to account for the difference between the actual svg size and what we get from the DOM
            var bounds, x, y;
            var el;

            if (this.options.xAxis.title) {
                bounds = nwt.textBounds(this.options.xAxis.title, '.x.axis-title');
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

            if (this.options.yAxis.title) {
                bounds = nwt.textBounds(this.options.yAxis.title, '.y.axis-title');
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
                var smartAxis = this.options.yAxis.smartAxis || this.options.yAxis.scaling.type === 'smart';
                ticks = getYTicks(this.yAxis(), smartAxis);
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


            g.enter().append('rect').attr('class', 'plot-area-background');

            g.attr('x', options.internalPadding.left)
                .attr('y', options.internalPadding.top)
                .attr('width', options.plotWidth)
                .attr('height', options.plotHeight);

            g.exit().remove();

            return this;
        },

        renderClipArea: function () {
            const data = this.options.chart.clipPlotArea ? [null] : [];
            const defs = this.svg.selectAll('defs').data(data);
            defs.enter().append('defs');

            const clip = defs.selectAll('clipPath').data(data);
            clip.enter().append('clipPath').attr('id', 'clip');

            const rect = clip.selectAll('rect').data(data);
            rect.enter().append('rect');

            const w = this.options.chart.plotWidth;
            const h = this.options.chart.plotHeight;

            rect.attr('width', w)
                .attr('height', h);

            rect.exit().remove();
            clip.exit().remove();
            defs.exit().remove();

            return this;
        },

        render: function () {

            this.composeOptions();
            this._normalizeData();
            this.adjustDomain();
            this.calcMetrics();
            this.computeScales();
            this.baseRender();

            this
                .renderClipArea()
                .renderBackground()
                .renderXAxis()
                .renderYAxis()
                .renderGridlines()
                .renderAxisLabels()
                .renderVisualizations();

            return this;
        },

        datum: function (d, index) {
            if(nwt.isObject(d) && Array.isArray(d.data))
                return d.data.map(this.datum.bind(this));

            return {
                y: nwt.isObject(d) ? d.y : d,
                x: nwt.isObject(d) ? d.x : this.options.xAxis.categories ? this.options.xAxis.categories[index] : index
            };
        },

        adjustDomain: function () {
            var extents = this.getExtents();
            this._adjustXDomain(extents);
            this._adjustYDomain(extents);

            this._yAxis = null;
            this._xAxis = null;
            this.yScale = null;
        },

        _adjustXDomain: function (extents) {
            this.xDomain = this.getXDomain();
            var dataVis = this._visualizations.filter(function (v) { return nwt.isSupportedDataFormat(v.data); });
            this.dataSrc = nwt.flatten(
                dataVis.map(function (v) {
                    return nwt.flatten(v.data.map(this.datum.bind(this)));
                }.bind(this))
            );

            // every() on empty array returns true, so we guard against it
            var isCategoricalData = this.dataSrc.length && this.dataSrc.every(function (d) { return +d.x !== d.x; });
            var dataSrcCategories = nwt.uniq(this.dataSrc.map(function (d) { return d.x; }));
            var sameCats = this.options.xAxis.categories ?
                this.options.xAxis.categories.length === dataSrcCategories.length && nwt.intersection(this.options.xAxis.categories, dataSrcCategories).length === dataSrcCategories.length :
                false;

            if (isCategoricalData && !(this.options.xAxis.categories && sameCats)) {
                this.options.xAxis.categories = dataSrcCategories;
            }
        },

        _adjustYDomain: function (extents) {
            this.yDomain = extents.length ? extents : [0, 10];
            this.yMin = this.yDomain[0];
            this.yMax = this.yDomain[this.yDomain.length - 1];
        },

        _normalizeData: function () {
            var opt = this.options;
            this._visualizations.forEach(function (viz) {
                var vizOpt = nwt.merge({}, opt, viz.options);
                viz.normalizeData(vizOpt);
            });
        },

        getExtents: function (axis) {
            var field = axis && axis === 'x' ? 'xExtent' : 'yExtent';
            var dataVis = this._visualizations.filter(function (v) { return nwt.isSupportedDataFormat(v.data); });
            var all = nwt.flatten(dataVis.map(function (d) { return d[field]; }));
            return all.length ? d3.extent(all) : [];
        },

        getXDomain: function () {
            var dataVis = this._visualizations.filter(function (v) { return nwt.isSupportedDataFormat(v.data); });
            var all = nwt.uniq(nwt.flatten(dataVis.map(function (d) { return d.xDomain; })));

            return all;
        }

    };
};

Contour.expose('cartesian', cartesian);
