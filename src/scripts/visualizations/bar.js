(function () {


    function barRender(data, layer, options) {
        var opt = options.bar;
        var xScale = this.xScale;
        var yScale = this.yScale;
        var rangeBand = this.rangeBand;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });
        var enter = options.bar.stacked ? stacked : grouped;
        var numSeries = data.length;

        var series = layer.selectAll('g.series')
                .data(stack(data))
                .enter().append('svg:g')
                    .attr('class', classFn);

        var bar = series.selectAll('.bar')
                .data(function (d) { return d.data; })
                .enter().append('rect')
                    .attr('class', 'bar tooltip-tracker');

        enter.call(this, bar);

        function stacked(bar) {
            if(this.options.yAxis.max == null) {
                var flat = _.flatten(_.map(data, function (d) { return d.data; }));
                var max = _.max(flat, function (d) { return d.y0 + d.y; });
                this.setYDomain([0, max.y + max.y0]);
                this.redrawYAxis();
            }

            return bar
                .attr('y', function (d) { return xScale(d.x); })
                .attr('height', rangeBand)
                .attr('x', function (d) { return yScale(d.y0 || 0); })
                .attr('width', function (d) { return yScale(d.y); });
        }

        function grouped() {
            var height = function () { return rangeBand / numSeries - opt.padding; };
            var offset = function (d, i) { return rangeBand / numSeries * i; };

            return bar
                .attr('y', function (d, i, j) { return xScale(d.x) + offset(d, j); })
                .attr('height', height)
                .attr('x', function () { return yScale(0); })
                .attr('width', function (d) { return yScale(d.y); });
        }
    }

    var defaults = {
        bar: {
            stacked: false,
            padding: 2      // two px between same group bars
        }
    };

    barRender.defaults = defaults;
    /**
    * Renders a bar chart (horizontal columns) onto the narwhal frame.
    *
    * You can use this visualization to render stacked & grouped charts (controlled through the options). This visualization requires *cartesian()* and *horizontal()*
    *
    * ### Example
    *     new Narwha({el: '.chart'})
    *           .cartesian()
    *           .horizontal()
    *           .bar([1,2,3,4])
    *           .render();
    *
    * @name .bar(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('bar', barRender);

})();
