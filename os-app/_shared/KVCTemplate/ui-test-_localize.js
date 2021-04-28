const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe('KVCTemplate_Localize-' + OLSKRoutingLanguage, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
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
