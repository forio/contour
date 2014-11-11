#### **min** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The minimum value for the domain of the xAxis. Only applies if the xAxis [`type`](#config_config.xAxis.type) is `linear`.

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { min: 50 }
      })
    .cartesian()
    .line(data)
    .render();

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

If the minimum value in your data series is less than `min`, not all of your visualization will be visible in your Contour instance.

<% if(notes) { %><%= notes %><% } %>

