(function (window, undefined) {

    var defaults = {
        area: {

        }
    };

    function renderer(data, layer, options) {
        var x = _.bind(function (d) { return this.xScale(d.x) + this.rangeBand / 2; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);

        _.each(data, renderSeries, this);

        function renderSeries(series, index) {
            var seriesName = function () { return series.name.replace(' ', '_') + ' s-' + (index+1); };
            var area = d3.svg.area()
                .x(function(d) { return x(d); })
                .y0(this.options.chart.plotHeight)
                .y1(function(d) { return y(d); });

            var g = layer.append('g')
                    .attr('class', seriesName());

            g.append('path')
                .datum(series.data)
                .attr('class', 'area')
                .attr('d', area);

        }

    }

    renderer.defaults = defaults;

    Narwhal.export('area', renderer);

})(window);
