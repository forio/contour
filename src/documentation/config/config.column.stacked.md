#### **stacked** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

Whether a single column visualization that has data with multiple series is displayed with each series stacked (`true`) or side by side (`false`).

**Example:**

		new Narwhal({
		    el: '.myColumnChart',
		    column: { stacked: true }
		  })
		.cartesian()
		.column([
		    {name: 'series1', data: [1,2,3,4]}, 
		    {name: 'series2', data: [5,6,7,8]}
		  ])
		.render()

TODO: this works fine in master, but is producing odd results on the yAxis (similar to https://github.com/forio/forio-narwhal/issues/77) with the version that's on forio.com/tools (that jsfiddle examples are using)

*[Try it.](http://jsfiddle.net/forio/7XAC5/))*

<% if(notes) { %><%= notes %><% } %>


