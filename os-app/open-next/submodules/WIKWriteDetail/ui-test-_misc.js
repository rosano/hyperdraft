import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WIKWriteDetail_Misc', function () {

	const uItem = function () {
		return {
			WKCNoteBody: 'alfa',
		};
	};

	describe('WIKWriteDetail', function () {

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

	describe('OLSKToolbar', function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify(uItem()),
			});
		});
		
		it('sets class', function () {
			browser.assert.hasClass('.OLSKToolbar', 'OLSKToolbarJustify');
		});
	
	});

	describe('WIKWriteDetailToolbarBackButton', function () {
		
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

	describe('WIKWriteDetailToolbarDiscardButton', function () {
		
		it('sets class', function () {
			browser.assert.hasClass(WIKWriteDetailToolbarDiscardButton, 'OLSKLayoutButtonNoStyle');
			browser.assert.hasClass(WIKWriteDetailToolbarDiscardButton, 'OLSKLayoutElementTappable');
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

	describe('WIKWriteDetailPlaceholder', function() {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute);
		});

		it('sets class', function () {
			browser.assert.hasClass(WIKWriteDetailPlaceholder, 'OLSKLayoutElementTextVisual');
		});
		
	});
	
	describe('WKCEditor', function() {
		
		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				WIKWriteDetailItem: JSON.stringify(uItem()),
			});
		});
		
		it.skip('binds WKCNoteBody', function () {
			browser.assert.input('.CodeMirror', 'alfa');
		});
			
		it('binds WKCNoteBody', function () {
			browser.assert.input('.WKCEditorFieldDebug', 'alfa');
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
				browser.fill('.WKCEditorFieldDebug', 'bravo');
			});

			it('sends WIKWriteDetailDispatchUpdate', function () {
				browser.assert.text('#TestWIKWriteDetailDispatchUpdate', '1');
				browser.assert.text('#TestWIKWriteDetailDispatchUpdateData', 'bravo');
			});
		
		});

	});

});
