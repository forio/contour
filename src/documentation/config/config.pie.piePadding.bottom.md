#### **bottom** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance from the bottom edge of the chart to the [`outerRadius`](#config_config.pie.outerRadius), that is, the amount of whitespace below the pie but within the [`chart`](#config_config.chart).

**Example:**

    new Contour({
        el: '.myPieChart',
        pie: { piePadding: { bottom: 200 } }
    })
    .pie(data)
    .render();

<% if(notes) { %><%= notes %><% } %>

