#### **type** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

How the xAxis should be scaled. The available options are:

* `linear`: The axis is treated as a continuous domain, that is, data points are considered as numerical values. They are spaced across the axis based on their value. For example, 20 and 40 are twice as far apart as 40 and 50.
* `ordinal`: The axis is treated as a discrete domain, that is, data points are considered as categories or equal elements of a set. They are spaced evenly across the axis, regardless of their value. For example, 20, 40, and 50 are all the same distance apart.
* `time`: The axis is treated as a continuous (linear) domain, but along dates rather than along real numbers. For example, 1/1/2014 and 1/20/2014 are twice as far apart as 1/20/2014 and 1/30/2014. (However, you can force a `time` axis to be treated as ordinal, see [`linearDomain`](#config_config.xAxis.linearDomain).)

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { type: 'ordinal' }
      })
    .cartesian()
    .line([{x:0, y:5}, {x:1, y:3}, {x:3, y:7}, {x:10, y:4}])
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

* The `type` defaults to `linear` **unless**:

	* your data is in the JavaScript [Date](http://www.w3schools.com/jsref/jsref_obj_date.asp) format, in which case the `type` defaults to `time`, or
	* your `xAxis` has a [`categories`](#config_config.xAxis.categories) property set.

	You can always set the `type` explicitly if needed.

* When you are using a `type` of `time`, your data must be JavaScript Date objects, for example: 

		var data = [
	        { x: new Date('1/1/2000'), y: 5},
	        { x: new Date('2/1/2000'), y: 3},
	        { x: new Date('3/1/2000'), y: 6},
	        { x: new Date('4/1/2000'), y: 7},
	        { x: new Date('4/2/2000'), y: 4},
	        { x: new Date('4/30/2000'), y: 2}
	    ];


<% if(notes) { %><%= notes %><% } %>

