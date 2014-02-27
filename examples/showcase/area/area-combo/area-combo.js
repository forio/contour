(function () {
    var data = [
        { data: [10,20,5,14,54,23,12,45] }
    ];

    new Narwhal({
            el: '.area-combo',
            xAxis: {
                title: 'Index',
            },
            yAxis: {
                title: 'Value'
            }
        })
        .cartesian()
        .area(data)
        .line(data, { marker: { size: 3 } } )
        .tooltip()
        .render();
})();