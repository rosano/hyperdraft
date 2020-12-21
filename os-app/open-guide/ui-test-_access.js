const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCGuide: '.KVCGuide',

	KVCGuideCrown: '.KVCGuideCrown',
	KVCGuideCrownName: '.KVCGuideCrownName',

	KVCGuideContent: '.KVCGuideContent',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCGuide_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KVCGuide', function () {
		browser.assert.elements(KVCGuide, 1);
	});

	it('shows KVCGuideCrown', function () {
		browser.assert.elements(KVCGuideCrown, 1);
	});

	it('shows KVCGuideCrownName', function () {
		browser.assert.elements(KVCGuideCrownName, 1);
	});

	it('shows KVCGuideContent', function () {
		browser.assert.elements(KVCGuideContent, 1);
	});

	it('shows KVCRootLink', function () {
		browser.assert.elements('.KVCRootLink', 1);
	});

});
