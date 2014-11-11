#### **style** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The CSS styles to apply to the "slices" of the pie chart. This can be a literal string, or any function that returns a string with style(s). Using a function gives you individual control over particular data points.

**Example:**

    new Contour({
        el: '.myPieChart',
        pie: {  
        	style: function(d) {
        		if (d.value > threshold) { return 'opacity: 1'; }
        		else { return 'opacity: 0.3';  }
        	}
        }
    })
    .pie(data)
    .render();

*[Try it.](<%= jsFiddleLink %>)*
    
**Notes:**

Use [`sliceClass`](#core_config/config.pie.sliceClass) to apply a CSS class to the chart. Use `style` to apply a particular style.

