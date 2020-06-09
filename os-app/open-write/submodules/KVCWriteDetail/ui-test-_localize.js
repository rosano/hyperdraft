const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguages.forEach(function (languageCode) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, languageCode);
	};

	describe(`KVCWriteDetail_Localize-${ languageCode }`, function () {

		context('KVCWriteDetailItem', function() {
		
			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKRoutingLanguage: languageCode,
					KVCWriteDetailItem: JSON.stringify({
						KVCNoteBody: 'alfa',
					}),
				});
			});

			it('localizes KVCWriteDetailToolbarBackButton', function () {
				browser.assert.attribute(KVCWriteDetailToolbarBackButton, 'title', uLocalized('KVCWriteDetailToolbarBackButtonText'));
			});

			it('localizes KVCWriteDetailToolbarJumpButton', function () {
				browser.assert.attribute(KVCWriteDetailToolbarJumpButton, 'title', uLocalized('KVCWriteDetailToolbarJumpButtonText'));
			});

			it('localizes KVCWriteDetailToolbarPublishButton', function () {
				browser.assert.attribute(KVCWriteDetailToolbarPublishButton, 'title', uLocalized('KVCWriteDetailToolbarPublishButtonText'));
			});

			it('localizes KVCWriteDetailToolbarVersionsButton', function () {
				browser.assert.attribute(KVCWriteDetailToolbarVersionsButton, 'title', uLocalized('KVCWriteDetailToolbarVersionsButtonText'));
			});

			it('localizes KVCWriteDetailToolbarDiscardButton', function () {
				browser.assert.attribute(KVCWriteDetailToolbarDiscardButton, 'title', uLocalized('KVCWriteDetailToolbarDiscardButtonText'));
			});

			context('discard', function () {
			
				it('localizes KVCWriteDetailDiscardPrompt', function() {
					browser.assert.OLSKConfirmQuestion(function () {
						return browser.pressButton(KVCWriteDetailToolbarDiscardButton);
					}, uLocalized('KVCWriteDetailDiscardPromptText'));
				});
		
			});

			context('KVCNotePublishStatusIsPublished', function() {

				before(function() {
					return browser.OLSKVisit(kDefaultRoute, {
						OLSKRoutingLanguage: languageCode,
						KVCWriteDetailItem: JSON.stringify({
							KVCNoteBody: 'alfa',
							KVCNotePublishStatusIsPublished: true,
							KVCNotePublicID: 'bravo',
						}),
					});
				});

				it('localizes KVCWriteDetailToolbarPublicLink', function () {
					browser.assert.text(KVCWriteDetailToolbarPublicLink, uLocalized('KVCWriteDetailToolbarPublicLinkText'));
				});

				it('localizes KVCWriteDetailToolbarRetractButton', function () {
					browser.assert.attribute(KVCWriteDetailToolbarRetractButton, 'title', uLocalized('KVCWriteDetailToolbarRetractButtonText'));
				});

			});
		
		});

	});

});
