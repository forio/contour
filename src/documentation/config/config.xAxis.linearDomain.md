#### **linearDomain** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

This configuration option is only relevant if the axis `type` is set to `time`.

When `true`, the `time` axis is treated as a discrete domain, that is, data points are considered as categories or equal elements of a set. They are spaced evenly across the axis, regardless of their value. For example, 4/1/2014, 4/2/2014, and 4/30/2014 are spaced evenly along the axis.

When `false`, the `time` axis is treated as a as a continuous domain through time, that is, data points are considered as dates. They are spaced across the axis based on their value. For example, 4/1/2014 and 4/2/2014 are very close together, but 4/2/2014 and 4/30/2014 are much farther apart. 

<% if(notes) { %><%= notes %><% } %>

