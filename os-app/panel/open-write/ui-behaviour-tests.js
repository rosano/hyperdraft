import { throws, deepEqual } from 'assert';

const Browser = require('zombie');
Browser.localhost('loc.tests', 3000);

Object.entries({
	browser: new Browser(),
	DefaultRoutePath: '/panel/write',

	WKCWriteFilterInput: '#WIKDefaultFocusNode',
	WKCWriteFilterClearButton: '#WKCWriteFilterClearButton',
	WKCWriteCreateButton: '#WKCWriteCreateButton',

	WKCWriteListItem: '.ListItem',
	WKCWriteListItemAccessibilitySummary: '.WKCWriteListItemAccessibilitySummary',
	WKCWriteListItemTitle: '.ListItemTitle',
	WKCWriteListItemSnippet: '.ListItemSnippet',
	WKCWriteExportButton: '#WKCWriteExportButton',

	WKCWriteDetailPlaceholderContainer: '.PlaceholderContainer',

	WKCWriteDetailToolbar: '#WKCWriteDetailToolbar',
	WKCWriteDetailToolbarBackButton: '#WKCWriteDetailToolbarBackButton',

	WKCWriteDetailToolbarJumpButton: '#WKCWriteDetailToolbarJumpButton',
	WKCWriteDetailToolbarUnpublishButton: '#WKCWriteDetailToolbarUnpublishButton',
	WKCWriteDetailToolbarPublishButton: '#WKCWriteDetailToolbarPublishButton',
	WKCWriteDetailToolbarVersionsButton: '#WKCWriteDetailToolbarVersionsButton',
	WKCWriteDetailToolbarDiscardButton: '#WKCWriteDetailToolbarDiscardButton',

	WKCWriteEditorContainer: '.EditorContainer',
	WKCWriteEditorDebugInput: '#WKCWriteEditorDebugInput',

	WKCWriteReloadButton: '#WKCWriteReloadButton',

	async uCreateItem (browser) {
		browser.pressButton(WKCWriteCreateButton);
		await browser.wait({ element: WKCWriteListItem });
	},
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteUITestDiscovery', function testDiscovery() {

	before(function() {
		return browser.visit(DefaultRoutePath);
	});

	it('on startup', function() {
		browser.assert.elements(WKCWriteFilterInput, 1);
		browser.assert.attribute(WKCWriteFilterInput, 'accesskey', 'f');
		browser.assert.elements(WKCWriteFilterClearButton, 0);
		browser.assert.elements(WKCWriteCreateButton, 1);
		browser.assert.attribute(WKCWriteCreateButton, 'accesskey', 'n');

		browser.assert.elements(WKCWriteListItem, 0);
		browser.assert.elements(WKCWriteExportButton, 1);
		
		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 1);

		browser.assert.elements(WKCWriteDetailToolbar, 0);

		browser.assert.elements(WKCWriteEditorContainer, 0);

		browser.assert.elements(WKCWriteReloadButton, 1);
	});

	it('on create', async function() {
		await uCreateItem(browser);

		browser.assert.elements(WKCWriteListItem, 1);
		browser.assert.elements(WKCWriteListItemAccessibilitySummary, 1);
		browser.assert.elements(WKCWriteListItemTitle, 1);
		browser.assert.elements(WKCWriteListItemSnippet, 1);

		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 0);

		browser.assert.elements(WKCWriteDetailToolbar, 1);
		browser.assert.elements(WKCWriteDetailToolbarBackButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarJumpButton, 1);
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'accesskey', 'r');
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', '');
		browser.assert.elements(WKCWriteDetailToolbarUnpublishButton, 0);
		browser.assert.elements(WKCWriteDetailToolbarPublishButton, 0);
		browser.assert.elements(WKCWriteDetailToolbarVersionsButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarDiscardButton, 1);

		browser.assert.elements(WKCWriteEditorContainer, 1);
	});

	it('on create nth item', async function() {
		await uCreateItem(browser);
		
		browser.assert.elements(WKCWriteListItem, 2);
		
		browser.assert.elements(WKCWriteDetailToolbar, 1);
	});

	it.skip('on filter', async function() {
		browser.fill(WKCWriteFilterInput, 'alfa');
		await browser.wait({ element: WKCWriteFilterClearButton });

		browser.assert.elements(WKCWriteFilterClearButton, 1);
		
		browser.pressButton(WKCWriteFilterClearButton);
		await browser.wait({ element: WKCWriteFilterClearButton });

		browser.assert.elements(WKCWriteFilterClearButton, 0);
	});

	it.skip('on publish', function() {
	});

	it.skip('type header', function() {
		// browser.fire(WKCWriteEditorContainer, 'keydown')
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', '');
	});

	context.skip('delete', function () {

		it('on cancel', async function() {
			const browser = new Browser();

			await browser.visit(DefaultRoutePath);

			await uCreateItem(browser);

			await new Promise(async function (resolve, reject) {
				browser.on('confirm', function (dialog) {
					dialog.response = false;

					return resolve(dialog);
				});

				browser.pressButton(WKCWriteDetailToolbarDiscardButton);
				await browser.wait({ element: WKCWriteListItem });
			});

			await browser.wait({ element: WKCWriteListItem });

			browser.assert.elements(WKCWriteDetailPlaceholderContainer, 0);

			browser.assert.elements(WKCWriteDetailToolbar, 1);
		});

		it('on confirm', async function() {
			const browser = new Browser();

			await browser.visit(DefaultRoutePath);

			await uCreateItem(browser);

			await new Promise(async function (resolve, reject) {
				browser.on('confirm', function (dialog) {
					return resolve(dialog);
				});

				browser.pressButton(WKCWriteDetailToolbarDiscardButton);
				await browser.wait({ element: WKCWriteListItem });
			});

			await browser.wait({ element: WKCWriteListItem });

			browser.assert.elements(WKCWriteDetailPlaceholderContainer, 1);

			browser.assert.elements(WKCWriteDetailToolbar, 0);
		});
		
	});

});

describe('WKCWriteUITestLanguage', function testLanguage() {

	['en'].forEach(function (languageCode) {

		context(languageCode, function () {

			const uLocalized = function (inputData) {
				return OLSKTestingLocalized(inputData, languageCode);
			};

			before(function() {
				return browser.visit(`${ languageCode }${ DefaultRoutePath }`);
			});

			it('localizes interface', function() {
				deepEqual(browser.query(WKCWriteFilterInput).placeholder, uLocalized('WKCWriteMasterToolbarFilterInputPlaceholderText'));
				deepEqual(browser.query(WKCWriteCreateButton).title, uLocalized('WKCWriteMasterToolbarCreateButtonText'));

				deepEqual(browser.query(WKCWriteExportButton).textContent, uLocalized('WKCUpdateExportText'));

				deepEqual(browser.query(WKCWriteDetailPlaceholderContainer).textContent, uLocalized('WKCWriteDetailPlaceholderText'));

				deepEqual(browser.query(WKCWriteReloadButton).title, uLocalized('WKCWriteFooterToolbarReloadButtonText'));
			});

			it('on create', async function() {
				await uCreateItem(browser);

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, '');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, '');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');

				deepEqual(browser.query(WKCWriteDetailToolbarBackButton).title, uLocalized('WKCWriteDetailToolbarBackButtonText'));
				deepEqual(browser.query(WKCWriteDetailToolbarJumpButton).title, uLocalized('WKCWriteDetailToolbarJumpButtonText'));
				deepEqual(browser.query(WKCWriteDetailToolbarVersionsButton).title, uLocalized('WKCWriteDetailToolbarVersionsButtonText'));
				deepEqual(browser.query(WKCWriteDetailToolbarDiscardButton).title, uLocalized('WKCWriteDetailToolbarDiscardButtonText'));

				deepEqual(browser.query(WKCWriteEditorDebugInput).value, '');
			});

			it('on edit title', async function() {
				browser.fill(WKCWriteEditorDebugInput, 'alfa');
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, 'alfa');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');
			});

			it('on edit body', async function() {
				browser.fill(WKCWriteEditorDebugInput, 'alfa\nbravo');
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, 'alfa');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, 'bravo');
			});

			it('on create nth item', async function() {
				await uCreateItem(browser);

				deepEqual(browser.query(WKCWriteEditorDebugInput).value, '');
			});

			it('on select 1st item', async function() {
				browser.click(`${ WKCWriteListItem }:nth-child(2)`);
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteEditorDebugInput).value, 'alfa\nbravo');
			});

			it('on delete', async function() {
				const browser = new Browser();

				await browser.visit(`${ languageCode }${ DefaultRoutePath }`);

				await uCreateItem(browser);

				deepEqual((await new Promise(async function (resolve, reject) {
					browser.on('confirm', function (dialog) {
						resolve(dialog);
					});

					browser.pressButton(WKCWriteDetailToolbarDiscardButton);
					await browser.wait({ element: WKCWriteListItem });
				})).question, uLocalized('WKCWriteNotesDeleteAlertText'));
			});

			it.skip('on filter', async function() {
				browser.fill(WKCWriteFilterInput, 'alfa');
				await browser.wait({ element: WKCWriteFilterClearButton });

				deepEqual(browser.query(WKCWriteFilterClearButton).title, uLocalized('WKCWriteFilterClearButtonText'));
				
				browser.pressButton(WKCWriteFilterClearButton);
				await browser.wait({ element: WKCWriteFilterClearButton });

				browser.assert.elements(WKCWriteFilterClearButton, 0);
			});

			it.skip('on write', async function() {
				browser.fill('#WKCWriteEditorDebugInput', 'test');

				await browser.wait({ element: WKCWriteListItem });
				
				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'test');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, '');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');

				// browser.assert.elements(WKCWriteEditorContainer, 1);
			});

		});
		
	});
});

describe('WKCWriteUITestInteraction', function testInteraction() {

	before(function() {
		return browser.visit(DefaultRoutePath);
	});

	context('on create', async function() {

		it('focuses .CodeMirror textarea', async function() {
			await uCreateItem(browser);

			deepEqual(browser.document.activeElement, browser.query('.CodeMirror textarea'));
		});

	});

	context('filter', function () {
		
		before(function() {
			return browser.visit(DefaultRoutePath);
		});

		it.skip('on create', async function() {
			// focuses editor
			await uCreateItem(browser);
			await uCreateItem(browser);
			await uCreateItem(browser);
			browser.assert.elements(WKCWriteListItem, 3);
		});

	});

});
