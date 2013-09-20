(function (ns, d3, _, $, undefined) {

    var defaults = {
        xAxis: {
            rangePadding: 0
        }
    };

    var cartesian = {

        init: function (options) {
            _.extend(this.options, defaults, options);
            return this;
        },

        computeXScale: function () {
            if (!this.xDomain) throw new Error('You are trying to render without setting data (xDomain).');

            this.xScale = d3.scale.ordinal()
                .domain(this.xDomain)
                .rangeRoundBands([0, this.options.chart.plotWidth]);
        },

        computeYScale: function () {
            if (!this.yDomain) throw new Error('You are trying to render without setting data (yDomain).');

            var yScaleDomain = this.globalMax ? [0, this.globalMax] : this.yDomain;

            this.yScale = d3.scale.linear()
                .domain(yScaleDomain)
                .range([this.options.chart.plotHeight, 0]);
        },

        computeScales: function () {
            this.computeXScale();
            this.computeYScale();
        },

        render: function () {
            this.computeScales();
            this.baseRender();

            return this;
        },

        datum: function (d, index) {
            return {
                y: _.isObject(d) ? d.y : d,
                x: _.isObject(d) ? d.x : index
            };
        },

        data: function (series) {

            if (series instanceof Array) {
                var datums = _.map(series, this.datum);
                this.dataSrc = datums;

                // this has to be the same for all series?
                this.xDomain = _.pluck(datums, 'x');

                var max = this.yDomain ? Math.max(this.yDomain[1], _.max(_.pluck(datums, 'y'))) : _.max(_.pluck(datums, 'y'));
                this.yDomain = [0, max];
            }

            return this;
        }
    };

    window[ns].prototype.expose('cartesian', cartesian);

})('Narwhal', window.d3, window._, window.jQuery);
