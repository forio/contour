#### **title** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The title to display for this axis. 	    

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    chart: { padding: { left: 0 } }
	    yAxis: { title: 'Value', titlePadding: 10}
	  })
	.cartesian()
	.line(data)
	.render()

**Notes:**

[`titlePadding`]() determines the distance below the axis and [`chart.padding.left`](), in pixels, where the axis `title` is drawn. 

<% if(notes) { %><%= notes %><% } %>

