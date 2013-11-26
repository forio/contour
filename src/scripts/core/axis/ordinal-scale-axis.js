(function (ns, d3, _, $, undefined) {

    // implements the following interface
    /*
    {
        scale: returns the d3 scale for the type

        axis: returns the d3 axis

        range: returns the d3 range for the type

        postProcessAxis:
    }
    */

    function OrdinalScale(data, options) {
        this.options = options;
        this.data = data;

        this.init();
    }

    OrdinalScale.prototype = {
        init: function () {
            this.isCategorized = true;// _.isArray(this.options.xAxis.categories);
            delete this._scale;
        },

        scale: function (domain) {
            this._domain = domain;
            if(!this._scale) {
                this._scale = new d3.scale.ordinal().domain(domain);

                this._range();
            }

            return this._scale;
        },

        axis: function () {
            var options = this.options.xAxis;
            var axis = d3.svg.axis()
                .scale(this._scale)
                .innerTickSize(options.innerTickSize)
                .outerTickSize(options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickValues(this.options.xAxis.categories)
                .tickFormat(function (d ,i) {
                    return _.isDate(d) ? d.getDate() : d;
                });

            if (this.options.xAxis.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            }

            return axis;
        },

        postProcessAxis: function (axisGroup) {
        },

        rangeBand: function () {
            return this._scale.rangeBand();
        },

        _range: function () {
            var range = this.options.chart.rotatedFrame ? [this.options.chart.plotHeight, 0] : [0, this.options.chart.plotWidth];
            return this.isCategorized ?
                this._scale.rangeRoundBands(range, 0.1) :
                this._scale.rangePoints(range);
        }
    };

    _.nw = _.extend({}, _.nw, { OrdinalScale: OrdinalScale });

})('Narwhal', window.d3, window._, window.jQuery);
