#### **animate** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `true`, the tooltip gradually reaches [`opacity`](#config_config.tooltip.opacity) over the course of [`showTime`](#config_config.tooltip.showTime) milliseconds.

When `false`, the tooltip appears instantaneously (`false`).

**Example:**

	new Contour({
	    el: '.myLineChart',
	    tooltip: { showTime: 1000, animate: true }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render() 

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.tooltip.animate/)*

<% if(notes) { %><%= notes %><% } %>

