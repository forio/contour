$(function () {

    Contour.export('pieName', function (data, layer, options) {

        var w = options.chart.plotWidth;
        var padding = options.pie.piePadding - 10;
        var paddings = (w / data.length / 2) - padding;
        var pieRadius = (w - paddings) / data.length;
        layer.selectAll('.pie-name')
            .data(data)
            .enter().append('text')
                .attr('class', 'pie-name')
                .attr('x', function (d, i) {
                    return options.pie.piePadding * (i + 1) + (pieRadius ) * i + pieRadius / 2;
                })
                .attr('text-anchor', 'middle')
                .attr('y', (options.pie.piePadding + pieRadius + 25))
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
                piePadding: 15
            },
            legend: {
                hAlign: 'center',
                vAlign: 'bottom',
                direction: 'horizontal'
            }
        })
        .pie(data)
        .pieName(data)
        .legend(_.map(_.pluck(data[0].data, 'x'), function (x) { return { name: x, data: [] }; }))
        .tooltip()
        .render();

    d3.selectAll('.series').classed('palette-5', true);

});
