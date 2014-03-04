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

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.line.marker.size/)*

**Notes:**

The `size` can be any non-negative number. 

[`enable`](#config_config.line.marker.enable) has precendence over `size`, so if [`enable`](#config_config.line.marker.enable) is set to `false`, the marker does not appear, regardless of the value for `size`.

<% if(notes) { %><%= notes %><% } %>

