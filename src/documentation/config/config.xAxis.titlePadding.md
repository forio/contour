#### **titlePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance below the axis and [`chart.padding.bottom`](#config_config.chart.padding.bottom), in pixels, where the axis `title` is drawn.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    chart: { padding: { bottom: 0 } }
	    xAxis: { title: 'Index', titlePadding: 10}
	  })
	.cartesian()
	.line(data)
	.render()

<% if(notes) { %><%= notes %><% } %>

