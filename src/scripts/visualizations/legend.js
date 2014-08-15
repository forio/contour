(function () {

    var defaults = {
        legend: {
            vAlign: 'middle',
            hAlign: 'right',
            direction: 'vertical',
            formatter: function (d) {
                return d.name;
            }
        }
    };

    function validAlignmentClasses(options) {
        var classes = [];
        if (['top', 'middle', 'bottom'].indexOf(options.legend.vAlign) != -1) {
            classes.push(options.legend.vAlign);
        } else {
            classes.push('top');
        }

        if (['left', 'center', 'right'].indexOf(options.legend.hAlign) != -1) {
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

        // make hidden html version of legend
        function makeDiv() {
            this.container.selectAll('div.contour-legend').remove();
            var legend = this.container.selectAll('div.contour-legend').data([null]);
            var em = _.nw.textBounds('series', 'div.contour-legend.contour-legend-entry');
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

            var container = legend.enter()
                .append('div')
                .attr('class', function () {
                    return ['contour-legend'].concat(validAlignmentClasses(options)).join(' ');
                })
                .attr('style', function () {
                    var styles = ['visibility: hidden'];

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
                        var bounds = _.nw.textBounds(this, 'div.contour-legend');

                        styles.push('left: ' + ((options.chart.plotWidth - bounds.width) / 2 + options.chart.internalPadding.left) + 'px' );
                    } else {
                        styles.push('right: 10px');
                    }

                    return styles.join(';');
                });

            var entries = container.selectAll('div.contour-legend-entry')
                .data(data);

            var enter = entries.enter()
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

        // make svg version of legend, copying positions and sizes from the html version
        function makeSvg() {
            layer.selectAll('.contour-legend').remove();
            var legend = layer.selectAll('.contour-legend').data([null]);

            var containerDiv = this.container.select('div.contour-legend');
            var containerDivNode = containerDiv.node();
            var containerDivStyle = window.getComputedStyle(containerDivNode);

            var container = legend.enter()
                .append('g')
                .attr('transform', 'translate(' + (containerDivNode.offsetLeft + containerDivNode.clientLeft - options.chart.plotLeft) + ',' + (containerDivNode.offsetTop + containerDivNode.clientTop - options.chart.plotTop) + ')')
                .attr('class', function () {
                    return ['contour-legend'].concat(validAlignmentClasses(options)).join(' ');
                });

            container.append('rect')
                .attr('width', containerDivNode.clientWidth)
                .attr('height', containerDivNode.clientHeight)
                .attr('rx', containerDivStyle.borderTopLeftRadius)
                .attr('ry', containerDivStyle.borderTopLeftRadius);

            var entriesDivs = containerDiv.selectAll('.contour-legend-entry');
            function getEntryDivSubNode(i, selector) {
                return d3.select(entriesDivs[0][i]).select(selector).node();
            }
            function getEntryDivKeyNode(i) {
                return getEntryDivSubNode(i, '.contour-legend-key');
            }
            function getEntryDivKeyStyle(i) {
                return window.getComputedStyle(getEntryDivSubNode(i, '.contour-legend-key'));
            }
            function getEntryDivSeriesNode(i) {
                return getEntryDivSubNode(i, '.series-name');
            }

            var entries = container.selectAll('.contour-legend-entry')
                .data(data);

            var enter = entries.enter()
                .append('g')
                .classed('contour-legend-entry', true);

            enter.append('rect')
                .attr('x', function (d, i) {
                    return getEntryDivKeyNode(i).offsetLeft;
                })
                .attr('y', function (d, i) {
                    return getEntryDivKeyNode(i).offsetTop;
                })
                .attr('width', function (d, i) {
                    return getEntryDivKeyNode(i).offsetWidth - 2;
                })
                .attr('height', function (d, i) {
                    return getEntryDivKeyNode(i).offsetHeight - 2;
                })
                .attr('rx', function (d, i) {
                    return getEntryDivKeyStyle(i).borderTopLeftRadius;
                })
                .attr('ry', function (d, i) {
                    return getEntryDivKeyStyle(i).borderTopLeftRadius;
                })
                .attr('class', function (d, i) {
                    return 'contour-legend-key series s-' + (i+1) + ' ' + _.nw.seriesNameToClass(d.name);
                });

            enter.append('text')
                .attr('x', function (d, i) {
                    return getEntryDivSeriesNode(i).offsetLeft + 1;
                })
                .attr('y', function (d, i) {
                    var entryDivSeriesNode = getEntryDivSeriesNode(i);
                    return entryDivSeriesNode.offsetTop + entryDivSeriesNode.offsetHeight - entryDivSeriesNode.offsetParent.clientTop - 2;
                })
                .classed('series-name', true)
                .text(options.legend.formatter);

            entries.exit()
                .remove();
        }

        makeDiv.call(this);
        makeSvg.call(this);
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
