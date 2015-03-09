(function () {

    var defaults = {
        xAxis: {
            type: 'linear'
        },
        line: {
            stacked: false,
            smooth: false,
            animationDirection: 'left-to-right',
            // animationDirection: 'bottom-to-top',
            marker: {
                enable: true,
                size: 3
            }
        }
    };

    var axisFor = function(series, options) {
        if (!options.line.stacked && (options.rightYAxis.series == 'all' || options.rightYAxis.series.indexOf(series.name) >= 0))
            return 'rightY';
        else
            return 'y';
    };

    var duration;
    var animationDirection;
    var animationsMap = {
        'left-to-right': {
            enter: function (line, options) {
                var path = this;
                path.each(function () {
                    var totalLength = this.getTotalLength();
                    d3.select(this)
                        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                        .attr('stroke-dashoffset', totalLength)
                        .transition().duration(duration).ease('linear')
                            .attr('stroke-dashoffset', 0)
                            .transition().duration(0)
                                .attr('stroke-dasharray', undefined);
                });
            },

            update: function (line, options) {
                this.attr('d', function (d) { 
                    return line(d.data, axisFor(d, options)); 
                });

                this.each(function () {
                    var totalLength = this.getTotalLength();
                    d3.select(this)
                        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                        .attr('stroke-dashoffset', totalLength)
                        .transition().duration(duration).ease('linear')
                            .attr('stroke-dashoffset', 0)
                            .transition().duration(0)
                                .attr('stroke-dasharray', undefined);
                });
            }
        },

        'bottom-to-top': {
            enter: function (line, options) {
                this.transition().duration(duration)
                    .attr('d', function (d) { 
                        return line(d.data, axisFor(d, options)); 
                    });
            },

            update: function (line, options) {
                this.transition().duration(duration)
                    .attr('d', function (d) { 
                        return line(d.data, axisFor(d, options)); 
                    });
            }
        }
    };


    /* jshint eqnull: true */
    function render(rawData, layer, options, id) {
        this.checkDependencies('cartesian');
        function optimizeData(rawData) {
            return _.map(rawData, function (s) {
                return _.extend(s, {
                    data: _.filter(s.data, function (d, i) {
                        if (i === 0 && d.y != null) return true;
                        var differentX = x(s.data[i-1]) !== x(d); // && y(s.data[i-1]) !== y(d);
                        return d.y != null && differentX;
                    })
                });
            });
        }

        var x = _.bind(function (d) { 
            return this.xScale(d.x) + this.rangeBand / 2 + 0.5; 
        }, this);

        var y = _.bind(function (d, whichAxis) { 
            return this[whichAxis + 'Scale'](d.y + (d.y0 || 0)) + 0.5; 
        }, this);

        var h = options.chart.plotHeight;
        var shouldAnimate = options.chart.animations && options.chart.animations.enable;
        animationDirection = options.line.animationDirection || 'left-to-right';
        duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        // jshint eqnull:true
        var data = optimizeData(rawData);

        data = options.line.stacked ? d3.layout.stack().values(function (d) { 
            return d.data; 
        })(data) : data;

        renderPaths();

        if (options.line.marker.enable)
          renderMarkers();

        if (options.tooltip && options.tooltip.enable)
            renderTooltipTrackers();

        function seriesClassName(extras) { 
            return function (d, i) { 
                return (extras||'') + ' s-' +(i+1) + ' ' + _.nw.seriesNameToClass(d.name); 
            }; 
        };

        function renderPaths() {
            var startLine = function(data, whichAxis) {
                var axis = options[whichAxis + 'Axis'];
                return d3.svg.line()
                    .x(function (d) { 
                        return x(d); 
                    })
                    .y(function (d) { 
                        return y({x: 0, y: axis.min || 0}, whichAxis); 
                    })(data);
            };

            

            var line = function(data, whichAxis) {
                return d3.svg.line()
                    .x(function (d) { 
                        return x(d); 
                    })
                    .y(function (d) { 
                        return y(d, whichAxis); 
                    })(data);
            }; 
            

            if(options.line.smooth) 
                line.interpolate('cardinal');

            var animFn = animationsMap[animationDirection];
            var series = layer.selectAll('g.series')
                    .data(data, function (d) { 
                        return d.name; 
                    });

            // enter
            var el = series.enter().append('svg:g')
                .attr('class',seriesClassName('series'))
                .append('path')
                    .attr('class', 'line');

            if (shouldAnimate) {
                var startLineFn = animationDirection === 'left-to-right' ? line : startLine;
                var path = el.attr('d', function(d) { 
                        return startLineFn(d.data, axisFor(d, options)); 
                    });
            } else {
                el.attr('d', function (d) { 
                    return line(d.data, axisFor(d, options)); 
                });
            }

            // update
            el = series
                .attr('class', seriesClassName('series'))
                .select('.line');

            if (shouldAnimate) {
                el.call(_.partial(animFn.update, line, options));
            } else  {
                el.attr('d', function (d) { 
                    return line(d.data, axisFor(d, options)); 
                });
            }

            // remove
           series.exit().remove();
        }

        function renderMarkers() {
            var markers = layer.selectAll('.line-chart-markers')
                .data(data, function (d) { 
                    return d.name; 
                });

            markers.enter().append('g')
                .attr('class', seriesClassName('line-chart-markers markers'));

            markers.exit().remove();

            var dots = markers.selectAll('.dot')
                .data(function (d) { 
                    return d.data.map(function(di) {
                        di.name = d.name;
                        return di;
                    }); 
                }, function (d) { 
                    return d.x; 
                });

            dots.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', options.line.marker.size)
                .attr('opacity', 0);

            dots.exit().remove();

            if (shouldAnimate) {
                dots.transition().delay(duration)
                    .attr('cx', x)
                    .attr('cy', function(d) {
                        return y(d, axisFor(d, options));
                    })
                    .attr('opacity', 1);
            } else {
                dots.attr('cx', x)
                    .attr('cy', function(d) {
                        return y(d, axisFor(d, options));
                    })
                    .attr('opacity', 1);
            }
        }

        function renderTooltipTrackers() {
            var trackerSize = 10;
            var markers = layer.selectAll('.tooltip-trackers')
                .data(data, function (d) { 
                    return d.name; 
                });

            markers.enter().append('g')
                .attr('class', seriesClassName('tooltip-trackers'));

            markers.exit().remove();

            var dots = markers.selectAll('.tooltip-tracker')
                .data(function (d) { 
                    return d.data.map(function(di) {
                        di.name = d.name;
                        return di;
                    }); 
                }, function (d) { 
                    return d.x; 
                });

            dots.enter().append('circle')
                .attr({
                    'class': 'tooltip-tracker',
                    'r': trackerSize,
                    'opacity': 0
                });

            dots.attr({
                'cx': x,
                'cy': function(d) {
                    return y(d, axisFor(d, options));
                }
            });

            dots.exit().remove();
        }

        return this;
    }

    render.defaults = defaults;


    /**
    * Adds a line chart to the Contour instance.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Contour({el: '.myChart'})
    *           .cartesian()
    *           .line([1,2,3,4])
    *           .render();
    *
    * @name line(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Configuration options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Contour.export('line', render);

})();
