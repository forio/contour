#### **top** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The amount of whitespace (padding), in pixels, between the top edge of the container for this Contour instance and the outer edge of any visualizations in this Contour instance (for example, the labels or axis titles).

**Example:**

    new Contour({
        el: '.myChart',
        chart: { margin: { top: 40 } }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

