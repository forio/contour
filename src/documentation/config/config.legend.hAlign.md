#### **hAlign** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Where the legend is located horizontally in the Contour instance: aligned to the `right`, `center`, or `left` of the chart.

**Example:**

    new Contour({
        el: '.myChart',
        legend: { hAlign: 'left' }
      })
    .cartesian()
    .line(data)
    .legend(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

