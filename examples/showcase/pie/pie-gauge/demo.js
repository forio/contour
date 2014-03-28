
$(function () {
    var formatter = d3.format('%');

    Contour.export('donutTextOneValue', function (data, layer, options) {

        // This visualization is only for single-element gauges, that is,
        // donut (pie) charts with one data series, one value visible, and the remainder dimed out.
        // So we can assume that there are only two elements in the data series.
        var visibleIndex = data[0].data[0].y < data[0].data[1].y ? 1 : 0;
        var posibleRadius = options.chart.plotHeight / 2;
        var center = (options.pie.outerRadius || posibleRadius);

        layer.append('text')
            .attr('class', 'center-text')
            .attr('x', center)
            .attr('y', center)
            .attr('dy', '.3em')
            .text(formatter(data[0].data[visibleIndex].y));

        layer.append('text')
            .attr('class', 'center-label')
            .attr('x', center)
            .attr('y', center)
            .attr('dy', '2.3em')
            .text('Growth Rate');
    });

    var data = [{ x: 'Case A', y: 0.82}, { x: 'Case B', y: 0.18 }];

    new Contour({
            el: '.pie-gauge',
            pie: {
                piePadding: 15,
                innerRadius: 90
            },
            tooltip: {
                formatter: function(d) {
                    return d.data.x + ': ' + formatter(d.data.y);
                }
            }
        })
        .pie(data)
        .donutTextOneValue(data)
        .render();
});

