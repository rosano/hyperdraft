import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWriteEditor_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			WKCWriteEditorSetDocument: 'alfa',
		});
	});

	describe('WKCWriteEditorFieldDebug', function() {
		
		it('binds WKCWriteEditorSetDocument', function () {
			browser.assert.input(WKCWriteEditorFieldDebug, 'alfa');
		});

		context('input', function () {

			before(function () {
				browser.fill(WKCWriteEditorFieldDebug, 'bravo');
			});

			it('sends WKCWriteEditorDispatchUpdate', function () {
				browser.assert.text('#TestWKCWriteEditorDispatchUpdate', '1');
				browser.assert.text('#TestWKCWriteEditorDispatchUpdateData', 'bravo');
			});
		
		});

	});
	
	describe.skip('CodeMirror', function() {
		
		it('binds WKCWriteEditorSetDocument', function () {
			browser.assert.input('.CodeMirror', 'alfa');
		});

		context('WKCWriteEditorFocus', function () {

			before(function () {
				browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
			});

			before(function () {
				browser.pressButton('#TestWKCWriteEditorFocus');
			});

			it('classes CodeMirror-focused', function () {
				browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
			});
			
		});

		context('input', function () {

			before(function () {
				browser.fill('.CodeMirror', 'bravo');
			});

			it('sends WKCWriteEditorDispatchUpdate', function () {
				browser.assert.text('#TestWKCWriteEditorDispatchUpdate', '1');
				browser.assert.text('#TestWKCWriteEditorDispatchUpdateData', 'bravo');
			});
		
		});

	});

});
