const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCVitrine_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	it('assigns meta:viewport', function () {
		browser.assert.attribute('meta[name=viewport]', 'content', 'width=device-width');
	});

	describe('KVCVitrine', function () {
		
		it('classes OLSKCommon', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKCommon');
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

});
