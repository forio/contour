##Key Concepts

Narwhal is Forio's visualization library.

###The Narwhal Object

The core Narwhal object defines functionality, visualizations, and default configuration options that can be used by any instance of Narwhal. 

* To create visualizations, [make a new Narwhal instance](#narwhal-instance).
* To create additional functionality or visualizations, [add them to Narwhal](#adding-to-narwhal).

For additional details, see also the [Narwhal reference documentation]().

<a id="narwhal-instance"></a>
###The Narwhal Instance

When you want to create a set of related visualizations, you create a Narwhal instance based on the core Narwhal object.

To create a set of visualizations:

1. First, call the Narwhal constructor. 
	* Pass the constructor a set of configuration options. 
	* Make sure the `el` option contains the selector of the container in which the Narwhal instance will be rendered. 
2. Next, set the frame for this set of visualizations. 
	* All visualizations in the same set (that is, all visualizations in the same instance of Narwhal) must use the same frame.
	* Currently, the only available frame is `.cartesian()`.
3. Then, add one or more specific visualizations to this Narwhal instance by calling their respective constructors. 
	* Pass each visualization constructor the data it displays.
4. Finally, invoke an action for this Narwhal instance. 
	* Typically, this action is `.render()`, that is, make this set of visualizations visible on your webpage.

For example:

	var data = [{x:0, y:3}, {x:1, y:4}, {x:2, y:5}];
	
	//call the Narwhal constructor with config options
	new Narwhal( { 
		el: '.myChart',
		xAxis: { title: 'Index' },
		yAxis: { title: 'Value' }
	})
	.cartesian() 	//set the frame
	.line(data)  	//call the 'line' constructor
	.render();


<a id="adding-to-narwhal"></a>
###Adding Capabilities to Narwhal

Narwhal is designed to be easily extensible.

**Visualizations**

You can also add your own visualizations to the core Narwhal object using `.export()`. 

To add a visualization to the core Narwhal object:

1. Call the `.export()` function on the Narwhal object.
2. Pass in the name of the new visualization. (You'll call this constructor in your Narwhal instance.)
3. Pass in the function that creates the new visualization.
	* The body of this function will most likely require you to write directly in [D3](http://d3js.org) or [SVG](http://www.w3schools.com/svg/svg_reference.asp).
4. Add this new visualization to an instance of Narwhal.

For example:

	Narwhal.export('myExportedVisualization', function (data, layer) {
	
		// new visualization is a circle, radius 45px, 
		// centered at (n,n) in the Narwhal frame;
		// n is passed in when the visualization constructor
		// is called in the Narwhal instance
		// .xScale and .yScale are functions of 
		// Narwhal's .cartesian() frame, 
		// so this visualization requires .cartesian() 
	
		layer.append('circle')
			.attr('cx', this.xScale(data))
			.attr('cy', this.yScale(data))
			.attr('r', 45);
	});

	new Narwhal({ el: '.myChart' })
		.cartesian()
		.myExportedVisualization(3)
		.render();

**Functionality**

You can add functionality to the core Narwhal object using `.expose()`. This functionality is then available to other visualizations, for example visualizations that you add using `.export()`. Consider this your own mini-library that you can include in particular Narwhal instances as needed.

To add functionality to the core Narwhal object:

1. Call the `.expose()` function on the Narwhal object.
2. Pass in the name of the new set of functionality. (You'll call this functionality in your Narwhal instance.)
3. Pass in a JSON object including one or more functions; each function is available after you add this set of functionality to your Narwhal instance.
4. Add visualizations to your Narwhal instance by calling their respective constructors. These constructors can now use any of the functions defined in the set of functionality you've exposed.

For example: 

	Narwhal.expose('myNewFunctions') {
		function1 : function (data) { /* some function */ },
		function2 : function (data) { /* some function */ }
	};
	
	Narwhal.export('myExportedVisualization', function (data, layer) {
		// function body including call to 
		// this.function1(data) or this.function2(data)
	});
	
	new Narwhal({ el: '.myChart' })
		.myNewFunctions()
		.myExportedVisualization(data)
		.render();

