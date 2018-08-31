var _ = require('underscore');


String.prototype.regexIndexOf = function(regex, start) {
    var indexOf = this.substring(start || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (start || 0)) : indexOf;
};


// external objects/functions used in defaults
// we just need the mocks here
_.nw = {
    minMaxFilter: function () {}
};



var isSafeForEval = function(text) {
    // from json2 parser
    // for details goto: https://github.com/douglascrockford/JSON-js/blob/master/json2.js
    // return /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
    //         .replace(/["'][^"\\\n\r]*["']|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
    //         .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));

    return true;
};

/*jslint evil: true, regexp: true */
var getConfigObject = function (js, options) {
    options = options || {};
    var searchPatterns = [
        '\\/\\*\\*\\s?@config',
        'defaults\\s?=\\s?\\{'
    ].join('|');

    var defaults = {
        patterns: searchPatterns
    };

    options = _.extend(defaults, options);

    // search for the 'config object' accounting to the given patterns
    var regExp = new RegExp(options.patterns, 'g');
    if(!(regExp.test(js))) return {};

    var start = js.regexIndexOf(regExp);
    if(js[start] === '/') {
        start = js.regexIndexOf(/\*\//, start);
    }

    var firstBraket = js.regexIndexOf(/{/, start);
    var buf = [], brakets = 0, cur = firstBraket;
    var whithinComment = false, whithinMultilineComment = false;

    do {
        var token = js[cur++];
        var next = js[cur];

        switch(token) {
        case '\n':
            whithinComment = false;
            break;
        case '*':
            if (next === '/') whithinMultilineComment = false;
            break;
        case '/':
            if (next === '/') whithinComment = true;
            if (next === '*') whithinMultilineComment = true;
            break;
        case '{':
            // only count the braket if we our not in a comment block|line
            brakets += !(whithinComment || whithinMultilineComment) | 0;
            break;
        case '}':
            // only count the braket if we our not in a comment block|line
            brakets -= !(whithinComment || whithinMultilineComment) | 0;
            break;
        }

        buf.push(token);
    } while(brakets);

    var text = buf.join('');
    if(!isSafeForEval(text)) throw new SyntaxError('Can\'t parse config object');

    // aaaahhhh!!! people are going to die with this!!!
    try {
        return eval('(' + text + ')');
    } catch (e) {
        return '';
    }
};

var res = {
    "tags":[
        {
            "type": "config-object",
            "description": "configuration object for ABC visualization"
        }
    ],
    "desciption": {
        "full": "full description",
        "summary": "first line of description",
        "body": "body of description"
    },
    "ctx": {
        "type": "property",
        "receiver": "window",
        "name": "config"
    }
};


exports.parseConfigObject = function(js, options) {
    options = options || {};

    var config = getConfigObject(js);
    var doc = {
        "tags": [{ "type": "config-object", "description": "" }],
        "ctx": { "type": "declaration", "name": "defaults" }
    };

    for (var key in config) {


    }

    return config;

};
