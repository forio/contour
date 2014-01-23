##Supported Data Formats

For each visualization that you add to a Narwhal instance (`.line()`, `.area()`, etc.), you pass the data series to be displayed into the visualization constructor. 

There are several valid formats for each data series.

###Single Series

**Array of {x, y} pairs.** You can pass in a single series as an array of {x, y} pairs. 

Use the format:

	[{x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}]

For example:

	.line([{x:23, y:45}, {x:34, y:22}, {x:45, y:78}])

**Array of scalars.** You can also pass a single series as an array of scalars. Narwhal automatically converts this to an array of `{x, y}` pairs, for `x` starting at `0`.

Use the format: 

	[y1, y2, y3]
	
	//Narwhal converts automatically to:
	[{x:0, y:y1}, {x:1, y:y2}, {x:2, y:y3}]

For example:

	.line([3, 4, 5])

	//Narwhal converts automatically to:
	.line([{x:0, y:3}, {x:1, y:4}, {x:2, y:5}])


###Multiple Series

**Array of objects, each containing name and data series.** You can pass in multiple series as an array of `{ name: '<series name>', data: '<any format for single series data>' }`.

Use the format: 

	[
	  {
	    name: 'mySeries1',
	    data: [ {x:x1, y:y1}, {x:x2, y:y2}, {x:x3, y:y3}]
	  },
	  {
	    name: 'mySeries2',
	    data: [y1, y2, y3]
	    	// Narwhal will automatically convert this series to
	    	// [{x:0, y:y1}, {x:1, y:y2}, {x:2, y:y3}]
	  }
	]

For example:

	.line([
	  {
	    name: 'Customer A',
	    data: [ {x:1, y:4}, {x:2, y:2}, {x:3, y:6}]
	  },
	  {
	    name: 'Customer B',
	    data: [12, 15, 24]
	    	// Narwhal will automatically convert this series to
	    	// [{x:0, y:12}, {x:1, y:15}, {x:2, y:24}]
	  }
	])

**Array of single series data.** You can also pass in multiple series as an array of `[<any format for single series data>]`. Narwhal automatically converts this to an array of `{ name: '<series name>', data: '<any format for single series data>' }`, where the series names are `series 1`, `series 2`, etc.

Use the format:

	[
	  [y1, y2, y3],
	  [{x:x1, y:y1}, {x:x2, y:y2}, {x:x3, y:y3}]
	]

For example:

	.line([
	  [8, 10, 11],
	  [{x:1, y:4}, {x:3, y:7}, {x:5, y:2}]
	])

Narwhal converts this automatically to:

	.line([
	  {
	    name: 'series 1',
	    data: [{x:0, y:8}, {x:1, y:10}, {x:2, y:11}]
	  },
	  {
	    name: 'series 2',
	    data: [{x:1, y:4}, {x:3, y:7}, {x:5, y:2}]
	  }
	])

###Advantages of Automatic Conversion

It might seem excessive to have Narwhal automatically convert all data series to such a verbose format. However, this conversion makes [exposing and exporting]() much easier. As the author of an `.expose()` or `.export()` function, you always know exactly what form of data you'll be receiving. 

