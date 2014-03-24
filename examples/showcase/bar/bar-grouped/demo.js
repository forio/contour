$(function () {
    var moneyFormatter = d3.format('$,.0f');
    var data = [
        {
            name: 'Business',
            data: [307094837, 380924573, 395535825, 354315825, 225481588, 277937220, 242848122, 281461580]
        },
        {
            name: 'Individual',
            data: [1107500994, 1236259371, 1366241437, 1400405178, 1175421788, 1163687589, 1331160469, 1371402290]
        },
        {
            name: 'Employment',
            data: [771441662, 814819218, 849732729, 883197626, 858163864, 824188337, 767504822, 784396853]
        }
    ];

    new Contour({
            el: '.bar-grouped',

            xAxis: {
                categories: ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012']
            },

            yAxis: {
                labels: {
                    formatter: function (d) {
                        function round(d, b, p) { return (d/b).toFixed(p || 0); }
                        return !d ? 0 : d < 1000000 ? round(d, 1000) + 'M' : d < 1000000000 ? round(d, 1000000) + 'B' : round(d, 1000000000, 1) + 'T';
                    }
                }
            },

            tooltip: {
                formatter: function (d) {
                    return '<strong>' + d.x + '</strong><br>' + moneyFormatter(d.y * 1000);
                }
            },
            legend: {
                vAlign: 'bottom',
                hAlign: 'left',
                direction: 'horizontal'
            }
        })
        .cartesian()
        .horizontal()
        .bar(data)
        .legend(data)
        .tooltip()
        .render();
});
