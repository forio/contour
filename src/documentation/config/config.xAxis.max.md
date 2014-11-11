#### **max** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The maximum value for the domain of the xAxis. Only applies if the xAxis [`type`](#config_config.xAxis.type) is `linear`.

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { max: 300 }
      })
    .cartesian()
    .line(data)
    .render();

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

If the maximum value in your data series is greater than `max`, not all of your visualization will be visible in your Contour instance.

<% if(notes) { %><%= notes %><% } %>

