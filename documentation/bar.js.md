

<!-- Start src/scripts/visualizations/bar.js -->

## .bar(data, options)

Renders a bar chart (horizontal columns) onto the narwhal frame.

You can use this visualization to render stacked &amp; grouped charts (controlled through the options). This visualization requires *cartesian()* and *horizontal()*

### Example
    new Narwha({el: &#39;.chart&#39;})
          .cartesian()
          .horizontal()
          .bar([1,2,3,4]);

### Params: 

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

<!-- End src/scripts/visualizations/bar.js -->

