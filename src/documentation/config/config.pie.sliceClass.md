#### **sliceClass** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The name of the CSS class to use for the "slices" of the pie chart. This can be a literal string, or any function that returns a string with the name of a CSS class.

**Example:**

	<style>
		.myPieStyle { 
			fill: #2477b3;
			stroke: white; 
			stroke-width: 10px;
		 }
	</style>

    new Contour({
        el: '.myPieChart',
        pie: { sliceClass: 'myPieStyle' }
    })
    .pie(data)
    .render();

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

Use `sliceClass` to apply a CSS class to the chart. Use [`style`](#core_config/config.pie.style) to apply a particular style.

