(function () {
    /**
    * Renders a tooltip legend combination for stacked series.
    *
    *
    * ### Example
    *     new Narwha({el: '.chart'})
    *           .stackedTooltip([1,2,3,4]);
    *
    * @name .stackedTooltip(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} options Options particular to this visualization that override the defaults. The `el` option must contain the selector the container where to render the tooptip
    * @api public
    *
    */
    Narwhal.export('stackTooltip', function (data, layer, options) {

        var valueFormatter = this.yAxis().tickFormat();
        var tooltip = d3.select(options.stackTooltip.el);

        tooltip.classed('stack-tooltip', true);

        /*jshint eqnull:true*/
        var onMouseOver = function (d) {
            var isNull = function (p) {
                return !(p && p.y != null);
            };
            var mapFn = function (p, i) {
                var index = _.isNumber(d.x) ? d.x : options.xAxis.categories.indexOf(d.x);
                return !isNull(p.data[index]) ?
                    { seriesName: p.name, value: p.data[index].y, cssClass: 's-' + (i+1) } :
                    null;
            };
            var filtered = _.filter(_.map(data, mapFn), function (x) { return x; });
            var text = _.map(filtered, function (t) { return '<span class="' + t.cssClass + '"">' + t.seriesName + ': ' + valueFormatter(t.value) + '</span>'; }).join(' / ');
            tooltip.html(text).style({display: 'block'});
        };

        var onMouseOut = function (/* datum */) {
            tooltip.html('');
        };

        this.svg.selectAll('.tooltip-tracker')
            .on('mouseover.tooltip', onMouseOver.bind(this))
            .on('mouseout.tooltip',  onMouseOut.bind(this));
    });
})();
