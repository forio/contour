#### **animations** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

This property only applies to [line](#line) visualizations. 

When `true`, renders the visualization by plotting the data points and then animating the line being drawn between them.

When `false`, renders the visualization by drawing the data points and the line between them simultaneously. 

**Example:**

    new Contour({
        el: '.myChart',
        chart: { animations: false }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

