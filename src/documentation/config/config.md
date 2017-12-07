#### **config** : {<%= type %>} (Core)

The Contour configuration object is a set of configuration options.

Each set of options can be added:

* to the configuration options object that you pass in to the Contour constructor; this will override the configuration defaults

		new Contour({
	      el: '.myColumnChart',
	      column: {
	      // column-specific configuration options
	      }
	    })

* to the configuration options object that you pass in to the particular visualization when you add that visualization to your Contour instance; this will override the configuration options object passed in to the Contour constructor

		new Contour({
		  el: '.myColumnChart',
		  column: { columnWidth: 50 }
		})
		.cartesian()
		.column(data, { columnWidth: 30 } )
		.column(otherData, { columnWidth: () => 20 } )
		.render()

Each configuration option can be:

* a literal value of the correct type

		columnWidth: 30

* a constant of the correct type that is available within your current scope

		columnWidth: bestWidth

* a function that returns a value of the correct type

		columnWidth: function() { return this.rangeBand/3 * 2; }

	__Note__ In general, function parameters will be invoked just before the render cycle happens except when:
	* the function expects 1 or more parameters (ie. `function (d) { return d.x; }`) or
	* the parameter path matches or is in  the `options.skip` array. The `options.skip` array can have string with a full path to skip or a RegExp to match a path. For example `['line.marker.enable', /formatter/i]` would skip the options `line.marker.enable` and any options called `formatter`.

This allows functions to be used for things like formatters that need to be called for each point in the data set.

<% if(notes) { %><%= notes %><% } %>

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

