import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	WKCWriteEditor: '.WKCWriteEditor',
	
	WKCWriteEditorFieldDebug: '.WKCWriteEditorFieldDebug',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteEditor_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			WKCWriteEditorInitialValue: 'alfa',
		});
	});

	it('shows WKCWriteEditor', function () {
		browser.assert.elements(WKCWriteEditor, 1);
	});

	it.skip('shows CodeMirror', function () {
		browser.assert.elements('.CodeMirror', 1);
	});

	it('shows WKCWriteEditorFieldDebug', function () {
		browser.assert.elements(WKCWriteEditorFieldDebug, 1);
	});

});
