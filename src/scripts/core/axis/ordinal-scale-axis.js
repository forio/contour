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
            }

            this.setDomain(domain || this.data);

            return this._scale;
        },

        /* jshint eqnull:true */
        axis: function () {
            var options = this.options.xAxis;
            var optFormat = (options.labels.format ? d3.format(options.labels.format) : 0);
            var formatLabel = options.labels.formatter || d3.format(options.labels.format || 'g');

            var tickFormat = options.labels.formatter || (!this.isCategorized ? optFormat : 0) || function (d) { return _.nw.isDate(d) ? d.getDate() : d; };
            var axis = d3.svg.axis()
                .scale(this._scale)
                .innerTickSize(options.innerTickSize)
                .outerTickSize(options.outerTickSize)
                .tickPadding(options.tickPadding)
                .tickFormat(tickFormat);

            var ticks = this.isCategorized && options.categories ? options.categories : _.nw.range(this._domain.length) || [];
            var labelsFit = _.nw.doXLabelsFit(ticks, formatLabel, this.options);

            if (options.firstAndLast) {
                // show only first and last tick
                axis.tickValues(_.nw.firstAndLast(this._domain));
            } else if (options.maxTicks) {
                axis.tickValues(_.nw.maxTickValues(options.maxTicks, this._domain));
            } else if (options.tickValues) {
                axis.tickValues(options.tickValues);
            } else if (options.ticks != null) {
                axis.ticks(options.ticks);
                if (options.ticks === 0) {
                    axis.tickValues([]);
                }
            } else if (!labelsFit) {
                var finalTicks = _.nw.getTicksThatFit(ticks, formatLabel, this.options);
                axis.tickValues(finalTicks);
                axis.ticks(finalTicks.length);
            } else {
                axis.tickValues(options.categories);
            }

            return axis;
        },

        /* jshint eqnull:true */
        postProcessAxis: function (axisGroup) {
            var options = this.options.xAxis;
            if (!options.labels || options.labels.rotation == null) return;

            var deg = options.labels.rotation;
            var rad = _.nw.degToRad(deg);
            var sign = deg > 0 ? 1 : deg < 0 ? -1 : 0;
            var pos = deg < 0 ? -1 : 1;
            var lineHeight = 0.71;
            var lineCenter = lineHeight / 2; // center of text line is at .31em
            var cos = Math.cos(rad);
            var sin = Math.sin(rad);
            var anchor = options.labels.rotation < 0 ? 'end' : options.labels.rotation > 0 ? 'start' : 'middle';

            axisGroup.selectAll('.tick text')
                .style({'text-anchor': anchor})
                .attr('transform', function (d, i, j) {
                    var x = d3.select(this).attr('x') || 0;
                    var y = d3.select(this).attr('y') || 0;
                    return 'rotate(' + options.labels.rotation + ' ' + x + ',' + y + ')';
                })
                .attr('dy', function (d, i, j) {
                    var ref = deg === 0 ? lineHeight : lineCenter;
                    var num = ((cos * ref) + (sin * ref * pos));
                    return (num).toFixed(4) + 'em';
                    // return (sign * ((cos * lineCenter) + (sin * lineCenter))).toFixed(4) + 'em';
                })
                .attr('dx', function (d, i, j) {
                    // var num = ((sin * lineCenter * pos));
                    // return -num.toFixed(4) + 'em';
                    return -(sin * lineCenter - 0.31 * sign).toFixed(4) + 'em';

                });
        },

        update: function (domain, data) {
            this.data = data;
            this.scale(domain);
        },

        setDomain: function (domain) {
            this._domain = domain;
            this._scale.domain(domain);
            this._range();
        },

        rangeBand: function () {
            var band = this._scale.rangeBand();
            if (!band) _.nw.warn('rangeBand is 0, you may have too many points in in the domain for the size of the chart (ie. chartWidth = ' + this.options.chart.plotWidth + 'px and ' + (this._domain.length) + ' X-axis points (plus paddings) means less than 1 pixel per band and there\'re no half pixels');

            return this._scale.rangeBand();
        },

        _range: function () {
            var range = this.options.chart.rotatedFrame ? [this.options.chart.plotHeight, 0] : [0, this.options.chart.plotWidth];
            var numCats = (this._domain || []).length;
            var threshold = 30;
            var rangeType = numCats <= threshold ? 'rangeRoundBands' : 'rangeBands';

            return this.isCategorized ?
                // this._scale.rangeBands(range, this.options.xAxis.innerRangePadding, this.options.xAxis.outerRangePadding) :
                this._scale[rangeType](range, this.options.xAxis.innerRangePadding, this.options.xAxis.outerRangePadding) :
                this._scale.rangePoints(range);
        }
    };

    _.nw.addAxis('OrdinalScale', OrdinalScale );

})();
