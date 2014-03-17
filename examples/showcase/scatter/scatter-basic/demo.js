(function () {
    series = [];
    // series defined as 3x100 array of random (x,y) pairs
    for(var j=0; j<3; j++) {
        var data = [];
        series.push({
            data: data
        });

        for(var k=0; k<100; k++) {
            data.push({x: Math.random() * 1000, y: Math.random() * 1000 });
        }
    }

    new Contour({
            el: '.scatter-basic',
            xAxis: {
                title: 'Value'
            },
            yAxis: {
                title: 'Value'
            },
            scatter: {
                radius: 1.5
            }
        })
        .cartesian()
        .scatter(series)
        .tooltip()
        .render();
})();