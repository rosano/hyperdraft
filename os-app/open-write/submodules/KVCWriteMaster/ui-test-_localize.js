import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`KVCWriteMaster_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});
	
		it('localizes KVCWriteMasterFilterField', function () {
			browser.assert.attribute(KVCWriteMasterFilterField, 'placeholder', uLocalized('KVCWriteMasterFilterFieldText'));
		});
	
		it('localizes KVCWriteMasterCreateButton', function () {
			browser.assert.attribute(KVCWriteMasterCreateButton, 'title', uLocalized('KVCWriteMasterCreateButtonText'));
		});

	});

});