(function (undefined) {

    var root = this;

    if (typeof module === 'object' && module && typeof module.exports === 'object') {
        if(typeof require === 'function') {
            root.d3 = require('d3');
            root._ = require('lodash');
        }
    }

    if(!d3) throw new Error('You need to include d3.js before Contour. Go to http://d3js.org/');
    if(!_ || !_.merge) throw new Error('You need to include lodash.js before Contour. Go to http://lodash.com/');

})();
