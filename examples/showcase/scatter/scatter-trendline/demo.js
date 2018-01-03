$(function () {
    var series = [];
    var names = ['School A', 'School B', 'School C'];
    var rand = function(l,h) { return Math.random() * (h-l) + l; };

    // series defined as 3x10 array of random (x,y) pairs
    for(var j=0; j<3; j++) {
        var data = [];
        series.push({
            name: names[j],
            data: data
        });

        for(var k=0; k<20; k++) {
            data.push({
                x: k + rand(0, 1),
                y: k + rand(0, 15)
            });
        }
    }

    Contour.export('r2Info', function (data, layer, options) {
        var reg = Contour.utils.linearRegression(_.flatten(_.map(data, 'data')));

        layer.append('text')
            .attr('class', 'r2-info')
            .attr('x', options.chart.plotWidth)
            .attr('y', options.chart.plotHeight)
            .attr('dy', '-1em')
            .attr('text-anchor', 'end')
            .text('R2: ' + d3.format('.3f')(reg.r2));
    });

    new Contour({
            el: '.scatter-trendline',
            xAxis: {
                title: 'Study Hours'
            },
            yAxis: {
                title: 'Score'
            },
            scatter: {
                radius: 2.5
            },
            legend: {
                vAlign: 'top',
                hAlign: 'left'
            }
        })
        .cartesian()
        .scatter(series)
        .trendLine(series)
        .legend(series)
        .r2Info(series)
        .tooltip()
        .render();
});
