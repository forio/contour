

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

