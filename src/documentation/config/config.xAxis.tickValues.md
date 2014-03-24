#### **tickValues** : { array }

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

An array containing the values for the locations of the tick marks on this axis (excluding ends of the domain). 

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { tickValues: [1, 2, 4.5, 8] }
      })
    .cartesian()
    .line([1, 2, 4, 5, 6, 7, 8])
    .tooltip()
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

