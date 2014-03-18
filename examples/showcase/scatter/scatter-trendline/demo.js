$(function () {
    series = [];
    // series defined as 3x10 array of random (x,y) pairs

    for(var j=0; j<3; j++) {
        var data = [];
        series.push({
            data: data
        });

        var rand = function(l,h) { return Math.random() * (h-l) + l; };

        for(var k=0; k<10; k++) {
            data.push({
                x: k + rand(-1, 1),
                y: k + rand(0, 5)
            });
        }
    }

    new Contour({
            el: '.scatter-trendline',
            xAxis: {
                title: 'Value'
            },
            yAxis: {
                title: 'Value'
            },
            scatter: {
                radius: 2.5
            }
        })
        .cartesian()
        .scatter(series)
        .trendLine(series)
        .tooltip()
        .render();
});