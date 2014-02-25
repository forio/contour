(function () {

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
            this.isCategorized = true;
            delete this._scale;
        },

        scale: function (domain) {
            if(!this._scale) {
                this._scale = new d3.scale.ordinal();
                this._range();
            }

            this.setDomain(domain);

            return this._scale;
        },

        axis: function () {
            var options = this.options.xAxis;
            var optFormat = (options.labels.format ? d3.format(options.labels.format) : 0);

            var tickFormat = options.labels.formatter || (!this.isCategorized ? optFormat : 0) || function (d) { return _.isDate(d) ? d.getDate() : d; };
            var axis = d3.svg.axis()
                .scale(this._scale)
                .innerTickSize(options.innerTickSize)
                .outerTickSize(options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickValues(this.options.xAxis.categories)
                .tickFormat(tickFormat);

            if (this.options.xAxis.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            }

            return axis;
        },

        /* jshint eqnull:true */
        postProcessAxis: function (axisGroup) {
            var options = this.options.xAxis;
            if (!options.labels || options.labels.rotation == null) return;

            var deg = options.labels.rotation;
            var rad = _.nw.degToRad(deg);
            var lineCenter = 0.71; // center of text line is at .31em
            var cos = Math.cos(rad);
            var sin = Math.sin(rad);
            var positive = options.labels.rotation > 0;
            var anchor = options.labels.rotation < 0 ? 'end' : options.labels.rotation > 0 ? 'start' : 'middle';
            var labels = axisGroup.selectAll('.tick text')
                .style({'text-anchor': anchor})
                .attr('transform', function (d, i, j) {
                    var x = d3.select(this).attr('x') || 0;
                    var y = d3.select(this).attr('y') || 0;
                    return 'rotate(' + options.labels.rotation + ' ' + x + ',' + y + ')';
                })
                .attr('dy', function (d, i, j) {
                    return (cos * lineCenter + (0.31)).toFixed(4) + 'em';
                });
        },

        update: function (domain, data) {
            this.data = data;
            this.setDomain(domain);
        },

        setDomain: function (domain) {
            this._domain = domain;
            this._scale.domain(domain);
        },

        rangeBand: function () {
            var band = this._scale.rangeBand();
            if (!band) _.nw.warn('rangeBand is 0, you may have too many points in in the domain for the size of the chart (ie. chartWidth = ' + this.options.chart.plotWidth + 'px and ' + (this._domain.length) + ' X-axis points (plus paddings) means less than 1 pixel per band and there\'re no half pixels');

            return this._scale.rangeBand();
        },

        _range: function () {
            var range = this.options.chart.rotatedFrame ? [this.options.chart.plotHeight, 0] : [0, this.options.chart.plotWidth];
            return this.isCategorized ?
                this._scale.rangeRoundBands(range, this.options.xAxis.innerRangePadding, this.options.xAxis.outerRangePadding) :
                this._scale.rangePoints(range);
        }
    };

    _.nw = _.extend({}, _.nw, { OrdinalScale: OrdinalScale });

})();
