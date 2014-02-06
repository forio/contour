#### **enable** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `true`, show the individual data points on a line chart.

When `false`, show only the line segments drawn between the data points.

**Example:**

	new Narwhal({
	    el: '.myChart',
	    line: { 
	        marker : { enable: false }
	      } 
      })
      .cartesian()
      .line([5, 3, 6, 7, 4, 2])
      .render()

*[Try it.](http://jsfiddle.net/forio/vtjLE/)*

**Notes:**

`enable` has precendence over [`size`](#config_config.line.marker.size), so if `enable` is set to `false`, the marker does not appear, regardless of the value for [`size`](#config_config.line.marker.size).

<% if(notes) { %><%= notes %><% } %>

