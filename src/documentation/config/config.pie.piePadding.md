#### **piePadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance from the edge of the chart to the [`outerRadius`](#config_config.pie.outerRadius), that is, the amount of whitespace around the pie but within the [`chart`](#config_config.chart).

Using `piePadding` specifies the same distance for all between the pie and the chart on all sides of the pie. Use [`piePadding.left`](#config_config.pie.piePadding.left), [`piePadding.right`](#config_config.pie.piePadding.right), [`piePadding.top`](#config_config.pie.piePadding.top), and [`piePadding.bottom`](#config_config.pie.piePadding.bottom) to position the pie more exactly within the [`chart`](#config_config.chart)

**Example:**

    new Contour({
        el: '.myPieChart',
        pie: { piePadding: 100 }
    })
    .pie(data)
    .render();

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

Values for `piePadding` of less than 1 are interpreted as percentages. For example, `pie: { piePadding: 0.35 }` means the distance from the edge of the chart to the [`outerRadius`](#config_config.pie.outerRadius) is 35% of the size of the chart.

If your data are [multiple series](#supported_data_formats), chart space is first divided by the number of elements in the series &mdash; that is, the number of pie charts your data generate &mdash; before the `piePadding` is applied to each individual pie.

