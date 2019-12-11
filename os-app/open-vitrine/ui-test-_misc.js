import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCVitrine_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('KVCVitrine', function () {
		
		it('sets class', function () {
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
