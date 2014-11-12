$(function () {
    new Contour({
        el: '.myLineChart',
        xAxis: { 
            labels : 
                { formatter: 
                    function (datum) { return '$' + datum; }
                }
        },
        yAxis: {min: 10, max: 30}
      })
    .cartesian()
    .line([{x:25.4, y:15}, {x:31.2, y:20}, {x:37, y:18}, {x:18, y:25}])
    .tooltip()
    .render();
});