#### **columnClass** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The name of the CSS class to use for the columns of the column chart. This can be a literal string, or any function that returns a string with the name of a CSS class.

**Example:**

	<style>
		 /* Blue hue colors from Color Brewer http://colorbrewer2.org/  */
		.q0-9{fill:rgb(247,251,255)}
		.q1-9{fill:rgb(222,235,247)}
		.q2-9{fill:rgb(198,219,239)}
		.q3-9{fill:rgb(158,202,225)}
		.q4-9{fill:rgb(107,174,214)}
		.q5-9{fill:rgb(66,146,198)}
		.q6-9{fill:rgb(33,113,181)}
		.q7-9{fill:rgb(8,81,156)}
		.q8-9{fill:rgb(8,48,107)}
	</style>

    new Contour({
        el: '.myColumnChart',
        column: { columnClass: function(d) { return "q" + d.y + "-9"; } }
    })
    .cartesian()
    .column(data)
    .render();

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

Use `columnClass` to apply a CSS class to the chart. Use [`style`](#core_config/config.column.style) to apply a particular style.

