(function (ns, d3, _, $, undefined) {

    function ctor(data) {

        this.data(data);

        var datum = _.map(data, this.datum);

        var renderer = function (svg) {
            var x = _.bind(function (d) { return this.xScale(d.x) + this.xScale.rangeBand() / 2; }, this);
            var y = _.bind(function (d) { return this.yScale(d.y); }, this);

            var line = d3.svg.line()
                .x(function (d) { return x(d); })
                .y(function (d) { return y(d); });

            var g = svg.append('g')
                .attr('vis-id', renderer.id)
                .attr('type', 'line-chart');

            g.append('path')
                .datum(datum)
                .attr('class', 'line')
                .attr('d', line);

            return this;
        };

        this.options.visualizations.push(renderer);

        return this;
    }

    Narwhal.export('line', ctor);

})('Narwhal', window.d3, window._, window.jQuery);
