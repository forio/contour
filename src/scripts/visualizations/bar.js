(function (window, undefined) {

    Narwhal.export('bar', function barRender(data, layer, options, i) {
        var values = _.pluck(data, 'y');
        var barWidth = 20;
        var w = this.options.chart.plotWidth;
        var h = barWidth * data.length;// this.options.chart.plotHeight;
        var xScale = d3.scale.linear().domain([0, d3.max(values)]).range([0, w]).nice();
        var yScale = d3.scale.ordinal().domain(_.pluck(data, 'x')).rangeBands([0, h], 0.1);
        var rangeBand = barWidth; //yScale.rangeBand();

        var bar = layer.selectAll('.bar')
            .data(data);

        bar.enter().append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('y', function (d) { return yScale(d.x); })
            .attr('height', rangeBand - 2)
                .attr('width', function (d) { return xScale(d.y); });


    });

}).call(this);
