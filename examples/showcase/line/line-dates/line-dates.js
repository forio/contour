(function () {

    var data = [
        { x: new Date('1/1/2000'), y: 5},
        { x: new Date('2/1/2000'), y: 3},
        { x: new Date('3/1/2000'), y: 6},
        { x: new Date('4/1/2000'), y: 7},
        { x: new Date('5/1/2000'), y: 4},
        { x: new Date('6/1/2000'), y: 2}
    ];

    new Contour({
            el: '.line-dates',
            xAxis: {
                title: 'Index',
            },
            yAxis: {
                title: 'Value'
            }
        })
        .cartesian()
        .line(data)
        .tooltip()
        .render();
})();