(function (ns, d3, _, $, undefined) {

    // implements the following interface
    /*
    {
        scale: returns the d3 scale for the type

        axis: returns the d3 axis

        range: returns the d3 range for the type
    }
    */

    function OrdinalScale(data, options) {
        this.options = options;
        this.data = data;

        this.init();
    }

    OrdinalScale.prototype = {
        init: function () {
            this.isCategorized = _.isArray(this.options.xAxis.categories);
            delete this._scale;
        },

        scale: function (domain) {
            if(!this._scale) {
                this._scale = new d3.scale.ordinal().domain(domain);

                this.range();
            }

            return this._scale;
        },

        axis: function () {
            var options = this.options.xAxis;
            var axis = d3.svg.axis()
                .scale(this._scale)
                .innerTickSize(options.innerTickSize)
                .outerTickSize(options.outerTickSize)
                .tickPadding(options.tickPadding);

            if (this.isCategorized) {
                // show only first and last tick
                axis.tickValues([_.first(this.options.xAxis.categories), _.last(this.options.xAxis.categories)]);
            }

            return axis;
        },

        rangeBand: function () {
            return this._scale.rangeBand();
        },

        range: function () {
            var range = [0, this.options.chart.plotWidth];
            return this.isCategorized ?
                this._scale.rangeRoundBands(range) :
                this._scale.rangePoints(range);
        }
    };

    _.nw = _.extend({}, _.nw, { OrdinalScale: OrdinalScale });

})('Narwhal', window.d3, window._, window.jQuery);
