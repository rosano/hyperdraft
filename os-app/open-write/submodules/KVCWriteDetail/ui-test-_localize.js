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
					KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
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
						KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
						KVCWriteDetailConnected: true,
					});
				});

				it('localizes KVCWriteDetailToolbarPublishButton', function () {
					browser.assert.attribute(KVCWriteDetailToolbarPublishButton, 'title', uLocalized('KVCWriteDetailToolbarPublishButtonText'));
				});

				context('KVCNoteModelIsPublic', function() {

					before(function() {
						return browser.OLSKVisit(kDefaultRoute, {
							OLSKRoutingLanguage: languageCode,
							KVCWriteDetailItem: JSON.stringify(Object.assign(StubNoteObjectValid(), {
								KVCNoteIsPublic: true,
								KVCNotePublishDate: new Date(),
								KVCNotePublicID: 'bravo',
							})),
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

			context('KVCWriteDetailItemIsRootPage', function() {

				before(function() {
					return browser.OLSKVisit(kDefaultRoute, {
						OLSKRoutingLanguage: languageCode,
						KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
						KVCWriteDetailItemIsRootPage: true,
					});
				});

				it('localizes KVCWriteDetailToolbarIsRootPage', function () {
					browser.assert.text(KVCWriteDetailToolbarIsRootPage, uLocalized('KVCWriteDetailToolbarIsRootPageText'));
				});

			});

			describe('KVCWriteDetailLauncherItemSetAsRootPage', function test_KVCWriteDetailLauncherItemSetAsRootPage() {
				
				before(function() {
					return browser.OLSKVisit(kDefaultRoute, {
						OLSKRoutingLanguage: languageCode,
						KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
						KVCWriteDetailConnected: true,
					});
				});

				before(function () {
					return browser.pressButton('.OLSKAppToolbarLauncherButton');
				});

				before(function () {
					return browser.fill('.LCHLauncherFilterInput', 'KVCWriteDetailLauncherItemSetAsRootPage');
				});

				it('localizes KVCWriteDetailLauncherItemSetAsRootPage', function () {
					browser.assert.text('.LCHLauncherPipeItem', uLocalized('KVCWriteDetailLauncherItemSetAsRootPageText'));
				});

			});
		
		});

	});

});
