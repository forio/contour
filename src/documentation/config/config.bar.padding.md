#### **padding** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The vertical distance between each data series in the *same* bar visualization.

**Example:**

	    new Contour({
	        el: '.myBarChart',
	        bar: { padding: 15 }
	      })
	    .cartesian()
	    .horizontal()
	    .bar([
	            {name: 'series1', data: [1,2,3,4]},
	            {name: 'series2', data: [5,6,7,8]}
	          ])
	    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.bar.padding/)*

<% if(notes) { %><%= notes %><% } %>

