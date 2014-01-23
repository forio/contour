#### **max** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The maximum value for the domain of the yAxis.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    yAxis: { max: 100 }
	  })
	.cartesian()
	.line(data)
	.render()

**Notes:**

If the maximum value in your data series is greater than `max`, not all of your visualizaiton will be visible in your Narwhal instance.

<% if(notes) { %><%= notes %><% } %>

