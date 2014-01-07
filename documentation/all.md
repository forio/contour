

## Narwhal() visualizations object

Narwhal visualization constructor

See: {@link config}

### Params:

* **object** *options* The global options object

## export(ctorName, renderer)

Adds a visualization to be rendered in the instance of Narwhal
This is the main way to expose visualizations to be used

See: options

### Params:

* **String** *ctorName* Name of the visualization to be used as a contructor name

* **Function** *renderer* Function that will be called to render the visualization. The function will recieve the data that was passed in to the constructor function

## expose()

Exposes functionality to the core Narwhal object.
This is used to add base functionality to be used by viasualizations
for example the `cartesian` frame is implemented exposing functionality.

Example:

    Narwhal.expose("example", {
         // when included in the instance, this will expose `.transformData` to the visualizations
        transformData: function(data) { .... }
    });

    // To include the functionality into a specific instance
    new Narwhal(options)
          .example()
          .visualizationsThatUsesTransformDataFunction()
          .render()

## .render()

Renders all the composed visualizations into the DOM.
This calls to render all the visualizations that were composed into the instance

Example:

    new Narwhal({ el:'.chart' })
          .pie([1,2,3])
          .render()

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

## frame

Horizontal Frame

Provides the basis for horizontal visualizations where the y axis grows to the right (ie. bar chart)

Example:
    new Narwhal(config)
       .cartesian()
       .horizontal()
       .bar([1,2,3])
       .render();

## version

