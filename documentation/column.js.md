

<!-- Start src/scripts/visualizations/column.js -->

shint eqnull:true

## .column(data, options)

Renders a column chart (vertical columns) onto the narwhal frame.

This visualization requires *cartesian()*

### Example
    new Narwha({el: &#39;.chart&#39;})
          .cartesian()
          .column([1,2,3,4]);

### Params: 

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

<!-- End src/scripts/visualizations/column.js -->

