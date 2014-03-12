#### **format** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The formatting for the labels of tick marks on the axis.

The general form of a specifier is `[​[fill]align][sign][symbol][0][width][,][.precision][type]`. The exact definitions are identical to those [used in D3](https://github.com/mbostock/d3/wiki/Formatting#wiki-d3_format).

**Example:**

	// format follows the d3 formatting conventions
	// https://github.com/mbostock/d3/wiki/Formatting#wiki-d3_format

    new Contour({
        el: '.myLineChart',
        // have labels use currency, and
        // round to 1 significant digit
        xAxis: { 
        	type: 'linear',
        	labels: { format: '$r.1'} 
        }
      })
    .cartesian()
    .line(data)
    .tooltip()
    .render()

*[Try it.](http://jsfiddle.net/gh/get/library/pure/forio/contour/tree/master/src/documentation/fiddle/config.xAxis.labels.format/)*

<% if(notes) { %><%= notes %><% } %>

