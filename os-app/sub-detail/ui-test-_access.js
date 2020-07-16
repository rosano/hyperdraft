const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteDetail: '.KVCWriteDetail',
	
	KVCWriteDetailToolbar: '.KVCWriteDetailToolbar',
	KVCWriteDetailToolbarBackButton: '.KVCWriteDetailToolbarBackButton',
	KVCWriteDetailToolbarBackButtonImage: '.KVCWriteDetailToolbarBackButtonImage',
	KVCWriteDetailToolbarJumpButton: '.KVCWriteDetailToolbarJumpButton',
	KVCWriteDetailToolbarJumpButtonImage: '.KVCWriteDetailToolbarJumpButtonImage',
	KVCWriteDetailToolbarArchiveButton: '.KVCWriteDetailToolbarArchiveButton',
	KVCWriteDetailToolbarArchiveButtonImage: '.KVCWriteDetailToolbarArchiveButtonImage',
	KVCWriteDetailToolbarUnarchiveButton: '.KVCWriteDetailToolbarUnarchiveButton',
	KVCWriteDetailToolbarUnarchiveButtonImage: '.KVCWriteDetailToolbarUnarchiveButtonImage',
	KVCWriteDetailToolbarConnectButton: '.KVCWriteDetailToolbarConnectButton',
	KVCWriteDetailToolbarConnectButtonImage: '.KVCWriteDetailToolbarConnectButtonImage',
	KVCWriteDetailToolbarIsRootPage: '.KVCWriteDetailToolbarIsRootPage',
	KVCWriteDetailToolbarPublishButton: '.KVCWriteDetailToolbarPublishButton',
	KVCWriteDetailToolbarPublishButtonImage: '.KVCWriteDetailToolbarPublishButtonImage',
	KVCWriteDetailToolbarPublicLink: '.KVCWriteDetailToolbarPublicLink',
	KVCWriteDetailToolbarRetractButton: '.KVCWriteDetailToolbarRetractButton',
	KVCWriteDetailToolbarRetractButtonImage: '.KVCWriteDetailToolbarRetractButtonImage',
	KVCWriteDetailToolbarVersionsButton: '.KVCWriteDetailToolbarVersionsButton',
	KVCWriteDetailToolbarVersionsButtonImage: '.KVCWriteDetailToolbarVersionsButtonImage',
	KVCWriteDetailToolbarDiscardButton: '.KVCWriteDetailToolbarDiscardButton',	
	KVCWriteDetailToolbarDiscardButtonImage: '.KVCWriteDetailToolbarDiscardButtonImage',	
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWriteDetail_Access', function () {
	
	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KVCWriteDetail', function () {
		browser.assert.elements(KVCWriteDetail, 1);
	});

	it('shows OLSKDetailPlaceholder', function () {
		browser.assert.elements('.OLSKDetailPlaceholder', 1);
	});

	it('hides KVCWriteDetailToolbar', function () {
		browser.assert.elements(KVCWriteDetailToolbar, 0);
	});

	it('hides KVCWriteInput', function () {
		browser.assert.elements('.KVCWriteInput', 0);
	});

	it('hides KVCWriteDetailLauncherItemSetAsRootPage', function () {
		return browser.assert.OLSKLauncherItems('KVCWriteDetailLauncherItemSetAsRootPage', 0);
	});

	context('KVCWriteDetailItem', function() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
			});
		});

		it('hides OLSKDetailPlaceholder', function () {
			browser.assert.elements('.OLSKDetailPlaceholder', 0);
		});

		it('shows OLSKToolbar', function () {
			browser.assert.elements('.OLSKToolbar', 1);
		});

		it('shows KVCWriteDetailToolbar', function () {
			browser.assert.elements(KVCWriteDetailToolbar, 1);
		});

		it('shows KVCWriteDetailToolbarBackButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarBackButton, 1);
		});

		it('shows KVCWriteDetailToolbarBackButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarBackButtonImage, 1);
		});

		it('shows KVCWriteDetailToolbarJumpButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarJumpButton, 1);
		});

		it('shows KVCWriteDetailToolbarJumpButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarJumpButtonImage, 1);
		});

		it('shows KVCWriteDetailToolbarArchiveButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarArchiveButton, 1);
		});

		it('shows KVCWriteDetailToolbarArchiveButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarArchiveButtonImage, 1);
		});

		it('hides KVCWriteDetailToolbarUnarchiveButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarUnarchiveButton, 0);
		});

		it('shows KVCWriteDetailToolbarConnectButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarConnectButton, 1);
		});

		it('shows KVCWriteDetailToolbarConnectButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarConnectButtonImage, 1);
		});

		it('hides KVCWriteDetailToolbarIsRootPage', function () {
			browser.assert.elements(KVCWriteDetailToolbarIsRootPage, 0);
		});

		it('hide KVCWriteDetailToolbarPublishButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublishButton, 0);
		});

		it('hide KVCWriteDetailToolbarPublishButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublishButtonImage, 0);
		});

		it('hides KVCWriteDetailToolbarPublicLink', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublicLink, 0);
		});

		it('hides KVCWriteDetailToolbarRetractButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarRetractButton, 0);
		});

		it('shows KVCWriteDetailToolbarVersionsButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarVersionsButton, 1);
		});

		it('shows KVCWriteDetailToolbarVersionsButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarVersionsButtonImage, 1);
		});

		it('shows KVCWriteDetailToolbarDiscardButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarDiscardButton, 1);
		});

		it('shows KVCWriteDetailToolbarDiscardButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarDiscardButtonImage, 1);
		});

		it('shows KVCWriteInput', function () {
			browser.assert.elements('.KVCWriteInput', 1);
		});

		it('shows KVCWriteDetailLauncherItemArchive', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteDetailLauncherItemArchive', 1);
		});

		it('hides KVCWriteDetailLauncherItemUnarchive', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteDetailLauncherItemUnarchive', 0);
		});
		
	});

	context('KVCNoteIsArchived', function() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(Object.assign(StubNoteObjectValid(), {
					KVCNoteIsArchived: true,
				})),
				KVCWriteDetailConnected: true,
			});
		});

		it('hides KVCWriteDetailToolbarArchiveButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarArchiveButton, 0);
		});

		it('shows KVCWriteDetailToolbarUnarchiveButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarUnarchiveButton, 1);
		});

		it('shows KVCWriteDetailToolbarUnarchiveButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarUnarchiveButtonImage, 1);
		});

		it('hides KVCWriteDetailLauncherItemArchive', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteDetailLauncherItemArchive', 0);
		});

		it('shows KVCWriteDetailLauncherItemUnarchive', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteDetailLauncherItemUnarchive', 1);
		});

	});

	context('KVCWriteDetailConnected', function () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
				KVCWriteDetailConnected: true,
			});
		});

		it('shows KVCWriteDetailToolbarPublishButton', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublishButton, 1);
		});

		it('shows KVCWriteDetailToolbarPublishButtonImage', function () {
			browser.assert.elements(KVCWriteDetailToolbarPublishButtonImage, 1);
		});

		it('shows KVCWriteDetailLauncherItemSetAsRootPage', function () {
			return browser.assert.OLSKLauncherItems('KVCWriteDetailLauncherItemSetAsRootPage', 1);
		});

		context('KVCNoteIsPublic', function() {

			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					KVCWriteDetailItem: JSON.stringify(Object.assign(StubNoteObjectValid(), {
						KVCNoteIsPublic: true,
						KVCNotePublishDate: new Date(),
						KVCNotePublicID: 'bravo',
					})),
					KVCWriteDetailConnected: true,
				});
			});

			it('hides KVCWriteDetailToolbarPublishButton', function () {
				browser.assert.elements(KVCWriteDetailToolbarPublishButton, 0);
			});

			it('shows KVCWriteDetailToolbarPublicLink', function () {
				browser.assert.elements(KVCWriteDetailToolbarPublicLink, 1);
			});

			it('shows KVCWriteDetailToolbarRetractButton', function () {
				browser.assert.elements(KVCWriteDetailToolbarRetractButton, 1);
			});

			it('shows KVCWriteDetailToolbarRetractButtonImage', function () {
				browser.assert.elements(KVCWriteDetailToolbarRetractButtonImage, 1);
			});

		});

	});

	context('KVCWriteDetailItemIsRootPage', function () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
				KVCWriteDetailItemIsRootPage: true,
			});
		});

		it('shows KVCWriteDetailToolbarIsRootPage', function () {
			browser.assert.elements(KVCWriteDetailToolbarIsRootPage, 1);
		});

	});

});
