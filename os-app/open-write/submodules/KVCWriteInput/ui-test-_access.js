const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteInput: '.KVCWriteInput',
	
	KVCWriteInputFieldDebug: '.KVCWriteInputFieldDebug',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWriteInput_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			KVCWriteInputItem: JSON.stringify({
				alfa: 'bravo',
			}),
			KVCWriteInputKey: 'alfa',
		});
	});

	it('shows KVCWriteInput', function () {
		browser.assert.elements(KVCWriteInput, 1);
	});

	it.skip('shows CodeMirror', function () {
		browser.assert.elements('.CodeMirror', 1);
	});

	it('shows KVCWriteInputFieldDebug', function () {
		browser.assert.elements(KVCWriteInputFieldDebug, 1);
	});

});
