import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCRootLink: '.KVCRootLink',
	
	KVCRootLinkLogo: '.KVCRootLinkLogo',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCRootLink_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});
	
	it('shows KVCRootLink', function() {
		browser.assert.elements(KVCRootLink, 1);
	});
	
	it('shows KVCRootLinkLogo', function() {
		browser.assert.elements(KVCRootLinkLogo, 1);
	});

});
