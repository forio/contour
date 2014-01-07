(function () {


    function ctor(data, layer, options) {
        var x = _.bind(function(d) { return this.xScale(d) + this.rangeBand / 2; }, this);
        var y = _.bind(function(d) { return this.yScale(d); }, this);
        var regression = _.nw.linearRegression(_.flatten(_.pluck(data, 'data')));
        var domain = d3.extent(this.xScale.domain());
        var lineY = function (x) { return regression.intercept + regression.slope * x; };

        layer.append('line')
            .attr('class', 'trend-line')
            .attr('x1', x(domain[0]))
            .attr('y1', y(lineY(domain[0])))
            .attr('x2', x(domain[1]))
            .attr('y2', y(lineY(domain[1])));
    }

    ctor.defaults = {};

    /*
    * Adds a trend line to the Narwhal instance, based on linear regression.
    * 
    * This visualization requires *.cartesian()*.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .trendLine([2,4,3,5,7])
    *           .render();
    *
    * @name .trendLine(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats. A linear regression is performed on the _data series_ and the resulting trend line is displayed.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('trendLine', ctor);

})();
