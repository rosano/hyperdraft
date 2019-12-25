import { deepEqual } from 'assert';

describe('KVCRef_Misc', function () {

	const stubURL = function (inputData, host = 'loc.tests') {
		return `http://${ host }${ inputData.OLSKRoutePath}`
	};

	describe.only('KVCRefHomeRoute', function () {		

		context('other host', function () {

			it.skip('sets status', async function() {
				deepEqual((await browser.fetch(stubURL(require('./controller.js').OLSKControllerRoutes().KVCRefHomeRoute))).status, 307);
			});
			
			it('redirects', async function() {
				deepEqual((await browser.fetch(stubURL(require('./controller.js').OLSKControllerRoutes().KVCRefHomeRoute))).url, stubURL(require('../open-write/controller.js').OLSKControllerRoutes().shift()));
			});
		
		});		

		context('KVC_SHARED_REF_HOST', function () {

			it('sets status', async function() {
				deepEqual((await browser.fetch(stubURL(require('./controller.js').OLSKControllerRoutes().KVCRefHomeRoute, process.env.KVC_SHARED_REF_HOST))).status, 200);
			});
			
			it('renders', async function() {
				deepEqual((await browser.fetch(stubURL(require('./controller.js').OLSKControllerRoutes().KVCRefHomeRoute, process.env.KVC_SHARED_REF_HOST))).url, stubURL(require('./controller.js').OLSKControllerRoutes().KVCRefHomeRoute, process.env.KVC_SHARED_REF_HOST));
			});
		
		});
		
	});

});
