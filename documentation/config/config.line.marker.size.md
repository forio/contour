#### **size** : {number}

*default: 3* 

The radius of each data point in a line chart, in pixels.

**Example:**

	new Narwhal({
	    el: '.myChart',
	    line: { 
	        marker : { size: 10 }
	      } 
      })
      .cartesian()
      .line([5, 3, 6, 7, 4, 2])
      .render()

*[Try it.](http://jsfiddle.net/forio/RPjwk/)*

**Notes:**

The `size` can be any non-negative number. 

[`enable`](#config_config.line.marker.enable) has precendence over `size`, so if [`enable`](#config_config.line.marker.enable) is set to `false`, the marker does not appear, regardless of the value for `size`.



