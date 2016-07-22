(function () {

    var defaults = {
        pie: {
            sliceClass: null,

            style: null,

            piePadding: {
                left: null,
                top: null,
                right: null,
                bottom: null
            },

            // inner and outer radius can be numbers of pixels if >= 1, percentage if > 0 && < 1 or functions

            // inner radius as function will recive the outerRadius as parameter
            // passing a value between 0 and 1 (non-inclusing), this value is interpreted as % of radius
            // ie. outerRadius: 100, innerRadius: .8 would give a inner radius or 80 pixles
            innerRadius: null,

            // outer radius as function will recieve the proposed maximum radius for a pie
            // passing a value between 0 and 1 (non-inclusing), this value is interpreted as % of width
            // the default behavior is 50% of the mininum between with and height of the container (adjusted for padding)
            outerRadius: null
        }
    };

    function normalizePadding(options) {
        if (_.isNumber(options.pie.piePadding)) {
            return {
                top: options.pie.piePadding,
                left: options.pie.piePadding,
                right: options.pie.piePadding,
                bottom: options.pie.piePadding
            };
        }

        return options.pie.piePadding;
    }

    function clampBounds(bounds, maxWidth, maxHeight) {
        return {
            top: nw.clamp(bounds.top, 0, maxHeight),
            bottom: nw.clamp(bounds.bottom, 0, maxHeight),
            left: nw.clamp(bounds.left, 0, maxWidth),
            right: nw.clamp(bounds.right, 0, maxWidth)
        };
    }

    function calcPadding(options) {
        var padding = normalizePadding(options);
        var w = options.chart.plotWidth;
        var h = options.chart.plotHeight;

        return clampBounds(padding, w, h);
    }

    function resolveValueUnits(value, ref) {
        // resolve (0,1) interval to a percentage of the reference value
        // otherwise as a pixel valie
        return value > 0 && value < 1 ? ref * value : value;
    }

    function resolvePaddingUnits(padding, w, h) {
        // if the value of padding is betweem 0 and 1 (non inclusing),
        // interpret it as a percentage, otherwise as a pixel value
        return {
            top: resolveValueUnits(padding.top, h) || 5,
            bottom: resolveValueUnits(padding.bottom, h) || 5,
            left: resolveValueUnits(padding.left, w) || 5,
            right: resolveValueUnits(padding.right, w) || 5
        };
    }

    function renderer(data, layer, options) {
        /*jshint eqnull:true */
        var duration = options.chart.animations.duration != null ? options.chart.animations.duration : 400;
        var shouldAnimate = options.chart.animations && options.chart.animations.enable;
        var w = options.chart.plotWidth, h = options.chart.plotHeight;
        var padding = calcPadding.call(this, options);
        var numSeries = data.length;
        var style = options.pie.style;
        var _this = this;
        var shouldCenterX = _.all([options.pie.piePadding.left, options.pie.piePadding.right], function (d) { return d == null; });
        var shouldCenterY = _.all([options.pie.piePadding.top, options.pie.piePadding.bottom], function (d) { return d == null; });
        var pixelPadding = resolvePaddingUnits(padding, w, h);
        // the reference size is the min between with and height of the container
        var referenceSize = Math.min(w, h);

        // for auto radius we need to take the min between the available with or height adjusted by padding and num series
        var totalPadding = pixelPadding.left + (pixelPadding.right + pixelPadding.left) * (numSeries - 1) + pixelPadding.right;
        var proposedRadius = Math.min(((w - totalPadding) / numSeries) / 2, (h - pixelPadding.top - pixelPadding.bottom) / 2);
        var radius = resolveValueUnits(nw.getValue(options.pie.outerRadius, proposedRadius, this, proposedRadius, referenceSize), referenceSize);
        // inner radius is a pixel value or % of the radius
        var innerRadius = resolveValueUnits(nw.getValue(options.pie.innerRadius, 0, this, radius), radius);
        var pieData = d3.layout.pie().value(function (d) { return d.y; }).sort(null);
        var totalWidth = totalPadding + radius * numSeries * 2;
        var outerPaddingLeft = shouldCenterX ? (w - totalWidth) / 2 : pixelPadding.left;
        var centerY = h / 2;

        var classFn = function (d, i, j) {
            var baseClass = 'series arc' + (options.tooltip.enable ? ' tooltip-tracker' : '') + ' s-' + (i+1) + ' ' + d.data.x;

            if (!options.pie.sliceClass) {
                return baseClass;
            }

            return baseClass + ' ' + (typeof options.pie.sliceClass === 'function' ? options.pie.sliceClass.call(_this, d, i, j) : options.pie.sliceClass);
        };

        var translatePie = function (d,i) {
            // calc the left side coord of the pie, including padding for the prevousous pies
            var offsetX = outerPaddingLeft + (radius * 2 * i + (pixelPadding.right + pixelPadding.left) * i);
            // calc the center of the pie starting from offsetX
            var posY = shouldCenterY ? centerY : radius + pixelPadding.top;

            return 'translate(' + (radius + offsetX) + ',' + (posY) + ')';
        };

        var pieGroup = layer.selectAll('g.pie-group')
            .data(data);

        pieGroup.enter().append('svg:g')
            .attr('class', 'pie-group')
            .attr('transform', translatePie)
            .call(renderSeries);

        pieGroup.exit().remove();

        if (shouldAnimate) {
            pieGroup
                .call(renderSeries)
                .transition().duration(duration/2)
                .attr('transform', translatePie);
        } else {
            pieGroup.call(renderSeries)
                .attr('transform', translatePie);
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
                .attr('style', style)
                .each(function (d) { this._current = { startAngle: d.startAngle, endAngle: d.startAngle }; });


            if (shouldAnimate) {
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


    /**
    * Adds a pie chart to the Contour instance.
    *
    * ### Example:
    *
    *     new Contour({el: '.myChart'})
    *           .pie([1,2,3,4])
    *           .render();
    *
    * @name pie(data, options)
    * @param {object|array} data The _data series_ to be rendered with this visualization. This can be in any of the supported formats. The data elements are summed and then divided. In the example, `.pie([1,2,3,4])` makes four pie slices: 1/10, 2/10, 3/10, and 4/10.
    * @param {object} [options] Configuration options particular to this visualization that override the defaults.
    * @api public
    *
    */
    Contour.export('pie', renderer);

})();
