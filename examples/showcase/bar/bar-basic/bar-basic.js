(function () {
    new Narwhal({
            el: '.bar-basic',
            xAxis: {
                title: 'Index or Category',
            },
            yAxis: {
                title: 'Value'
            }
        })
        .cartesian()
        .horizontal()
        .bar([1, 2, 3, 4, 5, 4, 3, 2, 1])
        .tooltip()
        .render();
})();