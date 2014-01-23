#### **smartAxis** : {<%= type %>}

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

When `smartAxis` is `true`, tick marks are drawn for:

* the minimum value of the axis (defaults to 0)
* the maximum value of the axis (either the largest y-value, or the largest y-value rounded up, based on [`nicing`]())
* the y-value of the data point with the largest y-value 

When `smartAxis` is `false`, tick marks are drawn for:

* the minimum value of the axis (defaults to 0)
* the y-values specified in the [`tickValues`]() array, if defined
* approximately [`ticks`]() number of tick marks evenly distributed along the axis, if defined
* y-values at multiples of 1, 2, 5, 10, or 10x, if neither [`tickValues`]() nor [`ticks`]() is defined

**Notes:**

The `smartAxis` configuration option has the highest precedence in specifying locations of tick marks. If [`smartAxis`]() is `true`, both [`tickValues`]() and [`ticks`]() option are ignored.

To remove the tick mark at the end of the domain, set [`outerTickSize`]() to `0`.

<% if(notes) { %><%= notes %><% } %>

