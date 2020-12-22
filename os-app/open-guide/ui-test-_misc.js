const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCGuide_Misc', function () {

	before(function () {
		return browser.OLSKVisit(kDefaultRoute);
	});

	context('KVCGuide', function () {
		
		it('classes OLSKDecor', function () {
			browser.assert.hasClass(KVCGuide, 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			browser.assert.hasClass(KVCGuide, 'OLSKDecorCapped');
		});
	
	});

	describe('KVCGuideCrown', function test_KVCGuideCrown() {

		it('classes OLSKCommonCard', function () {
			browser.assert.hasClass(KVCGuideCrown, 'OLSKCommonCard');
		});

		it('classes OLSKCommonCrownCard', function () {
			browser.assert.hasClass(KVCGuideCrown, 'OLSKCommonCrownCard');
		});
		
	});

});
