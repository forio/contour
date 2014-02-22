#### **defaultWidth** : {number}

*default: 400* 

If [`width`](#config_config.chart.width) is undefined, use this `defaultWidth` to determine the width of the container for this Narwhal instance, in pixels.

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: { defaultWidth: 250 }
	  })
	.cartesian()
	.line(data)
	.render()

TODO: defaultWidth not being respected within jsfiddle container?



