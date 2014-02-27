(function () {
    new Narwhal({
            el: '.area-basic',
            xAxis: {
                title: 'Index',
            },
            yAxis: {
                title: 'Value'
            }
        })
        .cartesian()
        .area([
            { data: [10,20,5,14,54,23,12,45] },
            { data: [40,32,32,43,65,73,12,33] },
            ])
        .tooltip()
        .render();
})();