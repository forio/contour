#### **ticks** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The approximate number of tick marks to display on the axis (excluding ends of the domain). 

Tick marks are evenly spaced along the domain at multiples of 1, 2, 5, 10, or 10x. Even spacing is given priority over an exact match of the `ticks` value.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    yAxis: { ticks: 4 }
	  })
	.cartesian()
		//for this data set, 
		//ticks: 4 draws tick marks at 0, 2, 4, 6, 8
		//ticks: 29 draws tick marks at 0.2, 0.4, 0.6, 0.8, 1, 1.2, etc.
	.line([1, 2, 4, 5, 6, 7, 8])
	.render()

**Notes:**

The `ticks` configuration option has the lowest precedence in specifying locations of tick marks. If [`smartAxis`](#config_config.yAxis.smartAxis) is `true`, or if [`tickValues`](#config_config.yAxis.tickValues) are specified, the `ticks` option is ignored.

<% if(notes) { %><%= notes %><% } %>

