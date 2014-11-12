#### **style** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The CSS styles to apply to the columns of the column chart. This can be a literal string, or any function that returns a string with style(s). Using a function gives you individual control over particular data points.

**Example:**

    new Contour({
        el: '.myColumnChart',
        column: { 
        	style: function(d) {
        		if (d.y > threshold) { return: 'fill: #000a0'; }
        		else { return 'fill: #0000a0; opacity: 0.4'; }
        	} 
        }
    })
    .cartesian()
    .column(data)
    .render();
    
*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

Use [`columnClass`](#core_config/config.column.columnClass) to apply a CSS class to the chart. Use `style` to apply a particular style.

