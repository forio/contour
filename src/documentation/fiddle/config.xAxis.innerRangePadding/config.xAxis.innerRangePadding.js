(function () {
    var data = [1,2,3,4];

    new Contour({
        el: '.myColumnChart',
        xAxis: { innerRangePadding: 0.9 }
      })
    .cartesian()
    .column(data)
    .render()
})();