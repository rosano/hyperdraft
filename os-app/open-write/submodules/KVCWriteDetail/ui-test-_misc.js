const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteDetail_Misc', function () {

	describe('KVCWriteDetail', function test_KVCWriteDetail () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
			});
		});

		it('classes OLSKViewportDetail', function () {
			browser.assert.hasClass(KVCWriteDetail, 'OLSKViewportDetail');
		});

		context('OLSKMobileViewInactive', function () {

			before(function () {
				browser.assert.hasNoClass(KVCWriteDetail, 'OLSKMobileViewInactive');
			});

			before(function () {
				browser.assert.attribute(KVCWriteDetail, 'aria-hidden', null);
			});
			
			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKMobileViewInactive: true,
				});
			});

			it('classes OLSKMobileViewInactive', function () {
				browser.assert.hasClass(KVCWriteDetail, 'OLSKMobileViewInactive');
			});

			it('sets aria-hidden', function () {
				browser.assert.attribute(KVCWriteDetail, 'aria-hidden', 'true');
			});
		
		});

	});

	describe('KVCWriteDetailToolbar', function test_KVCWriteDetailToolbar () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
			});
		});

		it('classes OLSKToolbar', function () {
			browser.assert.hasClass(KVCWriteDetailToolbar, 'OLSKToolbar');
		});

		it('classes OLSKToolbarJustify', function () {
			browser.assert.hasClass(KVCWriteDetailToolbar, 'OLSKToolbarJustify');
		});
		
		it('classes OLSKMobileViewHeader', function () {
			browser.assert.hasClass(KVCWriteDetailToolbar, 'OLSKMobileViewHeader');
		});
	
	});

	describe('KVCWriteDetailToolbarBackButton', function test_KVCWriteDetailToolbarBackButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarBackButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarBackButton, 'OLSKLayoutElementTappable');
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

	describe('KVCWriteDetailToolbarArchiveButton', function test_KVCWriteDetailToolbarArchiveButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarArchiveButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarArchiveButton, 'OLSKLayoutElementTappable');
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

	describe('KVCWriteDetailToolbarJumpButton', function test_KVCWriteDetailToolbarJumpButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarJumpButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarJumpButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarJumpButton, 'OLSKToolbarButton');
		});

		it('sets accesskey', function () {
			browser.assert.attribute(KVCWriteDetailToolbarJumpButton, 'accesskey', 'r');
		});

		it('sets tabIndex', function () {
			browser.assert.attribute(KVCWriteDetailToolbarJumpButton, 'tabIndex', '-1');
		});

		it('sets disabled', function () {
			browser.assert.attribute(KVCWriteDetailToolbarJumpButton, 'disabled', '');
		});

		context('keydown Ctrl+r', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'r', {
					ctrlKey: true,
				});
			});

			it('sends no KVCWriteDetailDispatchJump', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchJump', '0');
			});
		
		});
		
		context('KVCWriteInputDispatchHeaderTokens', function() {

			before(function() {
				// browser.fill('CodeMirror', 'bravo');
				browser.fill('.KVCWriteInputFieldDebug', '# bravo');
			});

			it('sets disabled', function() {
				browser.assert.attribute(KVCWriteDetailToolbarJumpButton, 'disabled', null);
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

			context('keydown Ctrl+r', function () {
				
				before(function () {
					return browser.OLSKFireKeyboardEvent(browser.window, 'r', {
						ctrlKey: true,
					});
				});

				it('sends KVCWriteDetailDispatchJump', function () {
					browser.assert.text('#TestKVCWriteDetailDispatchJump', '2');
				});
			
			});

		});
	
	});

	describe('KVCWriteDetailToolbarJumpButtonImage', function test_KVCWriteDetailToolbarJumpButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarJumpButtonImage } #_KVCWriteJump`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarConnectButton', function test_KVCWriteDetailToolbarConnectButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarConnectButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarConnectButton, 'OLSKLayoutElementTappable');
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

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarPublishButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarPublishButton, 'OLSKLayoutElementTappable');
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
				KVCWriteDetailItem: JSON.stringify(Object.assign(StubNoteObjectValid(), {
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

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarRetractButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarRetractButton, 'OLSKLayoutElementTappable');
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

	describe('KVCWriteDetailToolbarVersionsButton', function test_KVCWriteDetailToolbarVersionsButton () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
			});
		});
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarVersionsButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarVersionsButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarVersionsButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchVersions', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteDetailToolbarVersionsButton);
			});

			it('sends KVCWriteDetailDispatchVersions', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchVersions', '1');
			});
		
		});
	
	});

	describe('KVCWriteDetailToolbarVersionsButtonImage', function test_KVCWriteDetailToolbarVersionsButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarVersionsButtonImage } #_KVCWriteVersions`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarDiscardButton', function test_KVCWriteDetailToolbarDiscardButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarDiscardButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(KVCWriteDetailToolbarDiscardButton, 'OLSKLayoutElementTappable');
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
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
			});
		});

		it('binds KVCNoteBody', function () {
			// browser.assert.input('.CodeMirror', 'bravo');
			browser.assert.input('.KVCWriteInputFieldDebug', 'bravo');
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
				browser.assert.text('#TestKVCWriteDetailItem', JSON.stringify(StubNoteObjectValid()));
			});

			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchUpdate', '0');
			});

			before(function () {
				// browser.fill('CodeMirror', 'charlie');
				browser.fill('.KVCWriteInputFieldDebug', 'charlie');
			});

			it('updates KVCWriteDetailItem', function () {
				browser.assert.text('#TestKVCWriteDetailItem', JSON.stringify(Object.assign(StubNoteObjectValid(), {
					KVCNoteBody: 'charlie',
				})));
			});

			it('sends KVCWriteDetailDispatchUpdate', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchUpdate', '1');
			});
		
		});

	});

	describe('KVCWriteDetailLauncherItemSetAsRootPage', function test_KVCWriteDetailLauncherItemSetAsRootPage() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify(StubNoteObjectValid()),
				KVCWriteDetailConnected: true,
			});
		});

		before(function () {
			browser.assert.text('#TestKVCWriteDetailDispatchSetAsRootPage', '0');
			browser.assert.text('#TestKVCWriteDetailDispatchSetAsRootPageData', 'undefined');
		});
		
		before(function () {
			return uLaunch('KVCWriteDetailLauncherItemSetAsRootPage');
		});

		it('sends KVCWriteDetailDispatchSetAsRootPage', function () {
			browser.assert.text('#TestKVCWriteDetailDispatchSetAsRootPage', '1');
			browser.assert.text('#TestKVCWriteDetailDispatchSetAsRootPageData', StubNoteObjectValid().KVCNoteID);
		});

	});

});
