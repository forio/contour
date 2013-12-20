(function () {

    var SmartYAxis = function (data, options, yMin, yMax) {
        this.data = data;
        this.options = options;
        this.yMax = yMax;
        this.yMin = yMin;
    };

    function _extractYTickValues(domain, min, max, yMin, yMax) {
        var adjustedDomain = _.nw.merge(domain, yMax);
        // we want to be able to remove parameters with default values
        // so to remove the default yAxis.min: 0, you pass yAxis.min: null
        // and for that we need to to a truely comparison here (to get null or undefined)
        if (min == null && max == null)
            return adjustedDomain;

        if (min == null) {
            return max > yMin ? _.nw.merge([max], adjustedDomain) : [max];
        }

        if (max == null) {
            if (min >= yMax) return [min];
            adjustedDomain[0] = min;

            return adjustedDomain;
        }

        return _.nw.merge([min, max], yMax);
    }

    SmartYAxis.prototype = _.extend({}, _.nw.YAxis.prototype, {
        axis: function () {
            var options = this.options.yAxis;
            var domain = this._scale.domain();
            var tickValues = _extractYTickValues(domain, options.min, options.max, this.yMin, this.yMax);
            var numTicks = this.numTicks();
            var axis = _.nw.YAxis.prototype.axis.call(this);
            return axis.ticks(numTicks)
                .tickValues(tickValues);
        },

        numTicks: function () {
            return 3;
        },

        _niceTheScale: function () {
            // do nothing here
        }
    });

    _.extend(_.nw, { SmartYAxis: SmartYAxis });

})();
