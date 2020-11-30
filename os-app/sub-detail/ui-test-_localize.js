const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (languageCode) {

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

			it('localizes KVCWriteDetailToolbarArchiveButton', function () {
				browser.assert.attribute(KVCWriteDetailToolbarArchiveButton, 'title', uLocalized('KVCWriteDetailToolbarArchiveButtonText'));
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

			it('localizes KVCWriteDetailLauncherItemArchive', function () {
				return browser.assert.OLSKLauncherItemText('KVCWriteDetailLauncherItemArchive', uLocalized('KVCWriteDetailToolbarArchiveButtonText'));
			});

			context('connect', function () {
			
				it('localizes KVCWriteDetailConnectConfirm', function() {
					browser.assert.OLSKConfirmQuestion(function () {
						return browser.pressButton(KVCWriteDetailToolbarConnectButton);
					}, uLocalized('OLSKRemoteStorageConnectConfirmText'));
				});
		
			});

			context('discard', function () {
			
				it('localizes KVCWriteDetailDiscardConfirm', function() {
					browser.assert.OLSKConfirmQuestion(function () {
						return browser.pressButton(KVCWriteDetailToolbarDiscardButton);
					}, uLocalized('KVCWriteDetailDiscardConfirmText'));
				});
		
			});

			context('KVCNoteModelIsArchived', function() {

				before(function() {
					return browser.OLSKVisit(kDefaultRoute, {
						OLSKRoutingLanguage: languageCode,
						KVCWriteDetailItem: JSON.stringify(Object.assign(StubNoteObjectValid(), {
							KVCNoteIsArchived: true,
						})),
					});
				});

				it('localizes KVCWriteDetailToolbarUnarchiveButton', function () {
					browser.assert.attribute(KVCWriteDetailToolbarUnarchiveButton, 'title', uLocalized('KVCWriteDetailToolbarUnarchiveButtonText'));
				});

				it('localizes KVCWriteDetailLauncherItemUnarchive', function () {
					return browser.assert.OLSKLauncherItemText('KVCWriteDetailLauncherItemUnarchive', uLocalized('KVCWriteDetailToolbarUnarchiveButtonText'));
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

				it('localizes KVCWriteDetailLauncherItemSetAsRootPage', function () {
					return browser.assert.OLSKLauncherItemText('KVCWriteDetailLauncherItemSetAsRootPage', uLocalized('KVCWriteDetailLauncherItemSetAsRootPageText'));
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
		
		});

	});

});
