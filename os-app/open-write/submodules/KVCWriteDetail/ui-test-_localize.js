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

			it('localizes KVCWriteDetailToolbarConnectButton', function () {
				browser.assert.attribute(KVCWriteDetailToolbarConnectButton, 'title', uLocalized('KVCWriteDetailToolbarPublishButtonText'));
			});

			it('localizes KVCWriteDetailToolbarVersionsButton', function () {
				browser.assert.attribute(KVCWriteDetailToolbarVersionsButton, 'title', uLocalized('KVCWriteDetailToolbarVersionsButtonText'));
			});

			it('localizes KVCWriteDetailToolbarDiscardButton', function () {
				browser.assert.attribute(KVCWriteDetailToolbarDiscardButton, 'title', uLocalized('KVCWriteDetailToolbarDiscardButtonText'));
			});

			context('connect', function () {
			
				it('localizes KVCWriteDetailConnectConfirm', function() {
					browser.assert.OLSKConfirmQuestion(function () {
						return browser.pressButton(KVCWriteDetailToolbarConnectButton);
					}, uLocalized('KVCWriteDetailConnectConfirmText'));
				});
		
			});

			context('discard', function () {
			
				it('localizes KVCWriteDetailDiscardConfirm', function() {
					browser.assert.OLSKConfirmQuestion(function () {
						return browser.pressButton(KVCWriteDetailToolbarDiscardButton);
					}, uLocalized('KVCWriteDetailDiscardConfirmText'));
				});
		
			});

			context('KVCWriteDetailConnected', function() {

				before(function() {
					return browser.OLSKVisit(kDefaultRoute, {
						OLSKRoutingLanguage: languageCode,
						KVCWriteDetailItem: JSON.stringify({
							KVCNoteBody: 'alfa',
						}),
						KVCWriteDetailConnected: true,
					});
				});

				it('localizes KVCWriteDetailToolbarPublishButton', function () {
					browser.assert.attribute(KVCWriteDetailToolbarPublishButton, 'title', uLocalized('KVCWriteDetailToolbarPublishButtonText'));
				});

				context('KVCNoteIsPublic', function() {

					before(function() {
						return browser.OLSKVisit(kDefaultRoute, {
							OLSKRoutingLanguage: languageCode,
							KVCWriteDetailItem: JSON.stringify({
								KVCNoteBody: 'alfa',
								KVCNoteIsPublic: true,
								KVCNotePublicID: 'bravo',
							}),
							KVCWriteDetailConnected: true,
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

});
