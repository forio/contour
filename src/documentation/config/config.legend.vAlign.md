#### **vAlign** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Where the legend is located vertically in the Contour instance: aligned to the `top`, `middle`, or `bottom` of the chart.

**Example:**

    new Contour({
        el: '.myChart',
        legend: { vAlign: 'top' }
      })
    .cartesian()
    .line(data)
    .legend(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

