(function () {

    var defaults = {
        column : {
            // specifies a class string or function that will be added to each column
            columnClass: null,
            style: null,
            stacked: false,
            groupPadding: 1,
            columnWidth: function() { return this.rangeBand; },
            offset: function() { return 0; }
        }
    };

    function render(data, layer, options) {
        this.checkDependencies('cartesian');
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var opt = options.column;
        var w = options.chart.plotWidth;
        var h = options.chart.plotHeight;
        var rectClass = options.column.columnClass;
        var rectStyle = options.column.style;
        var _this = this;
        var chartOffset = _.nw.getValue(opt.offset, 0, this);
        var rangeBand = _.nw.getValue(opt.columnWidth, this.rangeBand, this);
        var enter = _.partialRight((options.column.stacked ? stacked : grouped), true);
        var update = options.column.stacked ? stacked : grouped;
        
        var axisFor = _.bind(function(series) {
            if (options.column.stacked)
                return 'y';
            
            return this.axisFor(series);
        }, this);

        var x = function (v) { 
            return Math.round(_this.xScale(v)) + 0.5; 
        };
        
        var y = function (v, whichAxis) { 
            return Math.round(_this[whichAxis + 'Scale'](v)) - 0.5; 
        };

        var dataKey = function (d) { 
            return d.data.map(function(di) {
                    di.name = d.name; 
                    return di; 
                }); 
        };
        var filteredData = _.map(data, function (series, j) {
            return {
                name: series.name,
                data: _.filter(series.data, function (d, i) {
                    return i === 0 ? true : x(d.x) !== x(series.data[i-1].x);
                })
            };
        });

        var stack = _.nw.stackLayout();
        var series = layer.selectAll('g.series')
                .data(stack(filteredData));

        series.enter()
            .append('g')
            .attr('class', function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; });

        series.exit()
            .remove();

        var cols = series.selectAll('.column')
                .data(dataKey, function (d) { return d.x || d; });

        var offset = function (d, i) { return rangeBand / data.length * i; };
        var width = rangeBand / data.length - opt.groupPadding - 0.5;
        var cssClass = 'column' + (options.tooltip.enable ? ' tooltip-tracker' : '');

        cols.enter()
            .append('rect')
            .attr('class', function (d, i, j) {
                if (!rectClass) return cssClass;

                return cssClass + ' ' + (typeof rectClass === 'function' ? rectClass.call(this, d, i, j) : rectClass);
            })
            .call(enter);

        if (options.chart.animations && options.chart.animations.enable) {
            cols.exit()
                .transition().duration(duration)
                .attr('y', h)
                .attr('height', function () { return 0.5; })
                .remove();
            cols.transition().duration(duration)
                .call(update);
        } else {
            cols.exit().remove();
            cols.call(update);
        }

        // for every update
        cols.attr('style', rectStyle);

        function getBase(whichAxis) {
            return y(0, whichAxis);
        }

        function stacked(col, enter) {
            col.attr('x', function (d) { 
                    return x(d.x) + chartOffset; 
                })
                .attr('width', function () { 
                    return rangeBand; 
                });

            if (enter) {
                col.attr('y', function (d) { 
                        return d.y >= 0 ? getBase(axisFor(d)) : getBase(axisFor(d)); 
                    })
                    .attr('height', function (d) { return 0.5; });
            } else {
                col.attr('y', function (d) { 
                        return d.y >= 0 ? y(d.y, axisFor(d)) + y(d.y0, axisFor(d)) - getBase(axisFor(d)) : y(d.y0, axisFor(d)) ; 
                    })
                    .attr('height', function (d) { 
                        return d.y >=0 ? getBase(axisFor(d)) - y(d.y, axisFor(d)) : y(d.y, axisFor(d)) - getBase(axisFor(d)); 
                    });
            }
        }

        function grouped(col, enter) {
            var width = rangeBand / data.length - opt.groupPadding + 0.5;

            var offset = function (d, i) { 
                return rangeBand / data.length * i + 0.5; 
            };

            col.attr('x', function (d, i, j) { 
                    return x(d.x) + offset(d, j) + chartOffset; 
                })
                .attr('width', width);

            if (enter) {
                col.attr('y', function(d) {
                        return getBase(axisFor(d));
                    })
                    .attr('height', 0);
            } else {
                col.attr('y', function (d) { 
                        return d.y >= 0 ? y(d.y, axisFor(d)) : getBase(axisFor(d)); 
                    })
                    .attr('height', function (d) { 
                        return d.y >= 0 ? getBase(axisFor(d)) - y(d.y, axisFor(d)) : y(d.y, axisFor(d)) - getBase(axisFor(d)); 
                    });
            }
        }
    }

    render.defaults = defaults;

    /**
    * Adds a column chart (vertical columns) to the Contour instance.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Contour({el: '.myChart'})
    *           .cartesian()
    *           .column([1,2,3,4])
    *           .render();
    *
    * @name column(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Configuration options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Contour.export('column', render);

})();
