(function () {

    var YAxis = function (data, options) {
        this.data = data;
        this.options = options;
    };

    function setRange(scale, options) {
        var rangeSize = options.chart.rotatedFrame ? options.chart.plotWidth : options.chart.plotHeight;
        var range = options.chart.rotatedFrame ? [0, rangeSize] : [rangeSize, 0];
        return scale.range(range);
    }

    YAxis.prototype = {
        axis: function () {
            var options = this.options.yAxis;
            var domain = this._scale.domain();
            var tickValues = options.tickValues;
            var numTicks = this.numTicks(domain, options.min, options.max);
            var format = d3.format(options.labels.format);

            return d3.svg.axis()
                .scale(this._scale)
                .tickFormat(format)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .ticks(numTicks)
                .tickValues(tickValues);
        },

        scale: function (domain) {
            if(!this._scale) {
                this._scale = d3.scale.linear();
                this.setDomain(domain);
                setRange(this._scale, this.options);
            }

            return this._scale;
        },

        setDomain: function (domain) {
            this._scale.domain(domain);
            this._niceTheScale();
        },

        /*jshint eqnull:true*/
        numTicks: function () {
            return this.options.yAxis.ticks != null ? this.options.yAxis.ticks : undefined;
        },

        _niceTheScale: function () {
            this._scale.nice();
        }
    };

    _.extend(_.nw, { YAxis: YAxis });

})();
