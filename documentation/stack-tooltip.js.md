

## stackTooltip(data, options)

Adds a tooltip and legend combination for stacked (multiple) series visualizations in the Narwhal instance.
Requires a second display element (`<div>`) for the legend in the html.

### Example:

    new Narwhal({el: '.myChart'})
          .cartesian()
          .column(stackedColData)
          .stackedTooltip(stackedColData, {el: '.myChartLegend'})
          .render();

### Params:

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *options* Options particular to this visualization that override the defaults. The `el` option must contain the selector of the container in which the tooltip should be rendered.

