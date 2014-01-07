##Key Concepts

Narwhal is Forio's visualization library.

###The Narwhal Object

The core Narwhal object defines functionality, visualizations, and default configuration options that can be used by any instance of Narwhal. 

* To create visualizations, [make a new Narwhal instance](#narwhal-instance).
* To create additional functionality or visualizations, [add them to Narwhal](#adding-to-narwhal).

For additional details, see also the [Narwhal reference documentation](TBW).

<a name="narwhal-instance"></a>
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


<a name="adding-to-narwhal"></a>
###Adding Capabilities to Narwhal

Narwhal is designed to be easily extensible.

**Functionality**

You can add functionality to the core Narwhal object using `.expose()`.  {Details TBW}

**Visualizations**

You can also add your own visualizations to the core Narwhal object using `.export()`. 

To add a visualization to the core Narwhal object:

1. Call the `.export` function on the Narwhal object.
2. Pass in the name of the new visualization. (You'll call this constructor in your Narwhal instance.)
3. Pass in the function that creates the new visualization.
	* The body of this function will most likely require you to write directly in [D3](http://d3js.org) or [SVG](http://www.w3schools.com/svg/svg_reference.asp).

For example:

	Narwhal.export('myExportedVisualization', function (data, layer) {
	
		// new visualization is a circle, radius 45px, centered at (n,n) in the Narwhal frame
		// where n is passed in when the visualization constructor is called in the Narwhal instance
		// .xScale and .yScale are functions of Narwhal's .cartesian() frame, 
		//so this visualization will require .cartesian() 
	
		layer.append('circle')
			.attr('cx', this.xScale(data))
			.attr('cy', this.yScale(data))
			.attr('r', 45);
	});

Visualizations that you have added to the core Narwhal object are then available to add to any instance of Narwhal.

For example:

	new Narwhal({ el: '.myChart' })
		.cartesian()
		.myExportedVisualization(3)
		.render();

