#### **hideTime** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The amount of time, in milliseconds, for the tooltip to disappear after the mouse out event.

**Example:**

	new Contour({
	    el: '.myLineChart',
	    tooltip: { hideTime: 800 }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.tooltip.hideTime/)*

<% if(notes) { %><%= notes %><% } %>

