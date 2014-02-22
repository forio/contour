(function () {

    var defaults = {
        line: {
            smooth: false,
            marker: {
                enable: true,
                size: 3
            }
        }
    };


    function render(rawData, layer, options, id) {

        var x = _.bind(function (d) { return this.xScale(d.x) + this.rangeBand / 2; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);
        var h = options.chart.plotHeight;
        var duration = 400;
        /*jshint eqnull:true */
        var data = _.map(rawData, function (s) {
            return _.extend(s, {
                data: _.filter(s.data, function (d, i) {
                    if (i === 0 && d.y != null) return true;
                    var differentX = x(s.data[i-1]) !== x(d); // && y(s.data[i-1]) !== y(d);
                    return d.y != null && differentX;
                })
            });
        });

        renderPaths();
        if (options.line.marker.enable)
            renderMarkers();
        renderTooltipTrackers();


        function renderPaths() {
            var startLine = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function () { return y({x: 0, y: 0}); });

            var line = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function (d) { return y(d); });

            if(options.line.smooth) line.interpolate('cardinal');

            var series = layer.selectAll('g.series')
                    .data(data);

            // enter
            var el = series.enter().append('svg:g')
                .attr('class', function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; })
                .append('path')
                    .attr('class', 'line');

            if (options.chart.animations) {
                el.attr('d', function(d) { return startLine(d.data); })
                    .transition().duration(duration)
                    .attr('d', function (d) { return line(d.data); });
            } else {
                el.attr('d', function (d) { return line(d.data); });
            }

            // update
            el = series.select('.line');

            if (options.chart.animations) {
                el.transition().duration(duration)
                    .attr('d', function (d) { return line(d.data); });
            } else  {
                el.attr('d', function (d) { return line(d.data); });
            }

            // remove
            if (options.chart.animations) {
                series.exit()
                    .remove();
            } else  {
                series.exit().remove();
            }
        }

        function renderMarkers() {
            var markers = layer.selectAll('.line-chart-markers')
                .data(data);

            markers.enter().append('g')
                .attr('class', function (d, i) { return 'line-chart-markers markers s-' + (i+1); });

            markers.exit().remove();

            var dots = markers.selectAll('.dot')
                .data(function (d) { return d.data; }, function (d) { return d.x; });

            dots.enter().append('circle')
                .attr('class', 'dot')
                .attr('r', options.line.marker.size)
                .attr('cx', x)
                .attr('cy', h);

            dots.exit().remove();

            if (options.chart.animations) {
                dots.transition().delay(100).duration(duration)
                    .attr('cx', x)
                    .attr('cy', y);
            } else {
                dots.attr('cx', x)
                    .attr('cy', y);
            }
        }

        function renderTooltipTrackers() {
            var trackerSize = 10;
            var markers = layer.selectAll('.tooltip-trackers')
                .data(data);

            markers.enter().append('g')
                .attr('class', function (d, i) { return 'tooltip-trackers s-' + (i+1); });

            markers.exit().remove();

            var dots = markers.selectAll('.tooltip-tracker')
                .data(function (d) { return d.data; }, function (d) { return d.x; });

            dots.enter().append('circle')
                .attr('class', 'tooltip-tracker')
                .attr('r', trackerSize)
                .attr('opacity', 0)
                .attr('cx', x)
                .attr('cy', h);

            dots.exit().remove();

            dots.attr('cx', x)
                .attr('cy', y);
        }

        return this;
    }

    render.defaults = defaults;


    /**
    * Adds a line chart to the Narwhal instance.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .cartesian()
    *           .line([1,2,3,4])
    *           .render();
    *
    * @name line(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('line', render);

})();
