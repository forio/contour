#### **min** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The minimum value for the domain of the yAxis.

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { min: 50 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

If the minimum value in your data series is less than `min`, not all of your visualizaiton will be visible in your Contour instance.

See also: [`smartAxis`](#config_config.yAxis.smartAxis), [`max`](#config_config.yAxis.max), [`nicing`](#config_config.yAxis.nicing), [`tickValues`](#config_config.yAxis.tickValues), [`ticks`](#config_config.yAxis.ticks).

<% if(notes) { %><%= notes %><% } %>

