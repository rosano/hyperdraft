import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCEditor_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			WKCEditorInitialValue: 'alfa',
		});
	});
	
	describe('WKCEditorFieldDebug', function() {
		
		it('binds WKCEditorInitialValue', function () {
			browser.assert.input(WKCEditorFieldDebug, 'alfa');
		});

		context('input', function () {

			before(function () {
				browser.fill(WKCEditorFieldDebug, 'bravo');
			});

			it('sends WKCEditorDispatchUpdate', function () {
				browser.assert.text('#TestWKCEditorDispatchUpdate', '1');
				browser.assert.text('#TestWKCEditorDispatchUpdateData', 'bravo');
			});
		
		});

	});
	
	describe.skip('CodeMirror', function() {
		
		it('binds WKCEditorInitialValue', function () {
			browser.assert.input('.CodeMirror', 'alfa');
		});

		context('WKCEditorFocus', function () {

			before(function () {
				browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
			});

			before(function () {
				browser.pressButton('#TestWKCEditorFocus');
			});

			it('classes CodeMirror-focused', function () {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});
			
		});

		context('input', function () {

			before(function () {
				browser.fill('.CodeMirror', 'bravo');
			});

			it('sends WKCEditorDispatchUpdate', function () {
				browser.assert.text('#TestWKCEditorDispatchUpdate', '1');
				browser.assert.text('#TestWKCEditorDispatchUpdateData', 'bravo');
			});
		
		});

	});

});
