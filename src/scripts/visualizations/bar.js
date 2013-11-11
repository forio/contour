(function (window, undefined) {

    Narwhal.export('bar', function barRender(data, layer, options, i) {
        var xScale = this.xScale;
        var yScale = this.yScale;
        var rangeBand = this.rangeBand;

        var bar = layer.selectAll('.bar')
            .data(data);

        bar.enter().append('rect')
            .attr('class', 'bar tooltip-tracker s-1')
            .attr('x', 0)
            .attr('y', function (d) {
                return xScale(d.x);
            })
            .attr('height', rangeBand )
            .attr('width', function (d) {
                return yScale(d.y);
            });


    });

}).call(this);
