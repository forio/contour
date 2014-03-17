$(function () {
    new Contour({
            el: '.pie-basic',
        })
        .pie([ 1, 2, 3, 4 ])
        .tooltip()
        .render();
});