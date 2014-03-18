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

<% if(notes) { %><%= notes %><% } %>


