(function () {
    series = [];
    // series defined as 3x100 array of random (x,y,z) pairs
    // we'll plot the points (x,y) and scale the point size by z
    for(var j=0; j<3; j++) {
        var data = [];
        series.push({
            data: data
        });

        for(var k=0; k<100; k++) {
            data.push({x: Math.random() * 1000, y: Math.random() * 1000, z: Math.random() * 50 });
        }
    }

    new Contour({
            el: '.scatter-export',
            xAxis: {
                title: 'Value'
            },
            yAxis: {
                title: 'Value'
            },
            scatter: {
                // argument d is the element of the data series
                // that is currently being added to the visualization
                radius: function(d) { return (d.z) }
            }
        })
        .cartesian()
        .scatter(series)
        .tooltip()
        .render();
})();