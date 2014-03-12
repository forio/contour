#### **outerTickSize** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The length of the tick mark at the end of the axis, in pixels, offset from the axis.

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { outerTickSize: 20 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.yAxis.outerTickSize/)*

**Notes:**

When [`orient`](#config_config.yAxis.orient) is set to `left`, the tick marks are drawn `outerTickSize` to the left of the axis. When [`orient`](#config_config.yAxis.orient) is set to `right`, the tick marks are drawn `outerTickSize` to the right of the axis.

To remove the tick mark at the end of the domain, set `outerTickSize` to `0`.

<% if(notes) { %><%= notes %><% } %>

