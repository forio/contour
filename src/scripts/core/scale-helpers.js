(function (ns, d3, _, $, undefined) {

    // implements the following interface
    /*
    {
        scale: returns the d3 scale for the type

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

        scale: function () {
            if(!this._scale) {
                this._scale = new d3.scale.ordinal();
            }

            return this._scale;
        },

        range: function () {
            var range = [0, this.options.chart.plotWidth];
            return this.isCategorized ?
                this._scale.rangeRoundBands(range) :
                this._scale.rangePoints(range);
        },

        rangeBand: function () {
            return this._scale.rangeBand();
        },

        extractDomain: function (domain, min, max) {
            if (min === undefined && max === undefined)
                return domain;

            if (min === undefined) {
                return [Math.min(domain[0], max), max];
            }

            if (max === undefined) {
                return [min, Math.max(min, domain[domain.length-1])];
            }

            return [min, max];
        }



    };

    function TimeScale(data, options) {
        this.options = options;
        this.data = data;
    }

    TimeScale.prototype = {
        init: function () {
            delete this._scale;
        },

        scale: function () {
            if(!this._scale) {
                this._scale = new d3.time.scale();
            }

            return this._scale;
        },

        range: function () {
            return this._scale.range([0, this.options.chart.plotWidth]);
        },

        rangeBand: function () {
            return 0;
        },

        extractDomain: function (domain, min, max) {
            if (min === undefined && max === undefined)
                return d3.extent(domain);

            if (min === undefined) {
                return [Math.min(domain[0], max), max];
            }

            if (max === undefined) {
                return [min, Math.max(min, domain[domain.length-1])];
            }

            return [min, max];
        }

    };

    var helpers = {
        xScaleFactory: function (data, options) {
            // if we have dates in the x field of the data points
            // we need a time scale, otherwise is an oridinal
            // two ways to shape the data for time scale:
            //  [{ x: date, y: 1}, {x: date, y: 2}]
            //  [{ data: [ x: date, y: 1]}, {data: [x: date, y: 100]}]
            // if we get no data, we return an ordinal scale
            var isTimeData = _.isArray(data) && data.length > 0 && data[0].data ?
                data[0].data[0].x && _.isDate(data[0].data[0].x) :
                _.isArray(data) && data.length > 0 && data[0].x && _.isDate(data[0].x);

            return isTimeData ? new TimeScale(data, options) : new OrdinalScale(data, options);
        }

    };

    _.nw = _.extend({}, _.nw, helpers);

})('Narwhal', window.d3, window._, window.jQuery);
