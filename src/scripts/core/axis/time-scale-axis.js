(function (ns, d3, _, $, undefined) {

    // implements the following interface
    /*
    {
        scale: returns the d3 scale for the type

        range: returns the d3 range for the type
    }
    */

    function dateDiff(d1, d2) {
        var diff = d1.getTime() - d2.getTime();
        return diff / (24*60*60*1000);
    }


    function TimeScale(data, options) {
        this.options = options;
        this.data = data;

        this.init();
    }

    TimeScale.prototype = {
        init: function () {
            delete this._scale;
        },

        scale: function (domain) {
            this._domain = domain;
            if(!this._scale) {
                this._scale = new d3.time.scale()
                    .domain(d3.extent(this._domain));

                this.range();
            }

            return this._scale;
        },

        axis: function () {
            var options = this.options.xAxis;
            var tickFormat = this.getOptimalTickFormat();

            var axis = d3.svg.axis()
                .scale(this._scale)
                .tickFormat(tickFormat)
                .innerTickSize(options.innerTickSize)
                .outerTickSize(options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickValues(this._domain);

            if (this.options.xAxis.maxTicks != null && this.options.xAxis.maxTicks < this._domain.length) {
                // override the tickValues with custom array based on number of ticks
                // we don't use D3 ticks() because you cannot force it to show a specific number of ticks
                var customValues = [];
                var len = this._domain.length;
                var step = (len + 1) / this.options.xAxis.maxTicks;

                // for (var j=0, index = 0; j<this.options.xAxis.ticks; j++, index += step) {
                for (var j=0, index = 0; j<len; j += step, index += step) {
                    customValues.push(this._domain[Math.min(Math.ceil(index), len-1)]);
                }

                axis.tickValues(customValues);

            } else if (this.options.xAxis.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            }

            return axis;
        },

        postProcessAxis: function (axisGroup) {
            if (!this.options.xAxis.firstAndLast) return;
            var labels = axisGroup.selectAll('.tick text')[0];
            $(labels[0]).attr('style', 'text-anchor: start');
            $(labels[labels.length - 1]).attr('style', 'text-anchor: end');
        },

        rangeBand: function () {
            return 4;
        },

        getOptimalTickFormat: function () {
            var spanDays = dateDiff(this._domain[this._domain.length-1], this._domain[0]);
            var daysThreshold = this.options.xAxis.maxTicks || 5;
            if (spanDays < daysThreshold) return d3.time.format('%H:%M');
            return d3.time.format('%d %b');
        },

        range: function () {
            return this._scale.rangeRound([0, this.options.chart.plotWidth], 0.1);
        }
    };

    _.nw = _.extend({}, _.nw, { TimeScale: TimeScale });

})('Narwhal', window.d3, window._, window.jQuery);
