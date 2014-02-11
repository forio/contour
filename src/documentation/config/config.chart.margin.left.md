#### **left** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The amount of whitespace (padding), in pixels, between the left edge of the container for this Narwhal instance and the outer edge of any visualizations in this Narwhal instance (for example, the labels or axis titles).

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: {
	      margin: { left: 50 } 
	    }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/EKzLt/)*

<% if(notes) { %><%= notes %><% } %>

