#### **maxTicks** : { integer }

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The maximum number of tick marks to display on the axis.

Where the ticks are placed is determined based on the number and value of elements in the data series. 

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { maxTicks: 4 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.xAxis.maxTicks/)*

**Notes:**

`maxTicks` serves at the upper bound. For example, when [`firstAndLast`](#config_config.xAxis.firstAndLast) is set to `true`, there are two tick marks, even if `maxTicks` is set much higher. 

<% if(notes) { %><%= notes %><% } %>

