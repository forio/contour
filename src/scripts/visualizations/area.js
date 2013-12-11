(function (window, undefined) {

    var defaults = {
        xAxis: {
            type: 'linear'
        },
        area: {
            stacked: true,
        }
    };

    function renderer(data, layer, options) {
        var x = _.bind(function (val) { return this.xScale(val) + this.rangeBand / 2; }, this);
        var y = _.bind(function (val) { return this.yScale(val); }, this);
        var classFn = function (d, i) { return 'series s-' + (i+1) + ' ' + d.name; };
        var stack = d3.layout.stack().values(function (d) { return d.data; });
        var stackedData = stack(data);
        var area = d3.svg.area()
            .x(function(d) { return x(d.x); })
            .y0(function (d) { return y(d.y0); })
            .y1(function(d) { return y(d.y0 + d.y); });

        adjustDomain.call(this);
        renderSeries.call(this);

        function adjustDomain() {
            /* jshint eqnull:true */
            if(this.options.area.stacked && this.options.yAxis.max == null) {
                var flat = _.flatten(_.map(stackedData, function (d) { return d.data; }));
                var max = _.max(flat, function (d) { return d.y0 + d.y; });
                this.setYDomain([0, max.y + max.y0]);
                this.redrawYAxis();
            }
        }

        function renderSeries() {
            var series = layer.selectAll('g.series')
                    .data(stackedData)
                    .enter().append('g')
                        .attr('class', classFn);

            series.append('path')
                .datum(function(d) { return d.data; })
                .attr('class', 'area')
                .attr('d', area);
        }
    }

    renderer.defaults = defaults;

    /*
    * Renders an area chart onto the narwhal frame. Area charts are stacked by default.
    *
    * ### Example
    *     new Narwhal({el: '.chart'}).area([1,2,3,4]);
    *
    * @name .area(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('area', renderer);

})(window);
