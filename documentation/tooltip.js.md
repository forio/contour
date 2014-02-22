

## tooltip(data, options)

Adds a tooltip on hover to all other visualizations in the Narwhal instance.

Although not strictly required, this visualization does not appear unless there are one or more additional visualizations in this Narwhal instance for which to show the tooltips.

### Example:

    new Narwhal({el: '.myChart'})
          .cartesian()
          .line([2, 4, 3, 5, 7])
          .tooltip()
          .render();

### Params:

* **object|array** *data* Ignored!

* **object** *options* Options particular to this visualization that override the defaults.

