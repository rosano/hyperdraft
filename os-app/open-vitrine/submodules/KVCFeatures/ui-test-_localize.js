const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe(`KVCFeatures_Localize-${ OLSKRoutingLanguage }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		uLocalized('KVCFeaturesArray').forEach(function ([name, blurb], i) {

			it('localizes KOMVitrineStandardFeaturesItem', function () {
				browser.assert.text(`${ KVCFeaturesItem }:nth-child(${ i + 1 }) ${ KVCFeaturesItemName }`, name);
			});

			it('localizes KOMVitrineStandardFeaturesBlurb', function () {
				browser.assert.text(`${ KVCFeaturesItem }:nth-child(${ i + 1 }) ${ KVCFeaturesItemBlurb }`, blurb);
			});
			
		});

	});

});
