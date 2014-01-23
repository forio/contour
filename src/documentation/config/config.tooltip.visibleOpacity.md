#### **visibleOpacity** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

How opaque the tooltip should be, expressed as a percentage between `0` (completely transparent) and `1` (completely opaque).

 **Example:**

	new Narwhal({
	    el: ".myLineChart",
	    tooltip: { visibleOpacity: 0.9 }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render()

<% if(notes) { %><%= notes %><% } %>

