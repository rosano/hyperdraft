const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCFeatureList: '.KVCFeatureList',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCFeatureList_Access', function () {
	
	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	it('shows KVCFeatureList', function() {
		browser.assert.elements(KVCFeatureList, 1);
	});
	
	it('shows OLSKFeatureList', function() {
		browser.assert.elements('.OLSKFeatureList', 1);
	});
	
});
