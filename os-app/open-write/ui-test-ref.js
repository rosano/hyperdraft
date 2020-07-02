const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWrite_Ref', function () {

	const stubURL = function (inputData, host) {
		return `http://${ host }:${ process.env.PORT }${ typeof inputData === 'string' ? inputData : inputData.OLSKRoutePath }`;
	};

	describe('KVCWriteDetailToolbarVersionsButton', function () {

		context('KVC_SHARED_REF_HOST', function () {

			before(function() {
				return browser.visit(stubURL(kDefaultRoute, process.env.KVC_SHARED_REF_HOST));
			});

			before(function () {
				return browser.pressButton('.KVCWriteMasterCreateButton');
			});

			it('shows KVCWriteDetailToolbarVersionsButton', function () {
				browser.assert.elements(KVCWriteDetailToolbarVersionsButton, 1);
			});
		
		});

		context('other host', function () {

			before(function() {
				return browser.visit(stubURL(kDefaultRoute, 'loc.tests'));
			});

			before(function () {
				return browser.pressButton('.KVCWriteMasterCreateButton');
			});

			it('hides KVCWriteDetailToolbarVersionsButton', function () {
				browser.assert.elements('.KVCWriteDetailToolbarVersionsButton', 0);
			});
		
		});		
		
	});

	describe('KVCWriteDetailToolbarPublishButton', function () {

		context('KVC_SHARED_REF_HOST', function () {

			before(function() {
				return browser.visit(stubURL(kDefaultRoute, process.env.KVC_SHARED_REF_HOST));
			});

			before(function () {
				return browser.pressButton('.KVCWriteMasterCreateButton');
			});

			before(function () {
				return browser.pressButton('.KVCWriteMasterCreateButton');
			});

			it('shows KVCWriteDetailToolbarConnectButton', function () {
				browser.assert.elements(KVCWriteDetailToolbarConnectButton, 1);
			});
		
		});

		context('other host', function () {

			before(function() {
				return browser.visit(stubURL(kDefaultRoute, 'loc.tests'));
			});

			before(function () {
				return browser.pressButton('.KVCWriteMasterCreateButton');
			});

			it('hides KVCWriteDetailToolbarConnectButton', function () {
				browser.assert.elements('.KVCWriteDetailToolbarConnectButton', 0);
			});
		
		});		
		
	});

});
