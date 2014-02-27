#### **column** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a column chart, include the `column` configuration object in the configuration options that you pass to your Contour constructor.

**Example:**

    new Contour({
        el: '.myColumnChart',
        column: {
          // column-specific configuration options
        }
      })
    .cartesian()
    .column(data)
    .render()	

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.column/)*

<% if(notes) { %><%= notes %><% } %>


