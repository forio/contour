#### **outerRadius** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The radius from the center of the pie chart to the outer edge, in pixels. 

When `outerRadius` is null, the radius from the center of the pie to the outer edge is half of the [`width`]() or [`height`]() of the [`chart`]() (whichever is less), minus the [`padding`]().

**Example:**

		new Narwhal({
		  el: '.myPieChart',
		  pie: { outerRadius: 200 }
		})

<% if(notes) { %><%= notes %><% } %>


