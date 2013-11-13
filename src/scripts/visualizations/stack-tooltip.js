Narwhal.export('stackTooltip', function (data, layer, options) {

    var valueFormatter = this.yAxis().tickFormat();
    var tooltip = $(options.stackTooltip.el);

    tooltip.addClass('stack-tooltip');

    var onMouseOver = function (d) {
        var isNull = function (p) {
            return !(p && p.y != null);
        };
        var filtered = _.filter(_.map(data, function (p, i) { return !isNull(p.data[d.x]) ? { seriesName: p.name, value: p.data[d.x].y, cssClass: 's-' + (i+1) } : null; }), function (x) { return x; });
        var text = _.map(filtered, function (t) { return '<span class="' + t.cssClass + '"">' + t.seriesName + ': ' + valueFormatter(t.value) + '</span>'; }).join(' / ');
        tooltip.html(text).show();
    };

    var onMouseOut = function (d) {
        tooltip.html('');
    };

    this.svg.selectAll('.tooltip-tracker')
        .on('mouseover.tooltip', onMouseOver.bind(this))
        .on('mouseout.tooltip',  onMouseOut.bind(this));
});
