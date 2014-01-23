#### **config** : {<%= type %>}

The Narwhal configuration object is a set of configuration options. 

Each set of options can be added:

* to the configuration options object that you pass in to the Narwhal constructor; this will override the configuration defaults

		new Narwhal({
	      el: ".myColumnChart",
	      column: {
	      // column-specific configuration options
	      }
	    })

* to the configuration options object that you pass in to the particular visualization when you add that visualization to your Narwhal instance; this will override the configuration options object passed in to the Narwhal constructor

		new Narwhal({
		  el: ".myColumnChart",
		  column: { columnWidth: 50 }
		})
		.cartesian()
		.column(data, { columnWidth: 30 } )
		.column(otherData, { columnWidth: 20} )
		.render()

Each configuration option can be:

* a literal value of the correct type

		columnWidth: 30

* a constant of the correct type that is available within your current scope

		columnWidth: bestWidth

* a function that returns a value of the correct type

		columnWidth: function() { return this.rangeBand/3 * 2; }

<% if(notes) { %><%= notes %><% } %>

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

