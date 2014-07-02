#### **innerRadius** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The radius from the center of the pie chart to the inner edge, in pixels. 

The pie chart is completely filled in when `innerRadius` is `0` or null. The pie chart becomes a donut chart when `innerRadius` is non-null.

**Example:**

    new Contour({
        el: '.myPieChart',
        pie: { innerRadius: 60 }
    })
    .pie(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

Values for `innerRadius` of less than 1 are interpreted as percentages. For example, `pie: { innerRadius: 0.35 }` means the radius from the center of the pie chart to the inner edge is 35% of the (outer) radius of the pie. 

