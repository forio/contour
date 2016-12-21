(function () {

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
            _.merge(this.options, defaults);
        },

        adjustPadding: function () {
            var categoryLabels = this.options.xAxis.categories || _.map(this.dataSrc, 'x');
            var text = categoryLabels.join('<br>');
            var xLabel = _.nw.textBounds(text, '.x.axis');
            var yLabel = _.nw.textBounds('ABC', '.y.axis');
            var maxTickSize = function (options) { return Math.max(options.outerTickSize, options.innerTickSize); };

            this.options.chart.internalPadding.left = this.options.chart.padding.left || maxTickSize(this.options.xAxis) + this.options.xAxis.tickPadding + xLabel.width;
            this.options.chart.internalPadding.bottom = this.options.chart.padding.bottom || maxTickSize(this.options.yAxis) + this.options.yAxis.tickPadding + yLabel.height;
        },

        adjustTitlePadding: function () {
            var titleBounds;
            if (this.options.xAxis.title || this.options.yAxis.title) {
                if(this.options.xAxis.title) {
                    titleBounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                    this.options.chart.internalPadding.left += titleBounds.height + this.options.xAxis.titlePadding;
                }

                if(this.options.yAxis.title) {
                    titleBounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                    this.options.chart.internalPadding.bottom += titleBounds.height + this.options.yAxis.titlePadding;
                }
            }
        },

        renderYAxis: function () {
            var yAxis = this.yAxis();
            var x = this.options.chart.internalPadding.left;
            var y = this.options.chart.padding.top + this.options.chart.plotHeight;

            this._yAxisGroup = this.svg.selectAll('.y.axis')
                .data([1]);

            this._yAxisGroup.enter().append('g')
                .attr('class', 'y axis')
                .attr('transform', 'translate(' + x+ ',' + y + ')');

            this._yAxisGroup.exit().remove();

            this._yAxisGroup
                    .transition().duration(this._animationDuration())
                    .attr('transform', 'translate(' + x+ ',' + y + ')')
                    .call(yAxis);

            return this;
        },

        renderXAxis: function () {
            var x = this.options.chart.internalPadding.left;
            var y = this.options.chart.padding.top;
            var xAxis = this.xAxis();

            this._xAxisGroup = this.svg.selectAll('.x.axis')
                .data([1]);

            this._xAxisGroup.enter().append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(' + x + ',' + y + ')');

            this._xAxisGroup.exit().remove();

           this._xAxisGroup
                .transition().duration(this._animationDuration())
                .attr('transform', 'translate(' + x + ',' + y + ')')
                .call(xAxis);

            this.xScaleGenerator.postProcessAxis(this._xAxisGroup);

            return this;
        },

        renderAxisLabels: function () {
            var lineHeightAdjustment = this.titleOneEm * 0.25; // add 25% of font-size for a complete line-height
            var adjustFactor = 40/46.609;
            var el;
            var bounds, anchor, rotation, tickSize, x, y;

            if (this.options.xAxis.title) {
                bounds = _.nw.textBounds(this.options.xAxis.title, '.x.axis-title');
                x = this.options.chart.rotatedFrame ? -bounds.height : this.options.chart.plotWidth;
                y = this.options.chart.rotatedFrame ? -this.options.chart.internalPadding.left : this.options.chart.internalPadding.bottom - lineHeightAdjustment;

                rotation = this.options.chart.rotatedFrame ? '-90' : '0';
                el = this._xAxisGroup.selectAll('.x.axis-title').data([null]);

                el.enter().append('text')
                    .attr('class', 'x axis-title');

                el.attr('x', 0)
                    .attr('y', y)
                    .attr('transform', ['rotate(', rotation, ')'].join(''))
                    .attr('dy', bounds.height * adjustFactor)
                    .attr('dx', -(this.options.chart.plotHeight + bounds.width) / 2)
                    .text(this.options.xAxis.title);

                el.exit().remove();
            }

            if (this.options.yAxis.title) {
                bounds = _.nw.textBounds(this.options.yAxis.title, '.y.axis-title');
                tickSize = Math.max(this.options.yAxis.innerTickSize, this.options.yAxis.outerTickSize);
                anchor = this.options.chart.rotatedFrame ? 'end' : 'middle';
                x = this.options.chart.rotatedFrame ? this.options.chart.plotWidth : 0;
                y = this.options.chart.rotatedFrame ?
                    this.options.chart.internalPadding.bottom:
                    -this.options.chart.internalPadding.left + this.titleOneEm - lineHeightAdjustment;

                rotation = this.options.chart.rotatedFrame ? '0' : '-90';

                el = this._yAxisGroup.selectAll('.y.axis-title').data([null]);

                el.enter().append('text')
                    .attr('class', 'y axis-title');

                el.attr('y', y)
                    .attr('x', x)
                    .attr('dx', -(this.options.chart.plotWidth + bounds.width) / 2)
                    .attr('dy', -4) // just because
                    .attr('transform', ['rotate(', rotation, ')'].join(''))
                    .text(this.options.yAxis.title);

                el.exit().remove();
            }

            return this;
        }
    };

    /**
    * Sets the visualization frame so that the xAxis is vertical and the yAxis is horizontal.
    *
    * This visualization requires `.cartesian()`.
    *
    * This visualization is a prerequiste for rendering bar charts (`.bar()`).
    *
    * ###Example:
    *
    *     new Contour({el: '.myChart'})
    *        .cartesian()
    *        .horizontal()
    *        .bar([1, 2, 3, 4, 5, 4, 3, 2, 1])
    *        .render()
    *
    * @function horiztonal
    */

    Contour.expose('horizontal', frame);

})();
