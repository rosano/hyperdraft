import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`WKCWriteFooter_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});
	
		it('localizes WKCWriteFooterDonateLink', function() {
			browser.assert.text(WKCWriteFooterDonateLink, uLocalized('WKCWriteFooterDonateLinkText'));
		});
	
		it('localizes WKCWriteFooterStorageButton', function() {
			browser.assert.attribute(WKCWriteFooterStorageButton, 'title', uLocalized('WKCWriteFooterStorageButtonText'));
		});

	});

});
