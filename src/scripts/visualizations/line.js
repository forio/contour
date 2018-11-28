import d3 from 'd3';
import * as nwt from '../utils/contour-utils';
import Contour from '../core/contour';

var defaults = {
    xAxis: {
        type: 'linear'
    },
    line: {
        stacked: false,
        smooth: false,
        animationDirection: 'left-to-right',
        // animationDirection: 'bottom-to-top',
        marker: {
            enable: true,
            size: 3,
            animationDelay: null
        },
    }
};

defaults.line.preprocess = nwt.minMaxFilter(1000);
var duration;
var animationDirection;
var animationsMap = {
    'left-to-right': {
        enter: function (line) {
            var path = this;
            path.each(function () {
                var totalLength = this.getTotalLength();
                d3.select(this)
                    .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                    .attr('stroke-dashoffset', totalLength)
                    .transition().duration(duration).ease('linear')
                        .attr('stroke-dashoffset', 0)
                        .transition().duration(0)
                            .attr('stroke-dasharray', undefined);
            });
        },

        update: function (line) {
            this.attr('d', function (d) { return line(d.data); });
            this.each(function () {
                var totalLength = this.getTotalLength();
                d3.select(this)
                    .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                    .attr('stroke-dashoffset', totalLength)
                    .transition().duration(duration).ease('linear')
                        .attr('stroke-dashoffset', 0)
                        .transition().duration(0)
                            .attr('stroke-dasharray', undefined);
            });
        }
    },

    'bottom-to-top': {
        enter: function (line) {
            this.transition().duration(duration)
                .attr('d', function (d) { return line(d.data); });
        },

        update: function (line) {
            this.transition().duration(duration)
                .attr('d', function (d) { return line(d.data); });
        }
    }
};


function render(rawData, layer, options, id) {
    this.checkDependencies('cartesian');

    var x = function (d) { return this.xScale(d.x) + this.rangeBand / 2 + 0.5; }.bind(this);
    var y = function (d) { return this.yScale(d.y + (d.y0 || 0)) + 0.5; }.bind(this);
    var shouldAnimate = options.chart.animations && options.chart.animations.enable;
    animationDirection = options.line.animationDirection || 'left-to-right';
    duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    // jshint eqnull:true
    var data = options.line.preprocess(nwt.cleanNullValues()(rawData));

    data = options.line.stacked ? d3.layout.stack().values(function (d) { return d.data; })(data) : data;

    renderPaths();

    renderMarkers(options.line.marker.enable);

    renderTooltipTrackers(options.tooltip && options.tooltip.enable);

    function seriesClassName(extras) { return function (d, i) { return (extras||'') + ' s-' +(i+1) + ' ' + nwt.seriesNameToClass(d.name); }; }

    function renderPaths() {
        var startLine = d3.svg.line()
            .x(function (d) { return x(d); })
            .y(function () { return y({x: 0, y: options.yAxis.min || 0}); });

        var line = d3.svg.line()
            .x(function (d) { return x(d); })
            .y(function (d) { return y(d); });

        if(options.line.smooth) line.interpolate('cardinal');

        var animFn = animationsMap[animationDirection];
        var series = layer.selectAll('g.series')
                .data(data, function (d) { return d.name; });

        // enter
        var el = series.enter().append('svg:g')
            .attr('class',seriesClassName('series'))
            .attr('clip-path', 'url(#clip)')
            .append('path')
                .attr('class', 'line');

        if (shouldAnimate) {
            var startLineFn = animationDirection === 'left-to-right' ? line : startLine;
            el.attr('d', function(d) { return startLineFn(d.data); })
                .call(nwt.partial(animFn.enter, line));
        } else {
            el.attr('d', function (d) { return line(d.data); });
        }

        // update
        el = series
            .attr('class', seriesClassName('series'))
            .select('.line');

        if (shouldAnimate) {
            el.call(nwt.partial(animFn.update, line));
        } else  {
            el.attr('d', function (d) { return line(d.data); });
        }

        series.exit().remove();
    }

    function renderMarkers(enabled) {
        var animationDelay = (options.line.marker.animationDelay == null) ? duration : options.line.marker.animationDelay;
        var markers = layer.selectAll('.line-chart-markers')
            .data(enabled ? data : [], function (d) { return d.name; });

        markers.enter().append('g');
        markers.attr('class', seriesClassName('line-chart-markers markers'));
        markers.exit().remove();

        var dots = markers.selectAll('.dot')
            .data(function (d) { return d.data; }, function (d) { return d.x; });

        if (shouldAnimate) {
            dots.transition().delay(animationDelay).duration(duration)
                .attr('cx', x)
                .attr('cy', y)
                .attr('opacity', 1);
        } else {
            dots.attr('cx', x)
                .attr('cy', y)
                .attr('opacity', 1);
        }


        dots.enter().append('circle')
            .attr('class', 'dot')
            .attr('r', options.line.marker.size)
            .attr('opacity', 0)
            .attr('cx', x)
            .attr('cy', y)
            .transition().delay(animationDelay)
                .attr('opacity', 1);

        dots.exit().remove();

    }

    function renderTooltipTrackers(enabled) {
        var trackerSize = 10;
        var markers = layer.selectAll('.tooltip-trackers')
            .data(enabled ? data : [], function (d) { return d.name; });

        markers.enter().append('g');
        markers.attr('class', seriesClassName('tooltip-trackers'));
        markers.exit().remove();

        var dots = markers.selectAll('.tooltip-tracker')
            .data(function (d) { return d.data; }, function (d) { return d.x; });

        dots.enter().append('circle')
            .attr({
                'class': 'tooltip-tracker',
                'r': trackerSize,
                'opacity': 0
            });

        dots.attr({
            'cx': x,
            'cy': y
        });

        dots.exit().remove();
    }

    return this;
}

render.defaults = defaults;


/**
* Adds a line chart to the Contour instance.
*
* This visualization requires `.cartesian()`.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*           .cartesian()
*           .line([1,2,3,4])
*           .render();
*
* @name line(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
Contour.export('line', render);
