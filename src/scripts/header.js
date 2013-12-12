(function (undefined) {

    var root = this;

    if ( typeof module === "object" && module && typeof module.exports === "object" ) {
        if(typeof require === 'function') {
            root.d3 = require('d3');
            root._ = require('lodash');
            $ = root.jQuery;
        }
    }

    if(!$) throw new Error('You need to include jQuery before Narwhal');


