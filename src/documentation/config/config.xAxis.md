#### **xAxis** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in an xAxis, include the `xAxis` configuration object in the configuration options that you pass to your Contour constructor.

An xAxis is only useful if your Contour instance uses a [cartesian](#cartesian) frame.

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: {
          // xAxis-specific configuration options
        }
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

