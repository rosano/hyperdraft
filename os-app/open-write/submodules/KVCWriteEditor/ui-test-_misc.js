import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

const KVCWriteEditorLogic = require('./ui-logic.js');

describe('KVCWriteEditor_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteEditorSetValue: 'alfa',
		});
	});

	it('binds KVCWriteEditorSetValue', function () {
		browser.assert.input(KVCWriteEditorFieldDebug, 'alfa');
	});

	it.skip('binds KVCWriteEditorSetValue', function () {
		browser.assert.input('.CodeMirror', 'alfa');
	});

	context('init', function () {

		it('sends KVCWriteEditorDispatchHeaderTokens', function () {
			browser.assert.text('#TestKVCWriteEditorDispatchHeaderTokens', '1');
			browser.assert.text('#TestKVCWriteEditorDispatchHeaderTokensData', JSON.stringify([]));
		});
	
	});

	context('input', function () {

		before(function () {
			browser.assert.text('#TestKVCWriteEditorDispatchUpdate', '0');
			browser.assert.text('#TestKVCWriteEditorDispatchUpdateData', 'undefined');
		});

		before(function () {
			browser.fill(KVCWriteEditorFieldDebug, 'bravo');
			// browser.fill('.CodeMirror', 'bravo');
		});

		it('sends KVCWriteEditorDispatchUpdate', function () {
			browser.assert.text('#TestKVCWriteEditorDispatchUpdate', '1');
			browser.assert.text('#TestKVCWriteEditorDispatchUpdateData', 'bravo');
		});

		it('sends KVCWriteEditorDispatchHeaderTokens', function () {
			browser.assert.text('#TestKVCWriteEditorDispatchHeaderTokens', '2');
			browser.assert.text('#TestKVCWriteEditorDispatchHeaderTokensData', JSON.stringify([]));
		});

		context('header', function () {

			before(function () {
				browser.fill(KVCWriteEditorFieldDebug, '# bravo');
				// browser.fill('.CodeMirror', '# bravo');
			});

			it('sends KVCWriteEditorDispatchHeaderTokens', function () {
				browser.assert.text('#TestKVCWriteEditorDispatchHeaderTokens', '3');
				browser.assert.text('#TestKVCWriteEditorDispatchHeaderTokensData', JSON.stringify(KVCWriteEditorLogic.KVCWriteEditorHeaderTokensFrom([KVCWriteEditorLogic.KVCWriteEditorLineObjectsFor(KVCWriteEditorLogic.uStubLineTokensFor('# bravo'))])));
			});
		
		});
	
	});

	context.skip('KVCWriteEditorFocus', function () {

		before(function () {
			browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});

		before(function () {
			browser.pressButton('#TestKVCWriteEditorFocus');
		});

		it('classes CodeMirror-focused', function () {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});
		
	});

});
