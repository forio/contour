

## cartesian()()

Provides a Cartesian frame to the Narwhal instance.

###Example:

    new Narwhal(options)
          .cartesian();

## xScale(value)

Provides a scaling function based on the xAxis values.

###Example:

    var scaledValue = this.xScale(100);

### Params:

* **Number|String** *value* The value to be scaled.

### Return:

* **Number** The scaled value according to the current xAxis settings.

## yScale(value)

Provides a scaling function based on the yAxis values.

###Example:

    var scaledValue = this.yScale(100);

### Params:

* **Number** *value* The value to be scaled.

### Return:

* **Number** The scaled value according to the current yAxis settings.

## setYDomain(domain)

Modifies the domain for the yAxis.

###Example:

    this.setYDomain([100, 200]);

### Params:

* **Array** *domain* The domain array representing the min and max values visible on the yAxis.

## redrawYAxis()

Redraws the yAxis with the new settings and domain.

###Example:

    this.redrawYAxis();

