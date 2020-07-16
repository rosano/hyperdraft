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
	
		it.skip('localizes KVCWriteMasterFilterField', function () {
			browser.assert.attribute(KVCWriteMasterFilterField, 'placeholder', uLocalized('KVCWriteMasterFilterFieldText'));
		});
	
		it('localizes KVCWriteMasterCreateButton', function () {
			browser.assert.attribute(KVCWriteMasterCreateButton, 'title', uLocalized('KVCWriteMasterCreateButtonText'));
		});


		context('KVCWriteMasterRevealArchiveIsVisible', function() {
			
			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKRoutingLanguage: languageCode,
					KVCWriteMasterListItems: JSON.stringify([]),
					KVCWriteMasterRevealArchiveIsVisible: true,
				});
			});

			it('localizes KVCWriteMasterRevealArchiveButton', function () {
				browser.assert.text(KVCWriteMasterRevealArchiveButton, uLocalized('KVCWriteMasterRevealArchiveButtonText'));
			});
			
		});

	});

});
