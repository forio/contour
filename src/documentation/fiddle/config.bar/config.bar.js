(function () {
    var data = [2, 4, 6, 3, 5];

    new Contour({
        el: '.myBarChart',
        bar: {
          // bar-specific configuration options
        }
      })
    .cartesian()
    .bar(data)
    .render()
})();