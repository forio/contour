(function () {

    var groupedColData = [
        { name: 'First Series', data: [6,5,3,5,7,6,3] },
        { name: 'Second Series', data: [1,2,1,2,1,2,1] },
        { name: 'Third Series', data: [6,5,1,5,2,3,5] },
        { name: 'Fourth Series', data: [5,3,2,5,1,6,5] }
    ];

    new Contour({
            el: '.column-stacked',
            xAxis: {
                title: 'Index or Category',
            },
            yAxis: {
                title: 'Value'
            }
        })
        .cartesian()
        .column(groupedColData)
        .stackTooltip(stackedColData, { el: '.column-stack-tooltip' })
        .render();
})();