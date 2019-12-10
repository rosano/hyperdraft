import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCRootLink_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	describe('KVCRootLinkLogo', function () {
		
		it('sets role', function () {
			browser.assert.attribute(KVCRootLinkLogo, 'role', 'img');
		});
	
		it('sets src', function () {
			browser.assert.attribute(KVCRootLinkLogo, 'src', '/_shared/KVCRootLink/ui-assets/identity.svg');
		});
	
	});

});
