$(function () {
    var data = [1,2,3,4];

    new Contour({
        el: '.myPieChart',
        pie: { piePadding: { left: 200 } }
    })
    .pie(data)
    .render();
});

