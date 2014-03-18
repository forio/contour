#### **enable** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `true`, show the individual data points on a line chart.

When `false`, show only the line segments drawn between the data points.

**Example:**

    new Contour({
        el: '.myLineChart',
        line: { 
            marker : { enable: false }
        } 
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

`enable` has precendence over [`size`](#config_config.line.marker.size), so if `enable` is set to `false`, the marker does not appear, regardless of the value for [`size`](#config_config.line.marker.size).

<% if(notes) { %><%= notes %><% } %>

