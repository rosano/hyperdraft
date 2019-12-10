import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	KVCWriteEditor: '.KVCWriteEditor',
	
	KVCWriteEditorFieldDebug: '.KVCWriteEditorFieldDebug',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('KVCWriteEditor_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows KVCWriteEditor', function () {
		browser.assert.elements(KVCWriteEditor, 1);
	});

	it.skip('shows CodeMirror', function () {
		browser.assert.elements('.CodeMirror', 1);
	});

	it('shows KVCWriteEditorFieldDebug', function () {
		browser.assert.elements(KVCWriteEditorFieldDebug, 1);
	});

});
