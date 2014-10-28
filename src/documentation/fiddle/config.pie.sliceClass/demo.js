$(function () {
    var data = [6, 2, 7, 5, 3];

    new Contour({
        el: '.myPieChart',
        pie: { sliceClass: 'myPieStyle' }
    })
    .pie(data)
    .render();
});