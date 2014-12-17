##Key Concepts

The core Contour object defines functionality, visualizations, and default configuration options that can be used by any instance of Contour.

This page is similar to the [QuickStart](#quickstart), but with a little more background information, rather than just code to copy.

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

