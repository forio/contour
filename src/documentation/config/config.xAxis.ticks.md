#### **ticks** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To remove all ticks from the xAxis, set `ticks` to `0`.

Otherwise, this property has no effect; tick marks are drawn based on the value of [`firstAndLast`](#config_config.xAxis.firstAndLast) and built-in "nicing" (even spacing).

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { ticks: 0 }
      })
    .cartesian()
    .line([1, 2, 4, 5, 6, 7, 8])
    .toolip()
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

