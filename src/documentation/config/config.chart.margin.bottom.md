#### **bottom** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The amount of whitespace (padding), in pixels, between the lower edge of the container for this Contour instance and the outer edge of any visualizations in this Contour instance (for example, the labels or axis titles).

**Example:**

    new Contour({
        el: '.myChart',
        chart: { margin: { bottom: 100 } }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.chart.margin.bottom/)*

<% if(notes) { %><%= notes %><% } %>

