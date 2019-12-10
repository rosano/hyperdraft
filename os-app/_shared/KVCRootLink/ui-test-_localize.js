import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const uFormatted = OLSKTestingStringWithFormat;

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`KVCRootLink_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});

		it('localizes title', function () {
			browser.assert.attribute(KVCRootLink, 'title', uFormatted(uLocalized('KVCSharedColonSeparatedFormat'), uLocalized('KVCRootLinkLogoLabel'), uLocalized('KVCRootLinkText')));
		});

		it('localizes href', function () {
			browser.assert.attribute(KVCRootLink, 'href', OLSKTestingCanonicalFor('/', {
				OLSKRoutingLanguage: languageCode,
			}));
		});

	});

});
