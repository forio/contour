$(function () {
    new Contour({
        el: '.myLineChart',
        xAxis: { tickValues: [1, 2, 4.5, 6] }
      })
    .cartesian()
    .line([1, 2, 4, 5, 6, 7, 8])
    .tooltip()
    .render();
});