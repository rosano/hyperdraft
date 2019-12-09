import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WIKWriteDetail_Misc', function () {

	describe('WIKWriteDetail', function test_WIKWriteDetail () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify({
					WKCNoteBody: 'alfa',
				}),
			});
		});

		it('sets class', function () {
			browser.assert.hasClass(WIKWriteDetail, 'OLSKViewportDetail');
		});

		context('OLSKMobileViewInactive', function () {

			before(function () {
				browser.assert.hasNoClass(WIKWriteDetail, 'OLSKMobileViewInactive');
			});
			
			before(function() {
				return browser.OLSKVisit(kDefaultRoute, {
					OLSKMobileViewInactive: true,
				});
			});

			it('sets class', function () {
				browser.assert.hasClass(WIKWriteDetail, 'OLSKMobileViewInactive');
			});
		
		});

	});

	describe('OLSKToolbar', function test_OLSKToolbar () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify({
					WKCNoteBody: 'alfa',
				}),
			});
		});

		it('sets class', function () {
			browser.assert.hasClass('.OLSKToolbar', 'OLSKToolbarJustify');
		});
	
	});

	describe('WIKWriteDetailToolbarBackButton', function test_WIKWriteDetailToolbarBackButton () {
		
		it('sets class', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarBackButton, 'OLSKLayoutButtonNoStyle');
			browser.assert.hasClass(WIKWriteDetailToolbarBackButton, 'OLSKLayoutElementTappable');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWIKWriteDetailDispatchBack', '0');
			});
			
			before(function () {
				return browser.pressButton(WIKWriteDetailToolbarBackButton);
			});

			it('sends WIKWriteDetailDispatchBack', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchBack', '1');
			});
		
		});
	
	});

	describe('WIKWriteDetailToolbarJumpButton', function test_WIKWriteDetailToolbarJumpButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarJumpButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarJumpButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarJumpButton, 'OLSKToolbarButton');
		});

		it('sets accesskey', function () {
			browser.assert.attribute(WIKWriteDetailToolbarJumpButton, 'accesskey', 'r');
		});

		it('sets tabIndex', function () {
			browser.assert.attribute(WIKWriteDetailToolbarJumpButton, 'tabIndex', '-1');
		});

		it('sets disabled', function () {
			browser.assert.attribute(WIKWriteDetailToolbarJumpButton, 'disabled', '');
		});

		context('keydown Ctrl+r', function () {
			
			before(function () {
				return browser.OLSKFireKeyboardEvent(browser.window, 'r', {
					ctrlKey: true,
				});
			});

			it('sends no WIKWriteDetailDispatchJump', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchJump', '0');
			});
		
		});
		
		context('WKCWriteEditorDispatchHeaderTokens', function() {

			before(function() {
				// browser.fill('CodeMirror', 'bravo');
				browser.fill('.WKCWriteEditorFieldDebug', '# bravo');
			});

			it('sets disabled', function() {
				browser.assert.attribute(WIKWriteDetailToolbarJumpButton, 'disabled', null);
			});

			context('click', function () {
				
				before(function () {
					browser.assert.text('#TestWIKWriteDetailDispatchJump', '0');
				});
				
				before(function () {
					return browser.pressButton(WIKWriteDetailToolbarJumpButton);
				});

				it('sends WIKWriteDetailDispatchJump', function () {
					browser.assert.text('#TestWIKWriteDetailDispatchJump', '1');
				});
			
			});

			context('keydown Ctrl+r', function () {
				
				before(function () {
					return browser.OLSKFireKeyboardEvent(browser.window, 'r', {
						ctrlKey: true,
					});
				});

				it('sends WIKWriteDetailDispatchJump', function () {
					browser.assert.text('#TestWIKWriteDetailDispatchJump', '2');
				});
			
			});

		});
	
	});

	describe('WIKWriteDetailToolbarPublishButton', function test_WIKWriteDetailToolbarPublishButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarPublishButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarPublishButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarPublishButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWIKWriteDetailDispatchPublish', '0');
			});
			
			before(function () {
				return browser.pressButton(WIKWriteDetailToolbarPublishButton);
			});

			it('sends WIKWriteDetailDispatchPublish', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchPublish', '1');
			});
		
		});
	
	});

	describe('WIKWriteDetailToolbarPublicLink', function test_WIKWriteDetailToolbarPublicLink () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify({
					WKCNoteBody: 'alfa',
					WKCNotePublishStatusIsPublished: true,
					WKCNotePublicID: 'bravo',
				}),
			});
		});

		it('sets target', function () {
			browser.assert.attribute(WIKWriteDetailToolbarPublicLink, 'target', '_blank');
		});

		it('sets href', function () {
			browser.assert.attribute(WIKWriteDetailToolbarPublicLink, 'href', '/bravo');
		});

	});

	describe('WIKWriteDetailToolbarRetractButton', function test_WIKWriteDetailToolbarRetractButton () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify({
					WKCNoteBody: 'alfa',
					WKCNotePublishStatusIsPublished: true,
					WKCNotePublicID: 'bravo',
				}),
			});
		});

		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarRetractButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarRetractButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarRetractButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWIKWriteDetailDispatchRetract', '0');
			});
			
			before(function () {
				return browser.pressButton(WIKWriteDetailToolbarRetractButton);
			});

			it('sends WIKWriteDetailDispatchRetract', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchRetract', '1');
			});
		
		});
	
	});

	describe('WIKWriteDetailToolbarVersionsButton', function test_WIKWriteDetailToolbarVersionsButton () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify({
					WKCNoteBody: 'alfa',
				}),
			});
		});
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarVersionsButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarVersionsButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarVersionsButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWIKWriteDetailDispatchVersions', '0');
			});
			
			before(function () {
				return browser.pressButton(WIKWriteDetailToolbarVersionsButton);
			});

			it('sends WIKWriteDetailDispatchVersions', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchVersions', '1');
			});
		
		});
	
	});

	describe('WIKWriteDetailToolbarDiscardButton', function test_WIKWriteDetailToolbarDiscardButton () {
		
		it('classes OLSKLayoutButtonNoStyle', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarDiscardButton, 'OLSKLayoutButtonNoStyle');
		});

		it('classes OLSKLayoutElementTappable', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarDiscardButton, 'OLSKLayoutElementTappable');
		});

		it('classes OLSKToolbarButton', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarDiscardButton, 'OLSKToolbarButton');
		});

		context('click', function () {
			
			before(function () {
				browser.assert.text('#TestWIKWriteDetailDispatchDiscard', '0');
			});
			
			before(function () {
				return browser.pressButton(WIKWriteDetailToolbarDiscardButton);
			});

			it('sends WIKWriteDetailDispatchDiscard', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchDiscard', '1');
			});

		});
	
	});

	describe('WIKWriteDetailPlaceholder', function test_WIKWriteDetailPlaceholder() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		it('sets class', function () {
			browser.assert.hasClass(WIKWriteDetailPlaceholder, 'OLSKLayoutElementTextVisual');
		});
		
	});
	
	describe('WKCWriteEditor', function test_WKCWriteEditor() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify({
					WKCNoteBody: 'alfa',
				}),
			});
		});

		it.skip('binds WKCNoteBody', function () {
			browser.assert.input('.CodeMirror', 'alfa');
		});
			
		it('binds WKCNoteBody', function () {
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

			it('sends WIKWriteDetailDispatchUpdate', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchUpdate', '1');
				browser.assert.text('#TestWIKWriteDetailDispatchUpdateData', 'bravo');
			});
		
		});

	});

});
