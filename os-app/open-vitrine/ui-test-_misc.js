const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCVitrine_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('KVCVitrine', function () {
		
		it('classes OLSKDecor', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKDecorCapped');
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

	context('KVCVitrineAppButton', function test_KVCVitrineAppButton () {

		it('classes OLSKCommonButton', function () {
			browser.assert.hasClass(KVCVitrineAppButton, 'OLSKCommonButton');
		});
		
		it('classes OLSKCommonButtonPrimary', function () {
			browser.assert.hasClass(KVCVitrineAppButton, 'OLSKCommonButtonPrimary');
		});
		
		it('sets href', function () {
			browser.assert.attribute(KVCVitrineAppButton, 'href', OLSKTestingCanonical(require('../open-write/controller.js').OLSKControllerRoutes().shift()));
		});
	
	});

	context('KVCVitrineGuideButton', function test_KVCVitrineGuideButton () {

		it('classes OLSKCommonButton', function () {
			browser.assert.hasClass(KVCVitrineGuideButton, 'OLSKCommonButton');
		});
		
		it('classes OLSKCommonButtonPrimary', function () {
			browser.assert.hasClass(KVCVitrineGuideButton, 'OLSKCommonButtonPrimary');
		});
		
		it('sets href', function () {
			browser.assert.attribute(KVCVitrineGuideButton, 'href', OLSKTestingCanonical(require('../open-guide/controller.js').OLSKControllerRoutes().shift()));
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
