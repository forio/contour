

## .cartesian()

Provides a cartesian frame to the Narwhal instance

Example:

    new Narwhal(options)
          .cartesian();

Now new visualizations have accecss to the cartesian frame functionality

## this.xScale()(value)

Provides a scaling function based on the xAxis values.

Example:

    var scaledValue = this.xScale(100);

### Params:

* **Number|String** *value* The value to be scaled

### Return:

* **Number** The scaled value according to the current xAxis settings

## this.yScale()(value)

Provides a scaling function based on the xAxis values.

Example:

    var scaledValue = this.xScale(100);

### Params:

* **Number** *value* The value to be scaled

### Return:

* **Number** The scaled value according to the current yAxis settings

Modifies the domain for the y axis.

Example:

    this.setYDomain([100, 200]);

### Params:

* **Array** *domain* The domain array represeting the min and max values of to be visible in the y Axis

Redraws the yAxis with the new settings and domain

Example:

    this.redrawYAxis(;

