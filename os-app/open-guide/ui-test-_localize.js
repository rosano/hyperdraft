const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute._OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe(`KVCGuide_Localize-${ OLSKRoutingLanguage }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		it('localizes title', function() {
			browser.assert.text('title', uLocalized('KVCGuideTitle'));
		});

		it('localizes meta[description]', function() {
			browser.assert.attribute('meta[name=description]', 'content', uLocalized('KVCGuideDescription'));
		});

		it('localizes KVCGuideCrownName', function () {
			browser.assert.text(KVCGuideCrownName, uLocalized('KVCGuideTitle'));
		});

	});

});
