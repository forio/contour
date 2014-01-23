#### **innerTickSize** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The length of the tick marks, in pixels, offset from the axis. 

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    xAxis: { innerTickSize: 6}
	  })
	.cartesian()
	.line(data)
	.render()

**Notes:**

The tick marks are drawn `innerTickSize` above the axis when [`orient`]() is set to `top`. The tick marks are drawn `innerTickSize` below the axis when [`orient`]() is set to `bottom`.

<% if(notes) { %><%= notes %> <% } %>

