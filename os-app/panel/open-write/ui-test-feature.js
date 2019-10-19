import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().WIKWriteRoute;

describe('WIKWriteUIFeature', function () {

	before(function() {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	context('on startup', function() {

		it('focuses WKCWriteFilterInput', function() {
			deepEqual(browser.document.hasFocus(WKCWriteFilterInput), true);
		});

	});

	context('WKCWriteFilterInput', function() {
		
		it('removes class if not active', async function() {
			browser.click(WKCWriteDetailPlaceholderContainer);
			browser.assert.hasNoClass('.WKCWriteMaster', 'WKCWriteMasterContainerFocused');
		});
		
		it.skip('adds class if active', async function() {
			browser.click(WKCWriteFilterInput);
			await browser.wait({ element: WKCWriteFilterInput });

			deepEqual(browser.document.hasFocus(WKCWriteFilterInput), true);

			await browser.wait({ element: WKCWriteFilterInput });
			browser.assert.hasClass('.WKCWriteMaster', 'WKCWriteMasterContainerFocused');
		});

		it.skip('creates note on Enter', async function() {
			browser.fill(WKCWriteFilterInput, 'bravo');
			browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
			await browser.wait({ element: WKCWriteListItem });

			browser.assert.elements(WKCWriteListItem, 1);
		});

	});

	context('on create', async function() {

		before(async function() {
			deepEqual(browser.document.hasFocus(WKCWriteFilterInput), true);

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

			browser.click(WKCWriteFilterInput);
			await browser.wait({ element: WKCWriteFilterInput });

			deepEqual(browser.document.hasFocus(WKCWriteFilterInput), true);
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

			browser.fill(WKCWriteFilterInput, 'bravo');
			await browser.wait({ element: OLSKInputWrapperClearButton });
			// console.log(browser.queryAll(WKCWriteListItem).map((e) => e.outerHTML));

			browser.assert.elements(WKCWriteListItem, 1);
		});

	});

	describe.skip('WIKWriteFooter', function testWIKWriteFooter () {

		before(function() {
			return browser.visit(kDefaultRoute.OLSKRoutePath);
		});

		it('sets class', function () {
			browser.assert.hasClass(`WIKWriteFooter .OLSKToolbar`, 'OLSKToolbarJustify')
		});

	});

	describe.skip('WIKWriteFooterStorageStatus', function testWIKWriteFooterStorageStatus () {

		before(function() {
			return browser.visit(OLSKTestingCanonicalFor(kDefaultRoute.OLSKRoutePath, {
				WIKWriteFooterStorageStatus: 'alfa',
			}));
		});

		it('shows WIKWriteFooterStorageStatus', function () {
			browser.assert.text(OSWRootRemoteStorageError, 'alfa')
		});

	});

});
