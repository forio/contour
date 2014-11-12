#### **style** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The CSS styles to apply to the rows of the bar chart. This can be a literal string, or any function that returns a string with style(s). Using a function gives you individual control over particular data points.
 

**Example:**

    new Contour({
        el: '.myBarChart',
        bar: { 
        	style: function(d) {
        		if (d.y > threshold) { return: 'fill: #000a0'; }
        		else { return 'fill: #0000a0; opacity: 0.4'; }
        	}
        }
    })
    .cartesian()
    .horizontal()
    .bar(data)
    .render();

*[Try it.](<%= jsFiddleLink %>)*
    
**Notes:**

Use [`barClass`](#core_config/config.bar.barClass) to apply a CSS class to the chart. Use `style` to apply a particular style.

