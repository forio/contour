(function () {
    var formatter = d3.format('%');

    Contour.export('donutTextOneValue', function (data, layer, options) {

        // This visualization is only for single-element gauges, that is,
        // donut (pie) charts with one data series, one value visible, and the remainder hidden.
        // So we can assume that there are only two elements in the data series.

        var greater;

        if (data[0].data[0].y > data[0].data[1].y)
            { greater = 0; }
        else { greater = 1; }


        layer.append('text')
            .attr('class', 'axis')
            .attr('y', options.pie.piePadding + options.pie.outerRadius)
            .attr('x', options.pie.piePadding + options.pie.outerRadius)
            .attr('style', 'text-anchor: middle; font-size: 30')
            .attr('dy', '.3em')
            .text(formatter(data[0].data[greater].y));
    });

    var data = [{ x: 'Case A', y: 0.82}, { x: 'Case B', y: 0.18 }];

    new Contour({
            el: '.pie-gauge',
            pie: { piePadding: 15, innerRadius: 80, outerRadius: 140 },
            tooltip: {
                formatter: function (d) {
                    return d.data.x + ': ' + formatter(d.data.y);
                }
            }
        })
        .pie(data)
        .donutTextOneValue(data)
        .tooltip()
        .render();
})();
