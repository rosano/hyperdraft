import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	WKCWriteJumpButton: '.WKCWriteJumpButton',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteJumpButton_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	it('shows WKCWriteJumpButton', function() {
		browser.assert.elements(WKCWriteJumpButton, 1);
	});
	
});
