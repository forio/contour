#### **tickValues** : { array }

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

An array containing the values for the locations of the tick marks on this axis (excluding ends of the domain). 

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { tickValues: [1, 2, 4, 6] }
      })
    .cartesian()
    .line([1, 2, 4, 5, 6, 7, 8])
    .tooltip()
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

For an xAxis with [`type`](#config_config.xAxis.type) of `ordinal`, the `tickValues` must be a subset of the categories. For example: 

	new Contour({
	    el: '.myLineChart',
	    	// shows tick marks for the second and fourth points
	    	// at x:1 and x:10
	    xAxis: { tickValues: [1, 10], type: 'ordinal' }
	  })
	.cartesian()
	.line([{x:0, y:5}, {x:1, y:3}, {x:3, y:7}, {x:10, y:4}])
	.tooltip()
	.render();

