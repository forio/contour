#### **radius** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The radius of the data points on a scatter plot, in pixels.

**Example:**

    new Contour({
        el: '.myScatterPlot',
        scatter: { radius: 10 }
    })
    .cartesian()
    .scatter(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.scatter.radius/)*

<% if(notes) { %><%= notes %><% } %>


