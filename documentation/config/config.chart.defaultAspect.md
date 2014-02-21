#### **defaultAspect** : {number}

*default: 0.6180339887498547* 

The `defaultAspect` determines the height of the container for this Narwhal instance, in pixels, if the [`height`](#config_config.chart.height) is undefined. To determine the height, `defaultAspect` looks at the [`width`](#config_config.chart.width) (or the [`defaultWidth`](#config_config.chart.defaultWidth), if [`width`](#config_config.chart.width) is also undefined) and then applies the [golden ratio](http://en.wikipedia.org/wiki/Golden_ratio) (`1.161803398875`).

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: { defaultAspect: 1 }
	  })
	.cartesian()
	.line(data)
	.render() 

*[Try it.](http://jsfiddle.net/forio/g4X7n/)*



