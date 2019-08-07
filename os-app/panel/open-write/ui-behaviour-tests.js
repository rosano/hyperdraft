import { throws, deepEqual } from 'assert';

Object.entries({
	browser: new OLSKBrowser(),
	kDefaultRoutePath: '/panel/write',

	WKCWriteSearchInput: '.WKCWriteSearchInput',
	WKCWriteSearchInputClearButton: '.WKCWriteSearchInputClearButton',
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
	WKCWriteEditorDebugInput: '#WKCWriteEditorDebugInput',

	WKCWriteReloadButton: '#WKCWriteReloadButton',

	async uCreateItem (browser) {
		browser.pressButton(WKCWriteCreateButton);
		await browser.wait({ element: WKCWriteListItem });
	},
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteBehaviourElements', function testWKCWriteBehaviourElements() {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

	it('on startup', function() {
		browser.assert.elements(WKCWriteSearchInput, 1);
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
		browser.assert.elements(WKCWriteDetailToolbarBackButton, 0);
		browser.assert.elements(WKCWriteJumpButton, 1);
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

	context('on filter', function () {
		
		before(async function() {
			browser.fill('#WKCWriteEditorDebugInput', 'alfa');

			browser.click(`${ WKCWriteListItem }:nth-child(2)`);
			await browser.wait({ element: WKCWriteListItem });

			browser.fill('#WKCWriteEditorDebugInput', 'bravo');
		});

		it('presents no items if no match', async function() {
			browser.fill(WKCWriteSearchInput, 'test');
			await browser.wait({ element: WKCWriteSearchInputClearButton });

			browser.assert.elements(WKCWriteListItem, 0);
		});

		it('presents items if match', async function() {
			browser.fill(WKCWriteSearchInput, 'alfa');
			await browser.wait({ element: WKCWriteSearchInputClearButton });

			browser.assert.elements(WKCWriteListItem, 1);
		});

	});

	context.skip('on click WKCWriteSearchInputClearButton', function() {

		before(async function() {
			browser.pressButton(WKCWriteSearchInputClearButton);
			await browser.wait({ element: WKCWriteListItem });
		});

		it('clears WKCWriteSearchInput ', function() {
			deepEqual(browser.query(WKCWriteSearchInput).value, '');
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

		deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa');
		browser.assert.attribute(WKCWriteJumpButton, 'disabled', '');
	});

	context('delete', function () {

		it('on cancel', async function() {
			const browser = new OLSKBrowser();

			await browser.visit(kDefaultRoutePath);

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
			const browser = new OLSKBrowser();

			await browser.visit(kDefaultRoutePath);

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

describe('WKCWriteBehaviourText', function testWKCWriteBehaviourText() {

	['en'].forEach(function (languageCode) {

		context(languageCode, function () {

			const uLocalized = function (inputData) {
				return OLSKTestingLocalized(inputData, languageCode);
			};

			before(function() {
				return browser.visit(`${ languageCode }${ kDefaultRoutePath }`);
			});

			it('on startup', function() {
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

				// deepEqual(browser.query(WKCWriteDetailToolbarBackButton).title, uLocalized('WKCWriteDetailToolbarBackButtonText'));
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

			it('on edit long title', async function() {
				browser.fill(WKCWriteEditorDebugInput, 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilos');
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');
			});

			it('on edit long body', async function() {
				browser.fill(WKCWriteEditorDebugInput, '\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, '');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, '');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the…');

				browser.fill(WKCWriteEditorDebugInput, 'alfa\nbravo');
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
				const browser = new OLSKBrowser();

				await browser.visit(`${ languageCode }${ kDefaultRoutePath }`);

				await uCreateItem(browser);

				deepEqual((await new Promise(async function (resolve, reject) {
					browser.on('confirm', function (dialog) {
						resolve(dialog);
					});

					browser.pressButton(WKCWriteDetailToolbarDiscardButton);
					await browser.wait({ element: WKCWriteListItem });
				})).question, uLocalized('WKCWriteNotesDeleteAlertText'));
			});

		});
		
	});
});

describe('WKCWriteBehaviourInteraction', function testWKCWriteBehaviourInteraction() {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

	context('on startup', function() {

		it('focuses .CodeMirror textarea', function() {
			browser.document.hasFocus(WKCWriteSearchInput);
		});

	});

	context('WKCWriteSearchInput', function() {
		
		it('removes class if not active', async function() {
			browser.click(WKCWriteDetailPlaceholderContainer);
			browser.assert.hasNoClass('.WKCWriteMaster', 'WKCWriteMasterContainerFocused');
		});
		
		it.skip('adds class if active', async function() {
			browser.click(WKCWriteSearchInput);
			await browser.wait({ element: WKCWriteSearchInput });

			browser.document.hasFocus(WKCWriteSearchInput);

			await browser.wait({ element: WKCWriteSearchInput });
			browser.assert.hasClass('.WKCWriteMaster', 'WKCWriteMasterContainerFocused');
		});

		it.skip('creates note on Enter', async function() {
			browser.fill(WKCWriteSearchInput, 'bravo');
			browser.OLSKFireKeyboardEvent(browser.window, 'Enter');
			await browser.wait({ element: WKCWriteListItem });

			browser.assert.elements(WKCWriteListItem, 1);
		});

	});

	context('on create', async function() {

		before(async function() {
			browser.document.hasFocus(WKCWriteSearchInput);

			await uCreateItem(browser);
			browser.assert.elements(WKCWriteListItem, 1);
		});

		it('focuses .CodeMirror textarea', async function() {
			browser.document.hasFocus('.CodeMirror textarea');
		});

	});

	context('on select', async function() {

		before(async function() {
			await uCreateItem(browser);
			browser.assert.elements(WKCWriteListItem, 2);

			browser.click(WKCWriteSearchInput);
			await browser.wait({ element: WKCWriteSearchInput });

			browser.document.hasFocus(WKCWriteSearchInput);
		});

		it('focuses .CodeMirror textarea', async function() {
			browser.document.hasFocus('.CodeMirror textarea');
		});

		it('focuses .CodeMirror textarea', async function() {
			await uCreateItem(browser);

			browser.click(`${ WKCWriteListItem }:nth-child(2)`);
			await browser.wait({ element: WKCWriteListItem });

			browser.document.hasFocus('.CodeMirror textarea');
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

			browser.fill(WKCWriteSearchInput, 'bravo');
			await browser.wait({ element: WKCWriteSearchInputClearButton });
			// console.log(browser.queryAll(WKCWriteListItem).map((e) => e.outerHTML));

			browser.assert.elements(WKCWriteListItem, 1);
		});

	});

});
