import { deepEqual } from 'assert';

describe('KVCCommon_Access', function testKVCCommon_Access () {

	it('redirects KVCCommonIdentityRedirect', async function() {
		deepEqual((await (await browser.fetch('http://loc.tests' + OLSKTestingCanonicalFor(require('./controller.js').OLSKControllerRoutes().KVCCommonIdentityRedirect.OLSKRoutePath))).text()).slice(0, 10), '<?xml vers')
	});

});
