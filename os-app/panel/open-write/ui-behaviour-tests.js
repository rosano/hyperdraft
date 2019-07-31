import { throws, deepEqual } from 'assert';

const Browser = require('zombie');

Browser.localhost(process.env.ZOMBIE_HOST, 3000);

Object.entries({
	WKCWriteFilterInput: '#WIKDefaultFocusNode',
	WKCWriteCreateButton: '#WKCWriteCreateButton',

	WKCWriteListItem: '.ListItem',
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

	WKCWriteReloadButton: '#WKCWriteReloadButton',

	uCreateNote: async function (browser) {
		browser.pressButton(WKCWriteCreateButton);
		await browser.wait({ element: WKCWriteListItem });
	},
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWrite', function() {

describe('Discovery', function testDiscovery() {

	const browser = new Browser();

	before(function() {
		return browser.visit('/panel/write');
	});

	it('on startup', function() {
		browser.assert.elements(WKCWriteFilterInput, 1);
		browser.assert.elements(WKCWriteCreateButton, 1);

		browser.assert.elements(WKCWriteListItem, 0);
		browser.assert.elements(WKCWriteExportButton, 1);
		
		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 1);

		browser.assert.elements(WKCWriteDetailToolbar, 0);

		browser.assert.elements(WKCWriteEditorContainer, 0);

		browser.assert.elements(WKCWriteReloadButton, 1);
	});

	it('on create', async function() {
		await uCreateNote(browser);

		browser.assert.elements(WKCWriteListItem, 1);

		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 0);

		browser.assert.elements(WKCWriteDetailToolbar, 1);
		browser.assert.elements(WKCWriteDetailToolbarBackButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarJumpButton, 1);
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', '');
		browser.assert.elements(WKCWriteDetailToolbarUnpublishButton, 0);
		browser.assert.elements(WKCWriteDetailToolbarPublishButton, 0);
		browser.assert.elements(WKCWriteDetailToolbarVersionsButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarDiscardButton, 1);

		browser.assert.elements(WKCWriteEditorContainer, 1);
	});

	it.skip('on publish', function() {
	});

	it.skip('type header', function() {
		// browser.fire(WKCWriteEditorContainer, 'keydown')
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', '');
	});

});

describe('Language', function testLanguage() {

	['en'].forEach(function (languageCode) {

		context(languageCode, function () {
			
			const browser = new Browser();
			const uLocalized = function (inputData) {
				return OLSKTestingLocalized(inputData, languageCode);
			};

			before(function() {
				return browser.visit(`${ languageCode }/panel/write`);
			});

			it('localizes interface', function() {
				deepEqual(browser.query(WKCWriteCreateButton).title, uLocalized('WKCWriteMasterToolbarCreateButtonText'));
			});

		});
		
	});
});

describe('Interaction', function testInteraction() {

	const browser = new Browser();

	before(function() {
		return browser.visit('/panel/write');
	});

	it('has no items', function() {
		browser.assert.elements(WKCWriteListItem, 0);
	});

	it('creates item', async function() {
		await uCreateNote(browser);
		browser.assert.elements(WKCWriteListItem, 1);
	});

});

});
