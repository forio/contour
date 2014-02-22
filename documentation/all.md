

## Narwhal() visualizations object

Create a set of related visualizations by calling the Narwhal visualization constructor. This creates a Narwhal instance, based on the core Narwhal object.

  * Pass the constructor any configuration options in the *options* parameter. Make sure the `el` option contains the selector of the container in which the Narwhal instance will be rendered.
  * Set the frame for this Narwhal instance (e.g. `.cartesian()`).
  * Add one or more specific visualizations to this Narwhal instance (e.g. `.scatter()`, `.trend-line()`). Pass each visualization constructor the data it displays.
  * Invoke an action for this Narwhal instance (e.g. `.render()`).

### Example:

    new Narwhal({el: 'myChart'})
      .cartesian()
      .line([1,3,2,5])
      .render()

See: {@link config}

### Params:

* **object** *options* The global options object

## export(ctorName, renderer)

Adds a new kind of visualization to the core Narwhal object.
The *renderer* function is called when you add this visualization to instances of Narwhal.

### Example:

    Narwhal.export("exampleVisualization", function(data, layer) {
          //function body to create exampleVisualization
          //for example using SVG and/or D3
    });

    //to include the visualization into a specific Narwhal instance
    new Narwhal(options)
          .exampleVisualization(data)
          .render()

See: options

### Params:

* **String** *ctorName* Name of the visualization, used as a constructor name.

* **Function** *renderer* Function called when this visualization is added to a Narwhal instance. This function receives the data that is passed in to the constructor.

## expose()

Exposes functionality to the core Narwhal object.
Use this to add *functionality* that will be available for any visualizations.

###Example:

    Narwhal.expose("example", {
         // when included in the instance, the function `.myFunction` is available in the visualizations
        myFunction: function(data) { .... }
    });

    Narwhal.export("visualizationThatUsesMyFunction", function(data, layer) {
          //function body including call to this.myFunction(data)
    });

    // to include the functionality into a specific instance
    new Narwhal(options)
          .example()
          .visualizationThatUsesMyFunction()
          .render()

## render()

Renders this Narwhal instance and all its visualizations into the DOM.

Example:

    new Narwhal({ el:'.myChart' })
          .pie([1,2,3])
          .render()

## .setData()

Set's the same data set into all visualizations for an instance

Example:

    var data = [1,2,3,4,5];
    var chart = new Narwhal({ el:'.myChart' })
          .scatter(data)
          .trendLine(data);

    data.push(10);
    chart.setData(data)
          .render();

## .select()

Returns a VisualizationContainer object for the visualization at a given index (0-based)

Example:

    var chart = new Narwhal({ el:'.myChart' })
          .pie([1,2,3])
          .render()

    var myPie = chart.select(0)

    // do something with the visualization like updateing its data set
    myPie.setData([6,7,8,9]).render()

## cartesian()()

Provides a Cartesian frame to the Narwhal instance.

###Example:

    new Narwhal(options)
          .cartesian();

## xScale(value)

Provides a scaling function based on the xAxis values.

###Example:

    var scaledValue = this.xScale(100);

### Params:

* **Number|String** *value* The value to be scaled.

### Return:

* **Number** The scaled value according to the current xAxis settings.

## yScale(value)

Provides a scaling function based on the yAxis values.

###Example:

    var scaledValue = this.yScale(100);

### Params:

* **Number** *value* The value to be scaled.

### Return:

* **Number** The scaled value according to the current yAxis settings.

## setYDomain(domain)

Modifies the domain for the yAxis.

###Example:

    this.setYDomain([100, 200]);

### Params:

* **Array** *domain* The domain array representing the min and max values visible on the yAxis.

## redrawYAxis()

Redraws the yAxis with the new settings and domain.

###Example:

    this.redrawYAxis();

## .horiztonal(frame)

Sets the visualization frame to be "horizontal".
The xAxis is set vertical and the yAxis is set horizontal.

This visualization requires *.cartesian()*.

This visualization is a prerequiste for rendering bar charts (*.bar()*).

###Example:

    new Narwhal({el: '.myChart'})
       .cartesian()
       .horizontal()
       .bar([1, 2, 3, 4, 5, 4, 3, 2, 1])
       .render()

### Params:

* **TBW** *frame* TBW

## version

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

## line(data, options)

Adds a line chart to the Narwhal instance.

This visualization requires `.cartesian()`.

### Example:

    new Narwhal({el: '.myChart'})
          .cartesian()
          .line([1,2,3,4])
          .render();

### Params:

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

## pie(data, options)

Adds a pie chart to the Narwhal instance.

### Example:

    new Narwhal({el: '.myChart'})
          .pie([1,2,3,4])
          .render();

### Params:

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats. The data elements are summed and then divided. In the example, `.pie([1,2,3,4])` makes four pie slices: 1/10, 2/10, 3/10, and 4/10.

* **object** *[options]* Options particular to this visualization that override the defaults.

## scatter(data, options)

Adds a scatter plot to the Narwhal instance.

This visualization requires `.cartesian()`.

### Example:

    new Narwhal({el: '.chart'})
          .cartesian()
          .scatter([1,2,3,4])
          .render();

### Params:

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats.

* **object** *[options]* Options particular to this visualization that override the defaults.

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

