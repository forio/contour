$(function () {

    var data = [22, 8, 5, 19, 11, 4, 5, 13, 20, 29, 25];

    new Contour({
        el: '.chart'
    })
    .cartesian()
    .line(data)
    .render();
});
