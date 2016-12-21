$(function () {

    var data = [
        { x: 'S. Vettel', y: 13 },
        { x: 'F. Alonso', y: 2 },
        { x: 'L. Hamilton', y: 1 },
        { x: 'K. Raikkonen', y: 1 },
        { x: 'N. Rosberg', y: 2 }
    ];

    new Contour({
            el: '.pie-donut',
            pie: {
                innerRadius: 80,
                piePadding: {
                    left: 20
                }
            },
            tooltip: {
                formatter: function (d) {
                    return d.data.x + '<br>' + d.value + ' wins';
                }
            }
        })
        .pie(data)
        .legend(_.map(_.map(data, 'x'), function (x) { return { name: x, data: [] }; }))
        .tooltip()
        .render();
});
