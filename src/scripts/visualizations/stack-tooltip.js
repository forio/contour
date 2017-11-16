(function () {
    var defaults = {
        tooltip: {
            enable: true
        }
    };

    /**
    * Adds a tooltip and legend combination for stacked (multiple) series visualizations in the Contour instance.
    * Requires a second display element (`<div>`) for the legend in the html.
    *
    * ### Example:
    *
    *     new Contour({el: '.myChart'})
    *           .cartesian()
    *           .column(stackedColData)
    *           .stackTooltip(stackedColData, {el: '.myChartLegend'})
    *           .render();
    *
    * @name stackTooltip(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} options Configuration options particular to this visualization that override the defaults. Requires an `el` option with the selector of the container in which to render the tooltip.
    * @api public
    *
    * ### Notes:
    *
    * Each Contour instance can only include one `stackTooltip` visualization.
    */
    function stackTooltip(data, layer, options) {

        var valueFormatter = this.yAxis().tickFormat();
        var tooltip = d3.select(options.stackTooltip.el);

        tooltip.classed('stack-tooltip', true);

        // jshint eqnull:true
        var onMouseOver = function (d) {
            var isNull = function (p) {
                return !(p && p.y != null);
            };
            var mapFn = function (p, i) {
                var index = _.nw.isNumber(d.x) ? d.x : options.xAxis.categories.indexOf(d.x);
                return !isNull(p.data[index]) ?
                    { seriesName: p.name, value: p.data[index].y, cssClass: 's-' + (i+1) } :
                    null;
            };
            var filtered =data.map(mapFn).filter(function (x) { return x; });
            var text = filtered.map(function (t) { return '<span class="' + t.cssClass + '"">' + t.seriesName + ': ' + valueFormatter(t.value) + '</span>'; }).join(' / ');
            tooltip.html(text).style({display: 'block'});
        };

        var onMouseOut = function (// datum
                                    ) {
            tooltip.html('');
        };

        this.svg.selectAll('.tooltip-tracker')
            .on('mouseover.tooltip', onMouseOver.bind(this))
            .on('mouseout.tooltip',  onMouseOut.bind(this));
    }

    stackTooltip.defaults = defaults;

    Contour.export('stackTooltip', stackTooltip);

})();
