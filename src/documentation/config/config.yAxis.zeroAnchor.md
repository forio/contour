#### **zeroAnchor** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Whether the minimum value of the yAxis should always be at zero (`true`) or not (`false`).

When `zeroAnchor` is `false`, the minimum value of the yAxis is at or slightly below the minimum value of your data.

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { zeroAnchor: false }
      })
    .cartesian()
    .line(data)
    .render();

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

When `zeroAnchor` is `false`, the exact minimum value of the yAxis is determined heuristically, based on the data and the other axis configuration properties. If you want to set the minimum value explicitly, use [`min`](#config_config.yAxis.min).
