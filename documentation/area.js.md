

## area(data, options)

Adds an area chart to the Narwhal instance.

Area charts are stacked by default when the _data_ includes multiple series.

This visualization requires `.cartesian()`.

### Example:

    new Narwhal({el: '.myChart'})
          .cartesian()
          .area([1,2,3,4])
          .render();

### Params:

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

