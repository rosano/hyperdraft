const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCVitrine_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('KVCVitrine', function () {
		
		it('classes OLSKCommon', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKCommon');
		});

		it('classes OLSKCommonCapped', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKCommonCapped');
		});
	
	});

	describe('KVCVitrineCrown', function test_KVCVitrineCrown() {

		it('classes OLSKCommonCard', function () {
			browser.assert.hasClass(KVCVitrineCrown, 'OLSKCommonCard');
		});

		it('classes OLSKCommonCrownCard', function () {
			browser.assert.hasClass(KVCVitrineCrown, 'OLSKCommonCrownCard');
		});
		
	});

	describe('KVCVitrineCrownIcon', function () {

		it('sets role', function () {
			browser.assert.attribute(KVCVitrineCrownIcon, 'role', 'presentation');
		});

		it('sets src', function () {
			browser.assert.attribute(KVCVitrineCrownIcon, 'src', '/_shared/KVCRootLink/ui-assets/identity.svg');
		});

	});

	describe('KVCVitrineVideo1', function () {

		it('sets src', function () {
			browser.assert.attribute(KVCVitrineVideo1, 'src', process.env.KVC_VITRINE_VIDEO_URL_1);
		});

		it('sets allowfullscreen', function () {
			browser.assert.attribute(KVCVitrineVideo1, 'allowfullscreen', '');
		});

	});

	describe('KVCVitrineVideo2', function () {

		it('sets src', function () {
			browser.assert.attribute(KVCVitrineVideo2, 'src', process.env.KVC_VITRINE_VIDEO_URL_2);
		});

		it('sets allowfullscreen', function () {
			browser.assert.attribute(KVCVitrineVideo1, 'allowfullscreen', '');
		});

	});

});
