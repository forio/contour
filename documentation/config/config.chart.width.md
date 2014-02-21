#### **width** : {undefined}

*default: undefined* 

The width of the container for this Narwhal instance, in pixels. 

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: { width: 200 }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/5SBJ8/)*

**Notes:**

If `width` is undefined, [`defaultWidth`](#config_config.chart.defaultWidth) determines the width. However, if `width` is defined, it takes precendence over [`defaultWidth`](#config_config.chart.defaultWidth). 



