#### **maxTicks** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The maximum number of tick marks to display on the axis.

Where the ticks are placed is determined based on the number of elements in the data series and the value of [`firstAndLast`](#config_config.xAxis.firstAndLast). 

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    xAxis: { maxTicks: 4 }
	  })
	.cartesian()
	.line(data)
	.render()

TODO: confirm the interaction between maxTicks and firstAndLast is working correctly; which one overrides which and how is unclear

<% if(notes) { %><%= notes %><% } %>

