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
					OLSKRoutingLanguage: languageCode,
					WIKWriteDetailItem: JSON.stringify({
						WKCNoteBody: 'alfa',
					}),
				});
			});

			it('localizes WIKWriteDetailToolbarBackButton', function () {
				browser.assert.text(WIKWriteDetailToolbarBackButton, uLocalized('WIKWriteDetailToolbarBackButtonText'));
			});

			it('localizes WIKWriteDetailToolbarPublishButton', function () {
				browser.assert.attribute(WIKWriteDetailToolbarPublishButton, 'title', uLocalized('WIKWriteDetailToolbarPublishButtonText'));
			});

			it('localizes WIKWriteDetailToolbarVersionsButton', function () {
				browser.assert.attribute(WIKWriteDetailToolbarVersionsButton, 'title', uLocalized('WIKWriteDetailToolbarVersionsButtonText'));
			});

			it('localizes WIKWriteDetailToolbarDiscardButton', function () {
				browser.assert.attribute(WIKWriteDetailToolbarDiscardButton, 'title', uLocalized('WIKWriteDetailToolbarDiscardButtonText'));
			});

			context('discard', function () {
			
				it('localizes WIKWriteDetailDiscardPrompt', async function() {
					deepEqual((await browser.OLSKConfirm(async function () {
						browser.pressButton(WIKWriteDetailToolbarDiscardButton);
					})).question, uLocalized('WIKWriteDetailDiscardPromptText'));
				});
		
			});

			context('WKCNotePublishStatusIsPublished', function() {

				before(function() {
					return browser.OLSKVisit(kDefaultRoute, {
						OLSKRoutingLanguage: languageCode,
						WIKWriteDetailItem: JSON.stringify({
							WKCNoteBody: 'alfa',
							WKCNotePublishStatusIsPublished: true,
							WKCNotePublicID: 'bravo',
						}),
					});
				});

				it('localizes WIKWriteDetailToolbarPublicLink', function () {
					browser.assert.text(WIKWriteDetailToolbarPublicLink, uLocalized('WIKWriteDetailToolbarPublicLinkText'));
				});

				it('localizes WIKWriteDetailToolbarRetractButton', function () {
					browser.assert.attribute(WIKWriteDetailToolbarRetractButton, 'title', uLocalized('WIKWriteDetailToolbarRetractButtonText'));
				});

			});
		
		});

	});

});
