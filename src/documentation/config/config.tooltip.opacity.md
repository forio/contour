#### **opacity** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

How opaque the tooltip should be, expressed as a percentage between `0` (completely transparent) and `1` (completely opaque).

 **Example:**

	new Narwhal({
	    el: ".myLineChart",
	    tooltip: { opacity: 0.3 }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render()
 
*[Try it.](http://jsfiddle.net/forio/fLR9X/)*

<% if(notes) { %><%= notes %><% } %>

