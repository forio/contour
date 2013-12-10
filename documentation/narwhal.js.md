

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

