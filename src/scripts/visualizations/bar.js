(function () {

    var defaults = {
        bar: {
            stacked: false,
            padding: 2      // two px between same group bars
        }
    };

    function barRender(data, layer, options) {

        if (!options.chart.rotatedFrame) throw new Error('Bar Chart requires .horizontal() to be included in the instance');

        var duration = 400;
        var x = this.xScale;
        var y = this.yScale;
        var rangeBand = this.rangeBand;
        var stack = d3.layout.stack().values(function (d) { return d.data; });
        var update = options.bar.stacked ? stacked : grouped;
        var enter = _.partialRight(update, true);
        var classFn = function (d, i) { return 'series s-' + (i+1); };

        var series = layer.selectAll('g.series')
            .data(stack(data));

        series.enter().append('svg:g')
            .attr('class', classFn);

        series.exit().remove();

        var bars = series.selectAll('.bar')
            .data(function (d) { return d.data; });

        bars.enter().append('rect')
            .attr('class', 'bar tooltip-tracker')
            .call(enter);

        if(options.chart.animations) {
            bars.transition().duration(duration).call(update);
            bars.exit()
                .transition().duration(duration)
                .attr('width', y(0))
                .remove();
        } else {
            bars.call(update);
            bars.exit().remove();
        }

        function stacked(bar, enter) {
            bar
                .attr('y', function (d) { return x(d.x); })
                .attr('height', rangeBand);

            if (enter) {
                return bar
                    .attr('x', function (d) { return y(0); })
                    .attr('width', function (d) { return y(0); });

            } else {
                return bar
                    .attr('x', function (d) { return y(d.y0 || 0); })
                    .attr('width', function (d) { return y(d.y); });
            }
        }

        function grouped(bar, enter) {
            var numSeries = data.length;
            var height = function () { return rangeBand / numSeries - options.bar.padding; };
            var offset = function (d, i) { return rangeBand / numSeries * i; };

            bar.attr('y', function (d, i, j) { return x(d.x) + offset(d, j); })
                .attr('x', 0)
                .attr('height', height);

            if (enter) {
                return bar
                    .attr('width', function (d) { return y(0); });
            } else {
                return bar
                    .attr('width', function (d) { return y(d.y); });
            }
        }
    }

    barRender.defaults = defaults;
    /**
    * Adds a bar chart (horizontal columns) to the Contour instance.
    *
    * You can use this visualization to render both stacked and grouped charts (controlled through the _options_).
    *
    * This visualization requires `.cartesian()` and `.horizontal()`.
    *
    * ### Example:
    *
    *     new Contour({el: '.myChart'})
    *           .cartesian()
    *           .horizontal()
    *           .bar([1,2,3,4])
    *           .render();
    *
    * @name bar(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Contour.export('bar', barRender);

})();
