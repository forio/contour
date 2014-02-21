

## column(data, options)

Adds a column chart (vertical columns) to the Narwhal instance.

This visualization requires `.cartesian()`.

### Example:

    new Narwhal({el: '.myChart'})
          .cartesian()
          .column([1,2,3,4])
          .render();

### Params:

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

