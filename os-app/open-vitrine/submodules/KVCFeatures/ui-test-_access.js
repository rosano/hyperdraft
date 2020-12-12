const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCFeatures: '.KVCFeatures',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCFeatures_Access', function () {
	
	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	it('shows KVCFeatures', function() {
		browser.assert.elements(KVCFeatures, 1);
	});
	
	it('shows OLSKFeatureList', function() {
		browser.assert.elements('.OLSKFeatureList', 1);
	});
	
});
