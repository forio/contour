(function () {

    var defaults = {
        pie: {
            piePadding: 10,
            innerRadius: null,
            outerRadius: null
        }
    };

    function renderer(data, layer) {
        var w = this.options.chart.plotWidth, h = this.options.chart.plotHeight;
        var padding = this.options.pie.piePadding;
        var radius = this.options.pie.outerRadius || Math.min(w, h) / 2 - padding;
        var classFn = function (d, i) { return 'series arc tooltip-tracker s-' + (i+1) + ' ' + d.name; };
        var pieData = d3.layout.pie().value(function (d) { return d.y; });
        var arc = d3.svg.arc()
                    .outerRadius(radius)
                    .innerRadius(this.options.pie.innerRadius);

        if(data.length > 1) _.nw.warning('pie chart only supports 1 series at a time');
        _.each(data, renderSeries, this);

        function renderSeries(series) {
            var g = layer
                .append('svg:g')
                    .attr("transform", "translate(" + (radius + padding) + "," + (radius + padding) + ")");

            g.selectAll('.series')
                .data(pieData(series.data))
                .enter().append('path')
                    .attr('class', classFn)
                    .attr('d', arc);
        }
    }

    renderer.defaults = defaults;


    /*
    * Adds a pie chart to the Narwhal instance.
    *
    * ### Example:
    *
    *     new Narwhal({el: '.myChart'})
    *           .pie([1,2,3,4])
    *           .render();
    *
    * @name pie(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats. The data elements are summed and then divided. In the example, `.pie([1,2,3,4])` makes four pie slices: 1/10, 2/10, 3/10, and 4/10.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('pie', renderer);

})();
