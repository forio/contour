#### **scatter** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a scatter plot, include the `scatter` configuration object in the configuration options that you pass to your Contour constructor.

**Example:**

    new Contour({
        el: '.myScatterPlot',
        scatter: { 
          // scatter-specific configuration options
        }
    })
    .cartesian()
    .scatter(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.scatter/)*

<% if(notes) { %><%= notes %><% } %>


