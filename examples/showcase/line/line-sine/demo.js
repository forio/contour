(function () {
    var pi = Math.PI;

    new Contour({
            el: '.line-sine',
            xAxis: {
                title: 'Index',
            },
            yAxis: {
                title: 'Value'
            },
            line: {
                smooth: true,
                marker: { enable: false }
            },
            chart: {
                gridlines: 'both'
            }
        })
        .cartesian()
        .line([{x: 0, y: 0},{x: pi / 4, y: .707},{x: pi / 2, y: 1},{x: 3 * pi / 4, y: .707},{x: pi, y: 0},{x: 5 * pi / 4, y: -.707},{x: 3 * pi / 2, y: -1},{x: 7 * pi / 4, y: -.707},{x: 2 * pi, y: 0}])
        .tooltip()
        .render();
})();
