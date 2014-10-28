#### **max** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The maximum value for the range of the yAxis.

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { max: 300 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

If the maximum value in your data series is greater than `max`, not all of your visualization will be visible in your Contour instance.

See also: [`smartAxis`](#config_config.yAxis.smartAxis), [`min`](#config_config.yAxis.min), [`nicing`](#config_config.yAxis.nicing), [`tickValues`](#config_config.yAxis.tickValues), [`ticks`](#config_config.yAxis.ticks).

<% if(notes) { %><%= notes %><% } %>

