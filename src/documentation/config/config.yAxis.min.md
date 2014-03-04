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

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.yAxis.min/)*

**Notes:**

If the minimum value in your data series is less than `min`, not all of your visualizaiton will be visible in your Contour instance.

<% if(notes) { %><%= notes %><% } %>

