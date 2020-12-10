const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCVitrine_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('KVCVitrine', function () {
		
		it('classes OLSKCommon', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKCommon');
		});
	
	});

	describe('KVCVitrineIdentity', function test_KVCVitrineIdentity() {

		it('classes OLSKCommonCard', function () {
			browser.assert.hasClass(KVCVitrineIdentity, 'OLSKCommonCard');
		});

		it('classes OLSKCommonIdentityCard', function () {
			browser.assert.hasClass(KVCVitrineIdentity, 'OLSKCommonIdentityCard');
		});
		
	});

	describe('KVCVitrineIdentityLogo', function () {

		it('sets role', function () {
			browser.assert.attribute(KVCVitrineIdentityLogo, 'role', 'presentation');
		});

		it('sets src', function () {
			browser.assert.attribute(KVCVitrineIdentityLogo, 'src', '/_shared/KVCRootLink/ui-assets/identity.svg');
		});

	});

	describe('KVCVitrineVideoFrame', function () {

		it('sets src', function () {
			browser.assert.attribute(KVCVitrineVideoFrame, 'src', process.env.KVC_VITRINE_VIDEO_URL);
		});

		it('sets width', function () {
			browser.assert.attribute(KVCVitrineVideoFrame, 'width', '320');
		});

		it('sets height', function () {
			browser.assert.attribute(KVCVitrineVideoFrame, 'height', '300');
		});

		it('sets frameborder', function () {
			browser.assert.attribute(KVCVitrineVideoFrame, 'frameborder', '0');
		});

	});

});
