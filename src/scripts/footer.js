// exports for commonJS and requireJS styles
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    module.exports = Contour;
} else {
    root.Contour = Contour;
    if ( typeof define === "function" && define.amd ) {
        define( "contour", [], function () { return Contour; } );
    }
}
})();
