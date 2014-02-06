#### **format** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

The formatting for the labels of tick marks on the axis.

The general form of a specifier is `[​[fill]align][sign][symbol][0][width][,][.precision][type]`. The exact definitions are identical to those [used in D3](https://github.com/mbostock/d3/wiki/Formatting#wiki-d3_format).

*[Try it.](http://jsfiddle.net/forio/YkZu4/)*
TODO: example pending https://github.com/forio/forio-narwhal/issues/83

<% if(notes) { %><%= notes %><% } %>

