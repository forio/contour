

## bar(data, options)

Adds a bar chart (horizontal columns) to the Narwhal instance.

You can use this visualization to render both stacked and grouped charts (controlled through the _options_).

This visualization requires `.cartesian()` and `.horizontal()`.

### Example:

    new Narwhal({el: '.myChart'})
          .cartesian()
          .horizontal()
          .bar([1,2,3,4])
          .render();

### Params:

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

