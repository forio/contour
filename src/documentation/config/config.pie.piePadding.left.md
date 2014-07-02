#### **left** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance from the left edge of the chart to the [`outerRadius`](#config_config.pie.outerRadius), that is, the amount of whitespace left of the pie but within the [`chart`](#config_config.chart).

**Example:**

    new Contour({
        el: '.myPieChart',
        pie: { piePadding: { left: 200 } }
    })
    .pie(data)
    .render();

<% if(notes) { %><%= notes %><% } %>

