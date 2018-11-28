import d3 from 'd3';
import * as nwt from '../utils/contour-utils';
import Contour from '../core/contour';

var defaults = {
    bar: {
        barClass: null,
        style: null,
        stacked: false,
        groupPadding: 2,      // two px between same group bars
        barWidth: function() { return this.rangeBand; },
        offset: function() { return 0; },
        preprocess: function(data) {
            return data;
        }
    }
};

function barRender(data, layer, options) {
    this.checkDependencies(['cartesian', 'horizontal']);
    var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    var _this = this;
    var opt = options.bar;
    var rectClass = opt.barClass;
    var style = opt.style;
    var x = function (d) { return _this.xScale(d) - 0.5; };
    var y = function (d) { 
        const yScale =  _this.yScale(d) + 0.5; 
        return yScale;
    };
    var chartOffset = nwt.getValue(opt.offset, 0, this);
    var rangeBand = nwt.getValue(opt.barWidth, this.rangeBand, this);
    var stack = nwt.stackLayout();
    var update = options.bar.stacked ? stacked : grouped;
    var enter = nwt.partialRight(update, true);
    var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };

    data = options.bar.preprocess(data);
    var series = layer.selectAll('g.series')
        .data(stack(data));

    series.enter().append('svg:g');
    series.attr('class', classFn);
    series.exit().remove();

    var bars = series.selectAll('.bar')
        .data(function (d) { return d.data; });

    var cssClass = 'bar' + (options.tooltip.enable ? ' tooltip-tracker' : '');
    bars.enter().append('rect')
        .attr('class', function (d, i, j) {
            if (!rectClass) return cssClass;

            return cssClass + ' ' + (typeof rectClass === 'function' ? rectClass.call(this, d, i, j) : rectClass);
        })
        .call(enter);

    if(options.chart.animations && options.chart.animations.enable) {
        bars
            .attr('style', style)
            .transition().duration(duration).call(update);
        bars.exit()
            .transition().duration(duration)
            .attr('width', y(0))
            .remove();
    } else {
        bars.attr('style', style).call(update);
        bars.exit().remove();
    }

    function stacked(bar, enter) {
        bar
            .attr('y', function (d) { return x(d.x) + chartOffset; })
            .attr('height', rangeBand);

        if (enter) {
            return bar
                .attr('x', function (d) { return y(0); })
                .attr('width', function (d) { return 0; });

        } else {
            return bar
                .attr('x', function (d) { return d.y >= 0 ? y(d.y0 || 0) : y(d.y + d.y0); })
                .attr('width', function (d) { return d.y >=0 ? y(d.y) - y(0) : y(0) - y(d.y); });
        }
    }

    function grouped(bar, enter) {
        var numSeries = data.length;
        var height = function () { 
            const h = rangeBand / numSeries - options.bar.groupPadding + 0.5; 
            return h;
        };
        var offset = function (d, i) { return rangeBand / numSeries * i + 0.5; };

        bar.attr('y', function (d, i, j) { return x(d.x) + offset(d, j) + chartOffset; })
            .attr('height', height);

        if (enter) {
            return bar
                .attr('x', y(0))
                .attr('width', function (d) { return 0.5; });
        } else {
            return bar
                .attr('width', function (d) { return d.y >= 0 ? y(d.y) - y(0) : y(0) - y(d.y); })
                .attr('x', function (d) { return d.y < 0 ? y(d.y) : y(0); });
        }
    }
}

barRender.defaults = defaults;
/**
* Adds a bar chart (horizontal columns) to the Contour instance.
*
* You can use this visualization to render both stacked and grouped charts (controlled through the _options_).
*
* This visualization requires `.cartesian()` and `.horizontal()`.
*
* ### Example:
*
*     new Contour({el: '.myChart'})
*       .cartesian()
*       .horizontal()
*       .bar([1,2,3,4])
*       .render();
*
* @name bar(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
Contour.export('bar', barRender);
