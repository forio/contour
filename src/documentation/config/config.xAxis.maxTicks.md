#### **maxTicks** : { integer }

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The maximum number of tick marks to display on the axis.

Where the ticks are placed is determined based on the number of elements in the data series and the value of [`firstAndLast`](#config_config.xAxis.firstAndLast). 

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { maxTicks: 4 }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.xAxis.maxTicks/)*

<% if(notes) { %><%= notes %><% } %>

