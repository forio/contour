Narwhal.export('stackTooltip', function (data, layer, options) {

    var valueFormatter = this.yAxis().tickFormat();
    var tooltip = $(options.stackTooltip.el);

    tooltip.addClass('stack-tooltip');

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
        tooltip.html(text).show();
    };

    var onMouseOut = function (/* datum */) {
        tooltip.html('');
    };

    this.svg.selectAll('.tooltip-tracker')
        .on('mouseover.tooltip', onMouseOver.bind(this))
        .on('mouseout.tooltip',  onMouseOut.bind(this));
});
