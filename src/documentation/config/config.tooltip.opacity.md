#### **opacity** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

How opaque the tooltip should be, expressed as a percentage between `0` (completely transparent) and `1` (completely opaque).

 **Example:**

	new Narwhal({
	    el: ".myLineChart",
	    tooltip: { opacity: 0.2 }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render()

TODO: make sure forio.com/tools is updated with latest -- it still has version that uses visibleOpacity for this.  
*[Try it.](http://jsfiddle.net/forio/fLR9X/)*

<% if(notes) { %><%= notes %><% } %>

