#### **animate** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `true`, the tooltip gradually reaches [`visibleOpacity`]() over the course of [`showTime`]() milliseconds.

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

