#### **piePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance from the edge of the chart to the [`outerRadius`](#config_config.pie.outerRadius), that is, the amount of whitespace around the pie but within the [`chart`](#config_config.chart).

**Example:**

    new Contour({
        el: '.myPieChart',
        pie: { piePadding: 100 }
    })
    .pie(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

Values for `piePadding` of less than 1 are interpreted as percentages. For example, `pie: { piePadding: 0.35 }` means the distance from the edge of the chart to the [`outerRadius`](#config_config.pie.outerRadius) is 35% of the size of the chart. (Therefore, values of `piePadding` less than or equal to `0.5` cause the pie chart to disappear.)

