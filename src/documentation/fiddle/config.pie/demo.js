(function () {
    var data = [1,2,3,4];

    new Contour({
        el: '.myPieChart',
        pie: {
          // pie-specific configuration options
        }
    })
    .pie(data)
    .render()
})();
