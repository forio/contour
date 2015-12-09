#### **el** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The separate element in the DOM where the legend should be placed. Defaults to undefined, meaning the legend is placed in the same element as the Contour chart.

**Example:**

	<table>
		<tr><td><div class="myChart"></div></td></tr>
		<tr><td><div class="myLegend"></div></td></tr>
	</table>
	
	<script>
	    new Contour({
	        el: '.myChart',
	        legend: { el: '.myLegend' }
	      })
	    .cartesian()
	    .line(data)
	    .legend(data)
	    .render();		
	</script>

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

