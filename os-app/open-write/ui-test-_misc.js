import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().WIKWriteRoute;

describe('WIKWriteUIFeature', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	context('on startup', function() {

		it('focuses WKCWriteMasterFilterField', function() {
			deepEqual(browser.document.hasFocus(WKCWriteMasterFilterField), true);
		});

	});

	context('WKCWriteMasterFilterField', function() {
		
		it('removes class if not active', async function() {
			browser.click(WKCWriteDetailPlaceholderContainer);
			browser.assert.hasNoClass('.WKCWriteMaster', 'WKCWriteMasterContainerFocused');
		});
		
		it.skip('adds class if active', async function() {
			browser.click(WKCWriteMasterFilterField);
			await browser.wait({ element: WKCWriteMasterFilterField });

			deepEqual(browser.document.hasFocus(WKCWriteMasterFilterField), true);

			await browser.wait({ element: WKCWriteMasterFilterField });
			browser.assert.hasClass('.WKCWriteMaster', 'WKCWriteMasterContainerFocused');
		});

		it.skip('creates note on Enter', async function() {
			browser.fill(WKCWriteMasterFilterField, 'bravo');
			browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
			await browser.wait({ element: WKCWriteListItem });

			browser.assert.elements(WKCWriteListItem, 1);
		});

	});

	context('on create', async function() {

		before(async function() {
			deepEqual(browser.document.hasFocus(WKCWriteMasterFilterField), true);

			await uCreateItem(browser);
			browser.assert.elements(WKCWriteListItem, 1);
		});

		it('focuses .CodeMirror textarea', async function() {
			deepEqual(browser.document.hasFocus('.CodeMirror textarea'), true);
		});

	});

	context('on select', async function() {

		before(async function() {
			await uCreateItem(browser);
			browser.assert.elements(WKCWriteListItem, 2);

			browser.click(WKCWriteMasterFilterField);
			await browser.wait({ element: WKCWriteMasterFilterField });

			deepEqual(browser.document.hasFocus(WKCWriteMasterFilterField), true);
		});

		it('focuses .CodeMirror textarea', async function() {
			deepEqual(browser.document.hasFocus('.CodeMirror textarea'), true);
		});

		it('focuses .CodeMirror textarea', async function() {
			await uCreateItem(browser);

			browser.click(`${ WKCWriteListItem }:nth-child(2)`);
			await browser.wait({ element: WKCWriteListItem });

			deepEqual(browser.document.hasFocus('.CodeMirror textarea'), true);
		});

	});

	context('on filter', function () {
		
		before(async function() {
			browser.fill('#WKCWriteEditorDebugInput', 'alfa');

			browser.click(`${ WKCWriteListItem }:nth-child(2)`);
			await browser.wait({ element: WKCWriteListItem });

			browser.fill('#WKCWriteEditorDebugInput', 'bravo');
			await browser.wait({ element: WKCWriteListItem });
		});

		it.skip('selects item if exact title match', async function() {
			browser.assert.elements(WKCWriteListItem, 2);

			browser.fill(WKCWriteMasterFilterField, 'bravo');
			await browser.wait({ element: OLSKInputWrapperClearButton });
			// console.log(browser.queryAll(WKCWriteListItem).map((e) => e.outerHTML));

			browser.assert.elements(WKCWriteListItem, 1);
		});

	});

});
