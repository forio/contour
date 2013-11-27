(function (window, undefined) {

    var defaults = {
        area: {

        }
    };

    function renderer(data, layer, options) {
        var x = _.bind(function (val) { return this.xScale(val) + this.rangeBand / 2; }, this);
        var y = _.bind(function (val) { return this.yScale(val); }, this);
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });
        var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return y(d.y0 || 0); })
            .y1(function(d) { return y(d.y0 + d.y); });

        var series = layer.selectAll('g.series')
                .data(stack(data))
                .enter().append('g')
                    .attr('class', classFn);

        series
            .append('path')
            .datum(function(d) { return d.data; })
            .attr('class', 'area')
            .attr('d', area);

    }

    renderer.defaults = defaults;

    Narwhal.export('area', renderer);

})(window);
