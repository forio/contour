(function () {

    var defaults = {
        xAxis: {
            type: 'linear'
        },
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

    /*
    * Adds a scatter plot to the Narwhal instance.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.chart'})
    *           .cartesian()
    *           .scatter([1,2,3,4])
    *           .render();
    *
    * @name scatter(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('scatter', ScatterPlot);


})();
