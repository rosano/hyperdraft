const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCVitrine_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	it('sets manifest', function () {
		browser.assert.attribute('link[rel="manifest"]', 'href', require('../tech-manifest/controller.js').OLSKControllerRoutes().shift().OLSKRoutePath);
	});

	describe('KVCVitrine', function () {
		
		it('classes OLSKDecor', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKDecorCapped');
		});
	
	});

	describe('OLSKCrown', function test_OLSKCrown () {

		it('sets OLSKCrownCardImageURL', function () {
			browser.assert.attribute('.OLSKCrownCardImage', 'src', '/_shared/KVCRootLink/ui-assets/identity.svg');
		});
	
	});

	context('OLSKAppFeaturesList', function test_OLSKAppFeaturesList () {

		it('shows OLSKAppFeatureOpenSource', function () {
			browser.assert.attribute('.OLSKAppFeatureListItemOpenSource a', 'href', process.env.OLSK_REPO_URL);
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

	describe('OLSKEdit', function test_OLSKEdit () {

		it('sets OLSKEditURL', function () {
			browser.assert.attribute('.OLSKEdit', 'href', process.env.OLSK_REPO_URL);
		});

	});

	describe('ROCOGazette', function test_ROCOGazette () {

		it('sets ROCOBulletinProject', function () {
			browser.assert.attribute('.ROCOBulletinProjectField', 'value', 'RP_003');
		});

	});

});
