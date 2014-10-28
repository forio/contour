$(function () {
    var data = [10, 60, 70, 40];

    new Contour({
        el: '.myAreaChart',
        area: { areaBase: 50 }
      })
    .cartesian()
    .area(data)
    .render(); 
});