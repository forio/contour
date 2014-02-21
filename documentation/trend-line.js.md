

## trendLine(data, options)

Adds a trend line to the Narwhal instance, based on linear regression.

This visualization requires `.cartesian()`.

### Example:

    new Narwhal({el: '.myChart'})
          .cartesian()
          .trendLine([2,4,3,5,7])
          .render();

### Params:

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats. A linear regression is performed on the _data series_ and the resulting trend line is displayed.

* **object** *[options]* Options particular to this visualization that override the defaults.

