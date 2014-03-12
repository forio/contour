#### **tooltip** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a tooltip, include the `tooltip` configuration object in the configuration options that you pass to your Contour constructor. 

A tooltip is only useful if there is another visualization in this Contour instance. 

**Example:**

	new Contour({
	    el: '.myLineChart',
	    tooltip: {
	      // tooltip-specific configuration options
	    }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render() 

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.tooltip/)*

<% if(notes) { %><%= notes %><% } %>

