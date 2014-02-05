#### **animate** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `true`, the tooltip gradually reaches [`opacity`](#config_config.tooltip.opacity) over the course of [`showTime`](#config_config.tooltip.showTime) milliseconds.

When `false`, the tooltip appears instantaneously (`false`).

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    tooltip: { showTime: 500, animate: true }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render() 

<% if(notes) { %><%= notes %><% } %>

