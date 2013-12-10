

<!-- Start src/scripts/visualizations/line.js -->

## nonNullData

shint eqnull:true

## .line(data, options)

Renders a line chart (vertical columns) onto the narwhal frame.

This visualization requires *cartesian()*

### Example
    new Narwha({el: &#39;.chart&#39;})
          .cartesian()
          .line([1,2,3,4]);

### Params: 

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

<!-- End src/scripts/visualizations/line.js -->

