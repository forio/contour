(function () {

    var defaults = {
        type: 'image/png',
        backgroundColor: '#fff',
        fileName: 'contour.png'
    };

    // browser capabilities
    var browser = {
        checked: false // true after browser capabilities have been checked
    };
    // shims depending on current browser
    var shim = {
        serializeXml: undefined // xml serializer
    };


    var exportable = function () {
        // css rules to ignore for diff
        var ignoreDiff = {
            cssText: 1,
            parentRule: 1
        };
        var self; // reference to this contour


        // interface

        return {
            init: function () {
                self = this;

                if (!browser.checked) checkBrowser();

                return this;
            },

            /**
            * Saves a visualization as an image, triggering a download.
            *
            * `type` specfies the mime type of the image. See http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support. (Default: 'image/png'.)
            * `fileName` specifies the fileName for the download. (Default: 'contour.png'.)
            *
            * ###Example:
            *
            *     var contour = new Contour(...)
            *         ...
            *         .exportable()
            *         .render();
            *     document.getElementById('save').onclick = function () {
            *         contour.download({
            *             fileName: 'contour.png',
            *             width: 640
            *         });
            *
            * @name download
            * @param {object} options Configuration options specific to saving the image.
            */
            download: function (options) {
                exportImage(options, 'download');

                return this;
            },

            /**
            * Saves a visualization as an image.
            *
            * `type` specfies the mime type of the image. See http://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support for browser support. (Default: 'image/png'.)
            * `target` specifies a selector for the container. (For example: `target: '#vis'` will insert the image in `<div id="vis"></div>`.)
            *
            * ###Example:
            *
            *     var contour = new Contour(...)
            *         ...
            *         .exportable()
            *         .render();
            *     document.getElementById('save').onclick = function () {
            *         contour.place({
            *             target: '#image'
            *         });
            *
            * @name place
            * @param {object} options Configuration options specific to saving the image.
            */
            place: function (options) {
                exportImage(options, 'place');

                return this;
            }
        };


        // svg to canvas export function
        // adapted from https://github.com/sampumon/SVG.toDataURL
        // which based on http://svgopen.org/2010/papers/62-From_SVG_to_Canvas_and_Back/#svg_to_canvas
        function getSvgDataUrl(svg, options, dataUrlCreated) {
            switch (options.type) {
                case 'image/svg+xml':
                    return exportSvg();

                default: // 'image/png' or 'image/jpeg'
                    return exportImage();
            }


            function encodeBase64DataUrl(svgXml) {
                // https://developer.mozilla.org/en/DOM/window.btoa
                return 'data:image/svg+xml;base64,' + btoa(svgXml);
            }

            // convert base64/URLEncoded data component to raw binary data held in a string
            function dataUrlToBlob(dataUrl) {
                var byteString;
                if (dataUrl.split(',')[0].indexOf('base64') >= 0) {
                    byteString = atob(dataUrl.split(',')[1]);
                } else {
                    byteString = unescape(dataUrl.split(',')[1]);
                }

                // separate out the mime component
                var mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];

                // write the bytes of the string to a typed array
                var ia = new Uint8Array(byteString.length);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                return new Blob([ia], {
                    type: mimeString
                });
            }

            function exportSvg() {
                var svgXml = shim.serializeXml(svg);
                var svgDataUrl = encodeBase64DataUrl(svgXml);

                dataUrlCreated(svgDataUrl, null, function () {});
            }

            function exportImage() {
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');

                var svgXml = shim.serializeXml(svg);

                if (root.canvg) {
                    // use canvg renderer for image export
                    renderImageCanvg();
                } else {
                    // use native renderer for image export (this might fail)
                    renderImageNative();
                }

                function imageRendered() {
                    var imageDataUrl = canvas.toDataURL(options.type);
                    var imageBlob = dataUrlToBlob(imageDataUrl);

                    var domUrl = root.URL || root.webkitURL || root;
                    var objectUrl = domUrl.createObjectURL(imageBlob);

                    dataUrlCreated(objectUrl, imageBlob, function () {
                        domUrl.revokeObjectURL(objectUrl);
                    });
                }

                function renderImageNative() {
                    var svgImg = new Image();
                    svgImg.src = encodeBase64DataUrl(svgXml);

                    svgImg.onload = function () {
                        canvas.width = svgImg.width;
                        canvas.height = svgImg.height;

                        if (options.backgroundColor) {
                            context.fillStyle = options.backgroundColor;
                            context.fillRect(0, 0, svgImg.width, svgImg.height);
                        }

                        context.drawImage(svgImg, 0, 0);

                        imageRendered();
                    };

                    svgImg.onerror = function () {
                        console.log('Cannot export image');
                    };
                }

                function renderImageCanvg() {
                    // note that canvg gets the svg element dimensions incorrectly if not specified as attributes
                    // also this canvg call is synchronous and blocks
                    canvg(canvas, svgXml, {
                        ignoreMouse: true,
                        ignoreAnimation: true,
                        offsetX: undefined,
                        offsetY: undefined,
                        scaleWidth: undefined,
                        scaleHeight: undefined,
                        renderCallback: imageRendered
                    });
                }
            }
        }


        // clone svg in isolation with styles directly applied
        function createSvgClone(svgNode, svgCloned) {
            createIsolatedNode(function (nodeClone, destroyIsolatedNode) {
                // clone nodes and apply styles directly to each node
                cloneNodes(svgNode, nodeClone);

                svgCloned(d3.select(nodeClone).select('svg').node(), destroyIsolatedNode);
            });


            // compare computed styles at this node and apply the differences directly
            function applyStyles(sourceNode, targetNode) {
                var sourceStyle = root.getComputedStyle(sourceNode);
                var targetStyle = root.getComputedStyle(targetNode);

                for (var prop in sourceStyle) {
                    if (!ignoreDiff[prop] && !isFinite(prop)) {
                        // note that checking for sourceStyle.hasOwnProperty(prop) eliminates all valid style properties in firefox
                        if (targetStyle[prop] !== sourceStyle[prop]) {
                            targetNode.style[prop] = sourceStyle[prop];
                        }
                    }
                }
            }

            // clone nodes and apply styles directly to each node
            function cloneNodes(sourceNode, targetNode) {
                var newNode = sourceNode.cloneNode(false);
                targetNode.appendChild(newNode);

                if (!sourceNode.tagName) return; // skip inner text

                // compare computed styles at this node and apply the differences directly
                applyStyles(sourceNode, newNode);

                _.each(sourceNode.childNodes, function (childNode) {
                    // clone each child node and apply styles
                    cloneNodes(childNode, newNode);
                });
            }

            function createIsolatedNode(nodeLoaded) {
                var iframe = document.body.appendChild(document.createElement('iframe'));
                iframe.style.visibility = 'hidden';
                var iframeWindow = iframe.contentWindow;
                var iframeDocument = iframeWindow.document;

                iframe.onload = function () {
                    var nodeClone = iframeDocument.createElement('div');
                    iframeDocument.body.appendChild(nodeClone);

                    var destroyIframe = function () {
                        // destroy clone
                        iframeDocument.body.removeChild(nodeClone);
                        document.body.removeChild(iframe);
                    };

                    nodeLoaded(nodeClone, destroyIframe);
                };

                iframeDocument.open();
                iframeDocument.write('<!DOCTYPE html>');
                iframeDocument.write('<html><head></head><body></body></html>');
                iframeDocument.close();
            }
        }


        function getProportionedBounds(original, specified) {
            if (specified.width && specified.height) {
                return specified;
            } else if (specified.width) {
                return {
                    width: specified.width,
                    height: specified.width * original.height / original.width
                };
            } else if (specified.height) {
                return {
                    width: specified.height * original.width / original.height,
                    height: specified.height
                };
            } else {
                return original;
            }
        }


        function exportImage(options, exporter) {
            // merge configuration options with defaults
            options = options || {};
            _.defaults(options, defaults);

            var svgNode = self.container.select('svg').node();
            // get bounds from original svg, and proportion them based on specified options
            var bounds = svgNode.getBoundingClientRect();
            var boundsClone = getProportionedBounds(bounds, options);

            // clone svg in isolation with styles directly applied
            createSvgClone(svgNode, performExport);

            function performExport(svgNodeClone, destroySvgClone) {
                svgNodeClone.setAttribute('width', boundsClone.width);
                svgNodeClone.setAttribute('height', boundsClone.height);

                getSvgDataUrl(svgNodeClone, options, function (url, blob, revokeUrl) {
                    destroySvgClone();

                    // exporter functions
                    var exporters = {
                        'download': function () {
                            if (browser.aDownloads) {
                                // make a link to download and click it
                                var a = document.createElement('a');
                                a.download = options.fileName;
                                a.href = url;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            } else if (browser.savesMsBlobs && blob) {
                                // IE9-11 support a method to save/open a blob
                                navigator.msSaveOrOpenBlob(blob, options.fileName);
                            } else {
                                // safari can only open a new tab with the image
                                root.open(url);
                            }
                            // wait for download to start
                            setTimeout(function () {
                                revokeUrl();
                            }, 1);
                        },
                        'place': function () {
                            var img = document.createElement('img');
                            img.onload = function () {
                                revokeUrl();
                            };
                            img.src = url;
                            d3.select(options.target).node().appendChild(img);
                        }
                    };
                    // call exporter function
                    exporters[exporter]();
                });
            }
        }
    };


    function checkBrowser() {
        browser.checked = true;

        checkEncodesBase64();
        checkHasTypedArray();
        checkSerializesXml();
        checkADownloads();
        checkSavesMsBlobs();
        checkExportsSvg();


        function checkEncodesBase64() {
            browser.encodesBase64 = 'btoa' in root;

            // setup shim for IE9
            if (!browser.encodesBase64) {
                setupBase64Shim();
            }
        }

        function checkHasTypedArray() {
            browser.hasTypedArray = 'Uint8Array' in root;

            if (!browser.hasTypedArray) {
                setupTypedArrayShim();
            }
        }

        function checkSerializesXml() {
            browser.serializesXml = 'XMLSerializer' in root;

            if (browser.serializesXml) {
                // use standard XMLSerializer.serializeToString
                shim.serializeXml = function (xml) {
                    return (new XMLSerializer()).serializeToString(xml);
                };
            } else {
                setupXmlSerializerShim();
            }
        }

        function checkADownloads() {
            browser.aDownloads = document.createElement('a').download !== undefined;
        }

        function checkSavesMsBlobs() {
            browser.savesMsBlobs = 'msSaveOrOpenBlob' in navigator;
        }

        function checkExportsSvg() {
            browser.exportsSvg = false;

            var iframe = document.body.appendChild(document.createElement('iframe'));
            iframe.style.visibility = 'hidden';
            var doc = iframe.contentWindow.document;

            iframe.onload = function () {
                try {
                    var svg = doc.querySelector('svg');
                    var img = doc.querySelector('img');
                    var canvas = doc.querySelector('canvas');
                    var context = canvas.getContext('2d');
                    canvas.width = img.getAttribute('width') * 1;
                    canvas.height = img.getAttribute('height') * 1;
                    var sourceImg = new Image();
                    sourceImg.width = canvas.width;
                    sourceImg.height = canvas.height;
                    sourceImg.onload = function () {
                        try {
                            context.drawImage(sourceImg, 0, 0, img.width, img.height);
                            img.src = canvas.toDataURL();

                            browser.exportsSvg = true; // yay
                        } catch (e) {}

                        svgExportChecked();
                    };
                    var xml = shim.serializeXml(svg);
                    sourceImg.src = 'data:image/svg+xml,' + encodeURIComponent(xml);
                } catch (e) {
                    svgExportChecked();
                }
            };

            doc.open();
            doc.write('<!DOCTYPE html>');
            doc.write('<html><head></head><body>');
            doc.write('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2" viewBox="0 0 1 1"><circle r="1" fill="red"/></svg>');
            doc.write('<img width="2" height="2">');
            doc.write('<canvas></canvas>');
            doc.write('</body></html>');
            doc.close();


            function svgExportChecked() {
                document.body.removeChild(iframe);

                // load canvg svg renderer for browsers that can't safely export svg
                if (!browser.exportsSvg) {
                    _.each([
                        'rgbcolor.js',
                        'StackBlur.js',
                        'canvg.js'
                    ], function (src) {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = 'http://canvg.googlecode.com/svn/trunk/' + src;
                        document.head.appendChild(script);
                    });
                }
            }
        }

        function setupBase64Shim() {
            var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

            root.btoa = base64Encode;
            root.atob = base64Decode;


            // base64 encode
            function base64Encode(input) {
                var output = '';
                var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                var i = 0;

                input = utf8Encode(input);

                while (i < input.length) {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                }

                return output;
            }

            function utf8Encode(string) {
                string = string.replace(/\r\n/g, '\n');
                var utftext = '';

                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    } else if((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    } else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                }

                return utftext;
            }

            // base64 decode
            function base64Decode(input) {
                var output = '';
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

                while (i < input.length) {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                }

                output = utf8Decode(output);

                return output;
            }

            function utf8Decode(utftext) {
                var string = '';
                var i = 0;
                var c, c1, c2;
                c = c1 = c2 = 0;

                while (i < utftext.length) {
                    c = utftext.charCodeAt(i);

                    if (c < 128) {
                        string += String.fromCharCode(c);
                        i++;
                    } else if ((c > 191) && (c < 224)) {
                        c2 = utftext.charCodeAt(i + 1);
                        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                        i += 2;
                    } else {
                        c2 = utftext.charCodeAt(i + 1);
                        c3 = utftext.charCodeAt(i + 2);
                        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                        i += 3;
                    }
                }

                return string;
            }
        }

        function setupTypedArrayShim() {
            root.Uint8Array = TypedArray;
            root.Uint32Array = TypedArray;
            root.Int32Array = TypedArray;


            function subarray(start, end) {
                return this.slice(start, end);
            }
         
            function set_(array, offset) {
                if (arguments.length < 2) offset = 0;
                for (var i = 0, n = array.length; i < n; ++i, ++offset) {
                    this[offset] = array[i] & 0xFF;
                }
            }
         
            // we need typed arrays
            function TypedArray(arg1) {
                var result;
                if (typeof arg1 === 'number') {
                    result = new Array(arg1);
                    for (var i = 0; i < arg1; ++i) {
                        result[i] = 0;
                    }
                } else {
                    result = arg1.slice(0);
                }
                result.subarray = subarray;
                result.buffer = result;
                result.byteLength = result.length;
                result.set = set_;
                if (typeof arg1 === 'object' && arg1.buffer) {
                    result.buffer = arg1.buffer;
                }
         
                return result;
            }
        }

        function setupXmlSerializerShim() {
            // use custom serializeXmlToString for IE9
            shim.serializeXml = serializeXmlToString;


            // quick-n-serialize an SVG dom, needed for IE9 where there's no XMLSerializer nor SVG.xml
            // s: SVG dom, which is the <svg> elemennt
            function serializeXmlToString(s) {
                var out = '<' + s.nodeName;
                for (var i = 0; i < s.attributes.length; i++) {
                    out += ' ' + s.attributes[i].name + '=' + '"' + s.attributes[i].value + '"';
                }

                if (s.hasChildNodes()) {
                    out += '>\n';
                    for (var j = 0; j < s.childNodes.length; j++) {
                        out += serializeXmlToString(s.childNodes[j]);
                    }
                    out += '</' + s.nodeName + '>' + '\n';
                } else out += ' />\n';

                return out;
            }
        }
    }


    /**
    * Saves a visualization as an image.
    *
    * ###Example:
    *
    *     var contour = new Contour(...)
    *         ...
    *         .exportable()
    *         .render();
    *     document.getElementById('save').onclick = function () {
    *         contour.download({
    *             fileName: 'contour.png'
    *         });
    *
    * @name exportable
    */
    Contour.expose('exportable', exportable);

})();
