import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

Object.entries({
	WKCEditor: '.WKCEditor',
	
	WKCEditorFieldDebug: '.WKCEditorFieldDebug',
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCEditor_Access', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			WKCEditorInitialValue: 'alfa',
		});
	});

	it('shows WKCEditor', function () {
		browser.assert.elements(WKCEditor, 1);
	});

	it.skip('shows CodeMirror', function () {
		browser.assert.elements('.CodeMirror', 1);
	});

	it('shows WKCEditorFieldDebug', function () {
		browser.assert.elements(WKCEditorFieldDebug, 1);
	});

});
