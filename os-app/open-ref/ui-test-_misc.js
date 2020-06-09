describe('KVCRef_Misc', function () {

	const stubURL = function (inputData, host = 'loc.tests') {
		return `http://${ host }:${ process.env.OLSK_SERVER_PORT }${ typeof inputData === 'string' ? inputData : inputData.OLSKRoutePath }`;
	};

	describe('KVCRefHomeRoute', function () {		

		context('other host', function () {

			before(function () {
				return browser.visit(stubURL(require('./controller.js').OLSKControllerRoutes().KVCRefHomeRoute));
			});

			it('sets status', function () {
				browser.assert.redirected();
			});

			it('redirects', function() {
				browser.assert.url(stubURL(require('../open-write/controller.js').OLSKControllerRoutes().shift()));
			});

		});		

		context('KVC_SHARED_REF_HOST', function () {

			before(function () {
				return browser.visit(stubURL(require('./controller.js').OLSKControllerRoutes().KVCRefHomeRoute, process.env.KVC_SHARED_REF_HOST));
			});

			it('sets status', function () {
				browser.assert.status(200);
			});

			it('renders', function() {
				browser.assert.url(stubURL(require('./controller.js').OLSKControllerRoutes().KVCRefHomeRoute, process.env.KVC_SHARED_REF_HOST));
			});

		});
		
	});

	describe('KVCRefReadRoute', function () {		

		context('other host', function () {

			before(function () {
				return browser.visit(stubURL('/1'));
			});

			it('sets status', function () {
				browser.assert.status(404);
			});
		
		});		

		context('KVC_SHARED_REF_HOST', function () {

			before(function () {
				return browser.visit(stubURL('/1', process.env.KVC_SHARED_REF_HOST));
			});

			it('sets status', function () {
				browser.assert.success();
			});

		});
		
	});

});
