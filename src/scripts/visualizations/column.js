(function (ns, d3, _, $, undefined) {

    var defaults = {
    };

    function render(data, svg, options, id) {
        var h = this.options.chart.plotHeight;
        var x = this.xScale;
        var y = this.yScale;
        var colWidth = this.rangeBand;
        var min = this.options.yAxis.min || this.yMin;


        var g = svg.append('g')
            .attr('vis-id', id)
            .attr('type', 'column-chart')
            .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')');

        var col = g.selectAll('.column')
            .data(data);

        col.enter().append('rect')
                .attr('class', 'bar vis-'+id)
                .attr('x', function (d) { return x(d.x); })
                .attr('y', function () { return y(min); })
                .attr('height', 0)
                .attr('width', function () { return colWidth; });

        if (this.options.chart.animations) {
            var delay = 3;
            col.transition().delay(function (d, i) { return i * delay; })
                .duration(500)
                .attr('height', function (d) { return h - y(d.y); })
                .attr('y', function (d) { return y(d.y); });

        } else {
            col.attr('height', function (d) { return h - y(d.y); })
                .attr('y', function (d) { return y(d.y); });

        }
    }

    render.defaults = defaults;
    Narwhal.export('column', render);

})('Narwhal', window.d3, window._, window.jQuery);
