const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteDetail_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
		});
	});

	describe('KVCWriteDetailHeader', function test_KVCWriteDetailHeader () {

		it('classes OLSKMobileViewHeader', function () {
			browser.assert.hasClass(KVCWriteDetailHeader, 'OLSKMobileViewHeader');
		});
	
	});

	describe('KVCWriteDetailToolbar', function test_KVCWriteDetailToolbar () {

		it('classes OLSKToolbar', function () {
			browser.assert.hasClass(KVCWriteDetailToolbar, 'OLSKToolbar');
		});

		it('classes OLSKToolbarJustify', function () {
			browser.assert.hasClass(KVCWriteDetailToolbar, 'OLSKToolbarJustify');
		});
		
		it('classes OLSKCommonEdgeBottom', function () {
			browser.assert.hasClass(KVCWriteDetailToolbar, 'OLSKCommonEdgeBottom');
		});
		
	});

	describe('KVCWriteDetailToolbarBackButton', function test_KVCWriteDetailToolbarBackButton () {
		
		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarBackButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarBackButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarBackButton, 'OLSKToolbarButton');
		});

		it('classes OLSKVisibilityMobile', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarBackButton, 'OLSKVisibilityMobile');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchBack', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteDetailToolbarBackButton);
			});

			it('sends KVCWriteDetailDispatchBack', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchBack', '1');
			});
		
		});
	
	});

	describe('KVCWriteDetailToolbarBackButtonImage', function test_KVCWriteDetailToolbarBackButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarBackButtonImage } #_OLSKSharedBack`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarConnectButton', function test_KVCWriteDetailToolbarConnectButton () {
		
		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarConnectButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarConnectButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarConnectButton, 'OLSKToolbarButton');
		});

		context('click', function () {

			context('cancel', function () {
				
				before(function () {
					browser.assert.text('#TestKVCWriteDetailDispatchConnect', '0');
				});

				return browser.OLSKConfirm(function () {
					return browser.pressButton(KVCWriteDetailToolbarConnectButton);
				}, function (dialog) {
					dialog.response = false;

					return dialog;
				});

				it('does nothing', function () {
					browser.assert.text('#TestKVCWriteDetailDispatchConnect', '0');
				});
			
			});
			
			context('confirm', function () {
				
				before(function () {
					return browser.pressButton(KVCWriteDetailToolbarConnectButton);
				});

				it('sends KVCWriteDetailDispatchConnect', function () {
					browser.assert.text('#TestKVCWriteDetailDispatchConnect', '1');
				});
			
			});

		});
	
	});

	describe('KVCWriteDetailToolbarConnectButtonImage', function test_KVCWriteDetailToolbarConnectButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarConnectButtonImage } #_KVCWritePublish`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarPublishButton', function test_KVCWriteDetailToolbarPublishButton () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
				KVCWriteDetailConnected: true,
			});
		});

		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarPublishButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarPublishButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarPublishButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchPublish', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteDetailToolbarPublishButton);
			});

			it('sends KVCWriteDetailDispatchPublish', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchPublish', '1');
			});
		
		});
	
	});

	describe('KVCWriteDetailToolbarPublishButtonImage', function test_KVCWriteDetailToolbarPublishButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarPublishButtonImage } #_KVCWritePublish`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarPublicLink', function test_KVCWriteDetailToolbarPublicLink () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid({
					KVCNoteIsPublic: true,
					KVCNotePublishDate: new Date(),
					KVCNotePublicID: 'bravo',
				})),
				KVCWriteDetailConnected: true,
			});
		});

		it('sets target', function () {
			browser.assert.attribute(KVCWriteDetailToolbarPublicLink, 'target', '_blank');
		});

		it('sets href to KVCWriteDetailPublicURLFor', function () {
			browser.assert.attribute(KVCWriteDetailToolbarPublicLink, 'href', '[public]/bravo');
		});

	});

	describe('KVCWriteDetailToolbarRetractButton', function test_KVCWriteDetailToolbarRetractButton () {

		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarRetractButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarRetractButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarRetractButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchRetract', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteDetailToolbarRetractButton);
			});

			it('sends KVCWriteDetailDispatchRetract', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchRetract', '1');
			});
		
		});
	
	});

	describe('KVCWriteDetailToolbarRetractButtonImage', function test_KVCWriteDetailToolbarRetractButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarRetractButtonImage } #_KVCWriteRetract`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarJumpButton', function test_KVCWriteDetailToolbarJumpButton () {
		
		before(function() {
			// browser.fill('CodeMirror', 'bravo');
			browser.fill('.KVCWriteInputFieldDebug', '# bravo');
		});

		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarJumpButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarJumpButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarJumpButton, 'OLSKToolbarButton');
		});

		it('sets accesskey', function () {
			browser.assert.attribute(KVCWriteDetailToolbarJumpButton, 'accesskey', 'j');
		});

		it('sets tabIndex', function () {
			browser.assert.attribute(KVCWriteDetailToolbarJumpButton, 'tabIndex', '-1');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchJump', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteDetailToolbarJumpButton);
			});

			it('sends KVCWriteDetailDispatchJump', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchJump', '1');
			});
		
		});

		context('keydown Ctrl+j', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'j', {
					ctrlKey: true,
				});
			});

			it('sends KVCWriteDetailDispatchJump', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchJump', '2');
			});
		
		});
	
	});

	describe('KVCWriteDetailToolbarJumpButtonImage', function test_KVCWriteDetailToolbarJumpButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarJumpButtonImage } #_KVCWriteJump`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarArchiveButton', function test_KVCWriteDetailToolbarArchiveButton () {
		
		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarArchiveButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarArchiveButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarArchiveButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchArchive', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteDetailToolbarArchiveButton);
			});

			it('sends KVCWriteDetailDispatchArchive', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchArchive', '1');
			});
		
		});
	
	});

	describe('KVCWriteDetailToolbarArchiveButtonImage', function test_KVCWriteDetailToolbarArchiveButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarArchiveButtonImage } #_KVCWriteArchive`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarUnarchiveButton', function test_KVCWriteDetailToolbarUnarchiveButton () {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid({
					KVCNoteIsArchived: true,
				})),
			});
		});

		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarUnarchiveButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarUnarchiveButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarUnarchiveButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchUnarchive', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteDetailToolbarUnarchiveButton);
			});

			it('sends KVCWriteDetailDispatchUnarchive', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchUnarchive', '1');
			});
		
		});
	
	});

	describe('KVCWriteDetailToolbarUnarchiveButtonImage', function test_KVCWriteDetailToolbarUnarchiveButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarUnarchiveButtonImage } #_KVCWriteUnarchive`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarDiscardButton', function test_KVCWriteDetailToolbarDiscardButton () {
		
		it('classes OLSKDecorButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarDiscardButton, 'OLSKDecorButtonNoStyle');
		});

		it('classes OLSKDecorTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarDiscardButton, 'OLSKDecorTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarDiscardButton, 'OLSKToolbarButton');
		});

		context('click', function () {

			context('cancel', function () {
				
				before(function () {
					browser.assert.text('#TestKVCWriteDetailDispatchDiscard', '0');
				});

				return browser.OLSKConfirm(function () {
					return browser.pressButton(KVCWriteDetailToolbarDiscardButton);
				}, function (dialog) {
					dialog.response = false;

					return dialog;
				});

				it('does nothing', function () {
					browser.assert.text('#TestKVCWriteDetailDispatchDiscard', '0');
				});
			
			});
			
			context('confirm', function () {
				
				before(function () {
					return browser.pressButton(KVCWriteDetailToolbarDiscardButton);
				});

				it('sends KVCWriteDetailDispatchDiscard', function () {
					browser.assert.text('#TestKVCWriteDetailDispatchDiscard', '1');
				});
			
			});

		});
	
	});

	describe('KVCWriteDetailToolbarDiscardButtonImage', function test_KVCWriteDetailToolbarDiscardButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarDiscardButtonImage } #_OLSKSharedDiscard`, 1);
		});
	
	});
	
	describe('KVCWriteInput', function test_KVCWriteInput() {

		const item = StubNoteObjectValid();
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(item),
			});
		});

		it('binds KVCNoteBody', function () {
			// browser.assert.input('.CodeMirror', item.KVCNoteBody);
			browser.assert.input('.KVCWriteInputFieldDebug', item.KVCNoteBody);
		});

		context.skip('WKCDetailFocus', function () {

			before(function () {
				browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
			});

			before(function () {
				browser.pressButton('#TestWKCDetailFocus');
			});

			it('classes CodeMirror-focused', function () {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});
			
		});

		context('input', function () {

			before(function () {
				browser.assert.text('#TestKVCWriteDetailItem', JSON.stringify(item));
			});

			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchUpdate', '0');
			});

			before(function () {
				// browser.fill('CodeMirror', 'charlie');
				browser.fill('.KVCWriteInputFieldDebug', 'charlie');
			});

			it('updates KVCWriteDetailItem', function () {
				browser.assert.text('#TestKVCWriteDetailItem', JSON.stringify(Object.assign(item, {
					KVCNoteBody: 'charlie',
				})));
			});

			it('sends KVCWriteDetailDispatchUpdate', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchUpdate', '1');
			});
		
		});

	});

	describe('KVCWriteDetailLauncherItemShowLocalVersions', function test_KVCWriteDetailLauncherItemShowLocalVersions() {
		
		before(function () {
			browser.assert.text('#TestKVCWriteDetailDispatchVersions', '0');
		});
		
		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemShowLocalVersions');
		});

		it('sends KVCWriteDetailDispatchVersions', function () {
			browser.assert.text('#TestKVCWriteDetailDispatchVersions', '1');
		});

	});

	describe('KVCWriteDetailLauncherItemClone', function test_KVCWriteDetailLauncherItemClone() {
		
		before(function () {
			browser.assert.text('#TestKVCWriteDetailDispatchClone', '0');
		});
		
		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemClone');
		});

		it('sends KVCWriteDetailDispatchClone', function () {
			browser.assert.text('#TestKVCWriteDetailDispatchClone', '1');
		});

	});

	describe('KVCWriteDetailLauncherItemArchive', function test_KVCWriteDetailLauncherItemArchive() {
		
		before(function () {
			browser.assert.text('#TestKVCWriteDetailDispatchArchive', '0');
		});
		
		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemArchive');
		});

		it('sends KVCWriteDetailDispatchArchive', function () {
			browser.assert.text('#TestKVCWriteDetailDispatchArchive', '1');
		});

	});

	describe('KVCWriteDetailLauncherItemUnarchive', function test_KVCWriteDetailLauncherItemUnarchive() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid({
					KVCNoteIsArchived: true,
				})),
			});
		});

		before(function () {
			browser.assert.text('#TestKVCWriteDetailDispatchUnarchive', '0');
		});
		
		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemUnarchive');
		});

		it('sends KVCWriteDetailDispatchUnarchive', function () {
			browser.assert.text('#TestKVCWriteDetailDispatchUnarchive', '1');
		});

	});

	describe('KVCWriteDetailLauncherItemPublish', function test_KVCWriteDetailLauncherItemPublish() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
				KVCWriteDetailConnected: true,
			});
		});

		before(function () {
			browser.assert.text('#TestKVCWriteDetailDispatchPublish', '0');
		});
		
		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemPublish');
		});

		it('sends KVCWriteDetailDispatchPublish', function () {
			browser.assert.text('#TestKVCWriteDetailDispatchPublish', '1');
		});

	});

	describe('KVCWriteDetailLauncherItemOpenLink', function test_KVCWriteDetailLauncherItemOpenLink() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid({
					KVCNoteIsPublic: true,
					KVCNotePublishDate: new Date(),
					KVCNotePublicID: Math.random().toString(),
				})),
				KVCWriteDetailConnected: true,
			});
		});

		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemOpenLink');
		});

		it.skip('opens link', function () {});

	});

	describe('KVCWriteDetailLauncherItemSetAsRootPage', function test_KVCWriteDetailLauncherItemSetAsRootPage() {

		const item = StubNoteObjectValid();
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(item),
				KVCWriteDetailConnected: true,
			});
		});

		before(function () {
			browser.assert.text('#TestKVCWriteDetailDispatchSetAsRootPage', '0');
			browser.assert.text('#TestKVCWriteDetailDispatchSetAsRootPageData', 'undefined');
		});
		
		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemSetAsRootPage');
		});

		it('sends KVCWriteDetailDispatchSetAsRootPage', function () {
			browser.assert.text('#TestKVCWriteDetailDispatchSetAsRootPage', '1');
			browser.assert.text('#TestKVCWriteDetailDispatchSetAsRootPageData', item.KVCNoteID);
		});

	});

	describe('KVCWriteDetailLauncherItemRetract', function test_KVCWriteDetailLauncherItemRetract() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid({
					KVCNoteIsPublic: true,
					KVCNotePublishDate: new Date(),
					KVCNotePublicID: Math.random().toString(),
				})),
				KVCWriteDetailConnected: true,
			});
		});

		before(function () {
			browser.assert.text('#TestKVCWriteDetailDispatchRetract', '0');
		});
		
		before(function () {
			return browser.OLSKLauncherRun('KVCWriteDetailLauncherItemRetract');
		});

		it('sends KVCWriteDetailDispatchRetract', function () {
			browser.assert.text('#TestKVCWriteDetailDispatchRetract', '1');
		});

	});

});
