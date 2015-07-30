#### **preprocess** : {<%= type %>}

*default: function minMaxFilter(1000)*

Sometimes, usually for performance reasons, you don't want Contour to draw *all* of the points in your data set. 

The default value is a function that:

* Takes in an integer, which is 1000 in the default case.
* If the number of points in your data set is less than or equal to this, simply returns the entire data set.
* Otherwise, returns a filtered data set. The filtering creates a new, smaller, data set, which has at most two data points for each x value in the original data: one with the minimum y value and one with the maximum y value.

This configuration option allows you to define a `preprocess` attribute that returns only the data that should be drawn. This is a function that returns a data set, for example one created using a different filtering algorithm than the provided default function.


**Example:**

	// sample preprocssing function, 
	// returns only the first n elements of the data
	
	function myProcessor(n) {
		return function(data) {
			var newData = [];
        	for (var i=0; i<n; i++) {
        		// sample function assumes only one series in origData
        		newData[i] = data[0].data[i];
        	}
        	return [{ name: data[0].name, data: newData }];
		}
    }

	new Contour({
        el: '.myLineChart',
        line: { preprocess: myProcessor(3) } 
      })
    .cartesian()
    .line(origData)
    .render();

 *[Try it.](<%= jsFiddleLink %>)*

<% if(notes) { %><%= notes %><% } %>

