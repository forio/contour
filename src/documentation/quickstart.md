##QuickStart

This example shows how to create your first chart with Narwhal.

###Including Narwhal

Narwhal requires the following files: 

* `narwhal.min.css`: the Narwhal stylesheet
* `d3.js`: the data manipulation library underlying many of Narwhal's visualizations
* `lodash.js`: utilities and performance enhancements used by Narwhal
* `narwhal.min.js`: the Narwhal visualization library

See the [{Download, license}](TBW-distribution) page for information on where to download or reference these libraries. 

You have two options for including these libraries: reference our copies, or download and load from your own domain. 

* If you reference ours, `yourPath` is `http://{TBW}`. 
* If you load from your own domain, `yourPath` is the location on your server, e.g. `/js/`.

		<html>
		  <head>
		    <link rel="stylesheet" href="yourPath/narwhal.min.css">
		      <script src="yourPath/d3.js"></script>
		      <script src="yourPath/lodash.js"></script>
		      <script src="yourPath/narwhal.min.js"></script>
		  </head>
		
		  <body>
		  </body>
		
		</html>

###Your first Narwhal visualization

Once you have included Narwhal in your webpage you can create your first visualization. We'll start with a line chart.

1. Add a `div` to your webpage and give it a `class`. Then set the `width` and `height` to be the width and height of your chart.

		<div class="myFirstChart" style="width:80%; height:300px;"></div>

2. To create one or more visualizations, make a new Narwhal instance within the JavaScript tag, `<script> </script>`, anywhere in your webpage. At minimum, your Narwhal instance needs an element whose name matches the `class` in your `div`.

		<script>
			new Narwhal({
				el: '.myFirstChart'
			})
		</script>

3. To display this Narwhal instance on your webpage, you need to add three more pieces to its definition:

	* The type of frame for all visualizations in this Narwhal instance: `.cartesian()`.
	* The particular visualization you want in this Narwhal instance, including its data: `.line([arrayOfData])`. (Each Narwhal instance can display multiple visualizations. In this example, we'll just make one.)
	* An instruction for all visualizations in this Narwhal instance to be displayed: `.render()`.

	So your complete webpage may look like this:
			
		<html>
		  <head>
			<link rel="stylesheet" href="yourPath/narwhal.min.css">
			<script src="yourPath/d3.js"></script>
			<script src="yourPath/lodash.js"></script>
			<script src="yourPath/narwhal.min.js"></script>
		  </head>
		
		  <body>
		
			<div class="myFirstChart" style="width:80%; height:300px;"></div>
		
			<script>
				new Narwhal({
					el: '.myFirstChart'
				})
				.cartesian()
				.line([1, 2, 3, 4, 5, 4, 3, 2, 1])
				.render();
			</script>
				
		  </body>
		</html>		

4. You should now see your Narwhal visualization on your webpage:

{img}

**What's next?** 

* Browse the [examples](TBW-../examples/) {for inspiration, to see what you can make}

* Review the reference documentation for any questions: see the visualizations and configuration options on the left

