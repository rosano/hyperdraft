import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe.only('KVCWrite_Ref', function () {

	const stubURL = function (inputData, host = 'loc.tests') {
		return `http://${ host }:3000${ typeof inputData === 'string' ? inputData : inputData.OLSKRoutePath }`
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
				return browser.OLSKVisit(kDefaultRoute);
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

			it('shows KVCWriteDetailToolbarPublishButton', function () {
				browser.assert.elements(KVCWriteDetailToolbarPublishButton, 1);
			});
		
		});

		context('other host', function () {

			before(function() {
				return browser.OLSKVisit(kDefaultRoute);
			});

			before(function () {
				return browser.pressButton('.KVCWriteMasterCreateButton');
			});

			it('hides KVCWriteDetailToolbarPublishButton', function () {
				browser.assert.elements('.KVCWriteDetailToolbarPublishButton', 0);
			});
		
		});		
		
	});

});
