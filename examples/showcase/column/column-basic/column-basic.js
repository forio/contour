(function () {
    new Narwhal({
            el: '.column-basic',
            xAxis: {
                title: 'Index or Category',
            },
            yAxis: {
                title: 'Value'
            }
        })
        .cartesian()
        .column([1, 2, 3, 4, 5, 4, 3, 2, 1])
        .tooltip()
        .render();
})();