#### **innerTickSize** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The length of the tick marks, in pixels, offset from the axis. 

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { innerTickSize: 15 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.xAxis.innerTickSize/)*

**Notes:**

The tick marks are drawn `innerTickSize` above the axis when [`orient`](#config_config.xAxis.orient) is set to `top`. The tick marks are drawn `innerTickSize` below the axis when [`orient`](#config_config.xAxis.orient) is set to `bottom`.

<% if(notes) { %><%= notes %> <% } %>

