import d3 from 'd3';
import Contour from '../core/contour';

var defaults = {
    xAxis: {
        type: 'linear'
    },
    scatter: {
        radius: 4,
        preprocess: function(data) {
            return data;
        }
    }
};

function ScatterPlot(data, layer, options) {
    this.checkDependencies('cartesian');
    var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
    var shouldAnimate = options.chart.animations && options.chart.animations.enable;
    var opt = options.scatter;
    var halfRangeBand = this.rangeBand / 2;
    var x = function (d) { return this.xScale(d.x) + halfRangeBand; }.bind(this);
    var y = function (d) { return this.yScale(d.y); }.bind(this);
    var h = options.chart.plotHeight;
    var classFn = function (d, i) { return d.name + ' series s-' + (i+1); };

    data = options.scatter.preprocess(data);

    var series = layer.selectAll('.series')
        .data(data);

    series.attr('class', classFn);

    series.enter().append('svg:g')
        .attr('class', classFn);

    series.exit().remove();

    var dots = series.selectAll('.dot')
        .data(function (d) { return d.data; }, function (d) {
            return options.scatter.dataKey ? d[options.scatter.dataKey] : d.x;
        });

    dots.enter().append('circle')
            .attr('class', 'dot tooltip-tracker')
            .attr('r', opt.radius)
            .attr('cx', x)
            .attr('cy', h);

    if (shouldAnimate) {
        dots.transition().duration(duration)
            .attr('r', opt.radius)
            .attr('cx', x)
            .attr('cy', y);
    } else {
        dots.attr('r', opt.radius)
            .attr('cx', x)
            .attr('cy', y);
    }


    dots.exit().remove();
}

ScatterPlot.defaults = defaults;

/**
* Adds a scatter plot to the Contour instance.
*
* This visualization requires `.cartesian()`.
*
* ### Example:
*
*     new Contour({el: '.chart'})
*           .cartesian()
*           .scatter([1,2,3,4])
*           .render();
*
* @name scatter(data, options)
* @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
* @param {object} [options] Configuration options particular to this visualization that override the defaults.
* @api public
*
*/
Contour.export('scatter', ScatterPlot);
