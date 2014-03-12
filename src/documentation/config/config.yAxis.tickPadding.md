#### **tickPadding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The distance between the end of the tick mark (which is offset `innerTickSize` from the axis) and the label of the tick mark, in pixels. 

**Example:**

    new Contour({
        el: '.myLineChart',
        yAxis: { tickPadding: 25 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.yAxis.tickPadding/)*

**Notes:**

The label of the tick mark appears to the left of the end of the tick mark when [`orient`](#config_config.yAxis.orient) is set to `left`. The label of the tick mark appears to the right of the end of the tick mark when [`orient`](#config_config.yAxis.orient) is set to `right`.

<% if(notes) { %><%= notes %><% } %>

