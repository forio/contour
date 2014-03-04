#### **orient** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The orientation of the axis and its tick marks.

The supported orientations are:

* `top`: horizontal axis with ticks above the axis
* `bottom`: horizontal axis with ticks below the axis

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { orient: 'top' }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.xAxis.orient/)*

<% if(notes) { %><%= notes %><% } %>

