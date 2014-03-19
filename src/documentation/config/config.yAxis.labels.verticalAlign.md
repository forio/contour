#### **verticalAlign** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The alignment of the labels of tick marks on the axis.

The available options are: 

* `top`: labels are aligned above the axis tick marks
* `middle`: labels are aligned even with the axis tick marks
* `bottom`: labels are aligned below the axis tick marks

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { labels: { verticalAlign: 'top'} }
      })
    .cartesian()
    .line(data)
    .tooltip()
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>



