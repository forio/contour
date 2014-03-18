#### **size** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The radius of each data point in a line chart, in pixels.

**Example:**

    new Contour({
        el: '.myLineChart',
        line: { 
            marker : { size: 10 }
        } 
      })
    .cartesian()
    .line(data)
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

The `size` can be any non-negative number. 

[`enable`](#config_config.line.marker.enable) has precendence over `size`, so if [`enable`](#config_config.line.marker.enable) is set to `false`, the marker does not appear, regardless of the value for `size`.

<% if(notes) { %><%= notes %><% } %>

