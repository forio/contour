#### **firstAndLast** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Whether to label only the first and last values on the axis (`true`), or to label all values on the axis (`false`).

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    xAxis: { firstAndLast: false }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/2mWM8/)*

<% if(notes) { %><%= notes %><% } %>

