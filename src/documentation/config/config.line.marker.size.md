#### **size** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The radius of each data point in a line chart, in pixels.

**Example:**

	new Narwhal({
	    el: '.myChart',
	    line: { 
	        marker : { size: 10 }
	      } 
      })
      .cartesian()
      .line([5, 3, 6, 7, 4, 2])
      .render()

**Notes:**

The `size` can be any non-negative number. 

[`enable`]() has precendence over `size`, so if [`enable`]() is set to `false`, the marker does not appear, regardless of the value for `size`.

<% if(notes) { %><%= notes %><% } %>

