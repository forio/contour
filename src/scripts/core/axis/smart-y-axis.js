(function () {

    var SmartYAxis = function (data, options, domain, which) {
        this.data = data;
        this.options = options;
        this.yMax = domain[0];
        this.yMin = domain[1];
        this.which = which;
        this.dataMax = _dataMax(this.data, this.options[which]);
    };

    function _dataMax(data, axisOptions) {
        var maxes = [];
        _.each(data, function(d) {
            var isAll = axisOptions && axisOptions.series == 'all';
            var hasSpecific = axisOptions && axisOptions.series;
            if (!isAll && hasSpecific) {
                var found = false;
                var seriesWhiteList = axisOptions.series;
                seriesWhiteList.forEach(function(whiteSeries) {
                    if ((typeof whiteSeries == "string" && whiteSeries == d.name) || (whiteSeries.name == d.name))
                        found = true;
                });

                hasSpecific = found;
            }

            if (isAll || hasSpecific) {
                var values = _.pluck(d.data, 'y');
                maxes.push(d3.max(values));
            }
        });

        return d3.max(maxes);
    }

    /* jshint eqnull: true */
    function _extractYTickValues(domain, min, max, yMin, yMax, dataMax) {
        var adjustedDomain = _.uniq(_.nw.merge(_.nw.merge(domain, yMax), dataMax));
        // we want to be able to remove parameters with default values
        // so to remove the default yAxis.min: 0, you pass yAxis.min: null
        // and for that we need to to a truly comparison here (to get null or undefined)
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
            var options = this.options[this.which];
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

        update: function (domain, dataSrc) {
            this.data = dataSrc;
            this.dataMax = _dataMax(this.data, this.options[this.which]);
            this.setDomain(domain);
            this.scale();
        },

        _niceTheScale: function () {
            var perTreshold = 0.05;
            var domain = this._scale.domain();
            var min = this.options[this.which].min || domain[0];
            var rawMax = this.options[this.which].max || this.dataMax;
            var nextTick = _.nw.roundToNextTick(rawMax);

            var max = Math.abs(nextTick - rawMax) < rawMax * perTreshold ? _.nw.roundToNextTick(rawMax + rawMax * perTreshold) : nextTick;
            // var max = nextTick === rawMax ? _.nw.roundToNextTick(rawMax + Math.pow(10, -_.nw.decDigits(rawMax) - 1)) : nextTick;
            var nice = [min, max];
            this._scale.domain(nice);
        }
    });

    _.extend(_.nw, { SmartYAxis: SmartYAxis });

})();
