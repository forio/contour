#### **smooth** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `false`, the line segments between data points are straight.

When `true`, the segments between data points are [interpolated in a cardinal spline](http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline){:target="_blank"}.

**Example:**

		new Narwhal({
		    el: '.myLineChart',
		    line: { smooth: true }
		  })
		.cartesian()
		.line([5, 3, 6, 7, 4, 2])
		.render()

<% if(notes) { %><%= notes %><% } %>

