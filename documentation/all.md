

<!-- Start src/scripts/core/narwhal.js -->

## Narwhal() visualizations object

Narwhal visualization constructor

See: {@link Options}

### Params: 

* **object** *options* The global options object

## expose()

Exposes functionality to the core Narwhal object.
This is used to add base functionality to be used by viasualizations
for example the `cartesian` frame is implemented exposing functionality.

Example:

    Narwhal.expose(&quot;example&quot;, {
         // when included in the instance, this will expose `.transformData` to the visualizations
        transformData: function(data) { .... }
    });

    // To include the functionality into a specific instance
    new Narwhal(options)
          .example()
          .visualizationsThatUsesTransformDataFunction()
          .render()

## export(ctorName, renderer)

Adds a visualization to be rendered in the instance of Narwhal
This is the main way to expose visualizations to be used

See: options

### Params: 

* **String** *ctorName* Name of the visualization to be used as a contructor name

* **Function** *renderer* Function that will be called to render the visualization. The function will recieve the data that was passed in to the constructor function

<!-- End src/scripts/core/narwhal.js -->

<!-- Start src/scripts/core/cartesian.js -->

## .cartesian()

Provides a cartesian frame to the Narwhal instance

Example:

    new Narwhal(options)
          .cartesian();

Now new visualizations have accecss to the cartesian frame functionality

## this.xScale()(value)

Provides a scaling function based on the xAxis values.

Example:

    var scaledValue = this.xScale(100);

### Params: 

* **Number|String** *value* The value to be scaled

### Return:

* **Number** The scaled value according to the current xAxis settings

## this.yScale()(value)

Provides a scaling function based on the xAxis values.

Example:

    var scaledValue = this.xScale(100);

### Params: 

* **Number** *value* The value to be scaled

### Return:

* **Number** The scaled value according to the current yAxis settings

Modifies the domain for the y axis.

Example:

    this.setYDomain([100, 200]);

### Params: 

* **Array** *domain* The domain array represeting the min and max values of to be visible in the y Axis

Redraws the yAxis with the new settings and domain

Example:

    this.redrawYAxis(;

<!-- End src/scripts/core/cartesian.js -->

<!-- Start src/scripts/core/horizontal-frame.js -->

<!-- End src/scripts/core/horizontal-frame.js -->

<!-- Start src/scripts/core/narwhal-utils.js -->

shint eqnull:true

shint eqnull:true

<!-- End src/scripts/core/narwhal-utils.js -->

<!-- Start src/scripts/core/version.js -->

## version

<!-- End src/scripts/core/version.js -->

<!-- Start src/scripts/core/axis/axis-scale-factory.js -->

<!-- End src/scripts/core/axis/axis-scale-factory.js -->

<!-- Start src/scripts/core/axis/linear-scale-axis.js -->

## optMin

shint eqnull: true

<!-- End src/scripts/core/axis/linear-scale-axis.js -->

<!-- Start src/scripts/core/axis/ordinal-scale-axis.js -->

## OrdinalScale()

{
        scale: returns the d3 scale for the type

        axis: returns the d3 axis

        range: returns the d3 range for the type

        postProcessAxis:
    }

<!-- End src/scripts/core/axis/ordinal-scale-axis.js -->

<!-- Start src/scripts/core/axis/time-scale-axis.js -->

## dateDiff()

{
        scale: returns the d3 scale for the type

        range: returns the d3 range for the type
    }

<!-- End src/scripts/core/axis/time-scale-axis.js -->

<!-- Start src/scripts/visualizations/area.js -->

jshint eqnull:true

## .area(data, options)

Renders an area chart onto the narwhal frame. Area charts are stacked by default.

### Example
    new Narwha({el: &#39;.chart&#39;}).area([1,2,3,4]);

### Params: 

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

<!-- End src/scripts/visualizations/area.js -->

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

<!-- Start src/scripts/visualizations/pie.js -->

## .pie(data, options)

Renders a pie chart onto the narwhal frame.

### Example
    new Narwha({el: &#39;.chart&#39;})
          .pie([1,2,3,4]);

### Params: 

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

<!-- End src/scripts/visualizations/pie.js -->

<!-- Start src/scripts/visualizations/scatter.js -->

## .scatter(data, options)

Renders a scatter plot chart
This visualization requires *cartesian()*

### Example
    new Narwha({el: &#39;.chart&#39;})
          .cartesian()
          .scatter([1,2,3,4]);

### Params: 

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

<!-- End src/scripts/visualizations/scatter.js -->

<!-- Start src/scripts/visualizations/stack-tooltip.js -->

## .stackedTooltip(data, options)

Renders a tooltip legend combination for stacked series.

### Example
    new Narwha({el: &#39;.chart&#39;})
          .stackedTooltip([1,2,3,4]);

### Params: 

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *options* Options particular to this visualization that override the defaults. The `el` option must contain the selector the container where to render the tooptip

## onMouseOver()

shint eqnull:true

datum

<!-- End src/scripts/visualizations/stack-tooltip.js -->

<!-- Start src/scripts/visualizations/tooltip.js -->

## .tooltip(data, options)

Renders a tooltip on hover.

### Example
    new Narwha({el: &#39;.chart&#39;})
          .tooltip(null, options);

### Params: 

* **object|array** *data* ignored!

* **object** *options* Options particular to this visualization that override the defaults. The `el` option must contain the selector the container where to render the tooptip

<!-- End src/scripts/visualizations/tooltip.js -->

<!-- Start src/scripts/connectors/csv.js -->

<!-- End src/scripts/connectors/csv.js -->

