##Key Concepts

The core Contour object defines functionality, visualizations, and default configuration options that can be used by any instance of Contour.

If you want more background information than the [QuickStart](#quickstart) provides, or if you've completed that and are looking for detail on some of the extensions and more advanced functionality, these key concepts can help. 

If you'd rather skip the detailed walkthrough, reference materials for this section are on the [Contour API reference page](#contour).

###The Contour Instance

When you want to create a set of related visualizations, you create a Contour instance based on the core Contour object. (This is also described in the [QuickStart](#quickstart).)

To create a set of visualizations:

1. First, call the Contour constructor. 
	* Pass the constructor a set of configuration options. 
	* Make sure the `el` option contains the selector of the container in which the Contour instance will be rendered. 
2. Next, set the frame for this set of visualizations. 
	* All visualizations in the same set (that is, all visualizations in the same instance of Contour) must use the same frame.
	* Currently, the only available frame is `.cartesian()`.
3. Then, add one or more specific visualizations to this Contour instance by calling their respective constructors. 
	* Pass each visualization constructor the data it displays. You can specify this by hand using a [supported data format](#supported_data_formats), or use a [Contour data connector](#data-connectors) to extract your data from another format (for example, CSV or TSV files).
4. Finally, invoke an action for this Contour instance. 
	* Typically, this action is `.render()`, that is, make this set of visualizations visible on your webpage.

For example:

	var data = [{x:0, y:3}, {x:1, y:4}, {x:2, y:5}];
	
	//call the Contour constructor with configuration options
	new Contour( { 
		el: '.myChart',
		xAxis: { title: 'Index' },
		yAxis: { title: 'Value' }
	})
	.cartesian() 	//set the frame
	.line(data)  	//call the 'line' constructor
	.render();


###Adding Capabilities to Contour

Contour is designed to be easily extensible. You can add both **visualizations** and **functionality**.

**Visualizations**

Although Contour comes with quite a few visualizations, sometimes you want something a little more customized. 

You can add your own visualizations to the core Contour object using `.export()`.

To add a visualization to the core Contour object:

1. Call the `.export()` function on the Contour object.
2. Pass in the name of the new visualization. (Later, you'll call this constructor in your Contour instance.)
3. Pass in the function that creates the new visualization.
	* The body of this function will most likely require you to write directly in [D3](http://d3js.org) or [SVG](http://www.w3schools.com/svg/svg_reference.asp).
4. Add this new visualization to an instance of Contour.

For example:

	Contour('myExportedVisualization', function (data, layer) {
	
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

**Functionality**

Although Contour comes with quite a bit of functionality, sometimes it's cleaner and easier to create your own functions.

You can add functionality to the core Contour object using `.expose()`. This functionality is then available to other visualizations, for example visualizations that you add using `.export()`. Consider this your own mini-library that you can include in particular Contour instances as needed.

To add functionality to the core Contour object:

1. Call the `.expose()` function on the Contour object.
2. Pass in the name of the new set of functionality. (You'll call this functionality in your Contour instance.)
3. Pass in a JSON object including one or more functions; each function is available after you add this set of functionality to your Contour instance.
4. Add visualizations to your Contour instance by calling their respective constructors. These constructors can now use any of the functions defined in the set of functionality you've exposed.

For example: 

	Contour.expose('myNewFunctions') {
		function1 : function (data) { /* some function */ },
		function2 : function (data) { /* some function */ }
	};
	
	Contour.export('myExportedVisualization', function (data, layer) {
		// function body, including call to 
		// this.function1(data) and this.function2(data)
	});
	
	new Contour({ el: '.myChart' })
		.myNewFunctions()
		.myExportedVisualization(data)
		.render();


###Adding Interactivity to Contour

Contour does more than make visualizations easy for developers to create. It also makes visualizations easy to update &mdash; so users can interact with your charts and graphs, and any updates are rendered quickly, with minimal redraw required.

To help make your visualizations more interactive, Contour provides **updating of data** and **selection of a visualization**.

**Updating Data**

To update the data for an entire Contour instance at once:

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


**Selecting Visualizations**

It's also easy to select just one of the set of visualizations that are part of your Contour instance. For example, this allows you to update and re-render just one part of your visualization. 

To select a particular visualization from your Contour instance:

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

