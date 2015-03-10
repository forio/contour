(function () {
    var MultiScaleYAxis = function (data, options, domain, which) {
        this.data = data;
        this.options = options;
        this.domain = domain;
        this.which = which;
    };

    function setRange(scale, options) {
        var rangeSize = options.chart.rotatedFrame ? options.chart.plotWidth : options.chart.plotHeight;
        var range = options.chart.rotatedFrame ? [0, rangeSize] : [rangeSize, 0];
        return scale.range(range);
    }

    MultiScaleYAxis.prototype = {
        axis: function () {
            /*jshint eqnull:true */
            var options = this.options[this.which];
            var domain = this.domain;
            var numTicks = this.numTicks(domain, options.min, options.max);
            var format = function(data) {
                return '';
            };

            var axis =  d3.svg.axis()
                .scale(this._scale)
                .tickFormat(format)
                .tickSize(options.innerTickSize, options.outerTickSize)
                .tickPadding(options.tickPadding)
                .ticks(numTicks);

            return axis;
        },

        postProcessAxis: function (axisGroup) {
            var options = this.options.yAxis;
            if (!options.labels || options.labels.rotation == null) return;

            
        },

        _seriesRange: function(seriesName) {
            var seriesPredicate = function(item) {
                if (item && _.isObject(item) && item.name && item.name == seriesName)
                    return true;
                else
                    return false;
            };

            var axisConfig = this.options[this.which];
            var seriesConfig = _.find(axisConfig.series, seriesPredicate);
            var seriesObject = _.find(this.data, seriesPredicate);

            var axisMin = (seriesConfig && seriesConfig.min) ? seriesConfig.min : (axisConfig && axisConfig.min) ? axisConfig.min : null; 
            var axisMax = (seriesConfig && seriesConfig.max) ? seriesConfig.max : (axisConfig && axisConfig.max) ? axisConfig.max : null;
            var domain = (seriesObject && seriesObject.data) ? [d3.min(_.pluck(seriesObject.data, 'y')), d3.max(_.pluck(seriesObject.data, 'y'))] : null;

            var absMin = axisConfig.zeroAnchor && domain && domain[0] > 0 ? 0 : undefined;
            var min = axisMax != null ? axisMin : absMin;

            if (axisConfig.tickValues) {
                if (axisMin != null && axisMax != null) {
                    return [axisMin, axisMax];
                } else if (axisMin != null) {
                    return [axisMin, d3.max(axisConfig.zeroAnchor ? [0].concat(axisConfig.tickValues) : axisConfig.tickValues)];
                } else if (axisMax != null) {
                    return [d3.min(axisConfig.zeroAnchor ? [0].concat(axisConfig.tickValues) : axisConfig.tickValues), axisMax];
                } else {
                    return d3.extent(axisConfig.zeroAnchor || axisMin != null ? [min].concat(axisConfig.tickValues) : axisConfig.tickValues);
                }
            }

            return _.nw.extractScaleDomain(domain, min, axisMax, axisConfig.ticks);
        },

        scaleForSeries: function(seriesName) {
            var range = this.scale().range();
            var seriesRange = this._seriesRange(seriesName);

            var scale = (range[1] - range[0]) / (seriesRange[1] - seriesRange[0]);

            return function(value) {
                return value * scale + range[0];
            };
        },

        scale: function (domain) {
            if(!this._scale) {
                this._scale = d3.scale.linear();
                this.setDomain(domain);
            }

            setRange(this._scale, this.options);
            return this._scale;
        },

        setDomain: function (domain) {
            this._scale.domain(domain);
            this._niceTheScale();
            return this._scale;
        },

        update: function (domain, dataSrc) {
            this.data = dataSrc;
            this.setDomain(domain);
            this.scale();
        },

        /*jshint eqnull:true*/
        numTicks: function () {
            return this.options[this.which].ticks != null ? this.options[this.which].ticks : undefined;
        },

        _niceTheScale: function () {
            // nothing to do for the regular y-axis
        }
    };

    _.extend(_.nw, { MultiScaleYAxis: MultiScaleYAxis });

})();
