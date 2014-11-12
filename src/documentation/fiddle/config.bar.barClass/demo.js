$(function () {
    var data = [2, 4, 6, 3, 5];

    new Contour({
        el: '.myBarChart',
        bar: {
          barClass: function(d) { return "q" + d.y + "-9"; }
        }
      })
    .cartesian()
    .horizontal()
    .bar(data)
    .render();
});