const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCFeatures: '.KVCFeatures',
	
	KVCFeaturesItem: '.KVCFeaturesItem',
	KVCFeaturesItemIdentity: '.KVCFeaturesItemIdentity',
	KVCFeaturesItemName: '.KVCFeaturesItemName',
	KVCFeaturesItemBlurb: '.KVCFeaturesItemBlurb',
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
	
});
