#### **firstAndLast** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Whether to label only the first and last values on the axis (`true`), or to label all values on the axis (`false`).

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { firstAndLast: true }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

