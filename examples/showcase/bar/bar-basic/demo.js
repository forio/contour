$(function () {

    // sample data
    var data =[21, 15, 23, 24, 29, 4, 13, 8, 14, 7, 6, 3];

    new Contour({
            el: '.bar-basic',
        })
        .cartesian()
        .horizontal()
        .bar(data)
        .render();
});
