#### **outerRadius** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The radius from the center of the pie chart to the outer edge, in pixels. 

When `outerRadius` is null, the radius from the center of the pie to the outer edge is half of the [`width`](#config_config.chart.width) or [`height`](#config_config.chart.height) of the [`chart`](#config_config.chart) (whichever is less), minus the [`padding`](#config_config.chart.padding).

**Example:**

		new Narwhal({
		  el: '.myPieChart',
		  pie: { outerRadius: 200 }
		})

<% if(notes) { %><%= notes %><% } %>


