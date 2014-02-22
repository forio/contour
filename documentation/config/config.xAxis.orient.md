#### **orient** : {string}

*default: bottom* 

The orientation of the axis and its tick marks.

The supported orientations are:

* `top`: horizontal axis with ticks above the axis
* `bottom`: horizontal axis with ticks below the axis

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    xAxis: { orient: "top",
                 innerTickSize: 6, 
                 firstAndLast: false
               }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render()

*[Try it.](http://jsfiddle.net/forio/agX8r/)*



