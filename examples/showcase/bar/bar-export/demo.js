$(function () {
    Contour.export('customLegend', function (data, layer, options) {
        var moneyFormatter = d3.format('.4s');
        var barCenter = this.rangeBand / 2;
        var x = this.xScale, y = this.yScale;

        // use d3 style enter/update/exit to render the data labels
        layer.selectAll('.label-text')
            .data(data[0].data)
            .enter().append('text')
                .transition().delay(options.chart.animations.duration)
                .attr('class', 'label-text')
                .attr('y', function (d) { return x(d.x) + barCenter; })
                .attr('x', function (d) { return y(d.y); })
                .attr('dy', '.3em')
                .attr('dx', '-.3em')
                .attr('text-anchor', 'end')
                .text(function (d) { return moneyFormatter(d.y); });
    });

    var estateTaxCollection = [23565164, 26717493, 24557815, 26543433, 21583131, 16930741];

    new Contour({
            el: '.bar-export',
            xAxis: {
                categories: ['2005', '2006', '2007', '2008', '2009', '2010']
            },
            yAxis: {
                // this set of options will turn off all ticks on the yAxis
                ticks: 0,
                tickPadding: 0,
                innerTickSize: 0,
                outerTickSize: 0
            }
        })
        .cartesian()
        .horizontal()
        .bar(estateTaxCollection)
        // add our custom legend to our visualization instance
        .customLegend(estateTaxCollection)
        .render();
});
