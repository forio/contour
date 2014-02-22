#### **tickPadding** : {number}

*default: 6* 

The distance between the end of the tick mark and the label of the tick mark, in pixels. (The tick mark itself is offset [`innerTickSize`](#config_config.xAxis.innerTickSize) from the axis.)

**Example:**

	new Narwhal({
	    el: ".myLineChart",
	    xAxis: { innerTickSize: 6, 
                 tickPadding: 25,
                 firstAndLast: false                
               }
	  })
	.cartesian()
	.line(data)
	.render()

*[Try it.](http://jsfiddle.net/forio/abzJE/)*

**Notes:**

The label of the tick mark appears below the end of the tick mark when [`orient`](#config_config.xAxis.orient) is set to `bottom`. The label of the tick mark appears above the end of the tick mark when [`orient`](#config_config.xAxis.orient) is set to `top`.



