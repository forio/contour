$(function () {

    var salesData = [
        {
            name: 'East Region',
            data: [
                { x: new Date('01-01-2010'), y: 1800 },
                { x: new Date('02-01-2010'), y: 1530 },
                { x: new Date('03-01-2010'), y: 1650 },
                { x: new Date('04-01-2010'), y: 950 },
                { x: new Date('05-01-2010'), y: 450 },
                { x: new Date('06-01-2010'), y: 750 },
                { x: new Date('07-01-2010'), y: 1480 },
                { x: new Date('08-01-2010'), y: 2604 },
                { x: new Date('09-01-2010'), y: 1350 },
                { x: new Date('10-01-2010'), y: 1150 },
                { x: new Date('11-01-2010'), y: 850 },
                { x: new Date('12-01-2010'), y: 720 }
            ]
        }, {
            name: 'West Region',
            data: [
                { x: new Date('01-01-2010'), y: 1917 },
                { x: new Date('02-01-2010'), y: 1630 },
                { x: new Date('03-01-2010'), y: 1656 },
                { x: new Date('04-01-2010'), y: 1048 },
                { x: new Date('05-01-2010'), y: 439 },
                { x: new Date('06-01-2010'), y: 612 },
                { x: new Date('07-01-2010'), y: 1368 },
                { x: new Date('08-01-2010'), y: 2527 },
                { x: new Date('09-01-2010'), y: 1350 },
                { x: new Date('10-01-2010'), y: 1403 },
                { x: new Date('11-01-2010'), y: 1161 },
                { x: new Date('12-01-2010'), y: 596 }
            ]
        }
    ];

    new Contour({
            el: '.area-combo',
            chart: {
                gridlines: 'horizontal'
            },
            xAxis: {
                labels: {
                    // x Axis labels should show abbreviated month only
                    // different time formatting options can be found at
                    // https://github.com/mbostock/d3/wiki/Time-Formatting
                    format: '%b'
                }
            },
            yAxis: {
                title: 'Sales (x1,000)'
            },
            tooltip: {
                formatter: function (d) {
                    // format the tooltip as currency
                    return d3.format('$,.0f')(d.y * 1000);
                }
            }
        })
        .cartesian()
        .area(salesData)
        .legend(salesData)
        .tooltip()
        .render();
});
