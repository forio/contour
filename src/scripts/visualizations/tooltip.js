
Narwhal.export('tooltip', function (data, layer) {

    var visibleOpacity = 0.75;

    var clearHideTimer = function () {
        clearTimeout(this.tooltip.hideTimer);
    };

    var positionTooltip = function (ev) {
        return { x: ev.pageX + 10, y: ev.pageY - 10 };
    };

    var onMouseOver = function (d) {
        var ev = d3.event;
        var pos = positionTooltip(ev);

        show.call(this, d, pos);
    };

    var onMouseOut = function () {

        this.tooltipElement
            .transition().duration(500)
                .style('opacity', 0);
    };

    var getTooltipText = function (d) {
        if(this.options.tooltip.formatter) return this.options.tooltip.formatter.call(this, d);

        return  'x: ' + d.x + '<br>' + 'y: ' + d.y;
    };

    var show = function (d, pos) {
        clearHideTimer.call(this);
        var text = getTooltipText.call(this, d);

        this.tooltipElement.select('.text').html(text);

        this.tooltipElement
            .style('top', pos.y + 'px')
            .style('left', pos.x + 'px')
            .transition().duration(300)
                .style('opacity', visibleOpacity);
    };

    this.tooltipElement = this.container
        .append('div');

    this.tooltipElement
        .attr('class', 'nw-tooltip')
        .style('opacity', visibleOpacity)
        .append('div')
            .attr('class', 'text');

    this.svg.selectAll('.tooltip-tracker')
        .on('mouseover.tooltip', onMouseOver.bind(this))
        .on('mouseout.tooltip',  onMouseOut.bind(this));
});

