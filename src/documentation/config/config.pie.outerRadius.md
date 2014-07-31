#### **outerRadius** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The radius from the center of the pie chart to the outer edge, in pixels. 

When `outerRadius` is null, the radius from the center of the pie to the outer edge is half of the [`width`](#config_config.chart.width) or [`height`](#config_config.chart.height) of the [`chart`](#config_config.chart) (whichever is less), minus the [`padding`](#config_config.chart.padding).

**Example:**

    new Contour({
        el: '.myPieChart',
        pie: { outerRadius: 100 }
    })
    .pie(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

Values for `outerRadius` of less than 1 are interpreted as percentages. For example, `pie: { outerRadius: 0.35 }` means the radius from the center of the pie chart to the outer edge is 35% of the size of the chart. (Therefore, values of `piePadding` greater than `0.5` but less than `1` cause the pie chart to be larger than &mdash; and partially cut off by &mdash; the outer borders of the chart.)


