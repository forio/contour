#### **xAxis** : {object}



To override any of the default configuration options in an xAxis, include the `xAxis` configuration object in the configuration options that you pass to your Narwhal constructor.

An xAxis is only useful if your Narwhal instance uses a [cartesian](#cartesian) frame.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    xAxis: {
	      // xAxis-specific configuration options
	    }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/67GrJ/)*



