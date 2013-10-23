(function (ns, d3, _, $, undefined) {

    var helpers = {
        firstAndLast: function (ar) {
            return [ar[0], ar[ar.length-1]];
        }
    };

    _.nw = _.extend({}, _.nw, helpers);

})('Narwhal', window.d3, window._, window.jQuery);
