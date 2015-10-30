(function () {

    function normalizeDataSet(dataSet) {
        var all = _.flatten(_.pluck(dataSet, 'data'));
        var isLinear = all.length && _.isNumber(all[0].x);
        var normalizer = function (d, i) { return { x: i, y: d.y }; };

        return isLinear ? all : _.map(all, normalizer);
    }

    function ctor(raw, layer, options) {
        this.checkDependencies('cartesian');
        var data = normalizeDataSet(raw);
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var shouldAnimate = options.chart.animations && options.chart.animations.enable;
        var x = _.bind(function(d) { return this.xScale(d) + this.rangeBand / 2; }, this);
        var y = _.bind(function(d) { return this.yScale(d); }, this);
        var regression = _.nw.linearRegression(data);
        var domain = d3.extent(this.xScale.domain());
        var numericDomain = d3.extent(data, function(p) { return p.x; });
        var lineY = function (x) { return regression.intercept + regression.slope * x; };

        var line = layer.selectAll('.trend-line')
            .data([1]);

        if (isNaN(lineY(numericDomain[0])) || isNaN(lineY(numericDomain[1])) || isNaN(x(domain[0])) || isNaN(x(domain[1]))) {
            line.remove();
        } else {
            line.enter().append('line')
              .attr('class', 'trend-line')
              .attr('x1', x(domain[0]))
              .attr('y1', y(lineY(numericDomain[0])))
              .attr('x2', x(domain[0]))
              .attr('y2', y(lineY(numericDomain[0])));

            line.exit().remove();

            if (shouldAnimate) {
                line = line.transition().duration(duration);
            }

            line.attr('x1', x(domain[0]))
              .attr('y1', y(lineY(numericDomain[0])))
              .attr('x2', x(domain[1]))
              .attr('y2', y(lineY(numericDomain[1])));
        }
    }

    ctor.defaults = {};

    /**
    * Adds a trend line to the Contour instance, based on linear regression.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Contour({el: '.myChart'})
    *           .cartesian()
    *           .trendLine([2,4,3,5,7])
    *           .render();
    *
    * @name trendLine(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats. A linear regression is performed on the _data series_ and the resulting trend line is displayed.
    * @param {object} [options] Configuration options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Contour.export('trendLine', ctor);

})();
