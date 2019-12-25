import { deepEqual } from 'assert';

describe('KVCRef_Misc', function () {

	const stubURL = function (inputData, host = 'loc.tests') {
		return `http://${ host }${ typeof inputData === 'string' ? inputData : inputData.OLSKRoutePath }`
	};

	describe('KVCRefHomeRoute', function () {		

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

	describe('KVCRefReadRoute', function () {		

		context('other host', function () {

			it.skip('sets status', async function() {
				deepEqual((await browser.fetch(stubURL('/1'))).status, 404);
			});
		
		});		

		context('KVC_SHARED_REF_HOST', function () {

			it.skip('sets status', async function() {
				deepEqual((await browser.fetch(stubURL('/1', process.env.KVC_SHARED_REF_HOST))).status, 200);
			});
		
		});
		
	});

});
