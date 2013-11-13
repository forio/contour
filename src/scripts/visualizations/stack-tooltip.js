Narwhal.export('stackTooltip', function (data, layer, options) {

    var valueFormatter = this.yAxis().tickFormat();
    var tooltip = $(options.stackTooltip.el);

    tooltip.addClass('stack-tooltip');

    var onMouseOver = function (d) {
        var filtered = _.filter(_.map(data, function (p, i) { return p.data[d.x] ? { z: p.name, y: p.data[d.x].y, class: 's-' + (i+1) } : null; }), function (x) { return x; });
        var text = _.map(filtered, function (t) { return '<span class="' + t.class + '"">' + t.z + ': ' + valueFormatter(t.y) + '</span>'; }).join(' / ');
        tooltip.html(text).show();
    };

    var onMouseOut = function (d) {
        tooltip.html('');
    };

    this.svg.selectAll('.tooltip-tracker')
        .on('mouseover.tooltip', onMouseOver.bind(this))
        .on('mouseout.tooltip',  onMouseOut.bind(this));
});
