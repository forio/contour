#### **radius** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The radius of the data points on a scatter plot, in pixels.

**Example:**

		new Narwhal({
		  el: '.myScatterPlot',
		  scatter: { radius: 10 }
		})

*[Try it.](http://jsfiddle.net/forio/XZWP5/)*

<% if(notes) { %><%= notes %><% } %>


