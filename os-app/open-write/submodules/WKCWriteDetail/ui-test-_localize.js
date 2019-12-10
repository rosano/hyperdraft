import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`WKCWriteDetail_Localize-${ languageCode }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage: languageCode,
			});
		});
	
		it('localizes WKCWriteDetailPlaceholder', function () {
			browser.assert.text(WKCWriteDetailPlaceholder, uLocalized('WKCWriteDetailPlaceholderText'));
		});

		context('WKCWriteDetailItem', function() {
		
			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKRoutingLanguage: languageCode,
					WKCWriteDetailItem: JSON.stringify({
						KVCNoteBody: 'alfa',
					}),
				});
			});

			it('localizes WKCWriteDetailToolbarBackButton', function () {
				browser.assert.attribute(WKCWriteDetailToolbarBackButton, 'title', uLocalized('WKCWriteDetailToolbarBackButtonText'));
			});

			it('localizes WKCWriteDetailToolbarJumpButton', function () {
				browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'title', uLocalized('WKCWriteDetailToolbarJumpButtonText'));
			});

			it('localizes WKCWriteDetailToolbarPublishButton', function () {
				browser.assert.attribute(WKCWriteDetailToolbarPublishButton, 'title', uLocalized('WKCWriteDetailToolbarPublishButtonText'));
			});

			it('localizes WKCWriteDetailToolbarVersionsButton', function () {
				browser.assert.attribute(WKCWriteDetailToolbarVersionsButton, 'title', uLocalized('WKCWriteDetailToolbarVersionsButtonText'));
			});

			it('localizes WKCWriteDetailToolbarDiscardButton', function () {
				browser.assert.attribute(WKCWriteDetailToolbarDiscardButton, 'title', uLocalized('WKCWriteDetailToolbarDiscardButtonText'));
			});

			context('discard', function () {
			
				it('localizes WKCWriteDetailDiscardPrompt', async function() {
					deepEqual((await browser.OLSKConfirm(async function () {
						browser.pressButton(WKCWriteDetailToolbarDiscardButton);
					})).question, uLocalized('WKCWriteDetailDiscardPromptText'));
				});
		
			});

			context('KVCNotePublishStatusIsPublished', function() {

				before(function() {
					return browser.OLSKVisit(kDefaultRoute, {
						OLSKRoutingLanguage: languageCode,
						WKCWriteDetailItem: JSON.stringify({
							KVCNoteBody: 'alfa',
							KVCNotePublishStatusIsPublished: true,
							KVCNotePublicID: 'bravo',
						}),
					});
				});

				it('localizes WKCWriteDetailToolbarPublicLink', function () {
					browser.assert.text(WKCWriteDetailToolbarPublicLink, uLocalized('WKCWriteDetailToolbarPublicLinkText'));
				});

				it('localizes WKCWriteDetailToolbarRetractButton', function () {
					browser.assert.attribute(WKCWriteDetailToolbarRetractButton, 'title', uLocalized('WKCWriteDetailToolbarRetractButtonText'));
				});

			});
		
		});

	});

});
