(function () {

    var SmartYAxis = function (data, options, domain) {
        this.data = data;
        this.options = options;
        this.yMax = domain[0];
        this.yMin = domain[1];
        this.dataMax = d3.max(_.pluck(data, 'y'));
    };

    /* jshint eqnull: true */
    function _extractYTickValues(domain, min, max, yMin, yMax, dataMax) {
        var adjustedDomain = _.nw.merge(_.nw.merge(domain, yMax), dataMax);
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
            this.domain = this._scale.domain();
            var tickValues = _extractYTickValues(this.domain, options.min, options.max, this.yMin, this.yMax, this.dataMax);
            var numTicks = this.numTicks();
            var axis = _.nw.YAxis.prototype.axis.call(this);
            return axis.ticks(numTicks)
                .tickValues(tickValues);
        },

        numTicks: function () {
            return 3;
        },

        setDomain: function (domain) {
            var extent = d3.extent(domain);
            this.yMin = extent[0];
            this.yMax = extent[1];
            this._scale.domain(domain);

            this._niceTheScale();
        },

        _niceTheScale: function () {
            var domain = this._scale.domain();
            var nice = [this.options.yAxis.min || domain[0], this.options.yAxis.max || this.dataMax];
            this._scale.domain(nice).nice();
        }
    });

    _.extend(_.nw, { SmartYAxis: SmartYAxis });

})();
