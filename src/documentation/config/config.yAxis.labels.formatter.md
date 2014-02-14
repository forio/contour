#### **formatter** : { function }

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

A function that formats each value. The function should return a valid [format](#config_config.yAxis.labels.format), that is a string (that could vary based on each value).

The general form of a specifier is `[​[fill]align][sign][symbol][0][width][,][.precision][type]`. The exact definitions are identical to those [used in D3](https://github.com/mbostock/d3/wiki/Formatting#wiki-d3_format).

*[Try it.](http://jsfiddle.net/forio/8z7gs/)*

<% if(notes) { %><%= notes %><% } %>

