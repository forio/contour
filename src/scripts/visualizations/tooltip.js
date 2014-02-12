(function () {
    var defaults = {
        tooltip: {
            animate: true,
            opacity: 0.85,
            showTime: 300,
            hideTime: 500,
            distance: 5
        }
    };

    function render() {

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

        var positionTooltip = function (d) {
            var plotLeft = this.options.chart.plotLeft;
            var plotWidth = this.options.chart.plotWidth;
            var plotTop = this.options.chart.plotTop;
            var plotHeight = this.options.chart.plotHeight;
            var distance = this.options.tooltip.distance;
            var width = parseFloat(this.tooltipElement.style('width'));
            var height = parseFloat(this.tooltipElement.style('height'));
            var pointX = this.xScale ? this.xScale(d.x) : d3.event.x;
            var pointY = this.yScale ? this.yScale(d.y) : d3.event.y;
            var alignedRight;

            var pos = {
                x: plotLeft + pointX - (distance + width),
                y: plotTop + pointY - (distance + height)
            };

            // Check outside plot area (left)
            if (pos.x < plotLeft) {
                pos.x = plotLeft + Math.max(pos.x, 0) + distance;
            }

            // Check outside plot area (right)
            if (pos.x + width > plotLeft + plotWidth) {
                pos.x -= (pos.x + width) - (plotLeft + plotWidth);
                // Don't overlap point
                pos.y = plotTop + pointY - (height + distance);
                alignedRight = true;
            }

            // Check outside the plot area (top)
            if (pos.y < plotTop) {
                pos.y = plotTop + distance;

                // Don't overlap point
                if (alignedRight && pointY >= pos.y && pointY <= pos.y + height) {
                    pos.y = pointY + plotTop + distance;
                }
            }

            // Check outside the plot area (bottom)
            if (pos.y + height > plotTop + plotHeight) {
                pos.y = Math.max(plotTop, plotTop + plotHeight - (height + distance));
            }

            return pos;
        };

        var onMouseOver = function (d) {
            show.call(this, d);
        };

        var onMouseOut = function () {
            changeOpacity.call(this, 0, this.options.tooltip.hideTime);
        };

        var getTooltipText = function (d) {
            function match() {
                var params = Array.prototype.slice.call(arguments);
                var list = params[0];
                var rest = params.slice(1);

                var response = _.map(list, function(fn) { return fn.apply(this, rest); }).concat([_.noop]);

                return _.first(_.select(response));
            }
            var options = this.options.tooltip;
            var formatters = [
                function (d) { return options.formatter ? _.partial(options.formatter, d) : null; },
                function (d) { return d.hasOwnProperty('x') ? _.partial(function (d) { return 'x: ' + d.x + '<br>' + 'y: ' + d.y; }, d) : null; },
                function (d) { return d.data && d.data.hasOwnProperty('x') ? _.partial(function (d) { return d.x + '<br>' + d.y; }, d.data) : null; },
                function (d) { return d.hasOwnProperty('value') ? _.partial(function (d) { return d.value; }, d) : null;  },
                function () { return function () { return 'NA'; }; }
            ];


            return match(formatters, d)();
        };

        var show = function (d) {
            clearHideTimer.call(this);

            this.tooltipElement.select('.text').html(getTooltipText.call(this, d));

            var pos = positionTooltip.call(this, d);

            this.tooltipElement
                .style('top', pos.y + 'px')
                .style('left', pos.x + 'px');

            changeOpacity.call(this, this.options.tooltip.opacity, this.options.tooltip.showTime);
        };

        this.tooltipElement = this.container
            .style('position', 'relative')
            .selectAll('.nw-tooltip').data([1]);

        this.tooltipElement
            .enter().append('div')
            .attr('class', 'nw-tooltip')
            .style('opacity', 0)
            .append('div')
                .attr('class', 'text');

        this.svg.selectAll('.tooltip-tracker')
            .on('mouseover.tooltip', onMouseOver.bind(this))
            .on('mouseout.tooltip',  onMouseOut.bind(this));
    }

    render.defaults = defaults;


    /*
    * Adds a tooltip on hover to all other visualizations in the Narwhal instance.
    *
    * Although not strictly required, this visualization does not appear unless there are one or more additional visualizations in this Narwhal instance for which to show the tooltips.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .line([2, 4, 3, 5, 7])
    *           .tooltip()
    *           .render();
    *
    * @name tooltip(data, options)
    * @param {object|array} data Ignored!
    * @param {object} options Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('tooltip', render);


})();


