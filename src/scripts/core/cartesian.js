(function (ns, d3, _, $, undefined) {

    var defaults = {
        xAxis: {
            rangePadding: 0
        }
    };

    var cartesian = {

        init: function () {
            _.extend(this.options, defaults);
            return this;
        },

        // to be overriden when coputing scales
        // xScale: function (x) { return x; },
        yScale: function (y) { return y; },
        computeXScale: function () {
            if (!this.xDomain) throw new Error('You are trying to render without setting data.');

            this.xScale = d3.scale.ordinal()
                .domain(this.xDomain)
                .rangeRoundBands([0, this.options.chart.plotWidth]);
        },

        computeYScale: function () {

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
            }

            return this;
        }
    };

    window[ns].prototype.expose('cartesian', cartesian);

})('Narwhal', window.d3, window._, window.jQuery);
