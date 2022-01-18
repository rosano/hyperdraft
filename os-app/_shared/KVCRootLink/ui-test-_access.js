const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCRootLink: '.KVCRootLink',
}).map(function (e) {
	return global[e.shift()] = e.pop();
});

describe('KVCRootLink_Access', function () {
	
	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	it('shows KVCRootLink', function() {
		browser.assert.elements(KVCRootLink, 1);
	});
	
	it('shows OLSKRootLink', function() {
		browser.assert.elements('.OLSKRootLink', 1);
	})
	
});
