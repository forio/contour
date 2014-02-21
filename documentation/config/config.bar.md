#### **bar** : {object}



To override any of the default configuration options in a bar chart, include the `bar` configuration object in the configuration options that you pass to your Narwhal constructor.

**Example:**

	new Narwhal({
	    el: ".myBarChart",
	    bar: {
	      // bar-specific configuration options
	    }
	  })
	.cartesian()
	.horiztonal()
	.bar(data)
	.render()	
	
*[Try it.](http://jsfiddle.net/forio/C27eg/)*	
	


