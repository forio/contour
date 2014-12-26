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

        var x = _.bind(function (d) { return this.xScale(d.x) + this.rangeBand / 2 + 0.5; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y + (d.y0 || 0)) + 0.5; }, this);
        var h = options.chart.plotHeight;
        var shouldAnimate = options.chart.animations && options.chart.animations.enable;
        var animationDirection = options.line.animationDirection || 'left-to-right';
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        // jshint eqnull:true
        var data = optimizeData(rawData);

        data = options.line.stacked ? d3.layout.stack().values(function (d) { return d.data; })(data) : data;

        renderPaths();

        if (options.line.marker.enable)
            renderMarkers();

        if (options.tooltip && options.tooltip.enable)
            renderTooltipTrackers();


        function seriesClassName(extras) { return function (d, i) { return (extras||'') + ' s-' +(i+1) + ' ' + _.nw.seriesNameToClass(d.name); }; }

        function renderPaths() {
            var line = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function (d) { return y(d); });
            if (options.line.smooth) line.interpolate('cardinal');

            var series = layer.selectAll('g.series')
                .data(data, function (d) { return d.name; });

            // update series
            var el = series
                .attr('class', seriesClassName('series'))
                .select('.line')
                .each(function (d) { renderLine.call(this, false, d); });

            // append series
            el = series.enter().append('svg:g')
                .attr('class', seriesClassName('series'))
                .append('path')
                    .attr('class', 'line')
                .each(function (d) { renderLine.call(this, true, d); });

            // remove series
            el = series.exit().remove();


            function renderLine(enter, dm) {
                var path = d3.select(this);
                var pathNode = path.node();
                var dat = dm.data;
                var same = _.first(pathNode.dat, function (d0, i) {
                    var d1 = dat[i];
                    return d1 && d0.x === d1.x && d0.y === d1.y;
                });
                pathNode.dat = _.cloneDeep(dat);

                if (shouldAnimate && animationDirection === 'left-to-right' && dat.length > same.length && (enter || same.length > 0)) {
                    // line animation on append point in left-to-right direction
                    if (same.length) {
                        path = path.transition().duration(duration)
                            .attr('d', function (d) {
                                return pathTween()(-1e-9); // t just below 0
                            });
                    }
                    path.transition().duration(same.length ? 250 : duration).ease('linear')
                        .attrTween('d', pathTween);
                } else {
                    if (shouldAnimate) {
                        if (enter) {
                            // line animation on append series in bottom-to-top direction
                            var startLine = d3.svg.line()
                                .x(function (d) { return x(d); })
                                .y(function () { return y({x: 0, y: options.yAxis.min || 0}); });
                            path.attr('d', function (d) { return startLine(d.data); });
                        }
                        path = path.transition().duration(duration);
                    }
                    path.attr('d', function (d) { return line(d.data); });
                }


                function pathTween() {
                    var interpolate = d3.scale.linear()
                        .domain([0, 1])
                        .range([same.length || 1, dat.length]);

                    return function (t) {
                        var index = Math.floor(interpolate(t));
                        var interpolatedLine = dat.slice(0, index);

                        if (index < dat.length) {
                            var weight = interpolate(t) - index;
                            interpolatedLine.push({
                                x: dat[index].x * weight + dat[index - 1].x * (1 - weight),
                                y: dat[index].y * weight + dat[index - 1].y * (1 - weight)
                            });
                        }

                        return line(interpolatedLine);
                    };
                }
            }
        }

        function renderMarkers() {
            var markers = layer.selectAll('.line-chart-markers')
                .data(data, function (d) { return d.name; });

            // update series
            markers.each(function () { renderDots.call(this, false); });

            // append series
            markers.enter().append('g')
                .attr('class', seriesClassName('line-chart-markers markers'))
                .each(function () { renderDots.call(this, true); });

            // remove series
            markers.exit().remove();


            function renderDots(enter) {
                var dots = d3.select(this).selectAll('.dot')
                    .data(function (d) { return d.data; }, function (d) { return d.x; });

                // append dots
                dots.enter().append('circle')
                    .attr('class', 'dot')
                    .attr('r', options.line.marker.size)
                    .attr('opacity', 0);

                // remove dots
                dots.exit().remove();

                // update/append dots
                if (enter && shouldAnimate && animationDirection === 'left-to-right') {
                    // dot animation on append series in left-to-right direction
                    dots.attr('cx', x)
                        .attr('cy', y);
                    if (shouldAnimate) {
                        var count = dots.size();
                        dots = dots.transition().delay(function (d, i) {
                            return duration * (i + 1.5) / (count + 0.5);
                        });
                    }
                    dots.attr('opacity', 1);
                } else {
                    if (shouldAnimate) dots = dots.transition().duration(duration);
                    dots.attr('cx', x)
                        .attr('cy', y);
                    if (shouldAnimate) dots = dots.transition().duration(250).delay(duration * 3 / 4);
                    dots.attr('opacity', 1);
                }
            }
        }

        function renderTooltipTrackers() {
            var trackerSize = 10;
            var markers = layer.selectAll('.tooltip-trackers')
                .data(data, function (d) { return d.name; });

            markers.enter().append('g')
                .attr('class', seriesClassName('tooltip-trackers'));

            markers.exit().remove();

            var dots = markers.selectAll('.tooltip-tracker')
                .data(function (d) { return d.data; }, function (d) { return d.x; });

            dots.enter().append('circle')
                .attr({
                    'class': 'tooltip-tracker',
                    'r': trackerSize,
                    'opacity': 0
                });

            dots.attr({
                'cx': x,
                'cy': y
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
