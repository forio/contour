(function (window, undefined) {

    var defaults = {
        scatter: {
            radius: 4
        }
    };

    function ScatterPlot(data, layer, options) {
        var opt = options.scatter;
        var halfRangeBand = this.rangeBand / 2;
        var x = _.bind(function (d) { return this.xScale(d.x) + halfRangeBand; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);

        _.each(data, renderSeries);

        function renderSeries(series, index) {
            var seriesName = function () { return series.name + ' s-' + (index+1); };
            var g = layer.append('g')
                .attr('class', seriesName);

            g.selectAll('dot')
                .data(series.data)
                .enter().append('circle')
                    .attr('class', 'dot tooltip-tracker')
                    .attr('r', opt.radius)
                    .attr('cx', x)
                    .attr('cy', y);
        }
    }

    ScatterPlot.defaults = defaults;
    Narwhal.export('scatter', ScatterPlot);


})(window);
