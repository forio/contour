$(function () {
    var data = [1,2,3,4];

    new Contour({
        el: '.myPieChart',
        pie: { piePadding: { bottom: 200 } }
    })
    .pie(data)
    .render();
});

