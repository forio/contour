// exports for commonJS and requireJS styles
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    module.exports = Narwhal;
} else {
    root.Narwhal = Narwhal;
    if ( typeof define === "function" && define.amd ) {
        define( "narwhal", [], function () { return Narwhal; } );
    }
}
})();
