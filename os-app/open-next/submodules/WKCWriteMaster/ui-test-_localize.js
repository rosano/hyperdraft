import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`WKCWriteMaster_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});
	
		it('localizes WKCWriteMasterFilterField', function () {
			browser.assert.attribute(WKCWriteMasterFilterField, 'placeholder', uLocalized('WKCWriteMasterFilterFieldText'));
		});
	
		it('localizes WKCWriteMasterCreateButton', function () {
			browser.assert.text(WKCWriteMasterCreateButton, uLocalized('WKCWriteMasterCreateButtonText'));
		});

	});

});
