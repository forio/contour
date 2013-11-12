(function (window, undefined) {
    var d3 = window.d3;
    var _ = window._;

    var defaults = {
        chart: {
            rotatedFrame: true,

        },

        xAxis: {
            orient: 'left'
        },

        yAxis: {
            orient: 'bottom'
        }
    };

    var frame = {

        init: function () {
            $.extend(true, this.options, defaults);
        },

        adjustPadding: function () {

            var categoryLabels = this.options.xAxis.categories || _.pluck(this.dataSrc, 'x');
            var text = categoryLabels.join('<br>');
            var xLabel = _.nw.textBounds(text, '.x.axis');
            var yLabel = _.nw.textBounds('ABC', '.y.axis');
            var maxTickSize = function (options) { return Math.max(options.outerTickSize, options.innerTickSize); };

            this.options.chart.padding.left = maxTickSize(this.options.xAxis) + this.options.xAxis.tickPadding + xLabel.width;
            this.options.chart.padding.bottom = maxTickSize(this.options.yAxis) + this.options.yAxis.tickPadding + yLabel.height;
        },

        adjustTitlePadding: function () {
            if (this.options.xAxis.title || this.options.yAxis.title) {
                if(this.options.xAxis.title) {
                    var titleBounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                    this.options.chart.padding.left += titleBounds.height + this.options.xAxis.titlePadding;
                }

                if(this.options.yAxis.title) {
                    var titleBounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                    this.options.chart.padding.bottom += titleBounds.height + this.options.yAxis.titlePadding;
                }
            }

        },

        renderYAxis: function () {
            var yAxis = this.yAxis();
            var x = this.options.chart.padding.left;
            var y = this.options.chart.padding.top + this.options.chart.plotHeight;

            this._yAxisGroup = this.svg.append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + x+ ',' + y + ')')
                .call(yAxis);

            return this;
        },

        renderXAxis: function () {
            var x = this.options.chart.padding.left;
            var y = this.options.chart.padding.top;
            var xAxis = this.xAxis();

            this._xAxisGroup = this.svg
                .append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + x + ',' + y + ')')
                .call(xAxis);

            this.scaleGenerator.postProcessAxis(this._xAxisGroup);

            return this;
        },

        renderAxisLabels: function () {
            var lineHeightAdjustment = this.titleOneEm * 0.25; // add 25% of font-size for a complete line-height
            var adjustFactor = 40/46.609;

            var bounds, anchor, lineHeight, rotation, tickSize;

            if (this.options.xAxis.title) {
                bounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                x = this.options.chart.rotatedFrame ? -bounds.height : this.options.chart.plotWidth;
                y = this.options.chart.rotatedFrame ? -this.options.chart.padding.left : this.options.chart.padding.bottom - lineHeightAdjustment;

                rotation = this.options.chart.rotatedFrame ? '-90' : '0';
                this._xAxisGroup.append('text')
                    .attr('class', 'x axis-title')
                    .attr('text-anchor', 'end')
                    .attr('x', 0)
                    .attr('y', y)
                    .attr('transform', ['rotate(', rotation, ')'].join(''))
                    .attr('dy', bounds.height * adjustFactor)
                    .attr('dx', -(this.options.chart.plotHeight - bounds.width) / 2)
                    .text(this.options.xAxis.title);
            }

            if (this.options.yAxis.title) {
                bounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                tickSize = Math.max(this.options.yAxis.innerTickSize, this.options.yAxis.outerTickSize);
                anchor = this.options.chart.rotatedFrame ? 'end' : 'middle';
                x = this.options.chart.rotatedFrame ? this.options.chart.plotWidth : 0;
                y = this.options.chart.rotatedFrame ?
                    this.options.chart.padding.bottom:
                    -this.options.chart.padding.left + this.titleOneEm - lineHeightAdjustment;

                rotation = this.options.chart.rotatedFrame ? '0' : '-90';

                this._yAxisGroup.append('text')
                    .attr('class', 'y axis-title')
                    .attr('text-anchor', anchor)
                    .attr('y', y)
                    .attr('x', x)
                    .attr('dx', -(this.options.chart.plotWidth - bounds.width) / 2)
                    .attr('dy', -4) // just because
                    .attr('transform', ['rotate(', rotation, ')'].join(''))
                    .text(this.options.yAxis.title);
            }
        }
    };

    window.Narwhal.expose('horizontal', frame);

})(window);
