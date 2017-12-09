const jsdom = require('jsdom');

const dom = new jsdom.JSDOM('<html><body></body></html>', { pretendToBeVisual: true });

global.document = dom.window.document;
global.window = dom.window;
