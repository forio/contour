#### **formatter** : {<%= type %>}

A function that formats each value to display in the tooltip.

The default behavior is:

* If a `formatter` is provided, return the data it specifies.
* Otherwise, return the the name of the series and the x and y values of each data point, on separate lines.
* For single-valued data (such as for a pie chart), return the value of each data point.

If you provide your own `formatter`, you can access both the name of the series (as `series`) and index of the series (as `seriesIndex`). This means that your formatting functions can determine the appropriate formatting to apply per series.

**Example:**

    new Contour({
        el: '.myChart',
        tooltip: {
        	formatter: function(d) { 
        		return d.seriesIndex + ': ' + d.series 
        			+ '<br>' + d.x + ',' + d.y; 
        	}
        }
      })
    .cartesian()
    .line(data)
    .tooltip()
    .render();

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

