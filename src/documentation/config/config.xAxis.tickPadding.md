#### **tickPadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance between the end of the tick mark and the label of the tick mark, in pixels. (The tick mark itself is offset [`innerTickSize`](#config_config.xAxis.innerTickSize) from the axis.)

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { tickPadding: 25 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.xAxis.tickPadding/)*

**Notes:**

The label of the tick mark appears below the end of the tick mark when [`orient`](#config_config.xAxis.orient) is set to `bottom`. The label of the tick mark appears above the end of the tick mark when [`orient`](#config_config.xAxis.orient) is set to `top`.

<% if(notes) { %><%= notes %><% } %>

