$(function () {
    new Contour({
            el: '.pie-series',
            pie: { piePadding: 15 }
        })
        .pie([{ data: [ 1, 2, 3, 4 ] }, { data: [ 2, 2, 5, 1 ] }, { data: [7, 4, 2, 2, 5] }])
        .tooltip()
        .render();
});