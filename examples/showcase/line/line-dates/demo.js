$(function () {

    var data = [
        { x: new Date('3/19/2014'), y: 4307.6 },
        { x: new Date('3/18/2014'), y: 4333.31 },
        { x: new Date('3/17/2014'), y: 4279.95 },
        { x: new Date('3/14/2014'), y: 4245.4 },
        { x: new Date('3/13/2014'), y: 4260.42 },
        { x: new Date('3/12/2014'), y: 4323.33 },
        { x: new Date('3/11/2014'), y: 4307.19 },
        { x: new Date('3/10/2014'), y: 4334.45 },
        { x: new Date('3/7/2014'), y: 4336.22 },
        { x: new Date('3/6/2014'), y: 4352.13 },
        { x: new Date('3/5/2014'), y: 4357.97 },
        { x: new Date('3/4/2014'), y: 4351.97 },
        { x: new Date('3/3/2014'), y: 4277.3 }
    ];

    new Contour({
            el: '.line-dates',
            chart: {
                gridlines: 'horizontal',
                padding: {
                    right: 40
                }
            },
            xAxis: {
                maxTicks: 7,
                linearDomain: true,
            },
            yAxis: {
                title: 'Value (US$)',
                min: 4000,
                max: 4500
            }
        })
        .cartesian()
        .line(data)
        .tooltip()
        .render();
});
