$(function () {

    Contour.export('donutTextOneValue', function (data, layer, options) {

        // This visualization is only for single-element gauges, that is, 
        // donut (pie) charts with one data series, one value visible, and the remainder hidden.
        // So we can assume that there are only two elements in the data series.

        var greater;

        if (data[0].data[0].y > data[0].data[1].y)
            { greater = 0; }
        else { greater = 1; }

        var formatter = d3.format('%');

        layer.append('text')
            .attr('class', 'axis')
            .attr('y', options.pie.piePadding + options.pie.outerRadius)
            .attr('x', options.pie.piePadding + options.pie.outerRadius)
            .attr('style', 'text-anchor: middle; font-size: 30')
            .attr('dy', '.3em')
            .text(formatter(data[0].data[greater].y))
    });

    var data = [.82, .18];

    new Contour({
            el: '.pie-gauge',
            pie: { piePadding: 15, innerRadius: 100, outerRadius: 300 }
        })
        .pie(data)
        .donutTextOneValue(data)
        .tooltip()
        .render();
});