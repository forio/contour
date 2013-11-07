(function () {
    var defaults = {
        tooltip: {
            animate: true,
            visibleOpacity: 0.75,
            showTime: 300,
            hideTime: 500
        }
    };

    function render(data, layer) {

        var clearHideTimer = function () {
            clearTimeout(this.tooltip.hideTimer);
        };

        var changeOpacity = function (opacity, delay) {
            if(this.options.tooltip.animate) {
                this.tooltipElement
                    .transition().duration(delay)
                        .style('opacity', opacity);
            } else {
                this.tooltipElement.style('opacity', opacity);
            }
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
            changeOpacity.call(this, 0, this.options.tooltip.hideTime);
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
                .style('left', pos.x + 'px');

            changeOpacity.call(this, this.options.tooltip.visibleOpacity, this.options.tooltip.showTime);
        };

        this.tooltipElement = this.container
            .append('div');

        this.tooltipElement
            .attr('class', 'nw-tooltip')
            .style('opacity', 0)
            .append('div')
                .attr('class', 'text');

        this.svg.selectAll('.tooltip-tracker')
            .on('mouseover.tooltip', onMouseOver.bind(this))
            .on('mouseout.tooltip',  onMouseOut.bind(this));
    }

    render.defaults = defaults;

    Narwhal.export('tooltip', render);


})();


