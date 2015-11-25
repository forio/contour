(function () {

    var defaults = {
        xAxis: {
            type: 'linear'
        },
        area: {
            stacked: true,
            areaBase: undefined,
            preprocess: _.nw.minMaxFilter(1000)
        }
    };

    /* jshint eqnull:true */
    function renderer(data, layer, options) {
        this.checkDependencies('cartesian');
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var x = _.bind(function (val) { return this.xScale(val) + this.rangeBand / 2 + 0.5; }, this);
        var y = _.bind(function (val) { return this.yScale(val) + 0.5; }, this);
        var h = options.chart.plotHeight;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });

        var startArea = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return h; })
            .y1(function(d) { return h; });

        var areaBase = options.area.areaBase != null ? options.area.areaBase : options.yAxis.min;
        var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return options.area.stacked ? y(d.y0 || areaBase || 0) : y(0); })
            .y1(function(d) { return y((options.area.stacked ? d.y0 : 0) + d.y); });

        if(options.area.smooth) {
            area.interpolate('cardinal');
            startArea.interpolate('cardinal');
        }

        renderSeries();

        if (options.tooltip && options.tooltip.enable)
            renderTooltipTrackers();

        function renderSeries() {
            data = options.area.preprocess(data);

            var series = layer.selectAll('g.series')
                    .data(stack(data));

            series.enter()
                .append('svg:g')
                .attr('class', classFn)
                .append('path').datum(function (d) { return d.data; })
                    .attr('class', 'area')
                    .attr('d', startArea);

            series.exit().remove();

            if (options.chart.animations && options.chart.animations.enable) {
                series.select('.area')
                    .datum(function (d) { return d.data; })
                    .transition().duration(options.chart.animations.duration || duration)
                    .attr('d', area);
            } else {
                series.select('.area')
                    .datum(function (d) { return d.data; })
                    .attr('d', area);
            }
        }

        function renderTooltipTrackers() {
            var trackerSize = 10;
            // add the tooltip trackers regardless
            var markers = layer.selectAll('.tooltip-trackers')
                .data(data, function (d) { return d.name; });

            markers.enter().append('g')
                .attr('class', 'tooltip-trackers');

            markers.exit().remove();

            var blocks = markers.selectAll('.tooltip-tracker')
                    .data(function (d) {
                        return d.data;
                    }, function (d, i) {
                        return [d.x,d.y,d.y0].join('&');
                    });

            blocks.enter().append('rect')
                    .attr('class', 'tooltip-tracker')
                    .attr('opacity', 0)
                    .attr('width', trackerSize * 2);

            blocks.attr('x', function(d) { return x(d.x) - trackerSize; })
                .attr('y', function(d) { return y((options.area.stacked ? d.y0 : 0) + d.y); })
                .attr('height', function(d) { return y(0) - y(d.y); });

            blocks.exit().remove();

        }
    }

    renderer.defaults = defaults;

    /**
    * Adds an area chart to the Contour instance.
    *
    * Area charts are stacked by default when the _data_ includes multiple series.
    *
    * This visualization requires `.cartesian()`.
    *
    * ### Example:
    *
    *     new Contour({el: '.myChart'})
    *           .cartesian()
    *           .area([1,2,3,4])
    *           .render();
    *
    * @name area(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Configuration options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Contour.export('area', renderer);

})();
