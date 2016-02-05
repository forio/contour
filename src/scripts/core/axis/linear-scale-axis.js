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
            this._scale = this._scale || d3.scale.linear();
            this._scale.domain(this._domain);

            if (this.options.xAxis.min == null && this.options.xAxis.max == null) {
                this._scale.nice();
            }

            this._setRange();

            return this._scale;
        },

        axis: function () {
            var options = this.options.xAxis;
            var formatLabel = options.labels.formatter || d3.format(options.labels.format || 'g');
            var axis = d3.svg.axis()
                .scale(this._scale)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickFormat(function (d) {
                    return _.isDate(d) ? d.getDate() : formatLabel(d);
                });

            var ticks = axis.scale().ticks();
            var labelsFit = _.nw.doXLabelsFit(ticks, formatLabel, this.options);

            if (options.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            } else if (options.tickValues) {
                axis.tickValues(options.tickValues);
            } else if (options.ticks != null) {
                axis.ticks(options.ticks);
            } else if (!labelsFit) {
                var finalTicks = _.nw.getTicksThatFit(ticks, formatLabel, this.options);
                axis.tickValues(finalTicks);
                axis.ticks(finalTicks.length);

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
            var extents = d3.extent(domain);

            if (optMin == null && optMax == null) {
                return extents;
            }

            if (optMin == null) {
                return [Math.min(extents[0], optMax), optMax];
            }

            if (optMax == null) {
                return [optMin, Math.max(extents[1], optMin)];
            }

            // options are invalid, use the extents
            if (optMin > optMax) {
                return extents;
            }

            return [optMin, optMax];
        }
    };

    _.nw.addAxis('LinearScale', LinearScale );

})();
