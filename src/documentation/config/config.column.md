#### **column** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a column chart, include the `column` configuration object in the configuration options that you pass to your Narwhal constructor.

**Example:**

	new Narwhal({
	    el: ".myColumnChart",
	    column: {
	      // column-specific configuration options
	    }
	  })
	.cartesian()
	.column(data)
	.render()	

*[Try it.](http://jsfiddle.net/forio/pG9Dx/)*

<% if(notes) { %><%= notes %><% } %>


