import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`KVCVitrine_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});

		it('localizes title', function() {
			browser.assert.text('title', uLocalized('KVCVitrineTitle'));
		});

		it('localizes description', function() {
			browser.assert.attribute('meta[name=description]', 'content', uLocalized('KVCVitrineDescription'));
		});

		it('localizes KVCVitrineIdentityName', function () {
			browser.assert.text(KVCVitrineIdentityName, uLocalized('KVCVitrineTitle'));
		});

		it('localizes KVCVitrineContent', function() {
			const item = require('OLSKString').OLSKStringReplaceTokens(require('fs').readFileSync(require('path').join(__dirname, `text.${ languageCode }.md`), 'utf-8'), {
				'_': '',
				'\n\n': '\n',
				'KVCVitrineDescription': uLocalized('KVCVitrineDescription'),
			});
			deepEqual(browser.query(KVCVitrineContent).textContent.trim().slice(0, 20), item.slice(0, 20));
		});

		it('localizes KVC_SHARED_GITHUB_URL', function() {
			browser.assert.element(`a[href="${ process.env.KVC_SHARED_GITHUB_URL }"]`);
		});

	});

});
