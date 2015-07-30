#### **legend** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

To override any of the default configuration options in a `legend`, include the `legend` configuration object in the configuration options that you pass to your Contour constructor.

**Example:**

    new Contour({
        el: '.myChart',
        legend: {
          // legend-specific configuration options
        }
      })
    .cartesian()
    .line(data)
    .legend(data)
    .render();

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

