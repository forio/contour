#### **line** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a line chart, include the `line` configuration object in the configuration options that you pass to your Contour constructor.

**Example:**

    new Contour({
        el: '.myLineChart',
        line: {
          // line-specific configuration options
        }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.line/)*

<% if(notes) { %><%= notes %><% } %>

