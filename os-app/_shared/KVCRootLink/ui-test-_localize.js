require('./controller.js').OLSKControllerRoutes().forEach(function (kDefaultRoute) {

	kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

		const uLocalized = function (inputData) {
			return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
		};

		describe(`KVCRootLink_Localize-${ kDefaultRoute.OLSKRouteSignature }-${ OLSKRoutingLanguage }`, function () {

			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKRoutingLanguage,
				});
			});

			it('localizes OLSKRootLink', function() {
				browser.assert.attribute('.OLSKRootLink', 'href', OLSKTestingCanonical(require('../../open-vitrine/controller.js').OLSKControllerRoutes().shift(), {
					OLSKRoutingLanguage,
				}));
			});

		});

	});

});
