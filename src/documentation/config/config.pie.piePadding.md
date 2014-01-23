#### **piePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance from the edge of the chart to the [`outerRadius`](), that is, the amount of whitespace around the pie but within the [`chart`]().

**Example:**

		new Narwhal({
		  el: '.myPieChart',
		  pie: { piePadding: 30 }
		})

<% if(notes) { %><%= notes %><% } %>


