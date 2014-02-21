

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

