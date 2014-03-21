(function () {

    function LinearScale(data, options) {
        this.options = options;
        this.data = data;

        this.init();
    }

    LinearScale.prototype = {
        init: function () {
            delete this._scale;
        },

        /*jshint eqnull:true*/
        scale: function (domain) {
            this._domain = domain ? this._getAxisDomain(domain) : this._getAxisDomain(this.data);
            if(!this._scale) {
                this._scale = d3.scale.linear().domain(this._domain);
                if(this.options.xAxis.min == null && this.options.xAxis.max == null)
                    this._scale.nice();
                this._setRange();
            } else {
                this._scale.domain(this._domain);
            }

            return this._scale;
        },

        axis: function () {
            var options = this.options.xAxis;
            var formatLabel = options.labels.formatter || d3.format(options.labels.format || 'd');
            var axis = d3.svg.axis()
                .scale(this._scale)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickFormat(function (d) {
                    return _.isDate(d) ? d.getDate() : formatLabel(d);
                });

            if (options.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            } else if (options.tickValues) {
                axis.tickValues(options.tickValues);
            } else if (options.ticks != null) {
                axis.ticks(options.ticks);
            }

            return axis;
        },

        update: function (domain, dataSrc) {
            this.data = dataSrc;
            this.scale(domain);
        },

        rangeBand: function () {
            return 1;
        },

        postProcessAxis: function () {
            return this;
        },

        _setRange: function () {
            var rangeSize = !!this.options.chart.rotatedFrame ? this.options.chart.plotHeight : this.options.chart.plotWidth;
            var range = !!this.options.chart.rotatedFrame ? [rangeSize, 0]  : [0, rangeSize];
            return this._scale.range(range);
        },

        _getAxisDomain: function (domain) {
            /*jshint eqnull: true*/
            var optMin = this.options.xAxis.min;
            var optMax = this.options.xAxis.max;
            var min = optMin != null ? this.options.xAxis.min : d3.min(domain);
            var max = optMax != null ? this.options.xAxis.max : d3.max(domain);

            if(optMin != null && optMax != null && optMin > optMax) {
                return d3.extent(domain);
            }

            return [min, max];
        },
    };

    _.nw = _.extend({}, _.nw, { LinearScale: LinearScale });

})();
