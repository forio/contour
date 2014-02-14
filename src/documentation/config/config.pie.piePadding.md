#### **piePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance from the edge of the chart to the [`outerRadius`](#config_config.pie.outerRadius), that is, the amount of whitespace around the pie but within the [`chart`](#config_config.chart).

**Example:**

		new Narwhal({
		  el: '.myPieChart',
		  pie: { piePadding: 100 }
		})

*[Try it.](http://jsfiddle.net/forio/8b4E2/)*

<% if(notes) { %><%= notes %><% } %>


