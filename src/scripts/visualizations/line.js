(function (ns, d3, _, $, undefined) {

    var defaults = {
        line: {
            marker: {
                enable: true,
            }
        }
    };

    function ctor(data, options) {

        $.extend(true, this.options, defaults, { line: options });

        this.data(data);

        var renderer = function (svg, series) {
            var x = _.bind(function (d) { return this.xScale(d.x) + this.rangeBand / 2; }, this);
            var y = _.bind(function (d) { return this.yScale(d.y); }, this);

            var line = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function (d) { return y(d); });

            var g = svg.append('g')
                .attr('vis-id', renderer.id)
                .attr('type', 'line-chart')
                .attr('transform', 'translate(' + this.options.chart.padding.left + ',' + this.options.chart.padding.top + ')');

            if(data[0].data) {
                _.each(data, function (d) {
                    var set = _.map(d.data, this.datum, this);
                    appendPath.call(this, set, d.name);
                }, this);
            } else {
                appendPath.call(this, _.map(data, this.datum));
            }

            function appendPath(data, seriesName) {
                seriesName = seriesName || 'not-specified';
                className = seriesName.replace(' ', '_');
                g.append('path')
                    .datum(data)
                    .attr('class', 'line series-' + className)
                    .attr('d', line);

                if (this.options.line.marker.enable) {
                    g.append('g').attr('class', 'line-chart-markers')
                        .selectAll('dot')
                            .data(data)
                        .enter().append('circle')
                            .attr('class', 'dot tooltip-tracker series-' + className)
                            .attr('r', 3)
                            .attr('cx', x)
                            .attr('cy', y);
                }
            }

            return this;
        };

        this.options.visualizations.push(renderer);

        return this;
    }

    Narwhal.export('line', ctor);

})('Narwhal', window.d3, window._, window.jQuery);
