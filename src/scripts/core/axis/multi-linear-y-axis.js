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

        postProcessAxis: function (axisGroup, ctx) {
            var options = this.options[this.which];
            if (!options.labels) return;

            axisGroup.selectAll('.tick text').remove();

            var options = this.options[this.which];
            var maxTickSize = function (options) { return Math.max(options.outerTickSize || 0, options.innerTickSize || 0); };
            var adjustFactor = 40/46.609; // this factor is to account for the difference between the actual svg size and what we get from the DOM
            var labelHeight = _.nw.textBounds('M', '.axis text').height * adjustFactor;               
            var groupLabelHeight = labelHeight * this.data.length;
            var format = options.labels.formatter || d3.format(options.labels.format);

            var padding = maxTickSize(options) + (options.tickPadding || 0);

            var tickEls = axisGroup.selectAll('.tick')[0];
            var range = this.scale().range();
            var tickIncrement = (range[1] - range[0]) / (tickEls.length - 1);
            
            var axisData = this.data;
            var seriesRanges = _.map(axisData, function(series) {
                var seriesRange = this._seriesRange(series.name);
                seriesRange.push((seriesRange[1] - seriesRange[0]) / (tickEls.length - 1));
                return seriesRange;
            }.bind(this));
            
           //make an array of labels [[0,0],[5,50],[10,100],[100,1000]] of length ticks, with sub length of this.data.length            
            var labelData = _.map(tickEls, function(tickEl, tIndex) {
                return _.map(seriesRanges, function(seriesRange) {
                    return seriesRange[0] + tIndex * seriesRange[2];
                });   
            });

            //for each tick create an svg text element with that label text formatted and colored
            _.each(tickEls, function(tickEl, tIndex) {
                _.each(seriesRanges, function(seriesRange, sIndex) {
                    var text = format(labelData[tIndex][sIndex]);
                    var textBounds = _.nw.textBounds(text, '.y.axis text');

                    var textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    textNode.appendChild(document.createTextNode(text));

                    textNode.setAttribute('class', 's-' + (ctx.seriesIndexFor(axisData[sIndex]) + 1));
                    
                    if (options.orient == 'left' || options.orient == 'right') {
                        var offset = tIndex == 0 ? -groupLabelHeight/2 + labelHeight/2 : (tIndex == tickEls.length - 1 ? groupLabelHeight/2 - labelHeight/2 : 0);
                        textNode.setAttribute('y', -groupLabelHeight / 2 + ((sIndex + 1) * labelHeight + offset));
                    
                        if (options.orient == 'left')
                            textNode.setAttribute('x', -1 * (textBounds.width + padding));
                        else if (options.orient == 'right')
                            textNode.setAttribute('x', padding);
                    } else {
                        var labelWidth = textBounds.width + 2;
                        var groupLabelWidth = labelWidth * axisData.length
                        
                        var offset = tIndex == 0 ? labelWidth / 2 : (tIndex == tickEls.length - 1 ? -labelWidth/2 : 0);
                        textNode.setAttribute('x', -groupLabelWidth + ((sIndex + 1) * labelWidth + offset));
                    
                        if (options.orient == 'top')
                            textNode.setAttribute('y', -padding);
                        else if (options.orient == 'bottom')
                            textNode.setAttribute('y', padding + labelHeight);
                    }
                   
                    tickEl.appendChild(textNode);
                });
            });
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
            var min = axisMin != null ? axisMin : absMin;

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

        update: function (domain, dataSrc, options) {
            this.options = options || this.options;
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
