$(function () {
    var data = [2, 4, 6, 3, 5];

    new Contour({
        el: '.myColumnChart',
        column: {
          columnClass: function(d) { return "q" + d.y + "-9"; }
        }
      })
    .cartesian()
    .bar(data)
    .render();
});