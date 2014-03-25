$(function () {

    Contour.export('lineMarker', function (data, layer) {

        var y = this.yScale(data.value);

        // use d3 to draw the path for this visualization
        // margin the range
        layer.append('path')
            .attr('d', 'M0,' + y + ' L' + this.options.chart.plotWidth + ',' + y)
            .attr('class', data.cssClass);

        layer.append('text')
            .attr('class', 'line-marker-text')
            .attr('x', this.options.chart.plotWidth)
            .attr('y', y)
            .attr('dy', '1em')
            .attr('text-anchor', 'end')
            .text(data.label);

        layer.append('text')
            .attr('class', 'line-marker-text')
            .attr('x', this.options.chart.plotWidth)
            .attr('y', y)
            .attr('dy', '-.31em')
            .attr('text-anchor', 'end')
            .text(data.value);

    });

    var data = [ 83, 101, 116, 109, 109, 75, 84, 98, 105, 76, 98, 113, 124, 101, 115, 122, 101, 100, 82, 110, 107, 85, 105, 75, 92, 82, 83, 101, 85, 120, 96, 104, 120, 120, 116, 99, 113, 105, 122 ];

    new Contour({
            el: '.line-export',
            xAxis: {
                type: 'linear',
                title: 'Sample No.',
            },
            yAxis: {
                title: 'Speed (mm/s)',
                min: 50
            }
        })
        .cartesian()
        .lineMarker({ value: 70, label: 'Low', cssClass: 'line-marker low-mark' })
        .lineMarker({ value: 90, label: 'Expected', cssClass: 'line-marker expected-mark' })
        .lineMarker({ value: 125, label: 'High', cssClass: 'line-marker high-mark' })
        .line(data)
        .tooltip()
        .render();
});
