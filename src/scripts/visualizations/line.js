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

    var initialize = true;


    /* jshint eqnull: true */
    function render(rawData, layer, options, id) {
        var initialRender = initialize;
        initialize = false;
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

            var startData = data;
            var startLine;
            if (initialRender && shouldAnimate) {
                if (animationDirection === 'left-to-right') {
                    startData = _.map(data, function (s0) {
                        var s1 = _.cloneDeep(s0);
                        s1.data = [];
                        return s1;
                    });
                } else {
                    startLine = d3.svg.line()
                        .x(function (d) { return x(d); })
                        .y(function () { return y({x: 0, y: options.yAxis.min || 0}); });
                }
            }

            var series = layer.selectAll('g.series')
                .data(startData, function (d) { return d.name; });

            // update
            var el = series
                .attr('class', seriesClassName('series'))
                .select('.line');

            if (shouldAnimate) el = el.transition().duration(duration);
            el.attr('d', function (d) { return line(d.data); });

            // enter
            el = series.enter().append('svg:g')
                .attr('class', seriesClassName('series'))
                .append('path')
                    .attr('class', 'line');

            if (initialRender && shouldAnimate && animationDirection === 'left-to-right') {
                el.transition().duration(duration).ease('linear')
                    .attrTween('d', pathTween);
            } else {
                if (shouldAnimate) {
                    if (startLine) el.attr('d', function (d) { return startLine(d.data); })
                    el = el.transition().duration(duration);
                }
                el.attr('d', function (d) { return line(d.data); });
            }

            // remove
            el = series.exit();
            if (shouldAnimate) el = el.transition().duration(duration);
            el.remove();


            function pathTween(d, i) {
                var dat = data[i].data;
                var interpolate = d3.scale.linear()
                    .domain([0, 1])
                    .range([1, dat.length]);

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

        function renderMarkers() {
            var markers = layer.selectAll('.line-chart-markers')
                .data(data, function (d) { return d.name; });

            markers.enter().append('g')
                .attr('class', seriesClassName('line-chart-markers markers'));

            markers.exit().remove();

            var dots = markers.selectAll('.dot')
                .data(function (d) { return d.data; }, function (d) { return d.x; });

            dots.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', options.line.marker.size)
                .attr('opacity', 0);

            dots.exit().remove();

            if (initialRender && shouldAnimate && animationDirection === 'left-to-right') {
                var count = _.max(_.map(_.pluck(data, 'data'), function (dat) {
                    return dat.length;
                }));
                dots.attr('cx', x)
                    .attr('cy', y);
                if (shouldAnimate) {
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

        function renderTooltipTrackers() {
            var trackerSize = 10;
            var markers = layer.selectAll('.tooltip-trackers')
                .data(data, function (d) { return d.name; });

            markers.enter().append('g')
                .attr('class', function (d, i) { return 'tooltip-trackers s-' + (i+1); });

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
