#### **direction** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The orientation of the legend.

* Use `vertical` to list the series vertically, all in one column.
* Use `horizontal` to list the series horizontally, all in one row.

**Example:**

    new Contour({
        el: '.myChart',
        legend: { direction: 'horizontal' }
      })
    .cartesian()
    .line(data)
    .legend(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*


<% if(notes) { %><%= notes %><% } %>

