$(function () {

    Contour.export('pieName', function (data, layer, options) {

        var w = options.chart.plotWidth;
        var h = options.chart.plotHeight;
        var numSeries = data.length;

        var padding = options.pie.piePadding;
        var totalPadding = (padding.left + padding.right + (padding.right + padding.left) * (numSeries - 1) || 30);
        var pieRadius = ((w - totalPadding) / numSeries) / 2;

        layer.selectAll('.pie-name')
            .data(data)
            .enter().append('text')
                .attr('class', 'pie-name')
                .attr('x', function (d, i) {
                    return ((padding.left || 5) + pieRadius * (i + 1)) + (pieRadius + (padding.right || 5) + (padding.left || 5)) * i;
                })
                .attr('text-anchor', 'middle')
                .attr('y', h / 2 + 10)
                .text(function (d) { return d.name; });
    });

    var data = [{
        name: 'Germany',
        data: [{ x: 'Prod A', y: 1 }, { x: 'Prod B', y: 2 }, { x: 'Prod C', y: 3 }, { x: 'Prod D', y: 4 }]
    }, {
        name: 'France',
        data: [{ x: 'Prod A', y: 2 }, { x: 'Prod B', y: 2 }, { x: 'Prod C', y: 5 }, { x: 'Prod D', y: 1 }]
    }, {
        name: 'Spain',
        data: [{ x: 'Prod A', y: 7 }, { x: 'Prod B', y: 4 }, { x: 'Prod C', y: 2 }, { x: 'Prod D', y: 2 }]
    }];

    new Contour({
            el: '.pie-series',
            chart: {
                height: 250
            },
            pie: {
                innerRadius: 50
            },
            legend: {
                hAlign: 'center',
                vAlign: 'bottom',
                direction: 'horizontal'
            },
            tooltip: {
                formatter: function(d) {
                    return d.data.x + ': ' + d.data.y;
                }
            }
        })
        .pie(data)
        .pieName(data)
        .legend(_.map(_.map(data[0].data, 'x'), function (x) { return { name: x, data: [] }; }))
        .tooltip()
        .render();

    d3.selectAll('.series').classed('palette-6', true);
});
