$(function () {
    var data = [1, 2, 3, 4];

    new Contour({
        el: '.myColumnChart',
        column: {
          // column-specific configuration options
        }
      })
    .cartesian()
    .column(data)
    .render();
});