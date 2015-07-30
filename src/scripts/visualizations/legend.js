(function () {

    var defaults = {
        legend: {
            vAlign: 'middle',
            hAlign: 'right',
            direction: 'vertical',
            formatter: function (d) {
                return d.name;
            },
            el: undefined
        }
    };

    function validAlignmentClasses(options) {
        var classes = [];
        if (['top', 'middle', 'bottom'].indexOf(options.legend.vAlign) !== -1) {
            classes.push(options.legend.vAlign);
        } else {
            classes.push('top');
        }

        if (['left', 'center', 'right'].indexOf(options.legend.hAlign) !== -1) {
            classes.push(options.legend.hAlign);
        } else {
            classes.push('right');
        }

        if (options.legend.direction === 'vertical') {
            classes.push('vertical');
        }

        return classes;
    }

    function Legend(data, layer, options) {
        var container;
        if (options.legend.el) {
            container = d3.select(options.legend.el).node();
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        } else {
            this.container.selectAll('.contour-legend').remove();
        }
        var em = _.nw.textBounds('series', '.contour-legend.contour-legend-entry');
        var count = data.length;
        var legendHeight = (em.height + 4) * count + 12; // legend has 1px border and 5px margin (12px) and each entry has ~2px margin
        var mid = (options.chart.plotHeight - legendHeight) / 2;
        var positioner = function (selection) {
            // adjust position of legend only when is horizontally centered
            // since we need to have all elements in the legend to calculate its width
            if (options.legend.hAlign !== 'center' || !selection.length) {
                return ;
            }

            // adjust the left
            var legendWidth = selection[0].parentNode.clientWidth;
            var left = (options.chart.plotWidth - legendWidth) / 2 + options.chart.internalPadding.left;

            d3.select(selection[0].parentNode)
                .style('left', left + 'px');
        };

        if (options.legend.el) {
            container = d3.select(options.legend.el);
        } else {
            var legend = this.container.selectAll('.contour-legend').data([null]);
            container = legend.enter().append('div');
        }

        container.attr('class', function () {
            return ['contour-legend'].concat(validAlignmentClasses(options)).join(' ');
        });

        container.attr('style', function () {
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
                var bounds = _.nw.textBounds(this, '.contour-legend');

                styles.push('left: ' + ((options.chart.plotWidth - bounds.width) / 2 + options.chart.internalPadding.left) + 'px' );
            } else {
                styles.push('right: 10px');
            }

            return styles.join(';');
        });

        var entries = container.selectAll('.contour-legend-entry')
            .data(data);

        entries.enter()
            .append('div')
            .attr('class', function () {
                return 'contour-legend-entry';
            });

        entries.append('span')
            .attr('class', function (d, i) { return 'contour-legend-key series s-' + (i+1) + ' ' + _.nw.seriesNameToClass(d.name); });

        entries.append('span')
            .attr('class', 'series-name')
            .text(options.legend.formatter)
            .call(positioner);

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
