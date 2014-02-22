#### **bottom** : {number}

*default: 0* 

The amount of whitespace (padding), in pixels, between the lower edge of any visualizations in this Narwhal instance (for example, the labels or axis titles) and the inner plot area (for example, the axes).

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: {
	      padding: { bottom: 100 } 
	    }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/RUeJ4/)*



