#### **innerTickSize** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The length of the tick marks, in pixels, offset from the axis. 

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    yAxis: { innerTickSize: 6}
	  })
	.cartesian()
	.line(data)
	.render()

**Notes:**

When [`orient`]() is set to `left`, the tick marks are drawn `innerTickSize` to the left of the axis. When [`orient`]() is set to `right`, the tick marks are drawn `innerTickSize` to the right of the axis.

<% if(notes) { %><%= notes %><% } %>

