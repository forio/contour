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
        var duration = 400;
        var x = _.bind(function (d) { return this.xScale(d.x) + halfRangeBand; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);
        var h = options.chart.plotHeight;
        var classFn = function (d, i) { return d.name + ' series s-' + (i+1); };

        var series = layer.selectAll('.series')
            .data(data);

        series.enter().append('svg:g')
            .attr('class', classFn);

        series.exit().remove();

        var dots = series.selectAll('.dot')
            .data(function (d) { return d.data; });

        dots
            .enter().append('circle')
                .attr('class', 'dot tooltip-tracker')
                .attr('r', opt.radius)
                .attr('cx', x)
                .attr('cy', h);

        if (options.chart.animations) {
            dots.transition().duration(duration);
        }

        dots.attr('r', opt.radius)
            .attr('cx', x)
            .attr('cy', y);

        dots.exit().remove();
    }

    ScatterPlot.defaults = defaults;

    /**
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
