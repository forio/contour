$(function () {
    var pi = Math.PI;

    var data = [{
        name: 'Sine Curve',
        data: [
            {x: 0,          y: 0 },
            {x: pi / 4,     y: 0.707 },
            {x: pi / 2,     y: 1 },
            {x: 3 * pi / 4, y: 0.707 },
            {x: pi,         y: 0 },
            {x: 5 * pi / 4, y: -0.707 },
            {x: 3 * pi / 2, y: -1 },
            {x: 7 * pi / 4, y: -0.707 },
            {x: 2 * pi,     y: 0}
        ]
    }];

    new Contour({
            el: '.line-sine',
            chart: {
                gridlines: 'both',
                animations: false
            },
            xAxis: {
                type: 'linear',
                labels: {
                    format: '.2f'
                }
            },
            yAxis: {
                labels: {
                    format: '.2f'
                }
            },
            line: {
                smooth: true,
                marker: {
                    enable: false
                }
            },
            legend: {
                vAlign: 'top'
            }
        })
        .cartesian()
        .line(data)
        .tooltip()
        .legend(data)
        .render();
});

