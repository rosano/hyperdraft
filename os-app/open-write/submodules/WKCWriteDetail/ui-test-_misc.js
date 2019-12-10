import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWriteDetail_Misc', function () {

	describe('WKCWriteDetail', function test_WKCWriteDetail () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
			});
		});

		it('sets class', function () {
			browser.assert.hasClass(WKCWriteDetail, 'OLSKViewportDetail');
		});

		context('OLSKMobileViewInactive', function () {

			before(function () {
				browser.assert.hasNoClass(WKCWriteDetail, 'OLSKMobileViewInactive');
			});

			before(function () {
				browser.assert.attribute(WKCWriteDetail, 'aria-hidden', null);
			});
			
			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKMobileViewInactive: true,
				});
			});

			it('classes OLSKMobileViewInactive', function () {
				browser.assert.hasClass(WKCWriteDetail, 'OLSKMobileViewInactive');
			});

			it('sets aria-hidden', function () {
				browser.assert.attribute(WKCWriteDetail, 'aria-hidden', 'true');
			});
		
		});

	});

	describe('WKCWriteDetailToolbar', function test_WKCWriteDetailToolbar () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
			});
		});
		
		it('classes OLSKMobileViewHeader', function () {
			browser.assert.hasClass(WKCWriteDetailToolbar, 'OLSKMobileViewHeader');
		});
	
	});

	describe('OLSKToolbar', function test_OLSKToolbar () {

		it('sets class', function () {
			browser.assert.hasClass('.OLSKToolbar', 'OLSKToolbarJustify');
		});
	
	});

	describe('WKCWriteDetailToolbarBackButton', function test_WKCWriteDetailToolbarBackButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarBackButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarBackButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarBackButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWKCWriteDetailDispatchBack', '0');
			});
			
			before(function () {
				return browser.pressButton(WKCWriteDetailToolbarBackButton);
			});

			it('sends WKCWriteDetailDispatchBack', function () {
				browser.assert.text('#TestWKCWriteDetailDispatchBack', '1');
			});
		
		});
	
	});

	describe('WKCWriteDetailToolbarJumpButton', function test_WKCWriteDetailToolbarJumpButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarJumpButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarJumpButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarJumpButton, 'OLSKToolbarButton');
		});

		it('sets accesskey', function () {
			browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'accesskey', 'r');
		});

		it('sets tabIndex', function () {
			browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'tabIndex', '-1');
		});

		it('sets disabled', function () {
			browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', '');
		});

		context('keydown Ctrl+r', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'r', {
					ctrlKey: true,
				});
			});

			it('sends no WKCWriteDetailDispatchJump', function () {
				browser.assert.text('#TestWKCWriteDetailDispatchJump', '0');
			});
		
		});
		
		context('WKCWriteEditorDispatchHeaderTokens', function() {

			before(function() {
				// browser.fill('CodeMirror', 'bravo');
				browser.fill('.WKCWriteEditorFieldDebug', '# bravo');
			});

			it('sets disabled', function() {
				browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', null);
			});

			context('click', function () {
				
				before(function () {
					browser.assert.text('#TestWKCWriteDetailDispatchJump', '0');
				});
				
				before(function () {
					return browser.pressButton(WKCWriteDetailToolbarJumpButton);
				});

				it('sends WKCWriteDetailDispatchJump', function () {
					browser.assert.text('#TestWKCWriteDetailDispatchJump', '1');
				});
			
			});

			context('keydown Ctrl+r', function () {
				
				before(function () {
					return browser.OLSKFireKeyboardEvent(browser.window, 'r', {
						ctrlKey: true,
					});
				});

				it('sends WKCWriteDetailDispatchJump', function () {
					browser.assert.text('#TestWKCWriteDetailDispatchJump', '2');
				});
			
			});

		});
	
	});

	describe('WKCWriteDetailToolbarPublishButton', function test_WKCWriteDetailToolbarPublishButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarPublishButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarPublishButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarPublishButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWKCWriteDetailDispatchPublish', '0');
			});
			
			before(function () {
				return browser.pressButton(WKCWriteDetailToolbarPublishButton);
			});

			it('sends WKCWriteDetailDispatchPublish', function () {
				browser.assert.text('#TestWKCWriteDetailDispatchPublish', '1');
			});
		
		});
	
	});

	describe('WKCWriteDetailToolbarPublicLink', function test_WKCWriteDetailToolbarPublicLink () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
					KVCNotePublishStatusIsPublished: true,
					KVCNotePublicID: 'bravo',
				}),
			});
		});

		it('sets target', function () {
			browser.assert.attribute(WKCWriteDetailToolbarPublicLink, 'target', '_blank');
		});

		it('sets href', function () {
			browser.assert.attribute(WKCWriteDetailToolbarPublicLink, 'href', '/bravo');
		});

	});

	describe('WKCWriteDetailToolbarRetractButton', function test_WKCWriteDetailToolbarRetractButton () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
					KVCNotePublishStatusIsPublished: true,
					KVCNotePublicID: 'bravo',
				}),
			});
		});

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarRetractButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarRetractButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarRetractButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWKCWriteDetailDispatchRetract', '0');
			});
			
			before(function () {
				return browser.pressButton(WKCWriteDetailToolbarRetractButton);
			});

			it('sends WKCWriteDetailDispatchRetract', function () {
				browser.assert.text('#TestWKCWriteDetailDispatchRetract', '1');
			});
		
		});
	
	});

	describe('WKCWriteDetailToolbarVersionsButton', function test_WKCWriteDetailToolbarVersionsButton () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
			});
		});
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarVersionsButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarVersionsButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarVersionsButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWKCWriteDetailDispatchVersions', '0');
			});
			
			before(function () {
				return browser.pressButton(WKCWriteDetailToolbarVersionsButton);
			});

			it('sends WKCWriteDetailDispatchVersions', function () {
				browser.assert.text('#TestWKCWriteDetailDispatchVersions', '1');
			});
		
		});
	
	});

	describe('WKCWriteDetailToolbarDiscardButton', function test_WKCWriteDetailToolbarDiscardButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarDiscardButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarDiscardButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WKCWriteDetailToolbarDiscardButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWKCWriteDetailDispatchDiscard', '0');
			});
			
			before(function () {
				return browser.pressButton(WKCWriteDetailToolbarDiscardButton);
			});

			it('sends WKCWriteDetailDispatchDiscard', function () {
				browser.assert.text('#TestWKCWriteDetailDispatchDiscard', '1');
			});

		});
	
	});

	describe('WKCWriteDetailPlaceholder', function test_WKCWriteDetailPlaceholder() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		it('sets class', function () {
			browser.assert.hasClass(WKCWriteDetailPlaceholder, 'OLSKLayoutElementTextVisual');
		});
		
	});
	
	describe('WKCWriteEditor', function test_WKCWriteEditor() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WKCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
			});
		});

		it.skip('binds KVCNoteBody', function () {
			browser.assert.input('.CodeMirror', 'alfa');
		});
			
		it('binds KVCNoteBody', function () {
			browser.assert.input('.WKCWriteEditorFieldDebug', 'alfa');
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
				// browser.fill('CodeMirror', 'bravo');
				browser.fill('.WKCWriteEditorFieldDebug', 'bravo');
			});

			it('sends WKCWriteDetailDispatchUpdate', function () {
				browser.assert.text('#TestWKCWriteDetailDispatchUpdate', '1');
				browser.assert.text('#TestWKCWriteDetailDispatchUpdateData', 'bravo');
			});
		
		});

	});

});
