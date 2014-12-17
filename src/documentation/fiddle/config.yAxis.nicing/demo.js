$(function () {
    new Contour({
        el: '.myLineChart',
        yAxis: { nicing: true }
      })
    .cartesian()
    .line([0.8, 2, 4, 5, 8.2, 11.5])
    .render();
});