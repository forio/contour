#### **stacked** : {boolean}

*default: false* 

Whether a single bar visualization that has data with multiple series is displayed with each series stacked (`true`) or side by side (`false`).

**Example:**

		new Narwhal({
		    el: '.myBarChart',
		    bar: { stacked: true }
		  })
		.cartesian()
		.horizontal()
		.bar([
		    {name: 'series1', data: [1,2,3,4]}, 
		    {name: 'series2', data: [5,6,7,8]}
		  ])
		.render()

*[Try it.](http://jsfiddle.net/forio/B5B2Y/)*



