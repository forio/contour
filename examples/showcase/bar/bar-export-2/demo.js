$(function () {
    'use strict';
    Contour.export('customLegend', function (data, layer, options) {
        var res = function (val) { return typeof val === 'function' ? val() : val; };
        var formatter = d3.format(',.4s');
        var rangeWidth = res(options.bar.barWidth) || this.rangeBand;
        var barWidth = (rangeWidth - (data.length * options.bar.groupPadding)) / data.length;
        var pinToBar = res(options.customLegend.pinToBar);
        var x = this.xScale;
        var y = pinToBar ? this.yScale : function () { return options.chart.plotWidth; };
        var duration = options.chart.animations.duration || 0;
        var em = _.nw.textBounds('123456789', '.label-text').height;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };

        var dy = function (d, n, i) {
            // calculate the offset for the label within the range using
            // the actual barWidth and current series index
            var base = barWidth / 2;
            var seriesOffset = i * barWidth;
            var padding = i * options.bar.groupPadding;
            var px = base + seriesOffset + padding;
            return px + 'px';
        };

        var series = layer.selectAll('g.series')
            .data(data);

        series.enter().append('svg:g')
            .attr('class', classFn);

        // use d3 style enter/update/exit to render the data labels
        var labels = series.selectAll('.label-text')
            .data(function (d) { return d.data; });

        labels.enter().append('text')
            .attr('class', 'label-text');

        labels
            .transition().delay(duration)
            .text(function (d) { return formatter(d.y); })
            .attr('x', function (d) { return y(d.y) })
            .attr('y', function (d) { return x(d.x) })
            .attr('dy', dy)
            .attr('alignment-baseline', 'middle')
            .attr('dx', pinToBar ? '.1em' : '')
            .attr('text-anchor', pinToBar ? 'start' : 'end');

        labels.exit().remove();
    });

    const series1 = [23565164, 26717493, 24557815, 26543433, 21583131, 16930741];
    const series2 = [26717493, 24557815, 26543433, 21583131, 16930741, 23565164];
    const estateTaxCollection = [series1, series2];

    const checkbox = document.querySelector('#pinToBar');

    const viz = new Contour({
            el: '.bar-export',
            xAxis: {
                categories: ['2005', '2006', '2007', '2008', '2009', '2010']
            },
            yAxis: {
                // this set of options will turn off all ticks on the yAxis
                ticks: 0,
                tickPadding: 0,
                innerTickSize: 0,
                outerTickSize: 0,
                max: 30000000
            },
            bar: {
                // barWidth: 45
            }
        })
        .cartesian()
        .horizontal()
        .bar(estateTaxCollection)
        // add our custom legend to our visualization instance
        .customLegend(estateTaxCollection, { pinToBar: function () { return checkbox.checked; } });

    viz.render();

    checkbox.addEventListener('change', function (e) {
        viz.render();
    });
});
