$(function () {
    var stackedColData = [
        { name: 'Model XH32', data: [38000, 25342, 32532, 23542] },
        { name: 'Model RT55-A', data: [10231, 9523, 6231, 9236] },
        { name: 'Model BC99', data: [1325, 2533, 4250, 1252] },
        { name: 'Model RC132-X', data: [21023, 29432, 42263, 33152] }
    ];

    new Contour({
            el: '.column-stacked',
            xAxis: {
                categories: ['Q1-2013', 'Q2-2013', 'Q3-2013', 'Q4-2013']
            },
            yAxis: {
                title: 'Sales (US $)'
            }
        })
        .cartesian()
        .column(stackedColData, { stacked: true })
        .stackTooltip(stackedColData, { el: '.column-stack-tooltip' })
        .render();
});
