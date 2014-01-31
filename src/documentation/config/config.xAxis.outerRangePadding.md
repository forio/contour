#### **outerRangePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

This property only applies to [column](#column) visualizations. 

In column visualizations, the amount of whitespace (padding) between the first (and last) column and the edge of the axis, expressed as a percentage of range band. (The range band is the distance between the edges of a single column of data, and is based on dividing the entire domain into evenly spaced intervals.) 

Use the [`innerRangePadding`](#config_config.xAxis.innerRangePadding) to set the amount of whitespace between the columns.

**Example:**

	new Narwhal({
	    el: ".myColumnChart",
	    xAxis: { outerRangePadding: 0.2}
	  })
	.cartesian()
	.column(data)
	.render()

<% if(notes) { %><%= notes %><% } %>

