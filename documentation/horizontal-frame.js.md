

## .horiztonal(frame)

Sets the visualization frame to be "horizontal".
The xAxis is set vertical and the yAxis is set horizontal.

This visualization requires *.cartesian()*.

This visualization is a prerequiste for rendering bar charts (*.bar()*).

###Example:

    new Narwhal({el: '.myChart'})
       .cartesian()
       .horizontal()
       .bar([1, 2, 3, 4, 5, 4, 3, 2, 1])
       .render()

### Params:

* **TBW** *frame* TBW

