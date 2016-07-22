(function () {

    var LogYAxis = function (data, options) {
        this.data = data;
        this.options = options;
    };

    function setRange(scale, options) {
        var rangeSize = options.chart.rotatedFrame ? options.chart.plotWidth : options.chart.plotHeight;
        var range = options.chart.rotatedFrame ? [0, rangeSize] : [rangeSize, 0];
        return scale.range(range);
    }

    var __super = nw.axes.YAxis.prototype;
    LogYAxis.prototype = _.extend({}, __super, {
        axis: function () {
            var options = this.options.yAxis;
            var domain = this._scale.domain();
            var ticksHint = Math.ceil(Math.log(domain[1]) / Math.log(10));
            var format = options.labels.formatter || d3.format(options.labels.format || ',.0f');

            var axis = d3.svg.axis()
                .scale(this._scale)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding);
            if(options.labels.formatter) {
                axis.tickFormat(options.labels.formatter);
            } else {
                axis.ticks(options.ticks || ticksHint, format);
            }


            return axis;
        },

        scale: function (domain) {
            if(!this._scale) {
                if(domain[0] <= 0.1) domain[0] = 0.1; //throw new Error('Log scales don\'t support 0 or negative values');

                this._scale = d3.scale.log();
                this.setDomain(domain).clamp(true);

            }

            setRange(this._scale, this.options);

            return this._scale;
        },

        update: function (domain, dataSrc) {
            this.data = dataSrc;
            if(domain[0] <= 0.1) domain[0] = 0.1; //throw new Error('Log scales don\'t support 0 or negative values');
            this.setDomain(domain).clamp(true);
            this.scale();
        },
    });

    nw.addAxis('LogYAxis', LogYAxis );

})();
