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
                    .domain(d3.extent(domain));

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

            if (this.options.xAxis.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            }

            return axis;
        },

        postProcessAxis: function (axisGroup) {
            var labels = axisGroup.selectAll('.tick text')[0];
            $(labels[0]).attr('style', 'text-anchor: start');
            $(labels[labels.length - 1]).attr('style', 'text-anchor: end');
        },

        rangeBand: function () {
            return 4;
        },

        getOptimalTickFormat: function () {
            var spanDays = dateDiff(this._domain[this._domain.length-1], this._domain[0]);
            if (spanDays < 1) return d3.time.format('%H:%M');
            return d3.time.format('%d %b');
        },

        range: function () {
            return this._scale.rangeRound([0, this.options.chart.plotWidth], 0.1);
        }
    };

    _.nw = _.extend({}, _.nw, { TimeScale: TimeScale });

})('Narwhal', window.d3, window._, window.jQuery);
