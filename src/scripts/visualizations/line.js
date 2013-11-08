(function (ns, d3, _, $, undefined) {

    var defaults = {
        line: {
            marker: {
                enable: true,
                size: 2.5
            }
        }
    };


    function render(data, layer, options, id) {

        var x = _.bind(function (d) { return this.xScale(d.x) + this.rangeBand / 2; }, this);
        var y = _.bind(function (d) { return this.yScale(d.y); }, this);
        var normalizeData = _.bind(this.datum, this);

        var line = d3.svg.line()
            .x(function (d) { return x(d); })
            .y(function (d) { return y(d); });

        if(data[0].data) {
            _.each(data, function (d, i) {
                var set = _.map(d.data, normalizeData);
                appendPath.call(this, set, d.name, i+1);
            }, this);
        } else {
            appendPath.call(this, _.map(data, normalizeData), data.name, 1);
        }

        function appendPath(data, seriesName, seriesIndex) {
            var markerSize = this.options.line.marker.size;
            var trackerSize = 10;
            seriesName = seriesName || '';
            className = ['v-' + id, 's-' + seriesIndex, seriesName].join(' ');
            var path = layer.append('path')
                .datum(data)
                .attr('class', 'line ' + className);
            if(this.options.chart.animations) {
                path.attr('d', line(data[0]))
                    .transition()
                        .duration(600)
                        .attrTween('d', pathTween);
            } else {
                path.attr('d', line);
            }

            if (this.options.line.marker.enable) {
                layer.append('g').attr('class', 'line-chart-markers')
                    .selectAll('dot')
                        .data(data)
                    .enter().append('circle')
                        .attr('class', 'dot ' + className)
                        .attr('r', markerSize)
                        .attr('cx', x)
                        .attr('cy', y);
            }

            // add the tooltip trackers regardless
            layer.append('g').attr('class', 'tooltip-trackers')
                .selectAll('tooltip-tracker')
                    .data(data)
                .enter().append('circle')
                    .attr('class', 'tooltip-tracker')
                    .attr('opacity', 0)
                    .attr('r', trackerSize)
                    .attr('cx', x)
                    .attr('cy', y);

            function pathTween() {
                var _data = data;
                var interpolate = d3.scale.quantile().domain([0,1])
                        .range(d3.range(1, _data.length + 1));
                return function(t) {
                    return line(_data.slice(0, interpolate(t)));
                };
            }
        }

        return this;
    };

    render.defaults = defaults;

    Narwhal.export('line', render);

})('Narwhal', window.d3, window._, window.jQuery);
