#### **innerTickSize** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The length of the tick marks, in pixels, offset from the axis. 

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { innerTickSize: 15 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

When [`orient`](#config_config.yAxis.orient) is set to `left`, the tick marks are drawn `innerTickSize` to the left of the axis. When [`orient`](#config_config.yAxis.orient) is set to `right`, the tick marks are drawn `innerTickSize` to the right of the axis.

<% if(notes) { %><%= notes %><% } %>

