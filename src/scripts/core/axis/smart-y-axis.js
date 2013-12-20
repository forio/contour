(function () {

    var SmartYAxis = function (data, options) {
        this.data = data;
        this.options = options;
    };


    function _extractYTickValues(domain, min, max) {

        /*jshint eqnull:true*/
        function smartAxisValues() {
            var adjustedDomain = _.nw.merge(domain, this.yMax);
            // we want to be able to remove parameters with default values
            // so to remove the default yAxis.min: 0, you pass yAxis.min: null
            // and for that we need to to a truely comparison here (to get null or undefined)
            if (min == null && max == null)
                return adjustedDomain;

            if (min == null) {
                return max > this.yMin ? _.nw.merge([max], adjustedDomain) : [max];
            }

            if (max == null) {
                if (min >= this.yMax) return [min];
                adjustedDomain[0] = min;

                return adjustedDomain;
            }

            return _.nw.merge([min, max], this.yMax);
        }

        return this.options.yAxis.smartAxis ? smartAxisValues.call(this) : undefined;
    }

    SmartYAxis.prototype = _.extend({}, _.nw.YAxis.prototype, {
        axis: function () {

            var options = this.options.yAxis;
            // var tickValues = this._extractYTickValues(this.yDomain, options.min, options.max);
            // var numTicks = this._numYTicks(this.yDomain, options.min, options.max);
            var format = d3.format(options.labels.format);
            var orient = options.orient;

            return d3.svg.axis()
                .scale(this.scale())
                .tickFormat(format)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .orient(orient)
                // .ticks(numTicks)
                // .tickValues(tickValues);
        },

        numTicks: function () {
            return 3;
        }


    });


    _.extend(_.nw, { SmartYAxis: SmartYAxis });

})();
