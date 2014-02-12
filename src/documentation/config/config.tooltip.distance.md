#### **distance** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance, in pixels, from the data point to the center of the tooltip.

In general the tooltip is drawn above and to the left of the data point. It is adjusted near the axes to ensure that it always appears within the chart.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    tooltip: { distance: 40 }
	  })
	.cartesian()
	.line(data)
	.tooltip()
	.render()

*[Try it.](http://jsfiddle.net/forio/63nte/)*

<% if(notes) { %><%= notes %><% } %>

