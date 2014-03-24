#### **categories** : { array }

<% if(defaultValue !== "[object Object]") { %>*default: <%= defaultValue %>* <% }%>

An array of category names (strings) to display as the labels on the `xAxis`. 

**Example:**

    new Contour({
        el: '.myLineChart',
        xAxis: { categories: ['apples', 'oranges', 'bananas', null, 'grapes', 'pears'] }
      })
    .cartesian()  
    .line([1, 2, 4, 5, 6, 8])
    .tooltip()
    .render()

*[Try it.](<%= jsFiddleLink %>)*

**Notes:**

Assignment of `categories` to data points starts at the first element of the data series being rendered. Therefore, if the `categories` array has eight elements and the data series has ten, the last two points in the data series will have no label. You can also insert a `null` into the `categories` array to force no label for a particular data point.

<% if(notes) { %><%= notes %><% } %>

