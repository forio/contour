#### **chart** : {object}



To override any of the default configuration options in a `chart`, include the `chart` configuration object in the configuration options that you pass to your Narwhal constructor.

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: {
	      // chart-specific configuration options
	    }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/7jqF4/)*



