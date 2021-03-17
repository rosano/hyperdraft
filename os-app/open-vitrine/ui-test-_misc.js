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

	describe('KVCVitrineManifest', function test_KVCVitrineManifest() {

		it('sets href', function () {
			browser.assert.attribute(KVCVitrineManifest, 'href', require('../tech-manifest/controller.js').OLSKControllerRoutes().shift().OLSKRoutePath);
		});

	});

	describe('KVCVitrineCrown', function test_KVCVitrineCrown() {

		it('classes OLSKCommonCard', function () {
			browser.assert.hasClass(KVCVitrineCrown, 'OLSKCommonCard');
		});

		it('classes OLSKCommonCrownCardMini', function () {
			browser.assert.hasClass(KVCVitrineCrown, 'OLSKCommonCrownCardMini');
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

	context('OLSKLanding', function test_OLSKLanding () {

		it('sets OLSKLandingActionHref', function () {
			browser.assert.attribute('.OLSKLandingAction', 'href', OLSKTestingCanonical(require('../open-write/controller.js').OLSKControllerRoutes().shift()));
		});
	
	});

	context('KVCVitrineGuideButton', function test_KVCVitrineGuideButton () {

		it('classes OLSKDecorPress', function () {
			browser.assert.hasClass(KVCVitrineGuideButton, 'OLSKDecorPress');
		});
		
		it('classes OLSKDecorPressCall', function () {
			browser.assert.hasClass(KVCVitrineGuideButton, 'OLSKDecorPressCall');
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

	describe('OLSKGazette', function test_OLSKGazette () {

		it('sets src', function () {
			browser.assert.attribute('.OLSKGazetteProjectField', 'value', 'RP_003');
		});

	});

});
