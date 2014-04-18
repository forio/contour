##Styling Visualizations

The [Forio Contour Core Components](#get_contour.html) include the Contour stylesheet.

You can update or extend the classes in this stylesheet, using [CSS](http://en.wikipedia.org/wiki/Cascading_Style_Sheets) or [SVG](http://www.w3.org/TR/SVG11/styling.html), to change the look of your visualizations.


####For example:

* **to change the background color of the plot area of a chart, update the `.contour-chart .plot-area-background` class and set a `fill` color.

* **to change the type face of axis labels**, update `contour-chart .axis text` and set the `font-family` or `font-size`. You can see an example of this in the [Styled Bar Chart](gallery.html#/chart/bar/bar-styled) in the Gallery.

* **to change the color of the markers on a line chart**, update `line-chart-markers .dot` and set the `fill` or `stroke`. You can see examples of this in the [Line Chart with Styled Markers](gallery.html#/chart/line/line-markers) and [Basic Line Chart, Multiple Series](gallery.html#/chart/line/line-multi-basic) in the Gallery.

* **to change the color of a visualization**, update the `fill` for `contour-chart .series .{visualization}`. You can see an example of this in the [Styled Bar Chart](gallery.html#/chart/bar/bar-styled) in the Gallery, where the `contour-chart .series .bar` is updated.

* **to change the entire color palette**, you can use the `d3.classed` call when you are creating your Contour instance, e.g. `d3.selectAll('series').classed('palette-6', true)`, as shown in the [Pie Chart Series](gallery.html#/chart/pie/pie-series) in the Gallery.








