(function () {

    var defaults = {
        xAxis: {
            type: 'linear'
        },
        area: {
            stacked: true,
        }
    };

    /* jshint eqnull:true */
    function renderer(data, layer, options) {

        if (!this.xScale) throw new Error('Area Chart requires .cartesian() to be included in the instance.');
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var x = _.bind(function (val) { return this.xScale(val) + this.rangeBand / 2; }, this);
        var y = _.bind(function (val) { return this.yScale(val); }, this);
        var h = options.chart.plotHeight;
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });

        var startArea = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return h; })
            .y1(function(d) { return h; });

        var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return options.area.stacked ? y(d.y0) : h; })
            .y1(function(d) { return y((options.area.stacked ? d.y0 : 0) + d.y); });

        renderSeries();


        function renderSeries() {
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

            renderTooltipTrackers.call(this, series);
        }

        function renderTooltipTrackers(series){
            var trackerSize = 10;
            // add the tooltip trackers regardless
            series.append('g').attr('class', 'tooltip-trackers')
                .selectAll('tooltip-tracker')
                    .data(function (d) { return d.data; })
                .enter().append('circle')
                    .attr('class', 'tooltip-tracker')
                    .attr('opacity', 0)
                    .attr('r', trackerSize)
                    .attr('cx', function(d) { return x(d.x); })
                    .attr('cy', function(d) { return y((options.area.stacked ? d.y0 : 0) + d.y); });
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
