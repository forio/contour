#### **hideTime** : {number}

*default: 500* 

The amount of time, in milliseconds, for the tooltip to disappear after the mouse out event.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    tooltip: { hideTime: 800 }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render()

*[Try it.](http://jsfiddle.net/forio/sNRgL/)*



