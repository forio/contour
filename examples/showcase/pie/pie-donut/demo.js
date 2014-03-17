(function () {
    new Contour({
            el: '.pie-donut',
            pie: { innerRadius: 30 }
        })
        .pie([ 1, 2, 3, 4 ])
        .tooltip()
        .render();
})();