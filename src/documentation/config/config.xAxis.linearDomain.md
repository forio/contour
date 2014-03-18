#### **linearDomain** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

This configuration option is only relevant if the axis `type` is set to `time`.

When `true`, the `time` axis is treated as a discrete domain, that is, data points are considered as categories or equal elements of a set. They are spaced evenly across the axis, regardless of their value. For example, 4/1/2014, 4/2/2014, and 4/30/2014 are spaced evenly along the axis.

When `false`, the `time` axis is treated as a continuous domain through time, that is, data points are considered as dates. They are spaced across the axis based on their value. For example, 4/1/2014 and 4/2/2014 are very close together, but 4/2/2014 and 4/30/2014 are much farther apart. 

**Example:**

	var data = [
        { x: new Date('1/1/2000'), y: 5},
        { x: new Date('2/1/2000'), y: 3},
        { x: new Date('3/1/2000'), y: 6},
        { x: new Date('4/1/2000'), y: 7},
        { x: new Date('4/2/2000'), y: 4},
        { x: new Date('4/30/2000'), y: 2}
    ];

	new Contour({
	    el: '.myLineChart',
    	xAxis: { type: 'time',  
            // set true to space the data points evenly;
            // set false to space the data points based
            //  on their relative values as dates
            linearDomain: false }
    	})
    .cartesian()
    .line(data)
    .tooltip()
	.render()

*[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

