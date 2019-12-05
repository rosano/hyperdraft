import { deepEqual } from 'assert';

const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().WIKWriteRoute;

Object.entries({
	WKCWriteFilterInput: '.WKCWriteFilterInput',
	OLSKInputWrapperClearButton: '.OLSKInputWrapperClearButton',
	WKCWriteCreateButton: '#WKCWriteCreateButton',

	WKCWriteListItem: '.ListItem',
	WKCWriteListItemAccessibilitySummary: '.WKCWriteListItemAccessibilitySummary',
	WKCWriteListItemTitle: '.ListItemTitle',
	WKCWriteListItemSnippet: '.ListItemSnippet',
	WKCWriteExportButton: '#WKCWriteExportButton',

	WKCWriteDetailPlaceholderContainer: '.PlaceholderContainer',

	WKCWriteDetailToolbar: '#WKCWriteDetailToolbar',
	WKCWriteDetailToolbarBackButton: '#WKCWriteDetailToolbarBackButton',

	WKCWriteJumpButton: '.WKCWriteJumpButton',
	WKCWriteDetailToolbarUnpublishButton: '#WKCWriteDetailToolbarUnpublishButton',
	WKCWriteDetailToolbarPublishButton: '#WKCWriteDetailToolbarPublishButton',
	WKCWriteDetailToolbarVersionsButton: '#WKCWriteDetailToolbarVersionsButton',
	WKCWriteDetailToolbarDiscardButton: '#WKCWriteDetailToolbarDiscardButton',

	WKCWriteEditorContainer: '.EditorContainer',
	WKCWriteEditorInput: '.EditorContainer .CodeMirror',
	WKCWriteEditorDebugInput: '#WKCWriteEditorDebugInput',

	WIKWriteStorageWidget: '#WIKWriteStorageWidget',

	WKCWriteFooter: '.WKCWriteFooter',

	async uCreateItem (browser) {
		browser.pressButton(WKCWriteCreateButton);
		await browser.wait({ element: WKCWriteListItem });
	},
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteUIAccess', function () {

	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('shows WKCWriteFooter', function () {
		browser.assert.elements(WKCWriteFooter, 1);
	});

	it('on startup', function() {
		browser.assert.elements(WKCWriteFilterInput, 1);
		browser.assert.elements(WKCWriteCreateButton, 1);
		browser.assert.attribute(WKCWriteCreateButton, 'accesskey', 'n');

		browser.assert.elements(WKCWriteListItem, 0);
		browser.assert.elements(WKCWriteExportButton, 1);
		
		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 1);

		browser.assert.elements(WKCWriteDetailToolbar, 0);

		browser.assert.elements(WKCWriteEditorContainer, 0);

		browser.assert.elements(WIKWriteStorageWidget, 1);
		browser.assert.hasClass(WIKWriteStorageWidget, 'StorageHidden');
	});

	it('on create', async function() {
		await uCreateItem(browser);

		browser.assert.elements(WKCWriteListItem, 1);
		browser.assert.elements(WKCWriteListItemAccessibilitySummary, 1);
		browser.assert.elements(WKCWriteListItemTitle, 1);
		browser.assert.elements(WKCWriteListItemSnippet, 1);

		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 0);

		browser.assert.elements(WKCWriteDetailToolbar, 1);
		browser.assert.elements(WKCWriteDetailToolbarBackButton, 0);
		browser.assert.elements(WKCWriteJumpButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarUnpublishButton, 0);
		browser.assert.elements(WKCWriteDetailToolbarPublishButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarVersionsButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarDiscardButton, 1);

		browser.assert.elements(WKCWriteEditorContainer, 1);
		browser.assert.elements(WKCWriteEditorInput, 1);
	});

	it('on create nth item', async function() {
		await uCreateItem(browser);
		
		browser.assert.elements(WKCWriteListItem, 2);
		
		browser.assert.elements(WKCWriteDetailToolbar, 1);
	});

	context('on filter', function () {
		
		before(async function() {
			browser.fill('#WKCWriteEditorDebugInput', 'alfa');

			browser.click(`${ WKCWriteListItem }:nth-child(2)`);
			await browser.wait({ element: WKCWriteListItem });

			browser.fill('#WKCWriteEditorDebugInput', 'bravo');
		});

		it('presents no items if no match', async function() {
			browser.fill(WKCWriteFilterInput, 'test');
			await browser.wait({ element: OLSKInputWrapperClearButton });

			browser.assert.elements(WKCWriteListItem, 0);
		});

		it('presents items if match', async function() {
			browser.fill(WKCWriteFilterInput, 'alfa');
			await browser.wait({ element: OLSKInputWrapperClearButton });

			browser.assert.elements(WKCWriteListItem, 1);
		});

	});

	context.skip('on click OLSKInputWrapperClearButton', function() {

		before(async function() {
			browser.pressButton(OLSKInputWrapperClearButton);
			await browser.wait({ element: `${WKCWriteListItem}:nth-child(2)` });
		});

		it('clears WKCWriteFilterInput', function() {
			browser.assert.input(WKCWriteFilterInput, '');
		});

		it('shows all items', function() {
			// console.log(browser.queryAll('.ListItem').map((e) => e.innerHTML));
			browser.assert.elements(WKCWriteListItem, 2);
		});

	});

	it.skip('on publish', function() {
	});

	it('type header', async function() {
		await uCreateItem(browser);
		browser.fill(WKCWriteEditorDebugInput, 'alfa\n# bravo');
		await browser.wait({ element: WKCWriteListItem });

		browser.assert.text(WKCWriteListItemAccessibilitySummary, 'alfa');
		browser.assert.attribute(WKCWriteJumpButton, 'disabled', '');
	});

	context('delete', function () {

		it('on cancel', async function() {
			await browser.OLSKConfirm(function () {
				browser.pressButton(WKCWriteDetailToolbarDiscardButton);
			}, function (dialog) {
				dialog.response = false;

				return dialog;
			});

			await browser.wait({ element: WKCWriteListItem });

			browser.assert.elements(WKCWriteDetailPlaceholderContainer, 0);

			browser.assert.elements(WKCWriteDetailToolbar, 1);
		});

		it.skip('on confirm', async function() {
			await browser.OLSKConfirm(async function () {
				await browser.pressButton(WKCWriteDetailToolbarDiscardButton);
			});

			await browser.wait({ element: WKCWriteDetailPlaceholderContainer });

			browser.assert.elements(WKCWriteDetailPlaceholderContainer, 1);

			browser.assert.elements(WKCWriteDetailToolbar, 0);
		});
		
	});

});
