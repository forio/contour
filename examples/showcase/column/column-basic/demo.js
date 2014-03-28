$(function () {

    // sample data
    var data = [10, 28, 21, 5, 18, 5, 13, 21, 25, 17, 26];

    new Contour({
            el: '.column-basic',
        })
        .cartesian()
        .column(data)
        .render();
});
