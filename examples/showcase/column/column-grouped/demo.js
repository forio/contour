$(function () {

    var moneyFormatter = d3.format('$,.0f');
    var groupedColData = [
        { name: '2012', data: [38535, 29533, 32423, 43023, 45055, 50323, 49231, 54023, 43025, 60122, 61342, 60234] },
        { name: '2013', data: [34511, 34965, 36913, 39834, 50385, 57873, 38453, 28800, 46830, 33204, 56963, 46605] }
    ];

    new Contour({
            el: '.column-grouped',
            xAxis: {
                categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            },
            yAxis: {
                title: 'Sales'
            },
            legend: {
                vAlign: 'bottom',
                hAlign: 'center',
                direction: 'horizontal'
            },
            tooltip: {
                formatter: function (d) {
                    return d.x + '<br>' + moneyFormatter(d.y);
                }
            }
        })
        .cartesian()
        .column(groupedColData)
        .legend(groupedColData)
        .tooltip()
        .render();
});



