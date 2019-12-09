import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCWriteEditor_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			WKCWriteEditorSetDocument: 'alfa',
		});
	});

	it('binds WKCWriteEditorSetDocument', function () {
		browser.assert.input(WKCWriteEditorFieldDebug, 'alfa');
	});

	it.skip('binds WKCWriteEditorSetDocument', function () {
		browser.assert.input('.CodeMirror', 'alfa');
	});

	context('input', function () {

		before(function () {
			browser.assert.text('#TestWKCWriteEditorDispatchUpdate', '0');
			browser.assert.text('#TestWKCWriteEditorDispatchUpdateData', 'undefined');
		});

		before(function () {
			browser.fill(WKCWriteEditorFieldDebug, 'bravo');
			// browser.fill('.CodeMirror', 'bravo');
		});

		it('sends WKCWriteEditorDispatchUpdate', function () {
			browser.assert.text('#TestWKCWriteEditorDispatchUpdate', '1');
			browser.assert.text('#TestWKCWriteEditorDispatchUpdateData', 'bravo');
		});
	
	});

	context.skip('WKCWriteEditorFocus', function () {

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

});
