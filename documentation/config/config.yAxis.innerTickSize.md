#### **innerTickSize** : {number}

*default: 6* 

The length of the tick marks, in pixels, offset from the axis. 

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    yAxis: { innerTickSize: 20}
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/Y4y39/)*

**Notes:**

When [`orient`](#config_config.yAxis.orient) is set to `left`, the tick marks are drawn `innerTickSize` to the left of the axis. When [`orient`](#config_config.yAxis.orient) is set to `right`, the tick marks are drawn `innerTickSize` to the right of the axis.



