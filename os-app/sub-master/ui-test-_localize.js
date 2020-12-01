const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe(`KVCWriteMaster_Localize-${ OLSKRoutingLanguage }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
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
					OLSKRoutingLanguage,
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
