(function () {

    var defaults = {
        legend: {
            vAlign: 'middle',
            hAlign: 'right',
            // position: 'inside',
            direction: 'vertical',
            formatter: function (d) {
                return d.name;
            }
        }
    };


    var positioners = {
        horizontal: {
            right: function (bounds, options) { return options.chart.plotWidth - bounds.width; },
            left: function () { return 0; }
        },

        vertical: {
            top: function (bounds, options) { return bounds.height; },
            bottom: function (bounds, options) { return options.chart.plotHeight; }
        },
    };

    function validAlignmentClasses(options) {
        var classes = [];
        if(['top', 'middle', 'bottom'].indexOf(options.legend.vAlign) != -1) {
            classes.push(options.legend.vAlign);
        } else {
            classes.push('top');
        }

        if(['left', 'center', 'right'].indexOf(options.legend.hAlign) != -1) {
            classes.push(options.legend.hAlign);
        } else {
            classes.push('right');
        }

        return classes;
    }

    function Legend(data, layer, options) {
        var legend = this.container.selectAll('.legend').data([null]);
        var em = _.nw.textBounds('series', '.legend.legend-entry');
        var count = data.length;
        var legendHeight = (em.height + 4) * count + 12; // legend has 1px border and 5px margin (12px) and each entry has ~2px margin
        var mid = (options.chart.plotHeight - legendHeight) / 2;

        var container = legend.enter()
            .append('div')
            .attr('class', function () {
                return ['legend'].concat(validAlignmentClasses(options)).join(' ');
            })
            .attr('style', function () {
                var styles = [];

                if (options.legend.vAlign === 'top') {
                    styles.push('top: 0');
                } else if (options.legend.vAlign === 'middle') {
                    styles.push('top: ' + mid + 'px');
                } else {
                    styles.push('bottom: ' + (options.chart.internalPadding.bottom + 5) + 'px');
                }

                if (options.legend.hAlign === 'left') {
                    styles.push('left: ' + options.chart.plotLeft + 'px');
                } else if (options.legend.hAlign === 'center') {
                    styles.push('margin-left: auto; margin-right: auto; width: ' + options.chart.plotWidth + 'px; padding-left:' + options.chart.plotLeft);
                } else {
                    styles.push('right: 10px');
                }

                return styles.join(';');
            });

        var entries = container.selectAll('.legend-entry')
            .data(data, function (d) { return d.name; });

        var enter = entries.enter()
            .append('div')
            .attr('class', function () {
                return 'legend-entry' + (options.legend.direction === 'vertical' ? ' vertical' : '');
            });

        entries.append('span')
            .attr('class', function (d, i) { return 'legend-key s-' + (i+1) + ' ' + d.name; });

        entries.append('span')
            .attr('class', 'series-name')
            .text(options.legend.formatter);

        entries.exit()
            .remove();
    }

    Legend.defaults = defaults;

    /**
    * Adds a legend to the Contour instance. One entry is added to the legend for each series in the data.
    * 
    * ### Example:
    *
    *     new Contour({el: '.myChart'})
    *           .cartesian()
    *           .column(data)
    *           .legend(data)
    *           .render();
    *
    * @name legend(data, options)
    * @param {object|array} data The _data series_ for which to create a legend. This can be in any of the supported formats. 
    * @param {object} [options] Configuration options particular to this visualization that override the defaults.
    * @api public
    *
    */

    Contour.export('legend', Legend);

})();
