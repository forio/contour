##Extending Contour

Contour is designed to be easily extensible. 

* You can add **visualizations** and **functionality**. 
* You can also add **interactivity**, for example by **updating data** or **selecting visualizations** on the fly.



###Adding Visualizations

Although Contour comes with quite a few visualizations, sometimes you want something a little more customized. 

You can add your own visualizations to the core Contour object using `.export()`.

**To add a visualization to the core Contour object:**

1. Call the `.export()` function on the Contour object.
2. Pass in the name of the new visualization. (Later, you'll call this constructor in your Contour instance.)
3. Pass in the function that creates the new visualization.
	* The body of this function will most likely require you to write directly in [D3](http://d3js.org) or [SVG](http://www.w3schools.com/svg/svg_reference.asp).
4. Add this new visualization to an instance of Contour.

For example:

	Contour.export('myExportedVisualization', function (data, layer) {
	
	    // new visualization is a circle, radius 45px, 
	    // centered at (n,n) in the Contour frame;
	    // n is passed in when the visualization constructor
	    // is called in the Contour instance
	    // .xScale and .yScale are functions of 
	    // Contour's .cartesian() frame, 
	    // so this visualization requires .cartesian() 
	
	    layer.append('circle')
	        .attr('cx', this.xScale(data))
	        .attr('cy', this.yScale(data))
	        .attr('r', 45);
	});

	new Contour({ el: '.myChart' })
		.cartesian()
		.myExportedVisualization(3)
		.render();

**To add a visualization that is based on an existing visualization:**

Note that any exported rendering function (visualization) can be called through the `.renderer` property of the given constructor. This is especially useful if the visualization you want to create and export is based on an existing rendering function.

For example, let's make a `stackedColumn` visualization. It is identical to the existing `column` visualization, but with the `stacked` option defaulting to true.

    var newVisualization = function (data, layer, options) {
    
        var renderer = this.column.renderer;
        var defaults = renderer.defaults;

        options = _.merge(options || {}, defaults, { column: { stacked: true } });

        return renderer.call(this, data, layer, options);
    };

    newVisualization.defaults = {
        stackedColumn: {
            stacked: true
        }
    };

    Contour.export('stackedColumn', newVisualization);

Then you can use your new visualization just like any other:

	new Contour({ el: '.myChart' })
		.cartesian()
		.stackedColumn(data)
		.render();


###Adding Functionality

Although Contour comes with quite a bit of functionality, sometimes it's cleaner and easier to create your own functions.

You can add functionality to the core Contour object using `.expose()`. This functionality is then available to other visualizations, for example visualizations that you add using `.export()`. Consider this your own mini-library that you can include in particular Contour instances as needed.

**To add functionality to the core Contour object:**

1. Call the `.expose()` function on the Contour object.
2. Pass in the name of the new set of functionality. (You'll call this functionality in your Contour instance.)
3. Pass in a function, which returns an object containing two functions. 
	a. The `init` function, if provided, is called automatically upon instantiation of the functionality. Its `options` parameter has the global Contour options object.
	b. The second function is available in the visualizations after you add this set of functionality to your Contour instance.
4. Add visualizations to your Contour instance by calling their respective constructors. These constructors can now use any of the functions defined in the set of functionality you've exposed.

For example: 

	Contour.expose('myCustomFunction', function ctor(params) {
		// params are the parameters passed into the constructor function
		return {
			// the init function, if provided, is called automatically upon instantiation of the functionality
			// the options parameter has the global Contour options object
			init: function (options) { },
			
			// when included in a Contour instance, 
			// the function `.showData` is available in the visualizations
			showScaledData: function (data) {
                var yValues =  _.map(data[0].data, 'y').map(function(input) { return input * params.factor; }).join(',');
                alert('The scaled data are: ' + yValues);
            }
		};
	});
	
	Contour.export('myVisualization', function (data, layer) {
		// for this call to work, .myCustomFunction() must first be added
		// to the Contour instance
		this.showScaledData(data);
	});
	
	new Contour({ el: '.myChart' })
        // add myCustomFunction() to this instance of Contour, 
        // so other visualizations can use it
    .myCustomFunction({ factor: 4 })
    .cartesian()
    .line(data)
        // add myVisualization to this instance of Contour
    .myVisualization(data)
    .render();

**Try it**

[Play with an example](http://jsfiddle.net/gh/get/jquery/1.7.2/forio/contour/tree/master/src/documentation/fiddle/Contour.expose/) using `.expose()` and `.export()`.


###Adding Interactivity to Contour

Contour does more than make visualizations easy for developers to create. It also makes visualizations easy to update &mdash; so users can interact with your charts and graphs, and any updates are rendered quickly, with minimal redraw required.

To help make your visualizations more interactive, Contour provides **updating of data** and **selection of a visualization**.

#####Updating Data

**To update the data for an entire Contour instance at once:**

1. Add the new data into your data series, for example using `.push()`.
2. Call the `.setData()` function on your Contour instance. This updates the data for all visualizations in your Contour instance at once.
3. Render (or re-render) your entire Contour instance, using `.render()`.

For example:

	var data = [1,2,3,4,5];
    var chart = new Contour({ el:'.myChart' })
        .scatter(data)
        .trendLine(data);
        
    data.push(10);
    chart.setData(data)
    	.render();


#####Selecting Visualizations

It's also easy to select just one of the set of visualizations that are part of your Contour instance. For example, this allows you to update and re-render just one part of your visualization. 

**To select a particular visualization from your Contour instance:**

1. Call the `.select()` function on your Contour instance. Pass in the index for the visualization you want. Indices are 0-based.
2. Optionally, call actions just on that visualization, for instance `.setData()` or `.render()`.

For example:

	var data = [1,2,3,4,5];
    var chart = new Contour({ el:'.myChart' })
        .scatter(data)
        .trendLine(data)
        .render();
        
    var myScatter = chart.select(0)
    var myTrendLine = chart.select(1)
    
    // add new data to the scatter plot, 
    // but don't update the trend line just yet
    myScatter.setData([6,7,8,9]).render()

