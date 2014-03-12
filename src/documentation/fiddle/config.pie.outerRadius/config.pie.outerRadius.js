(function () {
    var data = [1,2,3,4];

    new Contour({
        el: '.myPieChart',
        pie: { outerRadius: 100 }
    })
    .pie(data)
    .render()
})();

