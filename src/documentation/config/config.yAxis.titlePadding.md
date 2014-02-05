#### **titlePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance to the left of the axis and [`chart.padding.left`](#config_config.chart.padding.left), in pixels, where the axis `title` is drawn.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    chart: { padding: { left: 0 } }
	    yAxis: { title: 'Value', titlePadding: 10}
	  })
	.cartesian()
	.line(data)
	.render()

<% if(notes) { %><%= notes %><% } %>

