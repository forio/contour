(function (window, undefined) {

    Narwhal.export('bar', function barRender(data, layer, options, i) {
        var xScale = this.xScale;
        var yScale = this.yScale;
        var rangeBand = this.rangeBand;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });

        var series = layer.selectAll('g.series')
                .data(stack(data))
                .enter().append('svg:g')
                    .attr('class', classFn);

        var bar = series.selectAll('.bar')
                .data(function (d) { return d.data; });

        bar.enter().append('rect')
            .attr('class', 'bar tooltip-tracker')
            .attr('y', function (d) { return xScale(d.x); })
            .attr('height', rangeBand)
            .attr('x', function (d) { return yScale(d.y0 || 0); })
            .attr('width', function (d) { return yScale(d.y); });
    });

})(window);
