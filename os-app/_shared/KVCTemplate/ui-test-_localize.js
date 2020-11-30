const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`KVCTemplate_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});

		it('localizes KVCRootLink', function () {
			browser.assert.text(KVCRootLink, uLocalized('KVCRootLinkText'));
		});

		it('localizes KVCBacklinksHeading', function () {
			browser.assert.text(KVCBacklinksHeading, uLocalized('KVCBacklinksHeadingText'));
		});

	});

});
