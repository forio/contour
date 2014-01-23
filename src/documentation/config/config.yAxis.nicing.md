#### **nicing** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Determines whether the end of the domain should correspond exactly to a data point, or if the domain should be extended.

When `false`, extends the domain only to the largest y-value in the data series, and draws a tick mark there.

When `true`, extends the domain so that it starts and ends on ["nice, round" values](https://github.com/mbostock/d3/wiki/Quantitative-Scales#wiki-linear_nice), that is, at or above the largest y-value in the data series, and draws a tick mark there. Rounding is done at multiples of 1, 2, 5, 10, or 10x.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    yAxis: { nicing: true}
	  })
	.cartesian()
		//for this data set, 
		//nicing: true draws the top tick mark at 8.2 
		//nicing: false draws the top tick mark at 9 
	.line([0.8, 2, 4, 5, 8.2]) 
	.render()

<% if(notes) { %><%= notes %><% } %>

