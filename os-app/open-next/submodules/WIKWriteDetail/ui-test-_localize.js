import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`WIKWriteDetail_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});
	
		it('localizes WIKWriteDetailPlaceholder', function () {
			browser.assert.text(WIKWriteDetailPlaceholder, uLocalized('WIKWriteDetailPlaceholderText'));
		});

		context('WIKWriteDetailItem', function() {
		
			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					WIKWriteDetailItem: JSON.stringify({
						WKCNoteBody: 'alfa',
					}),
				});
			});

			before(function () {
				browser.pressButton('#TestWIKWriteDetailSetItem');
			});

			it('localizes WIKWriteDetailToolbarBackButton', function () {
				browser.assert.text(WIKWriteDetailToolbarBackButton, uLocalized('WIKWriteDetailToolbarBackButtonText'));
			});

			it('localizes WIKWriteDetailToolbarDiscardButton', function () {
				browser.assert.text(WIKWriteDetailToolbarDiscardButton, uLocalized('WIKWriteDetailToolbarDiscardButtonText'));
			});

			context('on discard', function () {
			
				it('localizes WIKWriteDetailDiscardPrompt', async function() {
					deepEqual((await browser.OLSKConfirm(async function () {
						browser.pressButton(WIKWriteDetailToolbarDiscardButton);
					})).question, uLocalized('WIKWriteDetailDiscardPromptText'));
				});
		
			});
		
		});

	});

});
