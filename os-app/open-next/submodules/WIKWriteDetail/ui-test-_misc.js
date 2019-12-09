import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WIKWriteDetail_Misc', function () {

	const uItem = function () {
		return {
			WKCNoteBody: 'alfa',
		};
	};

	describe('WIKWriteDetail', function test_WIKWriteDetail () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify(uItem()),
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
				WIKWriteDetailItem: JSON.stringify(uItem()),
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

	describe('WIKWriteDetailToolbarVersionsButton', function test_WIKWriteDetailToolbarVersionsButton () {
		
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
				browser.assert.text('#TestWIKWriteDetailDispatchDiscardData', 'undefined');
			});
			
			before(function () {
				return browser.pressButton(WIKWriteDetailToolbarDiscardButton);
			});

			it('sends WIKWriteDetailDispatchDiscard', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchDiscard', '1');
			});

			it('sends WIKWriteDetailDispatchDiscardData', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchDiscardData', JSON.stringify(uItem()));
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
				WIKWriteDetailItem: JSON.stringify(uItem()),
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
