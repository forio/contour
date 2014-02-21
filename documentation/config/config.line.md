#### **line** : {object}



To override any of the default configuration options in a line chart, include the `line` configuration object in the configuration options that you pass to your Narwhal constructor.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    line: {
	      // line-specific configuration options
	    }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/3xH4P/)*



