import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteDetail_Misc', function () {

	describe('KVCWriteDetail', function test_KVCWriteDetail () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
			});
		});

		it('sets class', function () {
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
				KVCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
			});
		});
		
		it('classes OLSKMobileViewHeader', function () {
			browser.assert.hasClass(KVCWriteDetailToolbar, 'OLSKMobileViewHeader');
		});
	
	});

	describe('OLSKToolbar', function test_OLSKToolbar () {

		it('sets class', function () {
			browser.assert.hasClass('.OLSKToolbar', 'OLSKToolbarJustify');
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

	describe('KVCWriteDetailToolbarBackButtonImage', function testKVCWriteDetailToolbarBackButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarBackButtonImage } #_OLSKSharedBack`, 1);
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
		
		context('KVCWriteEditorDispatchHeaderTokens', function() {

			before(function() {
				// browser.fill('CodeMirror', 'bravo');
				browser.fill('.KVCWriteEditorFieldDebug', '# bravo');
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

	describe('KVCWriteDetailToolbarJumpButtonImage', function testKVCWriteDetailToolbarJumpButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarJumpButtonImage } #_KVCWriteJump`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarPublishButton', function test_KVCWriteDetailToolbarPublishButton () {
		
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

	describe('KVCWriteDetailToolbarPublishButtonImage', function testKVCWriteDetailToolbarPublishButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarPublishButtonImage } #_KVCWritePublish`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarPublicLink', function test_KVCWriteDetailToolbarPublicLink () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
					KVCNotePublishStatusIsPublished: true,
					KVCNotePublicID: 'bravo',
				}),
			});
		});

		it('sets target', function () {
			browser.assert.attribute(KVCWriteDetailToolbarPublicLink, 'target', '_blank');
		});

		it('sets href', function () {
			browser.assert.attribute(KVCWriteDetailToolbarPublicLink, 'href', '/bravo');
		});

	});

	describe('KVCWriteDetailToolbarRetractButton', function test_KVCWriteDetailToolbarRetractButton () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
					KVCNotePublishStatusIsPublished: true,
					KVCNotePublicID: 'bravo',
				}),
			});
		});

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

	describe('KVCWriteDetailToolbarRetractButtonImage', function testKVCWriteDetailToolbarRetractButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarRetractButtonImage } #_KVCWriteRetract`, 1);
		});
	
	});

	describe('KVCWriteDetailToolbarVersionsButton', function test_KVCWriteDetailToolbarVersionsButton () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
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

	describe('KVCWriteDetailToolbarVersionsButtonImage', function testKVCWriteDetailToolbarVersionsButtonImage () {

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
			
			before(function () {
				browser.assert.text('#TestKVCWriteDetailDispatchDiscard', '0');
			});
			
			before(function () {
				return browser.pressButton(KVCWriteDetailToolbarDiscardButton);
			});

			it('sends KVCWriteDetailDispatchDiscard', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchDiscard', '1');
			});

		});
	
	});

	describe('KVCWriteDetailToolbarDiscardButtonImage', function testKVCWriteDetailToolbarDiscardButtonImage () {

		it('sets src', function () {
			browser.assert.elements(`${ KVCWriteDetailToolbarDiscardButtonImage } #_OLSKSharedDiscard`, 1);
		});
	
	});
	
	describe('KVCWriteEditor', function test_KVCWriteEditor() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				KVCWriteDetailItem: JSON.stringify({
					KVCNoteBody: 'alfa',
				}),
			});
		});

		it.skip('binds KVCNoteBody', function () {
			browser.assert.input('.CodeMirror', 'alfa');
		});
			
		it('binds KVCNoteBody', function () {
			browser.assert.input('.KVCWriteEditorFieldDebug', 'alfa');
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
				browser.fill('.KVCWriteEditorFieldDebug', 'bravo');
			});

			it('sends KVCWriteDetailDispatchUpdate', function () {
				browser.assert.text('#TestKVCWriteDetailDispatchUpdate', '1');
			});
		
		});

	});

});
