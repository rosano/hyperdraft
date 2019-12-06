import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('WKCEditor_Misc', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute, {
			WKCEditorInitialValue: 'alfa',
		});
	});
	
	describe('WKCEditor', function() {
		
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

});
