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

    /**
    * Renders a 'trend line' for the given data.
    *
    * The trend like is calculated using linear regression (min square error fit)
    *
    * ### Example
    *     new Narwha({el: '.chart'})
    *           .trendLine(data);
    *
    * @name .trendLine(data, options)
    * @param {object|array} data the data to use for the linear regression
    * @param {object} options Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('trendLine', ctor);

})();
