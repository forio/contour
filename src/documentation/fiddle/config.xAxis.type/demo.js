$(function () {
    new Contour({
        el: '.myLineChart',
        // available types are 'ordinal', 'linear', and 'time'
        // ('time' requires data in Date format)
        xAxis: { type: 'ordinal' }
      })
    .cartesian()
    .line([{x:0, y:5}, {x:1, y:3}, {x:3, y:7}, {x:10, y:4}])
    .render();
});