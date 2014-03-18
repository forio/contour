#### **left** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The amount of whitespace (padding), in pixels, between the left edge of the container for this Contour instance and the outer edge of any visualizations in this Contour instance (for example, the labels or axis titles).

**Example:**

    new Contour({
        el: '.myChart',
        chart: { margin: { left: 50 } }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

