#### **innerTickSize** : {number}

*default: 6* 

The length of the tick marks, in pixels, offset from the axis. 

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    xAxis: { innerTickSize: 15,
	    		 firstAndLast: false }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/LU6du/)*

**Notes:**

The tick marks are drawn `innerTickSize` above the axis when [`orient`](#config_config.xAxis.orient) is set to `top`. The tick marks are drawn `innerTickSize` below the axis when [`orient`](#config_config.xAxis.orient) is set to `bottom`.



