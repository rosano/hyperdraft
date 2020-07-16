const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCWriteInput_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteInputItem: JSON.stringify({
				alfa: 'bravo',
			}),
			KVCWriteInputKey: 'alfa',
		});
	});

	it('binds KVCWriteInputKey', function () {
		// browser.assert.input('.CodeMirror', 'bravo'); // #skip-codemirror
		browser.assert.input(KVCWriteInputFieldDebug, 'bravo');
	});

	context('init', function () {

		it('sends KVCWriteInputDispatchHeaderTokens', function () {
			browser.assert.text('#TestKVCWriteInputDispatchHeaderTokens', '1');
			browser.assert.text('#TestKVCWriteInputDispatchHeaderTokensData', JSON.stringify([]));
		});
	
	});

	context('input', function () {

		before(function () {
			browser.assert.text('#TestKVCWriteInputDispatchUpdate', '0');
		});

		before(function () {
			// browser.fill('.CodeMirror', 'charlie'); // #skip-codemirror
			browser.fill(KVCWriteInputFieldDebug, 'charlie');
		});

		it('sends KVCWriteInputDispatchUpdate', function () {
			browser.assert.text('#TestKVCWriteInputDispatchUpdate', '1');
		});

		it('sends KVCWriteInputDispatchHeaderTokens', function () {
			browser.assert.text('#TestKVCWriteInputDispatchHeaderTokens', '2');
			browser.assert.text('#TestKVCWriteInputDispatchHeaderTokensData', JSON.stringify([]));
		});

	});

	context('header', function () {

		before(function () {
			browser.fill(KVCWriteInputFieldDebug, '# bravo');
			// browser.fill('.CodeMirror', '# bravo');
		});

		it('sends KVCWriteInputDispatchHeaderTokens', function () {
			browser.assert.text('#TestKVCWriteInputDispatchHeaderTokens', '3');
			browser.assert.text('#TestKVCWriteInputDispatchHeaderTokensData', JSON.stringify(require('./ui-logic.js').KVCWriteInputHeaderTokensFrom([require('./ui-logic.js').KVCWriteInputLineObjectsFor(require('./ui-logic.js').uStubLineTokensFor('# bravo'))])));
		});
	
	});

	context.skip('KVCWriteInputFocus', function () {

		before(function () {
			browser.assert.hasNoClass('.CodeMirror', 'CodeMirror-focused');
		});

		before(function () {
			browser.pressButton('#TestKVCWriteInputFocus');
		});

		it('classes CodeMirror-focused', function () {
			browser.assert.hasClass('.CodeMirror', 'CodeMirror-focused');
		});
		
	});

	context('prop', function () {

		before(function () {
			browser.assert.input('#TestKVCWriteInputPropData', 'undefined');
		});

		before(function () {
			browser.fill('#TestKVCWriteInputPropData', JSON.stringify({
				alfa: 'delta',
			}));
			browser.pressButton('#TestKVCWriteInputPropDataSend');
		});

		it('binds KVCWriteInputKey', function () {
			// browser.assert.input('.CodeMirror', 'delta'); // #skip-codemirror
			browser.assert.input(KVCWriteInputFieldDebug, 'delta');
		});
	
	});

});
