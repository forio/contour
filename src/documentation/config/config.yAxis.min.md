#### **min** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The minimum value for the domain of the yAxis.

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    yAxis: { min: 50 }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/9Vf9k/)*

**Notes:**

If the minimum value in your data series is less than `min`, not all of your visualizaiton will be visible in your Narwhal instance.

<% if(notes) { %><%= notes %><% } %>

