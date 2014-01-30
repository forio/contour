(function () {

    var defaults = {
        pie: {
            piePadding: 1,
            // inner and outer radius can be numbers (pixels) or functions
            // inner radius as function will recive the outerRadius as parameter
            innerRadius: null,
            // outer radius as function will recieve the proposed maximum radius for a pie
            outerRadius: null
        }
    };

    function renderer(data, layer, options) {
        var duration = 400;
        var w = options.chart.plotWidth, h = options.chart.plotHeight;
        var padding = _.nw.getValue(options.pie.piePadding, 0, this);
        var numSeries = data.length;
        var proposedRadius = (Math.min(w / numSeries, h) / 2) - padding;
        var radius = _.nw.getValue(options.pie.outerRadius, proposedRadius, this, proposedRadius) ;
        var innerRadius = _.nw.getValue(options.pie.innerRadius, 0, this, radius);
        var classFn = function (d, i) { return 'series arc tooltip-tracker s-' + (i+1) + ' ' + d.name; };
        // shape the data into angles and don't sort (ie preserve order of input array)
        var pieData = d3.layout.pie().value(function (d) { return d.y; }).sort(null);
        var translatePie = function (d,i) {
            var offsetX = radius * 2 + padding;
            return "translate(" + (radius + padding + (offsetX * i)) + "," + (radius + padding) + ")";
        };

        var pieGroup = layer.selectAll('g.pie-group')
            .data(data);

        pieGroup.enter().append('svg:g')
            .attr('class', 'pie-group')
            .attr("transform", translatePie)
            .call(renderSeries);

        pieGroup.exit().remove();

        if (options.chart.animations) {
            pieGroup
                .call(renderSeries)
                .transition().duration(duration/2)
                .attr("transform", translatePie);
        } else {
            pieGroup.call(renderSeries)
                .attr("transform", translatePie);
        }

        function renderSeries(group) {
            var arc = d3.svg.arc()
                .outerRadius(radius).innerRadius(innerRadius);

            var startArc = d3.svg.arc()
                .outerRadius(radius).innerRadius(innerRadius)
                .startAngle(0).endAngle(0);

            var pie = group.selectAll('path')
                .data(function (d) { return pieData(d.data); }, function (d) { return d.data.x; });

            pie.enter()
                .append('path')
                .attr('class', classFn)
                .attr('d', function (d) { return startArc(d); })
                .each(function (d) { this._current = { startAngle: d.startAngle, endAngle: d.startAngle }; });

            if (options.chart.animations) {
                pie.exit()
                    .remove();

                pie.transition().duration(duration)
                    .ease('cubic-in')
                    .attrTween('d', arcTween);
            } else {
                pie.exit().remove();
                pie.attr('d', arc);
            }

            // Store the displayed angles in _current.
            // Then, interpolate from _current to the new angles.
            // During the transition, _current is updated in-place by d3.interpolate.
            // from http://bl.ocks.org/mbostock/1346410
            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                    return arc(i(t));
                };
            }
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
    * @name .pie(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats. The data elements are summed and then divided. In the example, `.pie([1,2,3,4])` makes four pie slices: 1/10, 2/10, 3/10, and 4/10.
    * @param {object} [options] Options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Narwhal.export('pie', renderer);

})();
