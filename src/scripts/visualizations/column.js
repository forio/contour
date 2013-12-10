(function (ns, d3, _, $, undefined) {

    var defaults = {
        column : {
            stacked: false,
            padding: 1
        }
    };

    function render(data, layer, options) {
        var opt = options.column;
        var h = this.options.chart.plotHeight;
        var x = this.xScale;
        var y = this.yScale;
        var rangeBand = this.rangeBand;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });
        var enter = this.options.column.stacked ? stacked : grouped;

        var series = layer.selectAll('g.series')
                .data(stack(data))
                .enter().append('g')
                    .attr('class', classFn);

        var col = series.selectAll('.column')
            .data(function(d) { return d.data; });
        col.enter().append('rect')
            .attr('class', 'column tooltip-tracker');

        enter.call(this, col);

        function stacked(col) {
            /*jshint eqnull:true */
            if(this.options.yAxis.max == null) {
                var flat = _.flatten(_.map(data, function (d) { return d.data; }));
                var max = _.max(flat, function (d) { return d.y0 + d.y; });
                this.setYDomain([0, max.y + max.y0]);
                this.redrawYAxis();
            }

            col.attr('x', function (d) { return x(d.x); })
                .attr('width', function () { return rangeBand; })
                .attr('y', function (d) { return y(d.y) + y(d.y0) - h; })
                .attr('height', function (d) { return h - y(d.y); });
        }

        function grouped(col) {
            var width = rangeBand / data.length - opt.padding;
            var offset = function (d, i) { return rangeBand / data.length * i; };

            col.attr('x', function (d, i, j) { return x(d.x) + offset(d, j); })
                .attr('width', width)
                .attr('y', function (d) { return y(d.y); })
                .attr('height', function (d) { return h - y(d.y); });
        }
    }

    render.defaults = defaults;

    /*
    * Renders a column chart (vertical columns) onto the narwhal frame.
    *
    * This visualization requires *cartesian()*
    *
    * ### Example
    *     new Narwha({el: '.chart'})
    *           .cartesian()
    *           .column([1,2,3,4]);
    *
    * @name .column(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('column', render);

})('Narwhal', window.d3, window._, window.jQuery);
