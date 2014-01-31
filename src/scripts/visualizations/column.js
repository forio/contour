(function () {

    var defaults = {
        column : {
            stacked: false,
            groupPadding: 1,
            columnWidth: function() { return this.rangeBand; },
            offset: function() { return 0; }
        }
    };

    function render(data, layer, options) {
        var duration = 400;
        var opt = options.column;
        var w = options.chart.plotWidth;
        var h = options.chart.plotHeight;
        var x = this.xScale;
        var y = this.yScale;
        var dataKey = function (d) { return d.data; };
        var chartOffset = _.nw.getValue(opt.offset, 0, this);
        var rangeBand = _.nw.getValue(opt.columnWidth, this.rangeBand, this);
        var enter = _.partialRight((options.column.stacked ? stacked : grouped), true);
        var update = options.column.stacked ? stacked : grouped;
        var stack = d3.layout.stack().values(function (d) {
            return d.data;
        });

        var series = layer.selectAll('g.series')
                .data(stack(data));

        series.enter()
            .append('g')
            .attr('class', function (d, i) { return 'series s-' + (i+1); });

        series.exit()
            .remove();

        var cols = series.selectAll('.column')
                .data(dataKey);

        var offset = function (d, i) { return rangeBand / data.length * i; };
        var width = rangeBand / data.length - opt.groupPadding;

        cols.enter()
            .append('rect')
            .attr('class', 'column tooltip-tracker')
            .call(enter);

        if (options.chart.animations) {
            cols.exit()
                .transition().duration(duration)
                .attr('y', h)
                .attr('height', function () { return 0; })
                .remove();
            cols.transition().duration(duration)
                .call(update);
        } else {
            cols.exit().remove();
            cols.call(update);
        }

        function stacked(col, enter) {
            col.attr('x', function (d) { return x(d.x) + chartOffset; })
                .attr('width', function () { return rangeBand; });

            if (enter) {
                col
                    .attr('y', function (d) { return h; })
                    .attr('height', function (d) { return 0; });
            } else {
                col
                    .attr('y', function (d) { return y(d.y) + y(d.y0) - h; })
                    .attr('height', function (d) { return h - y(d.y); });
            }
        }

        function grouped(col, enter) {
            var width = rangeBand / data.length - opt.groupPadding;
            var offset = function (d, i) { return rangeBand / data.length * i; };

            col.attr('x', function (d, i, j) { return x(d.x) + offset(d, j) + chartOffset; })
                .attr('width', width);

            if (enter)
                col.attr('y', _.nw.clampLeft(h, 0))
                    .attr('height', 0);
            else
                col.attr('height', function (d) { return h - y(d.y); })
                    .attr('y', function (d) { return y(d.y); });
        }
    }

    render.defaults = defaults;

    /*
    * Adds a column chart (vertical columns) to the Narwhal instance.
    *
    * This visualization requires *.cartesian()*.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .column([1,2,3,4])
    *           .render();
    *
    * @name column(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('column', render);

})();
