

## pie(data, options)

Adds a pie chart to the Narwhal instance.

### Example:

    new Narwhal({el: '.myChart'})
          .pie([1,2,3,4])
          .render();

### Params:

* **object|array** *data* The _data series_ to be rendered with this visualization. This can be in any of the supported formats. The data elements are summed and then divided. In the example, `.pie([1,2,3,4])` makes four pie slices: 1/10, 2/10, 3/10, and 4/10.

* **object** *[options]* Options particular to this visualization that override the defaults.

