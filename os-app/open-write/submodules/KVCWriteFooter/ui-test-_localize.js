import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`KVCWriteFooter_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});
	
		it('localizes KVCWriteFooterDonateLink', function() {
			browser.assert.text(KVCWriteFooterDonateLink, uLocalized('KVCWriteFooterDonateLinkText'));
		});
	
		it('localizes KVCWriteFooterStorageButton', function() {
			browser.assert.attribute(KVCWriteFooterStorageButton, 'title', uLocalized('KVCWriteFooterStorageButtonText'));
		});

	});

});
