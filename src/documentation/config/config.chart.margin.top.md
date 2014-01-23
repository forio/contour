#### **top** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The amount of whitespace (padding), in pixels, between the top edge of the container for this Narwhal instance and the outer edge of any visualizations in this Narwhal instance (for example, the labels or axis titles).

**Example:**

	new Narwhal({
	    el: ".myChart",
	    chart: {
	      margin: { top: 10 } 
	    }
	  })
	.cartesian()
	.line(data)
	.render()

<% if(notes) { %><%= notes %><% } %>

