import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const WKCWriteEditorLogic = require('./ui-logic.js');

describe('WKCWriteEditor_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			WKCWriteEditorSetValue: 'alfa',
		});
	});

	it('binds WKCWriteEditorSetValue', function () {
		browser.assert.input(WKCWriteEditorFieldDebug, 'alfa');
	});

	it.skip('binds WKCWriteEditorSetValue', function () {
		browser.assert.input('.CodeMirror', 'alfa');
	});

	context('init', function () {

		it('sends WKCWriteEditorDispatchHeaderTokens', function () {
			browser.assert.text('#TestWKCWriteEditorDispatchHeaderTokens', '1');
			browser.assert.text('#TestWKCWriteEditorDispatchHeaderTokensData', JSON.stringify([]));
		});
	
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

		it('sends WKCWriteEditorDispatchHeaderTokens', function () {
			browser.assert.text('#TestWKCWriteEditorDispatchHeaderTokens', '2');
			browser.assert.text('#TestWKCWriteEditorDispatchHeaderTokensData', JSON.stringify([]));
		});

		context('header', function () {

			before(function () {
				browser.fill(WKCWriteEditorFieldDebug, '# bravo');
				// browser.fill('.CodeMirror', '# bravo');
			});

			it('sends WKCWriteEditorDispatchHeaderTokens', function () {
				browser.assert.text('#TestWKCWriteEditorDispatchHeaderTokens', '3');
				browser.assert.text('#TestWKCWriteEditorDispatchHeaderTokensData', JSON.stringify(WKCWriteEditorLogic.WKCWriteEditorHeaderTokensFrom([WKCWriteEditorLogic.WKCWriteEditorLineObjectsFor(WKCWriteEditorLogic.uStubLineTokensFor('# bravo'))])));
			});
		
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
