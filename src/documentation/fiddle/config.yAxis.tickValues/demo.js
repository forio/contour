(function () {
    new Contour({
        el: '.myLineChart',
        yAxis: { tickValues: [0, 2, 4, 6, 7, 8] }
      })
    .cartesian()
    .line([1, 2, 4, 5, 6, 7, 8])
    .tooltip()
    .render()
})();