$(function () {
    var data = [1,2,3,4];

    new Contour({
        el: '.myColumnChart',
        xAxis: { outerRangePadding: 0.8 }
      })
    .cartesian()
    .column(data)
    .render();
});