const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCGuide_Misc', function () {

	before(function () {
		return browser.OLSKVisit(kDefaultRoute);
	});

	context('KVCGuide', function () {
		
		it('classes OLSKCommon', function () {
			browser.assert.hasClass(KVCGuide, 'OLSKCommon');
		});

		it('classes OLSKCommonCapped', function () {
			browser.assert.hasClass(KVCGuide, 'OLSKCommonCapped');
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
