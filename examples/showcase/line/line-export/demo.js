(function () {

    Contour.export('lineMarker', function (data, layer) {
            var y = this.yScale(data);
            // use d3 to draw the path for this visualization
            layer.append('path')
                .attr('d', 'M0,' + y + ' L' + this.options.chart.plotWidth + ',' + y)
                .attr('stroke', '#000');     
    });

    new Contour({
            el: '.line-export',
            xAxis: {
                title: 'Index',
            },
            yAxis: {
                title: 'Value'
            }
        })
        .cartesian()
        .line([{x: 0, y: 103},{x: 44, y: 103},{x: 154, y: 36},{x: 309, y: 150},{x: 376, y: 150},{x: 400, y: 171}])
        .lineMarker(50)
        .lineMarker(100)
        .lineMarker(150)
        .tooltip()
        .render();
})();