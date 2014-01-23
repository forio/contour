#### **tickValues** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

An array containing the values for the locations of the tick marks on this axis (excluding ends of the domain). 

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    yAxis: { tickValues: [0, 2, 4, 6, 7, 8]}
	  })
	.cartesian()
	.line([1, 2, 4, 5, 6, 7, 8])
	.render()

**Notes:**

The `tickValues` configuration option takes precedence over [`ticks`](). If both are specified, the `tickValues` array is used.

However, the [`smartAxis`]() configuration option takes precedence over `tickValues`. Explicit `tickValues` are only used if [`smartAxis`]() is `false`.

To remove the tick mark at the end of the domain, set [`outerTickSize`]() to `0`.

<% if(notes) { %><%= notes %><% } %>

