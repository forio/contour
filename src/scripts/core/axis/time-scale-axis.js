(function () {

    // implements the following interface
    /*
    {
        scale: returns the d3 scale for the type

        range: returns the d3 range for the type
    }
    */

    function dateDiff(d1, d2) {
        if (!d1 || !d2) return 0;
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

            if(!this._scale) {
                this._scale = new d3.time.scale();
                this.setDomain(domain);
            }

            this.range();

            return this._scale;
        },


        /* jshint eqnull:true */
        axis: function () {
            var options = this.options.xAxis;
            var tickFormat = this.getOptimalTickFormat();

            var axis = d3.svg.axis()
                .scale(this._scale)
                .tickFormat(tickFormat)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickValues(this._domain);

            if (this.options.xAxis.tickValues != null) {
                axis.tickValues(this.options.xAxis.tickValues);
            } else if (this.options.xAxis.maxTicks != null && this.options.xAxis.maxTicks < this._domain.length) {
                // override the tickValues with custom array based on number of ticks
                // we don't use D3 ticks() because you cannot force it to show a specific number of ticks
                axis.tickValues(NwUtils.maxTickValues(options.maxTicks, this._domain));

            } else if (this.options.xAxis.firstAndLast) {
                // show only first and last tick
                axis.tickValues(NwUtils.firstAndLast(this._domain));
            }

            return axis;
        },

        update: function (domain, data) {
            this.data = data;
            this.setDomain(domain);
            this.scale();
        },

        setDomain: function (domain) {
            this._domain = domain;
            var axisDomain = this._getAxisDomain(this._domain);
            this._scale.domain(axisDomain);
        },

        postProcessAxis: function (axisGroup) {
            if (!this.options.xAxis.firstAndLast) return;
            var labels = axisGroup.selectAll('.tick text')[0];
            d3.select(labels[0]).style({'text-anchor': 'start'});
            d3.select(labels[labels.length - 1]).style({'text-anchor': 'end'});
        },

        rangeBand: function () {
            return 4;
        },

        getOptimalTickFormat: function () {
            if (this.options.xAxis.labels.formatter) return this.options.xAxis.labels.formatter;
            if (this.options.xAxis.labels.format) return d3.time.format(this.options.xAxis.labels.format);

            var spanDays = Math.abs(dateDiff(this._domain[this._domain.length-1], this._domain[0]));
            var daysThreshold = this.options.xAxis.maxTicks || 1;
            if (spanDays < daysThreshold) return d3.time.format('%H:%M');
            if (spanDays < 365) return d3.time.format('%d %b');

            return d3.time.format('%Y');
        },

        range: function () {
            var range = this._getAxisRange(this._domain);
            return this._scale.rangeRound(range, 0.1);
        },


        _getAxisDomain: function (domain) {
            if(this.options.xAxis.linearDomain) {
                return domain;
            }

            return d3.extent(domain);
        },

        _getAxisRange: function (domain) {
            var size = this.options.chart.rotatedFrame ? this.options.chart.plotHeight : this.options.chart.plotWidth;

            if(this.options.xAxis.linearDomain) {
                return _.range(0, size, size / (domain.length - 1)).concat([size]);
            }

            return [0, size];
        }
    };

    NwUtils.addAxis('TimeScale', TimeScale );
})();
