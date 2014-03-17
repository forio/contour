(function () {
    var data = [1,2,3,4];

    new Contour({
        el: '.myPieChart',
        pie: { innerRadius: 60 }
    })
    .pie(data)
    .render()
})();
