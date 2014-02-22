#### **outerRangePadding** : {number}

*default: 0.1* 

This property only applies to [column](#column) visualizations. 

In column visualizations, the amount of whitespace (padding) between the first (and last) column and the edge of the axis, expressed as a percentage of range band. (The range band is the distance between the edges of a single column of data, and is based on dividing the entire domain into evenly spaced intervals.) 

Use the [`innerRangePadding`](#config_config.xAxis.innerRangePadding) to set the amount of whitespace between the columns.

**Example:**

	new Narwhal({
	    el: ".myColumnChart",
	    xAxis: { outerRangePadding: 0.8 }
	  })
	.cartesian()
	.column(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/R8KEn/)*



