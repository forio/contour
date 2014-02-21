#### **columnWidth** : {function}

*default: function () { return this.rangeBand; }* 

The width of each column, in pixels.

The default value `this.rangeBand` refers to the width when the axis interval for this Narwhal instance is evenly divided into bands. (See also [d3's rangeBand()](https://github.com/mbostock/d3/wiki/Ordinal-Scales#wiki-ordinal_rangeBand){:target="_blank"}.)

**Example:**

		new Narwhal({
		  el: '.myColumnChart',
		  column: { columnWidth: 20 }
		})

*[Try it.](http://jsfiddle.net/forio/5JubL/)*

**Notes:** 

The `columnWidth` is divided evenly among *all* of the column visualizations in this instance of Narwhal. Therefore, if you add multiple column chart visualizations to your Narwhal instance, mostly likely you will want to override this configuration option *for each subsequent visualization*. (You'll probably also want to set the [`offset`](#config_config.column.offset), so that columns for the two visualizations don't overlap.)

For example:

	new Narwhal({
	    el: '.myColumnChart'
	    column: { columnWidth: 20 }
	  })
	.cartesian()
	.column(data)
	.column(otherData, { columnWidth: 40, offset: 30 } )
	.render()




